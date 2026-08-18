import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Clock3,
  ListChecks,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

interface KeyPoint {
  title: string;
  detail: string;
}

interface Chapter {
  id: string;
  code: string;
  title: string;
  group: '理论总论' | '总体布局' | '安全统一外交' | '党的建设';
  focus: string;
  keyPoints: KeyPoint[];
  answerFrame: string;
  trap: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 'intro', code: '导论', title: '理论的时代背景与历史地位', group: '理论总论',
    focus: '把“创立背景—两个结合—科学体系—历史地位—两个确立”串成总论闭环。',
    keyPoints: [
      { title: '创立背景', detail: '世界百年未有之大变局加速演进，民族复兴进入关键时期，中国式现代化全面推进拓展，科学社会主义在21世纪中国焕发生机，党的自我革命开辟新境界。' },
      { title: '两个结合', detail: '马克思主义基本原理同中国具体实际相结合、同中华优秀传统文化相结合。第二个结合必须写“中华优秀传统文化”。' },
      { title: '六个必须坚持', detail: '人民至上、自信自立、守正创新、问题导向、系统观念、胸怀天下。' },
      { title: '历史地位', detail: '是当代中国马克思主义、二十一世纪马克思主义，是中华文化和中国精神的时代精华，实现了马克思主义中国化时代化新的飞跃。' },
      { title: '两个确立', detail: '确立习近平同志党中央的核心、全党的核心地位；确立习近平新时代中国特色社会主义思想的指导地位。' },
    ],
    answerFrame: '答历史地位：先写“当代中国马克思主义、二十一世纪马克思主义”，再写“中华文化和中国精神的时代精华”，最后写“实现新的飞跃”。',
    trap: '“第二个结合”不是笼统的“中华传统文化”，而是“中华优秀传统文化”。',
  },
  {
    id: 'chapter-1', code: '第一章', title: '新时代坚持和发展中国特色社会主义', group: '理论总论',
    focus: '掌握新时代历史方位、社会主要矛盾与“五位一体”“四个全面”。',
    keyPoints: [
      { title: '道路问题', detail: '道路问题是关系党的事业兴衰成败第一位的问题；只有坚持和发展中国特色社会主义才能实现中华民族伟大复兴。' },
      { title: '新时代方位', detail: '中国特色社会主义进入新时代，是我国发展新的历史方位。' },
      { title: '社会主要矛盾', detail: '人民日益增长的美好生活需要和不平衡不充分的发展之间的矛盾。' },
      { title: '一以贯之', detail: '全面贯彻党的基本理论、基本路线、基本方略。' },
      { title: '总布局和战略布局', detail: '统筹推进“五位一体”总体布局，协调推进“四个全面”战略布局。' },
    ],
    answerFrame: '解释新时代伟大变革：写社会主要矛盾的关系全局的历史性变化，再写新时代伟大变革的里程碑意义。',
    trap: '社会主要矛盾变化不等于基本国情和国际地位发生变化。',
  },
  {
    id: 'chapter-2', code: '第二章', title: '以中国式现代化全面推进中华民族伟大复兴', group: '理论总论',
    focus: '这是综合题重章：熟记中国梦、中国式现代化的中国特色、本质要求、重大原则和重大关系。',
    keyPoints: [
      { title: '中国梦本质', detail: '国家富强、民族振兴、人民幸福。' },
      { title: '五个中国特色', detail: '人口规模巨大；全体人民共同富裕；物质文明和精神文明相协调；人与自然和谐共生；走和平发展道路。' },
      { title: '本质要求', detail: '坚持党的领导和中国特色社会主义，实现高质量发展、全过程人民民主、共同富裕、人与自然和谐共生，推动构建人类命运共同体，创造人类文明新形态。' },
      { title: '五项重大原则', detail: '坚持和加强党的全面领导、坚持中国特色社会主义道路、坚持以人民为中心、坚持深化改革开放、坚持发扬斗争精神。' },
      { title: '六对重大关系', detail: '顶层设计与实践探索、战略与策略、守正与创新、效率与公平、活力与秩序、自立自强与对外开放。' },
    ],
    answerFrame: '答中国式现代化：定位为强国建设、民族复兴的唯一正确道路；分点写五个中国特色；补充本质要求或重大原则；回扣创造人类文明新形态。',
    trap: '“中国特色”与“本质要求”是两个层次，主观题不能只写前者。',
  },
  {
    id: 'chapter-3', code: '第三章', title: '坚持党的全面领导', group: '总体布局',
    focus: '用“最本质特征—最大优势—最高政治领导力量—根本领导制度”锁定选择题。',
    keyPoints: [
      { title: '最本质的特征', detail: '中国共产党领导是中国特色社会主义最本质的特征。' },
      { title: '最大优势', detail: '中国共产党领导是中国特色社会主义制度的最大优势。' },
      { title: '最高原则', detail: '党中央集中统一领导是党的领导的最高原则。' },
      { title: '最高政治领导力量', detail: '中国共产党是最高政治领导力量。' },
      { title: '根本领导制度', detail: '党的领导制度是我国的根本领导制度。' },
    ],
    answerFrame: '材料题先点明党的领导是全面的、系统的、整体的，再写其落实到改革发展稳定、内政外交国防、治党治国治军等各领域各方面各环节。',
    trap: '“最本质特征”和“最大优势”的答案都是中国共产党领导，但设问指向不同。',
  },
  {
    id: 'chapter-4', code: '第四章', title: '坚持以人民为中心', group: '总体布局',
    focus: '区分人民立场、人民至上、群众路线和共同富裕。',
    keyPoints: [
      { title: '人民立场', detail: '人民立场是中国共产党的根本政治立场，是区别于其他政党的显著标志。' },
      { title: '人民至上', detail: '人民对美好生活的向往就是党的奋斗目标；人民是党的生命之根、执政之基、力量之源。' },
      { title: '群众路线', detail: '一切为了群众，一切依靠群众，从群众中来，到群众中去；是党的生命线和根本工作路线、根本工作方法。' },
      { title: '最高评判者', detail: '人民是党的工作的最高裁决者和最终评判者。' },
      { title: '共同富裕', detail: '是中国特色社会主义的本质要求和中国式现代化的重要特征，不是整齐划一的平均主义。' },
    ],
    answerFrame: '答以人民为中心：从人民立场、发展为了人民、发展依靠人民、发展成果由人民共享和促进共同富裕依次展开。',
    trap: '共同富裕不是同步富裕、同等富裕或平均主义。',
  },
  {
    id: 'chapter-5', code: '第五章', title: '全面深化改革开放', group: '总体布局',
    focus: '重点是“关键一招—总目标—方法论—高水平开放”。',
    keyPoints: [
      { title: '关键一招', detail: '改革开放是决定当代中国命运的关键一招，也是决定实现民族复兴的关键一招。' },
      { title: '出发点和落脚点', detail: '更好实现和维护人民利益，让老百姓过上好日子。' },
      { title: '总目标', detail: '完善和发展中国特色社会主义制度，推进国家治理体系和治理能力现代化。' },
      { title: '三个进一步解放', detail: '进一步解放思想、进一步解放和发展社会生产力、进一步解放和增强社会活力。' },
      { title: '改革特征', detail: '新时代全面深化改革具有全面性、系统性、整体性，是一场深刻革命。' },
    ],
    answerFrame: '问改革方向时，写坚持和完善中国特色社会主义制度，以促进社会公平正义、增进人民福祉为出发点和落脚点。',
    trap: '全面深化改革总目标不能只写“国家治理现代化”，必须先写“完善和发展中国特色社会主义制度”。',
  },
  {
    id: 'chapter-6', code: '第六章', title: '推动高质量发展', group: '总体布局',
    focus: '选择题密集章，重点掌握新发展理念、基本经济制度、新发展格局和乡村振兴。',
    keyPoints: [
      { title: '新发展理念', detail: '创新、协调、绿色、开放、共享。创新是第一动力；绿色解决人与自然和谐共生；共享是中国特色社会主义的本质要求。' },
      { title: '高质量发展', detail: '是全面建设社会主义现代化国家的首要任务，是新时代经济社会发展的鲜明主题。' },
      { title: '新质生产力', detail: '以创新起主导作用，摆脱传统增长路径、符合高质量发展要求的先进生产力质态。' },
      { title: '基本经济制度', detail: '公有制为主体、多种所有制经济共同发展；按劳分配为主体、多种分配方式并存；社会主义市场经济体制。' },
      { title: '新发展格局', detail: '以国内大循环为主体、国内国际双循环相互促进，不是封闭的国内循环。' },
    ],
    answerFrame: '答基本经济制度时，按“所有制—分配—市场经济体制”三层写；答高质量发展时，用新发展理念和现代化经济体系补充实践路径。',
    trap: '“两个毫不动摇”是巩固发展公有制经济与鼓励支持引导非公有制经济发展，不能只写一边。',
  },
  {
    id: 'chapter-7', code: '第七章', title: '教育、科技、人才战略', group: '总体布局',
    focus: '围绕“三个第一”和教育、科技、人才一体推进命题。',
    keyPoints: [
      { title: '战略定位', detail: '教育、科技、人才是全面建设社会主义现代化国家的基础性、战略性支撑。' },
      { title: '三个第一', detail: '科学技术是第一生产力，人才是第一资源，创新是第一动力。' },
      { title: '教育', detail: '教育是国之大计、党之大计；立德树人是教育的根本任务。' },
      { title: '科技', detail: '科技自立自强是国家强盛之基、安全之要；要打赢关键核心技术攻坚战。' },
      { title: '人才', detail: '人才是实现民族振兴、赢得国际竞争主动的战略资源。' },
    ],
    answerFrame: '答建设三强：教育优先发展、科技自立自强、人才引领驱动，三者必须一体推进、协同发力。',
    trap: '第一资源是人才，不是教育；第一生产力是科学技术。',
  },
  {
    id: 'chapter-8', code: '第八章', title: '发展全过程人民民主', group: '总体布局',
    focus: '精准辨析国体、政体、根本政治制度、基本政治制度与统一战线。',
    keyPoints: [
      { title: '国体与政体', detail: '国体是人民民主专政；政体是人民代表大会制度。' },
      { title: '根本政治制度', detail: '人民代表大会制度。' },
      { title: '基本政治制度', detail: '中国共产党领导的多党合作和政治协商制度、民族区域自治制度、基层群众自治制度。' },
      { title: '全过程人民民主', detail: '是全链条、全方位、全覆盖的民主，是最广泛、最真实、最管用的民主，是社会主义民主政治的本质属性。' },
      { title: '统一战线', detail: '是党克敌制胜、执政兴国的重要法宝；新时代历史责任是促进中华儿女大团结。' },
    ],
    answerFrame: '答全过程人民民主时，先写本质属性，再写“全链条、全方位、全覆盖”和“最广泛、最真实、最管用”，最后落到人民当家作主制度体系。',
    trap: '协商民主不是根本政治制度；人民代表大会制度才是。',
  },
  {
    id: 'chapter-9', code: '第九章', title: '全面依法治国', group: '总体布局',
    focus: '把“道路—总目标—总抓手—工作布局—根本目的”逐一对应。',
    keyPoints: [
      { title: '唯一正确道路', detail: '中国特色社会主义法治道路。' },
      { title: '根本保证与目的', detail: '党的领导是社会主义法治最根本的保证；全面依法治国的根本目的是依法保障人民权益。' },
      { title: '总目标', detail: '建设中国特色社会主义法治体系，建设社会主义法治国家。' },
      { title: '总抓手', detail: '建设中国特色社会主义法治体系。' },
      { title: '工作布局', detail: '科学立法、严格执法、公正司法、全民守法。依法治国首先坚持依宪治国，依法执政首先坚持依宪执政。' },
    ],
    answerFrame: '材料题：写全面依法治国是国家治理的一场深刻革命，并写坚持党的领导、人民当家作主、依法治国有机统一及四个环节协同推进。',
    trap: '“法律体系”与“法治体系”不同；全面依法治国的总抓手是中国特色社会主义法治体系。',
  },
  {
    id: 'chapter-10', code: '第十章', title: '建设社会主义文化强国', group: '总体布局',
    focus: '文化自信、意识形态、核心价值观、中华文明突出特性四项必须成组记忆。',
    keyPoints: [
      { title: '文化自信', detail: '是更基础、更广泛、更深厚的自信，是更基本、更深沉、更持久的力量。' },
      { title: '文化发展道路', detail: '中国特色社会主义文化发展道路是推动社会主义文化繁荣兴盛的唯一正确道路。' },
      { title: '意识形态', detail: '意识形态工作是为国家立心、为民族立魂的工作；坚持马克思主义在意识形态领域指导地位的根本制度。' },
      { title: '核心价值观', detail: '国家层面富强民主文明和谐；社会层面自由平等公正法治；个人层面爱国敬业诚信友善。' },
      { title: '文明特性', detail: '连续性、创新性、统一性、包容性、和平性。' },
    ],
    answerFrame: '答文化强国时，用文化自信引领，依次写意识形态、核心价值观、优秀传统文化的创造性转化创新性发展、文化软实力。',
    trap: '个人层面是“爱国、敬业、诚信、友善”，不要混入国家或社会层面。',
  },
  {
    id: 'chapter-11', code: '第十一章', title: '保障和改善民生、加强社会建设', group: '总体布局',
    focus: '沿“发展—分配—就业—社保—健康—治理”主线复习。',
    keyPoints: [
      { title: '发展与民生', detail: '发展是解决民生问题的“总钥匙”，民生是发展的“指南针”；增进民生福祉是发展的根本目的。' },
      { title: '重中之重', detail: '解决人民群众最关心、最直接、最现实的利益问题。' },
      { title: '就业', detail: '就业是最基本的民生，是最大的民生工程、民心工程、根基工程；实施就业优先战略。' },
      { title: '收入分配', detail: '收入分配是民生之源；构建初次分配、再分配、第三次分配协调配套的制度体系。' },
      { title: '社会治理', detail: '坚持共建共治共享的社会治理理念，在共建共治共享中推进社会治理现代化。' },
    ],
    answerFrame: '问提高生活品质，按完善分配制度、就业优先、社会保障、健康中国四个着力点写，每点回扣获得感、幸福感、安全感。',
    trap: '保障改善民生的重中之重不是泛泛的“经济发展”，而是解决最关心最直接最现实的利益问题。',
  },
  {
    id: 'chapter-12', code: '第十二章', title: '建设社会主义生态文明', group: '总体布局',
    focus: '从价值立场、绿色发展、美丽中国与全球生态治理四层回答。',
    keyPoints: [
      { title: '基本方针', detail: '尊重自然、顺应自然、保护自然。' },
      { title: '核心理念', detail: '人与自然是生命共同体；绿水青山就是金山银山。' },
      { title: '发展方式', detail: '推动绿色低碳发展，加快形成绿色生产方式和生活方式。' },
      { title: '美丽中国', detail: '用最严格制度、最严密法治保护生态环境，将建设美丽中国转化为全体人民自觉行动。' },
      { title: '全球治理', detail: '坚持共同但有区别的责任原则，积极推动全球可持续发展，共建清洁美丽世界。' },
    ],
    answerFrame: '答生态文明建设时，先写人与自然和谐共生，再写绿色低碳和最严格制度法治，最后写共建清洁美丽世界。',
    trap: '生态文明不是单纯的环境保护，必须联系生产方式、生活方式和全球治理。',
  },
  {
    id: 'chapter-13', code: '第十三章', title: '维护和塑造国家安全', group: '安全统一外交',
    focus: '总体国家安全观的“宗旨—根本—基础—保障—依托”是必背固定搭配。',
    keyPoints: [
      { title: '总体国家安全观', detail: '以人民安全为宗旨，以政治安全为根本，以经济安全为基础，以军事、科技、文化、社会安全为保障，以促进国际安全为依托。' },
      { title: '安全地位', detail: '国家安全是民族复兴的根基，社会稳定是国家强盛的前提。' },
      { title: '首要位置', detail: '维护政治安全要放在首要位置。' },
      { title: '新安全格局', detail: '统筹外部与内部、国土与国民、传统与非传统、自身与共同安全。' },
      { title: '风险治理', detail: '坚持底线思维和极限思维，提高防范化解重大风险能力。' },
    ],
    answerFrame: '材料出现网络、数据、人工智能、生物或公共卫生风险时，先归入重点领域安全，再回到统筹发展和安全、构建新安全格局。',
    trap: '总体国家安全观的关键是“总体”；人民安全是宗旨，政治安全是根本，经济安全是基础。',
  },
  {
    id: 'chapter-14', code: '第十四章', title: '建设巩固国防和强大人民军队', group: '安全统一外交',
    focus: '牢记强军目标、战略安排、建军方略与党对军队绝对领导。',
    keyPoints: [
      { title: '强军逻辑', detail: '强国必须强军，军强才能国安。' },
      { title: '强军目标', detail: '建设一支听党指挥、能打胜仗、作风优良的人民军队。' },
      { title: '战略安排', detail: '到2027年实现建军一百年奋斗目标；到2035年基本实现国防和军队现代化；到本世纪中叶全面建成世界一流军队。' },
      { title: '建军方略', detail: '政治建军、改革强军、科技强军、人才强军、依法治军。' },
      { title: '根本原则', detail: '坚持党对人民军队的绝对领导；军委主席负责制是根本制度和根本实现形式。' },
    ],
    answerFrame: '答国防和军队现代化：先写党对军队绝对领导，再写强军目标与战略安排，最后列五项建军方略。',
    trap: '“能打胜仗”反映军队根本职能和建设根本指向；“听党指挥”是灵魂。',
  },
  {
    id: 'chapter-15', code: '第十五章', title: '坚持“一国两制”和推进祖国完全统一', group: '安全统一外交',
    focus: '区分根本宗旨、最高原则、“一国”和“两制”的关系及对台总体方略。',
    keyPoints: [
      { title: '根本宗旨', detail: '维护国家主权、安全、发展利益，保持香港、澳门长期繁荣稳定。' },
      { title: '最高原则', detail: '维护国家主权、安全、发展利益。' },
      { title: '一国与两制', detail: '“一国”是实行“两制”的前提和基础；“两制”从属和派生于“一国”，统一于“一国”之内。' },
      { title: '港澳工作', detail: '坚持和完善“一国两制”制度体系，支持香港、澳门更好融入国家发展大局。' },
      { title: '祖国统一', detail: '实现祖国完全统一是民族复兴的必然要求；坚持新时代党解决台湾问题的总体方略。' },
    ],
    answerFrame: '材料题先写维护国家主权、安全、发展利益的原则，再写坚持完善“一国两制”与推进祖国完全统一。',
    trap: '“保持港澳长期繁荣稳定”是根本宗旨的一部分，但“最高原则”是维护国家主权、安全、发展利益。',
  },
  {
    id: 'chapter-16', code: '第十六章', title: '中国特色大国外交和构建人类命运共同体', group: '安全统一外交',
    focus: '掌握外交政策、外交宗旨、对外工作总目标、三大全球倡议和“一带一路”定位。',
    keyPoints: [
      { title: '世界形势', detail: '当今世界正经历百年未有之大变局；和平、发展、合作、共赢的历史潮流不可阻挡。' },
      { title: '外交政策', detail: '坚持独立自主的和平外交政策，坚持走和平发展道路。' },
      { title: '外交宗旨', detail: '维护世界和平、促进共同发展。' },
      { title: '对外工作总目标', detail: '推动构建人类命运共同体。' },
      { title: '实践平台', detail: '全球发展、安全、文明三大倡议；高质量共建“一带一路”是重要实践平台和重要依托。' },
    ],
    answerFrame: '答人类命运共同体：先写世界各国人民前途所在，再写和平发展、合作共赢、多边主义，最后联系三大全球倡议、“一带一路”和全球治理。',
    trap: '外交宗旨是“维护世界和平、促进共同发展”；“推动构建人类命运共同体”是对外工作总目标。',
  },
  {
    id: 'chapter-17', code: '第十七章', title: '全面从严治党', group: '党的建设',
    focus: '用“全面从严治党—政治建设—反腐败—自我革命”完成全书收束。',
    keyPoints: [
      { title: '鲜明主题', detail: '全面从严治党是新时代党的建设的鲜明主题。' },
      { title: '建设布局', detail: '政治、思想、组织、作风、纪律建设，把制度建设贯穿其中，深入推进反腐败斗争。' },
      { title: '首位建设', detail: '把党的政治建设摆在首位。' },
      { title: '反腐败', detail: '腐败是党长期执政面临的最大威胁；反腐败必须永远吹冲锋号。' },
      { title: '自我革命', detail: '勇于自我革命是党区别于其他政党的显著标志，是最大的优势、最鲜明的品格；党的自我革命是跳出历史周期率的第二个答案。' },
    ],
    answerFrame: '答以自我革命引领社会革命：从党的性质宗旨、长期执政风险、保持先进性纯洁性和为民族复兴提供根本保证四层作答。',
    trap: '党的建设总体布局中，制度建设是贯穿各项建设之中的，不要误选思想建设或纪律建设。',
  },
];

const QUIZ: QuizQuestion[] = [
  { question: '“第二个结合”指马克思主义基本原理同什么相结合？', options: ['中国具体实际', '中华优秀传统文化', '世界文明成果', '中国历史经验'], answer: 1, explanation: '“两个结合”中的第二个结合是同中华优秀传统文化相结合。' },
  { question: '新时代我国社会主要矛盾是？', options: ['人民日益增长的物质文化需要同落后的社会生产之间的矛盾', '人民日益增长的美好生活需要和不平衡不充分的发展之间的矛盾', '生产力与生产关系之间的矛盾', '经济发展与环境保护之间的矛盾'], answer: 1, explanation: '必须完整表述为“美好生活需要”与“不平衡不充分的发展”之间的矛盾。' },
  { question: '中国梦的本质是？', options: ['国家富强、民族振兴、人民幸福', '经济繁荣、文化发展、社会稳定', '共同富裕、绿色发展、和平共处', '改革开放、科技自立、依法治国'], answer: 0, explanation: '中国梦本质的固定表述是国家富强、民族振兴、人民幸福。' },
  { question: '中国特色社会主义制度的最大优势是？', options: ['人民代表大会制度', '集中力量办大事', '中国共产党的领导', '社会主义市场经济体制'], answer: 2, explanation: '中国共产党领导既是最本质特征，也是制度最大优势。' },
  { question: '全面深化改革的总目标是？', options: ['建设高水平社会主义市场经济体制', '完善和发展中国特色社会主义制度，推进国家治理体系和治理能力现代化', '推进高水平对外开放', '实现共同富裕'], answer: 1, explanation: '总目标必须同时包含制度发展与国家治理现代化两个部分。' },
  { question: '教育、科技、人才中的“第一资源”是？', options: ['教育', '科技', '人才', '创新'], answer: 2, explanation: '科学技术是第一生产力，人才是第一资源，创新是第一动力。' },
  { question: '我国的根本政治制度是？', options: ['人民代表大会制度', '多党合作和政治协商制度', '民族区域自治制度', '基层群众自治制度'], answer: 0, explanation: '人民代表大会制度是根本政治制度，后三项属于基本政治制度。' },
  { question: '全面依法治国的总抓手是？', options: ['建设中国特色社会主义法律体系', '建设中国特色社会主义法治体系', '建设社会主义法治国家', '坚持依宪执政'], answer: 1, explanation: '总抓手是建设中国特色社会主义法治体系。' },
  { question: '总体国家安全观中，国家安全的根本是？', options: ['人民安全', '政治安全', '经济安全', '社会安全'], answer: 1, explanation: '人民安全是宗旨，政治安全是根本，经济安全是基础。' },
  { question: '新时代对外工作的总目标是？', options: ['维护世界和平、促进共同发展', '共建“一带一路”', '推动构建人类命运共同体', '弘扬全人类共同价值'], answer: 2, explanation: '外交宗旨是维护世界和平、促进共同发展；总目标是推动构建人类命运共同体。' },
];

const GROUPS: Chapter['group'][] = ['理论总论', '总体布局', '安全统一外交', '党的建设'];
const STORAGE_KEY = 'code-game-15040-study-progress';

function getStoredProgress(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export default function XjpThoughtStudy() {
  const { addScore, completeLevel } = useGameStore();
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz' | 'strategy'>('learn');
  const [activeId, setActiveId] = useState('intro');
  const [learnedIds, setLearnedIds] = useState<string[]>(getStoredProgress);
  const [quizIndex, setQuizIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const activeChapter = useMemo(() => CHAPTERS.find(chapter => chapter.id === activeId) ?? CHAPTERS[0], [activeId]);
  const progress = Math.round((learnedIds.length / CHAPTERS.length) * 100);
  const currentQuestion = QUIZ[quizIndex];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(learnedIds));
    } catch {
      // Local persistence is optional in privacy-restricted browsers.
    }
  }, [learnedIds]);

  useEffect(() => {
    if (learnedIds.length === CHAPTERS.length) completeLevel('xjp-thought-study');
  }, [learnedIds.length, completeLevel]);

  const markLearned = () => {
    if (!learnedIds.includes(activeId)) {
      setLearnedIds(prev => [...prev, activeId]);
      addScore(15);
    }
  };

  const moveChapter = (direction: -1 | 1) => {
    const currentIndex = CHAPTERS.findIndex(chapter => chapter.id === activeId);
    const next = CHAPTERS[currentIndex + direction];
    if (next) setActiveId(next.id);
  };

  const chooseAnswer = (index: number) => {
    if (answered) return;
    setChosen(index);
    setAnswered(true);
    if (index === currentQuestion.answer) {
      setCorrectCount(value => value + 1);
      addScore(10);
    }
  };

  const nextQuestion = () => {
    if (quizIndex === QUIZ.length - 1) {
      const finalScore = correctCount + (chosen === currentQuestion.answer ? 1 : 0);
      if (finalScore >= 8) completeLevel('xjp-thought-study');
      setQuizDone(true);
      return;
    }
    setQuizIndex(index => index + 1);
    setChosen(null);
    setAnswered(false);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setChosen(null);
    setAnswered(false);
    setCorrectCount(0);
    setQuizDone(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-6 text-slate-100">
      <section className="rounded-3xl border border-amber-400/30 bg-slate-950/90 shadow-2xl shadow-amber-950/30 overflow-hidden">
        <div className="relative px-5 sm:px-8 py-6 sm:py-7 border-b border-amber-400/20 bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950">
          <div className="absolute -right-10 -top-12 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-400/15 border border-amber-300/30 text-amber-300 shadow-lg shadow-amber-500/10">
                <BookOpenCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.16em] text-amber-200/80 uppercase">
                  <Sparkles size={13} /> 自考公共课 · 15040
                </div>
                <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-amber-50">习近平新时代中国特色社会主义思想概论</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">以60分通过为底线设计：18章高频知识点、规范化主观题框架与10题即时自测，完成学习进度后将同步点亮地图关卡。</p>
              </div>
            </div>
            <div className="min-w-[210px] rounded-2xl bg-slate-950/55 border border-slate-700/80 px-4 py-3 backdrop-blur">
              <div className="flex items-center justify-between text-xs text-slate-400"><span className="font-mono">学习进度</span><span className="font-bold text-amber-300">{learnedIds.length} / {CHAPTERS.length}</span></div>
              <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
              <p className="mt-2 text-[11px] text-slate-500">完成全部章节或自测达到80分即可通关</p>
            </div>
          </div>
        </div>

        <div className="flex gap-1 p-2 sm:px-5 sm:pt-4 border-b border-slate-800 bg-slate-950/70 overflow-x-auto">
          {[
            { id: 'learn', label: '章节精学', icon: BookOpenCheck },
            { id: 'quiz', label: '通关自测', icon: ClipboardCheck },
            { id: 'strategy', label: '考场策略', icon: Target },
          ].map(tab => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;
            return <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`flex items-center gap-2 shrink-0 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${selected ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-amber-100 hover:bg-slate-800'}`}><Icon size={16} />{tab.label}</button>;
          })}
        </div>

        {activeTab === 'learn' && (
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] min-h-[610px]">
            <aside className="border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/60 p-3 sm:p-4">
              <div className="flex items-center justify-between px-2 pb-3"><span className="text-xs font-mono tracking-widest text-slate-500">CHAPTER MAP</span><span className="text-xs text-amber-300">{progress}%</span></div>
              <div className="max-h-[390px] lg:max-h-[610px] overflow-y-auto pr-1 space-y-4">
                {GROUPS.map(group => (
                  <div key={group}>
                    <p className="px-2 mb-1.5 text-[10px] uppercase tracking-[0.18em] text-slate-600">{group}</p>
                    <div className="space-y-1">
                      {CHAPTERS.filter(chapter => chapter.group === group).map(chapter => {
                        const isActive = chapter.id === activeId;
                        const done = learnedIds.includes(chapter.id);
                        return <button key={chapter.id} type="button" onClick={() => setActiveId(chapter.id)} className={`w-full text-left px-3 py-2.5 rounded-xl transition-all border ${isActive ? 'bg-amber-500/15 border-amber-400/35 text-amber-100' : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
                          <span className="flex items-center gap-2 text-xs"><span className={`flex h-5 w-5 items-center justify-center rounded-full border ${done ? 'border-emerald-400/60 bg-emerald-400/15 text-emerald-300' : isActive ? 'border-amber-300/50 text-amber-300' : 'border-slate-700 text-slate-600'}`}>{done ? <CheckCircle2 size={12} /> : <span className="font-mono text-[9px]">{chapter.code === '导论' ? '0' : chapter.code.replace('第', '').replace('章', '')}</span>}</span><span className="font-mono text-[10px] opacity-75">{chapter.code}</span></span>
                          <span className="block mt-1 pl-7 text-xs leading-snug">{chapter.title}</span>
                        </button>;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            <main className="p-4 sm:p-7 lg:p-8 bg-gradient-to-br from-slate-900/40 to-slate-950">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-300"><CircleDot size={14} /> {activeChapter.code} · {activeChapter.group}</div>
                  <h3 className="mt-2 text-2xl font-black text-slate-50">{activeChapter.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{activeChapter.focus}</p>
                </div>
                <button type="button" onClick={markLearned} disabled={learnedIds.includes(activeId)} className={`shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${learnedIds.includes(activeId) ? 'bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 cursor-default' : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-[0.97]'}`}>
                  <CheckCircle2 size={17} />{learnedIds.includes(activeId) ? '本章已掌握' : '标记本章掌握'}
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-3">
                {activeChapter.keyPoints.map((point, index) => (
                  <article key={point.title} className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 hover:border-amber-400/30 transition-colors">
                    <div className="flex items-start gap-3"><span className="flex shrink-0 h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-xs font-mono font-bold text-amber-300 border border-amber-400/15">{String(index + 1).padStart(2, '0')}</span><div><h4 className="text-sm font-bold text-amber-100">{point.title}</h4><p className="mt-1.5 text-sm leading-relaxed text-slate-300">{point.detail}</p></div></div>
                  </article>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
                <section className="rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-4"><div className="flex items-center gap-2 text-cyan-300 font-bold text-sm"><Brain size={17} /> 主观题得分框架</div><p className="mt-2 text-sm leading-relaxed text-slate-300">{activeChapter.answerFrame}</p></section>
                <section className="rounded-2xl border border-rose-400/20 bg-rose-500/5 p-4"><div className="flex items-center gap-2 text-rose-300 font-bold text-sm"><ShieldCheck size={17} /> 易错警报</div><p className="mt-2 text-sm leading-relaxed text-slate-300">{activeChapter.trap}</p></section>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button type="button" onClick={() => moveChapter(-1)} disabled={activeId === CHAPTERS[0].id} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100 disabled:opacity-35 disabled:hover:bg-transparent"><ChevronLeft size={18} />上一章</button>
                <span className="text-xs font-mono text-slate-600">{CHAPTERS.findIndex(chapter => chapter.id === activeId) + 1} / {CHAPTERS.length}</span>
                <button type="button" onClick={() => moveChapter(1)} disabled={activeId === CHAPTERS[CHAPTERS.length - 1].id} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-amber-300 hover:bg-amber-500/10 disabled:opacity-35 disabled:hover:bg-transparent">下一章<ChevronRight size={18} /></button>
              </div>
            </main>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto p-5 sm:p-8 min-h-[610px]">
            {!quizDone ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="font-mono text-xs tracking-widest text-amber-300">CHECKPOINT {String(quizIndex + 1).padStart(2, '0')} / {QUIZ.length}</div><h3 className="mt-2 text-xl font-bold text-slate-100">通关自测：选择最符合题意的一项</h3></div><div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-400">当前正确 <span className="font-bold text-emerald-300">{correctCount}</span> 题</div></div>
                <div className="mt-5 h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all" style={{ width: `${((quizIndex + (answered ? 1 : 0)) / QUIZ.length) * 100}%` }} /></div>
                <section className="mt-7 rounded-3xl border border-slate-700 bg-slate-900/70 p-5 sm:p-7"><p className="text-lg sm:text-xl font-bold leading-relaxed text-slate-100">{quizIndex + 1}. {currentQuestion.question}</p><div className="mt-6 space-y-3">{currentQuestion.options.map((option, index) => { const isCorrect = index === currentQuestion.answer; const isChosen = chosen === index; const stateClass = answered ? (isCorrect ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-100' : isChosen ? 'border-rose-400/60 bg-rose-500/10 text-rose-100' : 'border-slate-700 text-slate-500') : 'border-slate-700 bg-slate-950/50 text-slate-300 hover:border-amber-400/45 hover:bg-amber-500/5'; return <button key={option} type="button" onClick={() => chooseAnswer(index)} className={`w-full flex gap-3 text-left p-4 rounded-2xl border transition-all ${stateClass}`}><span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs font-mono">{String.fromCharCode(65 + index)}</span><span className="text-sm leading-relaxed">{option}</span></button>; })}</div>
                {answered && <div className={`mt-5 rounded-2xl p-4 border ${chosen === currentQuestion.answer ? 'border-emerald-400/30 bg-emerald-500/10' : 'border-rose-400/30 bg-rose-500/10'}`}><div className="flex gap-2"><CheckCircle2 size={18} className={chosen === currentQuestion.answer ? 'text-emerald-300 shrink-0 mt-0.5' : 'text-rose-300 shrink-0 mt-0.5'} /><p className="text-sm leading-relaxed text-slate-200">{chosen === currentQuestion.answer ? '回答正确。' : '本题需要再记。'} {currentQuestion.explanation}</p></div></div>}
                </section>
                <div className="mt-5 flex justify-end"><button type="button" disabled={!answered} onClick={nextQuestion} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold disabled:opacity-40 disabled:hover:bg-amber-500 active:scale-[0.97] transition-all">{quizIndex === QUIZ.length - 1 ? '提交成绩' : '下一题'}<ArrowRight size={17} /></button></div>
              </>
            ) : (
              <div className="min-h-[520px] flex items-center justify-center"><section className="max-w-xl w-full text-center rounded-3xl border border-amber-400/30 bg-gradient-to-b from-amber-500/10 to-slate-900 p-7 sm:p-10"><div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-400/15 border border-amber-300/30 text-amber-300"><AwardBadge score={correctCount} /></div><h3 className="mt-5 text-2xl font-black text-amber-50">自测完成：{correctCount} / {QUIZ.length}</h3><p className="mt-3 text-sm leading-relaxed text-slate-300">{correctCount >= 8 ? '已达到80分通关线。建议回到章节精学，优先复盘标红的易错搭配，再完成一次全真模拟。' : '尚未达到80分通关线。请从错题对应章节返回精学，重点核对“根本、最大、总目标、总抓手”等固定搭配。'}</p><div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center"><button type="button" onClick={resetQuiz} className="inline-flex justify-center items-center gap-2 px-4 py-3 rounded-xl border border-slate-600 text-slate-200 hover:bg-slate-800"><RotateCcw size={16} />重新自测</button><button type="button" onClick={() => setActiveTab('learn')} className="inline-flex justify-center items-center gap-2 px-4 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"><BookOpenCheck size={16} />返回章节</button></div></section></div>
            )}
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="p-5 sm:p-8 min-h-[610px]">
            <div className="max-w-4xl mx-auto"><div className="flex items-center gap-3"><div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-300"><ListChecks size={22} /></div><div><h3 className="text-xl font-black text-slate-100">15040 保通过作战卡</h3><p className="mt-1 text-sm text-slate-400">把有限时间优先投入识记、规范化简答与动态时政更新。</p></div></div>
              <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">{[
                ['识记先拿分', '选择题重点圈定“根本、首要、最大、核心、总目标、总抓手”等限定词。看到固定搭配，按教材规范表述作答。'],
                ['简答要分点', '先写总论断，再用“是什么—为什么—怎么办”分3至5点展开。每一点单独成句，关键词置于句首。'],
                ['材料须回扣', '先找材料主题词，再调用相应章的“内涵—意义—要求”。开头点题，结尾回到实践要求。'],
              ].map(([title, detail], index) => <article key={title} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5"><span className="font-mono text-amber-300 text-xs">0{index + 1}</span><h4 className="mt-2 font-bold text-slate-100">{title}</h4><p className="mt-2 text-sm leading-relaxed text-slate-400">{detail}</p></article>)}</div>
              <section className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-5"><div className="flex items-center gap-2 text-cyan-200 font-bold"><Clock3 size={18} />临考时政更新</div><p className="mt-2 text-sm leading-relaxed text-slate-300">考试范围包括考试日前12个月内的国内外时事；考试日前6个月前由全国人大和国务院制定或修订的法律、法规，纳入相应课程范围。临考时按“重大会议与部署、经济科技、民生法治文化生态、国家安全统一、外交全球治理”五类整理，并为每条时政标注对应教材章节。</p></section>
              <section className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/5 p-5"><div className="flex items-center gap-2 text-amber-200 font-bold"><Target size={18} />14天冲刺节奏</div><div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">{['1—2天：导论至第二章', '3—6天：第三至第八章', '7—10天：第九至第十七章', '11—14天：选择、简答、材料、时政'].map((item, index) => <div key={item} className="rounded-xl bg-slate-950/60 border border-slate-700 p-3"><span className="font-mono text-amber-300">PHASE {index + 1}</span><p className="mt-1.5 text-slate-300 leading-relaxed">{item}</p></div>)}</div></section>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function AwardBadge({ score }: { score: number }) {
  return <span className="font-black text-2xl">{score >= 8 ? '✓' : '!'}</span>;
}
