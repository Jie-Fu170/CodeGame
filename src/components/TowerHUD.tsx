import { useState, useEffect } from 'react';
import { useGameStore, TowerType } from '../store/useGameStore';
import { getScenarioByWave } from '../config/umlTempleScenarios';
import { UMLBlueprintPanel } from './UMLBlueprintPanel';
import { CodeDiffDrawer } from './CodeDiffDrawer';
import { soundManager } from '../utils/audio';
import {
  ShieldAlert,
  Factory,
  Eye,
  Paintbrush,
  Plug,
  ListChecks,
  Link,
  Coins,
  Heart,
  X,
  Zap,
  Info,
  Lock,
  Boxes,
  Activity,
  Copy,
  Layout,
  AlertOctagon,
  FileCode2,
  Volume2,
  VolumeX
} from 'lucide-react';

const QUIZ_QUESTIONS = [
  { q: '"确保一个类只有一个实例，并提供全局访问点"描述的是哪种模式？', opts: ['工厂模式', '单例模式', '观察者模式', '适配器模式'], a: 1, explain: '单例模式的核心就是"唯一实例 + 全局访问点"。' },
  { q: '"状态变化时自动通知并更新所有依赖对象"描述的是？', opts: ['策略模式', '装饰器模式', '观察者模式', '责任链模式'], a: 2, explain: '观察者模式(发布-订阅)就是一对多的通知机制。' },
  { q: '"不修改原有类结构，动态给对象添加职责"描述的是？', opts: ['装饰器模式', '单例模式', '适配器模式', '观察者模式'], a: 0, explain: '装饰器模式通过"包装"来动态增强，而非继承。' },
  { q: '"封装创建过程，使对象的创建与使用分离"描述的是？', opts: ['观察者模式', '工厂模式', '策略模式', '单例模式'], a: 1, explain: '工厂模式把 new 操作封装到工厂类中。' },
  { q: '"转换接口，使不兼容的类能够协同工作"描述的是？', opts: ['装饰器模式', '责任链模式', '适配器模式', '策略模式'], a: 2, explain: '适配器就像电源转接头，转换"不兼容的接口"。' },
  { q: '"定义一族算法，使它们可以互相替换"描述的是？', opts: ['策略模式', '工厂模式', '观察者模式', '装饰器模式'], a: 0, explain: '策略模式封装一族可替换的算法。' },
  { q: '"将请求沿链传递，每个处理者决定处理或转发"描述的是？', opts: ['观察者模式', '装饰器模式', '单例模式', '责任链模式'], a: 3, explain: '责任链让多个对象依次有机会处理请求。' },
  { q: '以下哪种模式属于创建型模式？', opts: ['装饰器模式', '适配器模式', '工厂模式', '观察者模式'], a: 2, explain: '创建型模式包括：单例、工厂方法、抽象工厂、建造者、原型。' },
  { q: '以下哪种模式属于结构型模式？', opts: ['单例模式', '策略模式', '观察者模式', '适配器模式'], a: 3, explain: '结构型模式包括：适配器、装饰器、代理、桥接、组合、外观、享元。' },
  { q: '观察者模式的别名是？', opts: ['代理模式', '发布-订阅模式', '中介者模式', '迭代器模式'], a: 1, explain: '观察者模式又称"发布-订阅模式" (Publish-Subscribe)。' },
  { q: 'Java I/O 中 BufferedReader 包装 FileReader 体现了哪种模式？', opts: ['适配器模式', '代理模式', '装饰器模式', '工厂模式'], a: 2, explain: 'Java I/O 是装饰器模式的经典应用：动态为流添加缓冲功能。' },
  { q: '关于设计模式分类，以下哪项说法是错误的？', opts: ['单例属于创建型', '装饰器属于结构型', '观察者属于结构型', '策略属于行为型'], a: 2, explain: '观察者模式属于行为型模式，不是结构型。' },
];

const KNOWLEDGE_DATA: Record<string, any> = {
  SINGLETON: {
    title: '单例模式 Singleton',
    category: '创建型模式',
    color: 'yellow',
    definition: '确保一个类只有一个实例，并提供一个全局访问点。',
    uml: '私有构造函数 + 静态 getInstance() 方法',
    example: '日志管理器、数据库连接池、全局配置对象',
    keyPoint: '⚠️ 多线程下需要双重检查锁定 (DCL)',
    examTip: '考题常问：如何保证线程安全的懒汉式单例？'
  },
  FACTORY: {
    title: '工厂模式 Factory Method',
    category: '创建型模式',
    color: 'purple',
    definition: '定义一个创建对象的接口，让子类决定实例化哪个类。',
    uml: '抽象工厂类 + 具体工厂子类 + 产品接口',
    example: '不同格式解析器、跨平台 UI 组件创建',
    keyPoint: '⚠️ 简单工厂 ≠ 工厂方法 ≠ 抽象工厂',
    examTip: '考题常考三种工厂模式的区别与适用场景'
  },
  OBSERVER: {
    title: '观察者模式 Observer',
    category: '行为型模式',
    color: 'blue',
    definition: '定义一对多的依赖关系，当一个对象状态改变时，所有依赖对象自动收到通知。',
    uml: 'Subject(主题) + Observer(观察者) + notify()/update()',
    example: 'GUI 事件监听、消息队列、Vue/React 响应式系统',
    keyPoint: '⚠️ 也叫发布-订阅模式 (Pub-Sub)',
    examTip: '考题常与 MVC 架构结合出题'
  },
  DECORATOR: {
    title: '装饰器模式 Decorator',
    category: '结构型模式',
    color: 'violet',
    definition: '动态地给对象添加额外的职责，比子类继承更灵活。',
    uml: 'Component + ConcreteComponent + Decorator + ConcreteDecorator',
    example: 'Java I/O 流 (BufferedReader 包装 FileReader)',
    keyPoint: '⚠️ 装饰器和被装饰对象实现相同接口',
    examTip: '考题常问：装饰器 vs 适配器 vs 代理模式的区别'
  },
  ADAPTER: {
    title: '适配器模式 Adapter',
    category: '结构型模式',
    color: 'emerald',
    definition: '将一个类的接口转换成客户期望的另一个接口，使不兼容的类能够协同工作。',
    uml: 'Target(目标接口) + Adaptee(被适配者) + Adapter',
    example: '电源适配器、旧系统接口兼容、第三方库封装',
    keyPoint: '⚠️ 分为类适配器(继承)和对象适配器(组合)',
    examTip: '考题常问适配器的两种实现方式及优缺点'
  },
  STRATEGY: {
    title: '策略模式 Strategy',
    category: '行为型模式',
    color: 'orange',
    definition: '定义一族算法，把它们封装起来，并且使它们可以互相替换。',
    uml: 'Context + Strategy(接口) + ConcreteStrategy(A/B/C)',
    example: '排序算法选择、支付方式切换、折扣计算',
    keyPoint: '⚠️ 与状态模式结构相似，区别在于意图',
    examTip: '考题常与简单工厂结合：用工厂创建策略对象'
  },
  CHAIN: {
    title: '责任链模式 Chain of Resp.',
    category: '行为型模式',
    color: 'cyan',
    definition: '使多个对象都有机会处理请求，将这些对象连成一条链，沿链传递请求。',
    uml: 'Handler(抽象处理者) + ConcreteHandler + successor(后继)',
    example: 'Servlet Filter链、审批流程、异常处理链',
    keyPoint: '⚠️ 每个处理者决定：自己处理 or 转发给下一个',
    examTip: '考题常问：责任链 vs 装饰器模式的区别'
  },
  PROXY: {
    title: '代理模式 Proxy',
    category: '结构型模式',
    color: 'rose',
    definition: '为其他对象提供一种代理以控制对这个对象的访问。',
    uml: 'Subject(接口) + RealSubject + Proxy',
    example: 'Spring AOP 动态代理、RPC 远程调用、图片延迟加载',
    keyPoint: '⚠️ 代理对象与真实对象实现同一个接口',
    examTip: '考题常问：JDK 动态代理 vs CGLIB 代理的实现原理'
  },
  BUILDER: {
    title: '建造者模式 Builder',
    category: '创建型模式',
    color: 'amber',
    definition: '将一个复杂对象的构建与其表示分离，使同样的构建过程可以创建不同的表示。',
    uml: 'Builder(接口) + ConcreteBuilder + Director + Product',
    example: 'StringBuilder、Lombok @Builder、HTTP Client 请求构建器',
    keyPoint: '⚠️ 适合构建参数繁多、步骤复杂的复合对象',
    examTip: '考题常考：建造者模式 vs 工厂模式的区别'
  },
  STATE: {
    title: '状态模式 State',
    category: '行为型模式',
    color: 'pink',
    definition: '允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。',
    uml: 'Context + State(接口) + ConcreteStateA/B',
    example: '订单状态机(未支付/已支付/已发货)、TCP 连接状态切换',
    keyPoint: '⚠️ 消除庞大的 switch-case 或 if-else 条件判断',
    examTip: '考题常问：状态模式与策略模式结构的相同与意图的区别'
  },
  PROTOTYPE: {
    title: '原型模式 Prototype',
    category: '创建型模式',
    color: 'teal',
    definition: '用原型实例指定创建对象的种类，并通过拷贝这些原型创建新的对象。',
    uml: 'Prototype(接口) + ConcretePrototype + clone()',
    example: 'Java Object.clone()、浅拷贝与深拷贝、克隆大对象',
    keyPoint: '⚠️ 重点考察深拷贝(Deep Copy)与浅拷贝(Shallow Copy)',
    examTip: '考题常考：如何通过序列化实现深拷贝克隆？'
  },
  FACADE: {
    title: '外观模式 Facade',
    category: '结构型模式',
    color: 'indigo',
    definition: '为子系统中的一组接口提供一个一致的高层界面，定义一个高层接口使子系统更容易使用。',
    uml: 'Facade(外观类) + SubsystemClasses(多个子系统类)',
    example: '一键关机/开机系统、微服务网关 (API Gateway)、复杂 SDK 门面封装',
    keyPoint: '⚠️ 遵循最少知识原则(迪米特法则)',
    examTip: '考题常考外观模式如何降低系统之间的耦合度'
  }
};

const TOWERS = [
  { type: 'SINGLETON', name: '单例模式', cost: 120, icon: ShieldAlert, color: 'border-yellow-500', textColors: 'text-yellow-500', bgHover: 'hover:bg-yellow-500/20', desc: '全局唯一\n超高伤害\n专克强敌' },
  { type: 'FACTORY', name: '工厂模式', cost: 60, icon: Factory, color: 'border-purple-500', textColors: 'text-purple-500', bgHover: 'hover:bg-purple-500/20', desc: '批量生产\n自爆无人机\n多目标打击' },
  { type: 'OBSERVER', name: '观察者模式', cost: 50, icon: Eye, color: 'border-blue-500', textColors: 'text-blue-500', bgHover: 'hover:bg-blue-500/20', desc: '发布通知\n全场攻速\n翻倍' },
  { type: 'DECORATOR', name: '装饰器模式', cost: 40, icon: Paintbrush, color: 'border-violet-500', textColors: 'text-violet-500', bgHover: 'hover:bg-violet-500/20', desc: '增强相邻塔\n+40%伤害\n可叠加' },
  { type: 'ADAPTER', name: '适配器模式', cost: 45, icon: Plug, color: 'border-emerald-500', textColors: 'text-emerald-500', bgHover: 'hover:bg-emerald-500/20', desc: '接口转换\n敌人减速\n50%' },
  { type: 'STRATEGY', name: '策略模式', cost: 70, icon: ListChecks, color: 'border-orange-500', textColors: 'text-orange-500', bgHover: 'hover:bg-orange-500/20', desc: '三种攻击\n策略自动\n切换' },
  { type: 'CHAIN', name: '责任链模式', cost: 55, icon: Link, color: 'border-cyan-500', textColors: 'text-cyan-500', bgHover: 'hover:bg-cyan-500/20', desc: '伤害沿链\n传递\n协同攻击' },
  { type: 'PROXY', name: '代理模式', cost: 50, icon: Lock, color: 'border-rose-500', textColors: 'text-rose-500', bgHover: 'hover:bg-rose-500/20', desc: '代理护盾\n反射伤害\n抵挡控制' },
  { type: 'BUILDER', name: '建造者模式', cost: 65, icon: Boxes, color: 'border-amber-500', textColors: 'text-amber-500', bgHover: 'hover:bg-amber-500/20', desc: '分步装配\n随着时间\n指数强化' },
  { type: 'STATE', name: '状态模式', cost: 55, icon: Activity, color: 'border-pink-500', textColors: 'text-pink-500', bgHover: 'hover:bg-pink-500/20', desc: '战防双形态\n动态自动\n形态切换' },
  { type: 'PROTOTYPE', name: '原型模式', cost: 30, icon: Copy, color: 'border-teal-500', textColors: 'text-teal-500', bgHover: 'hover:bg-teal-500/20', desc: '低成本克隆\n复制本体\n协同作战' },
  { type: 'FACADE', name: '外观模式', cost: 50, icon: Layout, color: 'border-indigo-500', textColors: 'text-indigo-500', bgHover: 'hover:bg-indigo-500/20', desc: '统一门面\n降低周围\n塔冷却20%' }
] as const;

export const TowerHUD = () => {
  const {
    hp,
    maxHp,
    money,
    hasSingleton,
    selectedTowerType,
    wave,
    maxWaves,
    showQuiz,
    showKnowledgeCard,
    setSelectedTowerType,
    setMoney,
    setShowQuiz,
    setQuizCorrect,
    setShowKnowledgeCard,
  } = useGameStore();

  const [quizQuestion, setQuizQuestion] = useState<typeof QUIZ_QUESTIONS[0] | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [isCodeDiffOpen, setIsCodeDiffOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  const currentScenario = getScenarioByWave(Math.max(1, wave));
  const isTargetPatternSelectedOrBuilt = selectedTowerType === currentScenario.targetPattern || (currentScenario.targetPattern === 'SINGLETON' && hasSingleton);

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  useEffect(() => {
    if (showQuiz) {
      const q = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
      setQuizQuestion(q);
      setSelectedOption(null);
      setAnsweredCorrectly(null);
    }
  }, [showQuiz]);

  useEffect(() => {
    if (showKnowledgeCard) {
      const timer = setTimeout(() => setShowKnowledgeCard(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [showKnowledgeCard, setShowKnowledgeCard]);

  const handleOptionClick = (index: number) => {
    if (answeredCorrectly !== null) return;
    
    setSelectedOption(index);
    const correct = index === quizQuestion?.a;
    setAnsweredCorrectly(correct);
    
    if (correct) {
      setMoney(money + 30);
      setQuizCorrect(true);
    } else {
      setQuizCorrect(false);
    }
  };

  const handleQuizContinue = () => {
    setShowQuiz(false);
  };

  const hpPercentage = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const hpColor = hpPercentage > 50 ? 'bg-green-500' : hpPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      
      {/* 🚨 TOP SYSTEM CRISIS BANNER (Desktop: Centered / Mobile: Compact Strip below top bar) */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-2xl w-full px-4 hidden sm:block">
        <div className="bg-slate-900/90 backdrop-blur-md border border-red-500/40 rounded-xl p-3 shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-rose-400 font-mono tracking-wide">
                  CRISIS #{currentScenario.wave}
                </span>
                <span className="text-xs font-bold text-slate-100 truncate">{currentScenario.title}</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{currentScenario.subTitle}</p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={toggleSound}
              title={isMuted ? "开启音效" : "静音"}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={() => setIsCodeDiffOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 rounded-lg text-purple-200 text-xs font-bold shadow transition-all"
            >
              <FileCode2 className="w-4 h-4 text-purple-400" />
              <span>代码重构对比</span>
            </button>

            <button
              onClick={() => setShowKnowledgeCard(selectedTowerType || 'SINGLETON')}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-purple-500/40 rounded-lg text-purple-300 hover:text-purple-200 text-xs font-bold shadow transition-all"
            >
              <span>📖</span> 模式图鉴
            </button>
          </div>
        </div>
      </div>

      {/* 📱 MOBILE ONLY: Compact Crisis Banner */}
      <div className="absolute top-16 left-2 right-2 z-20 pointer-events-auto block sm:hidden">
        <div className="bg-slate-900/95 backdrop-blur-md border border-red-500/40 rounded-lg p-1.5 shadow-lg flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />
            <span className="text-[10px] font-black text-rose-400 font-mono">#{currentScenario.wave}</span>
            <span className="text-[10px] font-bold text-slate-200 truncate">{currentScenario.title}</span>
          </div>
        </div>
      </div>

      {/* RIGHT LIVE UML BLUEPRINT PANEL */}
      <div className="absolute top-36 right-4 z-20 pointer-events-none hidden lg:block">
        <UMLBlueprintPanel scenario={currentScenario} isUnlocked={isTargetPatternSelectedOrBuilt} />
      </div>

      {/* 1. LEFT PANEL */}
      <div className="absolute top-10 sm:top-14 left-2 sm:left-4 flex flex-row sm:flex-col gap-1.5 sm:gap-3 pointer-events-none z-20 w-auto max-w-[calc(100vw-130px)] sm:max-w-none overflow-x-auto">
        
        {/* Core HP */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-1.5 sm:p-4 rounded-lg sm:rounded-xl shadow-lg shrink-0 w-24 sm:w-64 pointer-events-auto">
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <span className="font-bold text-slate-200 flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm">
              <Heart className="w-3 h-3 sm:w-5 sm:h-5 text-red-400 shrink-0" />
              <span className="hidden sm:inline">核心圣殿</span> HP
            </span>
            <span className="text-slate-300 font-mono text-[9px] sm:text-sm">{hp}/{maxHp}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 sm:h-2.5 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-300 ${hpColor}`} style={{ width: `${hpPercentage}%` }}></div>
          </div>
        </div>

        {/* Resources */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-yellow-500/30 p-1.5 sm:p-4 rounded-lg sm:rounded-xl shadow-lg shrink-0 w-24 sm:w-64 pointer-events-auto flex items-center gap-1.5 sm:gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-yellow-500/5 animate-pulse"></div>
          <div className="bg-yellow-500/20 p-1 sm:p-2 rounded-lg shrink-0">
            <Coins className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-yellow-400" />
          </div>
          <div>
            <div className="text-[9px] sm:text-xs text-yellow-200/70 font-medium leading-none mb-0.5">算力</div>
            <div className="text-xs sm:text-2xl font-black text-yellow-400 font-mono drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">{money}</div>
          </div>
        </div>

        {/* Wave Progress */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-1.5 sm:p-3 rounded-lg sm:rounded-xl shadow-lg shrink-0 w-20 sm:w-64 pointer-events-auto">
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <span className="text-[9px] sm:text-sm font-semibold text-slate-300 flex items-center gap-1 sm:gap-2">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 shrink-0" />
              波次 {wave}/{maxWaves}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1 sm:h-1.5 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${(wave / maxWaves) * 100}%` }}></div>
          </div>
        </div>

      </div>

      {/* 2. BOTTOM BUILD BAR */}
      <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 pointer-events-none w-full max-w-[98vw] sm:max-w-6xl px-1 sm:px-2 z-30">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 shadow-2xl pointer-events-auto flex gap-1.5 sm:gap-2.5 overflow-x-auto custom-scrollbar items-center justify-start">
          {TOWERS.map((tower) => {
            const canAfford = money >= tower.cost;
            const isRestrictedSingleton = tower.type === 'SINGLETON' && hasSingleton;
            const isDisabled = !canAfford || isRestrictedSingleton;
            const isSelected = selectedTowerType === tower.type;
            const Icon = tower.icon;

            return (
              <button
                key={tower.type}
                disabled={isDisabled}
                onClick={() => setSelectedTowerType(isSelected ? null : (tower.type as TowerType))}
                className={`group relative flex flex-col items-center w-20 sm:w-24 shrink-0 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border-2 transition-all duration-200 
                  ${isSelected ? `${tower.color} bg-slate-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] scale-105 z-10` : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'}
                  ${isDisabled ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className={`p-1 sm:p-2 rounded-lg mb-1 sm:mb-2 ${isSelected ? `bg-slate-700 ${tower.textColors}` : 'bg-slate-700/50 text-slate-400 group-hover:text-slate-300'}`}>
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                
                <div className="text-[10px] sm:text-xs font-bold text-slate-200 mb-0.5 text-center truncate w-full">{tower.name}</div>
                
                <div className={`text-[9px] sm:text-[10px] whitespace-pre-line text-center text-slate-400 leading-tight mb-1 flex-grow h-7 sm:h-10 hidden sm:block ${isSelected ? tower.textColors : ''}`}>
                  {tower.desc}
                </div>

                <div className={`flex items-center gap-0.5 font-mono text-xs sm:text-sm font-bold ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                  <Coins className="w-3 h-3" />
                  {tower.cost}
                </div>

                {/* Hover Knowledge Tooltip */}
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 p-3 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 text-left hidden sm:block">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white">{KNOWLEDGE_DATA[tower.type]?.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">{KNOWLEDGE_DATA[tower.type]?.category}</span>
                  </div>
                  <div className="text-[10px] text-slate-300 mb-1.5 leading-snug">{KNOWLEDGE_DATA[tower.type]?.definition}</div>
                  <div className="text-[9px] text-amber-300 bg-amber-950/40 p-1.5 rounded border border-amber-500/30 font-medium">{KNOWLEDGE_DATA[tower.type]?.keyPoint}</div>
                </div>

                {isRestrictedSingleton && (
                  <div className="absolute inset-0 bg-slate-900/80 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <span className="text-[10px] sm:text-xs font-bold text-red-400 bg-red-950/80 px-1.5 py-0.5 rounded border border-red-500/50">已建造</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 📱 MOBILE ONLY: Action Buttons Top Right */}
      <div className="absolute top-10 right-2 z-30 pointer-events-auto flex items-center gap-1 sm:hidden">
        <button
          onClick={toggleSound}
          title={isMuted ? "开启音效" : "静音"}
          className="p-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-300 transition-all"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
        </button>

        <button
          onClick={() => setIsCodeDiffOpen(true)}
          title="代码重构对比"
          className="p-1 bg-purple-950/90 border border-purple-500/50 rounded-md text-purple-200 transition-all"
        >
          <FileCode2 className="w-3.5 h-3.5 text-purple-400" />
        </button>

        <button
          onClick={() => setShowKnowledgeCard(selectedTowerType || 'SINGLETON')}
          className="px-1.5 py-0.5 bg-slate-900/90 border border-purple-500/40 rounded-md text-purple-300 text-[10px] font-bold shadow-lg transition-all"
        >
          📖 图鉴
        </button>
      </div>

      {/* 3. NON-BLOCKING FLOATING KNOWLEDGE CARD (Top Right / Right Panel) */}
      {showKnowledgeCard && KNOWLEDGE_DATA[showKnowledgeCard] && (
        <div className="absolute top-12 sm:top-16 right-2 sm:right-4 z-40 pointer-events-auto w-72 sm:w-80 max-w-[90vw] animate-in fade-in slide-in-from-right-4 duration-300">
          <div 
            className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header strip */}
            <div className={`h-1.5 bg-${KNOWLEDGE_DATA[showKnowledgeCard].color}-500 w-full`}></div>
            
            <div className="p-4 relative">
              <button 
                onClick={() => setShowKnowledgeCard(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-2 pr-6">
                <h3 className="text-base font-bold text-white truncate">{KNOWLEDGE_DATA[showKnowledgeCard].title}</h3>
                <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {KNOWLEDGE_DATA[showKnowledgeCard].category}
                </span>
              </div>

              <div className="text-xs text-slate-300 mb-3 font-medium leading-relaxed">
                {KNOWLEDGE_DATA[showKnowledgeCard].definition}
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="bg-slate-800/60 p-2 rounded border border-slate-700/60">
                  <div className="text-slate-400 text-[10px] mb-0.5 flex items-center gap-1 font-semibold"><Info className="w-3 h-3 text-purple-400"/> 核心结构</div>
                  <div className="text-slate-200 font-mono text-[10px]">{KNOWLEDGE_DATA[showKnowledgeCard].uml}</div>
                </div>

                <div className="bg-orange-950/20 border border-orange-500/30 p-2 rounded">
                  <div className="text-orange-300 font-bold text-[10px]">{KNOWLEDGE_DATA[showKnowledgeCard].keyPoint}</div>
                </div>

                <div className="bg-blue-950/20 border border-blue-500/30 p-2 rounded">
                  <div className="text-blue-300 text-[10px] flex gap-1 font-medium">
                    <span className="shrink-0">💡</span>
                    <span>{KNOWLEDGE_DATA[showKnowledgeCard].examTip}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-right text-[9px] text-slate-500">
                5秒后自动关或点击✕关闭
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. QUIZ MODAL */}
      {showQuiz && quizQuestion && (
        <div className="fixed inset-0 pointer-events-auto flex items-center justify-center z-50 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-purple-500/50 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.2)] max-w-lg w-full overflow-hidden flex flex-col">
            
            <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-4 border-b border-purple-500/30 text-center">
              <h2 className="text-xl font-black text-purple-300 drop-shadow-md">
                第 {wave} 波清空！知识检验
              </h2>
            </div>

            <div className="p-6">
              <p className="text-lg text-slate-200 mb-6 font-medium">
                {quizQuestion.q}
              </p>

              <div className="space-y-3">
                {quizQuestion.opts.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = idx === quizQuestion.a;
                  
                  let btnClass = "bg-slate-800 border-slate-600 hover:bg-slate-700 text-slate-300";
                  
                  if (answeredCorrectly !== null) {
                    if (isCorrectAnswer) {
                      btnClass = "bg-green-900/50 border-green-500 text-green-300";
                    } else if (isSelected) {
                      btnClass = "bg-red-900/50 border-red-500 text-red-300";
                    } else {
                      btnClass = "bg-slate-800/50 border-slate-700 text-slate-500 opacity-50";
                    }
                  } else if (isSelected) {
                    btnClass = "bg-purple-900/50 border-purple-500 text-purple-300";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(idx)}
                      disabled={answeredCorrectly !== null}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${btnClass}`}
                    >
                      <span className="inline-block w-6 font-bold opacity-70">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {answeredCorrectly !== null && (
                <div className={`mt-6 p-4 rounded-xl border ${answeredCorrectly ? 'bg-green-950/50 border-green-500/50' : 'bg-red-950/50 border-red-500/50'} animate-in slide-in-from-bottom-4 duration-300`}>
                  <div className={`text-lg font-bold mb-2 ${answeredCorrectly ? 'text-green-400' : 'text-red-400'}`}>
                    {answeredCorrectly ? '✅ 回答正确！奖励 30 算力' : '❌ 回答错误'}
                  </div>
                  <div className="text-slate-300 text-sm">
                    {quizQuestion.explain}
                  </div>
                </div>
              )}

              {answeredCorrectly !== null && (
                <button
                  onClick={handleQuizContinue}
                  className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors shadow-lg"
                >
                  {wave === maxWaves ? '查看通关结果' : '继续下一波'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. CODE DIFF DRAWER */}
      <CodeDiffDrawer
        scenario={currentScenario}
        isOpen={isCodeDiffOpen}
        onClose={() => setIsCodeDiffOpen(false)}
      />
    </div>
  );
};
