import { TowerType } from '../store/useGameStore';

export interface UMLNode {
  id: string;
  name: string;
  type: 'class' | 'interface' | 'abstract';
  methods?: string[];
  fields?: string[];
}

export interface UMLLink {
  from: string;
  to: string;
  relation: 'implements' | 'extends' | 'uses' | 'creates' | 'notifies';
  label?: string;
}

export interface SystemScenario {
  wave: number;
  title: string;
  subTitle: string;
  crisisDescription: string;
  targetPattern: TowerType;
  patternName: string;
  badCode: string;
  goodCode: string;
  badCodeExplanation: string;
  goodCodeExplanation: string;
  umlNodes: UMLNode[];
  umlLinks: UMLLink[];
}

export const SYSTEM_SCENARIOS: SystemScenario[] = [
  {
    wave: 1,
    title: '电商秒杀日志系统内存打爆崩溃',
    subTitle: '零散 new Logger() 导致并发线程争用与 GC 停顿',
    crisisDescription: '高并发秒杀峰值到来，几十万线程同时 new Logger() 申请日志句柄，致使内存被垃圾对象占满，频繁引发 Full GC 导致系统假死。',
    targetPattern: 'SINGLETON',
    patternName: '单例模式 (Singleton)',
    badCode: `// ❌ 频繁创建新实例，开销极大
public class OrderService {
    public void processOrder() {
        Logger logger = new Logger(); // 每次调用都 new！
        logger.info("Order processed");
    }
}`,
    goodCode: `// ✅ 全局唯一共享实例 + 静态访问点
public class Logger {
    private static volatile Logger instance;
    private Logger() {} // 私有构造
    
    public static Logger getInstance() {
        if (instance == null) {
            synchronized (Logger.class) {
                if (instance == null) instance = new Logger();
            }
        }
        return instance;
    }
}`,
    badCodeExplanation: '每次请求都实例化独立对象，数据库连接池或文件句柄被频繁占用与销毁，导致 CPU 占用率 100%。',
    goodCodeExplanation: '通过双重检查锁定 (DCL) 保证全局仅存在一个 Logger 实例，节省内存并消除连接争用。',
    umlNodes: [
      { id: 'logger', name: 'Logger', type: 'class', fields: ['- instance: Logger'], methods: ['+ getInstance(): Logger', '+ log(msg)'] },
      { id: 'client', name: 'OrderService', type: 'class', methods: ['+ processOrder()'] }
    ],
    umlLinks: [
      { from: 'client', to: 'logger', relation: 'uses', label: 'getInstance()' }
    ]
  },
  {
    wave: 2,
    title: '聚合支付网关接口爆炸',
    subTitle: '嵌套 20 层 if-else，新增微信/支付宝支付改动上千行代码',
    crisisDescription: '业务扩展接入数字人民币、连连支付、PayPal，原本硬编码的 if-else 逻辑急剧膨胀，修改一个支付逻辑导致整个支付模块全面崩溃。',
    targetPattern: 'STRATEGY',
    patternName: '策略模式 (Strategy)',
    badCode: `// ❌ 硬编码 20 层 if-else，违反开闭原则
if (payType.equals("WECHAT")) {
    // 微信支付算法 50 行...
} else if (payType.equals("ALIPAY")) {
    // 支付宝算法 50 行...
} else if (payType.equals("UNION")) {
    // 银联支付算法...
}`,
    goodCode: `// ✅ 抽象策略接口 + 可互换算法族
public interface PayStrategy {
    void pay(BigDecimal amount);
}

public class WeChatPay implements PayStrategy {
    public void pay(BigDecimal amount) { /* 微信逻辑 */ }
}

public class PayContext {
    private PayStrategy strategy;
    public void executePay(BigDecimal amt) { strategy.pay(amt); }
}`,
    badCodeExplanation: '所有分支逻辑强耦合在单一函数中，无法独立单元测试，违反面向对象开闭原则 (OCP)。',
    goodCodeExplanation: '将各类支付算法封装为各自独立的 Strategy 实现类，新增支付方式只需新增扩展类，无需修改原有逻辑。',
    umlNodes: [
      { id: 'strategy', name: 'PayStrategy', type: 'interface', methods: ['+ pay(amount)'] },
      { id: 'wx', name: 'WeChatPay', type: 'class', methods: ['+ pay(amount)'] },
      { id: 'ali', name: 'AliPay', type: 'class', methods: ['+ pay(amount)'] },
      { id: 'ctx', name: 'PayContext', type: 'class', fields: ['- strategy: PayStrategy'] }
    ],
    umlLinks: [
      { from: 'wx', to: 'strategy', relation: 'implements' },
      { from: 'ali', to: 'strategy', relation: 'implements' },
      { from: 'ctx', to: 'strategy', relation: 'uses', label: 'delegates' }
    ]
  },
  {
    wave: 3,
    title: '订单状态机逻辑失控导致财务越权',
    subTitle: '未支付订单被非法触发“退款”，状态校验错漏百出',
    crisisDescription: '订单涵盖“未支付、已支付、已发货、已退款”等复杂生命周期，硬编码状态判断导致非法状态越权转移，引发重大财务损失。',
    targetPattern: 'STATE',
    patternName: '状态模式 (State)',
    badCode: `// ❌ 状态条件散落全系统，越权漏洞高发
if (order.status == 1) { // 1=未支付
    if (action.equals("REFUND")) {
        refundMoney(); // 漏洞！未支付竟然能退款！
    }
}`,
    goodCode: `// ✅ 状态对象控制合法的状态转移
public interface OrderState {
    void pay(OrderContext ctx);
    void refund(OrderContext ctx);
}

public class UnpaidState implements OrderState {
    public void pay(OrderContext ctx) { ctx.setState(new PaidState()); }
    public void refund(OrderContext ctx) { throw new IllegalStateException("未支付订单不可退款！"); }
}`,
    badCodeExplanation: '状态判断散落在数十个 Service 中，很容易遗漏合法的边界条件检查。',
    goodCodeExplanation: '每个状态拥有独立状态类，非法行为在编译期或运行时被类型系统直接拦截。',
    umlNodes: [
      { id: 'state', name: 'OrderState', type: 'interface', methods: ['+ pay()', '+ refund()'] },
      { id: 'unpaid', name: 'UnpaidState', type: 'class' },
      { id: 'paid', name: 'PaidState', type: 'class' },
      { id: 'order', name: 'OrderContext', type: 'class', fields: ['- state: OrderState'] }
    ],
    umlLinks: [
      { from: 'unpaid', to: 'state', relation: 'implements' },
      { from: 'paid', to: 'state', relation: 'implements' },
      { from: 'order', to: 'state', relation: 'uses' }
    ]
  },
  {
    wave: 4,
    title: '海量数据流读取 I/O 探针拖垮磁盘',
    subTitle: '逐字节磁盘读取导致百万次底层系统调用',
    crisisDescription: '日志分析模块按字符读取几 GB 的日志文件，频繁触发操作系统的零碎磁盘 I/O 中断，处理速度极其缓慢。',
    targetPattern: 'DECORATOR',
    patternName: '装饰器模式 (Decorator)',
    badCode: `// ❌ 原始字符流直接读磁盘，速度慢上百倍
FileReader fr = new FileReader("huge.log");
int ch;
while ((ch = fr.read()) != -1) {
    process(ch); // 几百万次低效系统调用！
}`,
    goodCode: `// ✅ 用 BufferedReader 动态增强缓冲功能
FileReader fr = new FileReader("huge.log");
// 装饰模式：动态包裹 Buffer 职责
BufferedReader br = new BufferedReader(fr);
String line;
while ((line = br.readLine()) != null) {
    process(line);
}`,
    badCodeExplanation: '直接操作基础数据流没有缓存机制，磁盘磁头反复频繁寻道，性能吞吐量低迷。',
    goodCodeExplanation: '装饰器模式在不改变原始 InputStream/Reader 接口的前提下，透明扩展了缓冲 (Buffering) 职责。',
    umlNodes: [
      { id: 'reader', name: 'Reader', type: 'abstract', methods: ['+ read()'] },
      { id: 'filereader', name: 'FileReader', type: 'class' },
      { id: 'decorator', name: 'BufferedReader', type: 'class', fields: ['- in: Reader'] }
    ],
    umlLinks: [
      { from: 'filereader', to: 'reader', relation: 'extends' },
      { from: 'decorator', to: 'reader', relation: 'extends' },
      { from: 'decorator', to: 'reader', relation: 'uses', label: 'wraps' }
    ]
  },
  {
    wave: 5,
    title: '旧版第三方 SDK 接口不兼容导致系统崩溃',
    subTitle: '升级新版 SDK 时接口签名全变，调用方全面报错',
    crisisDescription: '核心服务调用的第三方加密 SDK 升级到 2.0，原有的 \`encryptMD5()\` 被废弃并改名为 \`hashSHA256()\`, 全系统数百处调用无法直接对接。',
    targetPattern: 'ADAPTER',
    patternName: '适配器模式 (Adapter)',
    badCode: `// ❌ 被迫到处修改旧系统的几百处业务代码
// NewSDK newSdk = new NewSDK();
// newSdk.hashSHA256(data); // 旧业务代码写死了 encryptMD5()，编译报错！`,
    goodCode: `// ✅ 编写 Adapter 转换不兼容的接口
public class CryptoAdapter implements LegacyCryptoTarget {
    private NewSDK newSdk = new NewSDK();
    
    @Override
    public String encryptMD5(String data) {
        // 将旧接口请求适配转发给新 SDK
        return newSdk.hashSHA256(data);
    }
}`,
    badCodeExplanation: '直接修改所有业务调用代码风险极高，且无法兼容需要同时支持新老 SDK 的场景。',
    goodCodeExplanation: '适配器包装新的 SDK 类，对外暴露老的 Target 接口，充当“电源转换接头”，让新老组件协同工作。',
    umlNodes: [
      { id: 'target', name: 'LegacyCryptoTarget', type: 'interface', methods: ['+ encryptMD5()'] },
      { id: 'adaptee', name: 'NewSDK20', type: 'class', methods: ['+ hashSHA256()'] },
      { id: 'adapter', name: 'CryptoAdapter', type: 'class' }
    ],
    umlLinks: [
      { from: 'adapter', to: 'target', relation: 'implements' },
      { from: 'adapter', to: 'adaptee', relation: 'uses', label: 'adapts' }
    ]
  },
  {
    wave: 6,
    title: '黑客洗钱攻击穿透风控服务',
    subTitle: '缺乏多层动态校验链条，漏掉任何一道防线直接沦陷',
    crisisDescription: '黑客利用伪造 IP、高频并发、异常金额组合发起自动化攻击，单层写死的防守无法应对复杂的风控校验规则组合。',
    targetPattern: 'CHAIN',
    patternName: '责任链模式 (Chain of Resp.)',
    badCode: `// ❌ 硬编码顺序校验，无法灵活调整防线或动态插拔
if (!checkIP(req)) return false;
if (!checkFrequency(req)) return false;
if (!checkAmount(req)) return false;
// 只要想加一道防线就要修改全局函数...`,
    goodCode: `// ✅ 抽象 Handler 链条，每个节点决定处理或转发
public abstract class RiskHandler {
    protected RiskHandler next;
    public void setNext(RiskHandler next) { this.next = next; }
    public abstract boolean filter(Request req);
}

// 灵活拼装防线链：IP -> Frequency -> Amount
ipHandler.setNext(freqHandler);
freqHandler.setNext(amountHandler);`,
    badCodeExplanation: '校验顺序固定死板，后续无法按需给特定用户群（如 VIP 用户）跳过某些检查节点。',
    goodCodeExplanation: '将每一个风控判定抽象为链上的 Handler，任何请求沿着处理链依次流转，可动态增加或重新编排节点。',
    umlNodes: [
      { id: 'handler', name: 'RiskHandler', type: 'abstract', fields: ['- next: RiskHandler'], methods: ['+ filter()'] },
      { id: 'ip', name: 'IPFilterHandler', type: 'class' },
      { id: 'freq', name: 'FreqFilterHandler', type: 'class' }
    ],
    umlLinks: [
      { from: 'ip', to: 'handler', relation: 'extends' },
      { from: 'freq', to: 'handler', relation: 'extends' },
      { from: 'handler', to: 'handler', relation: 'uses', label: 'next' }
    ]
  },
  {
    wave: 7,
    title: '大 V 发微博导致全量轮询服务 CPU 100%',
    subTitle: '百万粉丝轮询拉取数据打爆 DB，实时通知不可用',
    crisisDescription: '明星发微博瞬间，百万粉丝客户端定时器不断轮询 HTTP 接口 Pull 最新动态，把应用服务器与数据库连接拉爆。',
    targetPattern: 'OBSERVER',
    patternName: '观察者模式 (Observer)',
    badCode: `// ❌ 客户端每隔 1 秒主动 Pull 轮询 DB，造成巨量无用开销
while (true) {
    List<Post> posts = db.queryNewPosts(userId);
    Thread.sleep(1000);
}`,
    goodCode: `// ✅ 发布-订阅模式 (Pub-Sub)，状态改变主动通知
public class AuthorSubject {
    private List<Observer> fans = new ArrayList<>();
    public void subscribe(Observer fan) { fans.add(fan); }
    public void publishPost(String content) {
        for (Observer fan : fans) fan.update(content); // 主动 Push
    }
}`,
    badCodeExplanation: 'Pull 模式绝大多数轮询请求都是无效无意义查询，造成海量的数据库 CPU 浪费。',
    goodCodeExplanation: '观察者模式将状态变化事件主动通知给每一个已订阅的 Observer，避免低效轮询，达成高效解耦。',
    umlNodes: [
      { id: 'subject', name: 'AuthorSubject', type: 'class', fields: ['- fans: List<Observer>'], methods: ['+ subscribe()', '+ notify()'] },
      { id: 'observer', name: 'Observer', type: 'interface', methods: ['+ update()'] },
      { id: 'fan', name: 'FanObserver', type: 'class' }
    ],
    umlLinks: [
      { from: 'fan', to: 'observer', relation: 'implements' },
      { from: 'subject', to: 'observer', relation: 'notifies' }
    ]
  },
  {
    wave: 8,
    title: '微服务网状依赖雪崩导致前端瘫痪',
    subTitle: '前端需并发调用 15 个微服务 API，网络延迟叠加',
    crisisDescription: '单页应用为了渲染首页，前端 JS 需要直接分别与用户服务、商品服务、推荐服务、广告服务等 15 个后端微服务握手，稍微一个服务超时整页崩溃。',
    targetPattern: 'FACADE',
    patternName: '外观模式 (Facade / API Gateway)',
    badCode: `// ❌ 客户端直接面对 15 个子系统的杂乱 API
fetchUser();
fetchOrders();
fetchRecommendations();
fetchAdBanners();
// 前端网络请求高达数十次，逻辑极其冗长`,
    goodCode: `// ✅ 网关外观门面统一向客户端提供一站式极简接口
public class ApiGatewayFacade {
    private UserService userService;
    private OrderService orderService;
    
    public HomeViewDTO getHomeViewData(Long userId) {
        // 门面类负责内部聚合多个子系统 API
        return new HomeViewDTO(userService.get(userId), orderService.get(userId));
    }
}`,
    badCodeExplanation: '客户端强耦合多个子系统内部细节，安全鉴权、限流、跨域配置在每个子服务都要配置一遍。',
    goodCodeExplanation: '外观模式在前端与复杂后端子系统间搭建一层 API Gateway 门面，提供统一的调配入口，大幅降低耦合。',
    umlNodes: [
      { id: 'facade', name: 'ApiGatewayFacade', type: 'class', methods: ['+ getHomeData()'] },
      { id: 'user', name: 'UserService', type: 'class' },
      { id: 'order', name: 'OrderService', type: 'class' }
    ],
    umlLinks: [
      { from: 'facade', to: 'user', relation: 'uses' },
      { from: 'facade', to: 'order', relation: 'uses' }
    ]
  },
  {
    wave: 9,
    title: '复杂 HTTP Client 请求构建极其混乱',
    subTitle: '构造函数重载 10 个参数，漏填 Timeout 导致连接泄露',
    crisisDescription: '请求对象包含 Header, QueryParams, Body, Certificate, Timeouts 等 12 个属性，构造函数参数位置填错引发严重死锁异常。',
    targetPattern: 'BUILDER',
    patternName: '建造者模式 (Builder)',
    badCode: `// ❌ 10 个参数的魔鬼构造函数，参数位置极易颠倒
HttpRequest req = new HttpRequest("https://api.com", "POST", null, 5000, 3000, true, false, "utf-8", null, 3);`,
    goodCode: `// ✅ 链式调用，分步清爽装配复杂对象
HttpRequest req = HttpRequest.builder()
    .url("https://api.com")
    .method("POST")
    .connectTimeout(5000)
    .readTimeout(3000)
    .build();`,
    badCodeExplanation: '构造函数参数过多且类型相同时，传入顺序颠倒不会触发编译错误，但运行时引发极其隐蔽的 Bug。',
    goodCodeExplanation: '建造者模式将复杂对象的构建过程拆解为链式 Setter 方法，步骤清晰，保障构造出合法的不可变对象。',
    umlNodes: [
      { id: 'product', name: 'HttpRequest', type: 'class' },
      { id: 'builder', name: 'RequestBuilder', type: 'class', methods: ['+ url()', '+ method()', '+ build(): HttpRequest'] }
    ],
    umlLinks: [
      { from: 'builder', to: 'product', relation: 'creates' }
    ]
  },
  {
    wave: 10,
    title: '终极挑战：高并发敏感数据安全与性能兼顾',
    subTitle: '数据库连接鉴权与安全审计代理',
    crisisDescription: '黑客直接扫描攻击核心敏感数据库接口，系统需要即刻接入全局权限拦截、只读副本路由与缓存代理。',
    targetPattern: 'PROXY',
    patternName: '代理模式 (Proxy)',
    badCode: `// ❌ 在真正的数据库访问类里面直接修改鉴权与日志逻辑
public class RealDatabaseAccess {
    public Data query(String sql) {
        if (!checkAuth()) return null; // 业务代码强耦合安全逻辑！
        return db.rawQuery(sql);
    }
}`,
    goodCode: `// ✅ 代理对象拦截，不侵入真实业务类
public class SecurityDatabaseProxy implements DatabaseAccess {
    private RealDatabaseAccess realDb = new RealDatabaseAccess();
    
    @Override
    public Data query(String sql) {
        if (!SecurityContext.hasPermission()) throw new AccessDeniedException();
        logAudit(sql);
        return realDb.query(sql); // 校验通过后代理转发
    }
}`,
    badCodeExplanation: '直接侵入真实业务类添加日志、安全、缓存逻辑，违反单一职责原则 (SRP)。',
    goodCodeExplanation: '代理模式控制对真实对象的访问，在不修改目标对象源码的前提下，无缝嵌入鉴权、缓存、日志等切面功能。',
    umlNodes: [
      { id: 'subject', name: 'DatabaseAccess', type: 'interface', methods: ['+ query(sql)'] },
      { id: 'real', name: 'RealDatabaseAccess', type: 'class' },
      { id: 'proxy', name: 'SecurityDatabaseProxy', type: 'class', fields: ['- realDb: RealDatabaseAccess'] }
    ],
    umlLinks: [
      { from: 'real', to: 'subject', relation: 'implements' },
      { from: 'proxy', to: 'subject', relation: 'implements' },
      { from: 'proxy', to: 'real', relation: 'uses', label: 'delegates' }
    ]
  }
];

export const getScenarioByWave = (wave: number): SystemScenario => {
  return SYSTEM_SCENARIOS.find(s => s.wave === wave) || SYSTEM_SCENARIOS[0];
};
