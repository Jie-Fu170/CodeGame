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
  group: '基础与环境' | '计划与组织' | '领导与激励' | '沟通与控制';
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
    id: 'management-overview', code: '第一章', title: '管理概论', group: '基础与环境',
    focus: '用“组织—目标—职能—效率效果—管理者”建立全书底座。',
    keyPoints: [
      { title: '管理的含义', detail: '在特定环境下，通过计划、组织、领导、控制等职能，合理配置和协调资源，以实现组织目标的过程。' },
      { title: '管理的载体', detail: '管理的载体是组织。管理活动不同于作业活动；管理工作既具有科学性又具有艺术性；管理核心是以人为本。' },
      { title: '有效性', detail: '管理有效性以效率和效果衡量。效率强调投入与产出关系，效果强调目标实现程度；二者应统一。' },
      { title: '管理过程', detail: '计划、组织、领导、控制。记忆为：先定方向，再配资源，后带队伍，最后纠偏。' },
      { title: '管理者', detail: '角色分为人际关系、信息传递、决策制定三类；技能分为技术、人际、概念三类，高层管理者更需概念技能。' },
    ],
    answerFrame: '答管理的特性：管理活动不同于作业活动；管理既有科学性又有艺术性；管理核心是以人为本。补充“围绕组织目标协调资源”即可形成完整答案。',
    trap: '管理的载体是组织；效率不是速度，也不是单纯利润。',
  },
  {
    id: 'management-theories', code: '第二章', title: '管理思想与管理理论的形成发展', group: '基础与环境',
    focus: '高频人名、理论、内容配对章，重点抓泰勒、法约尔、韦伯、行为科学、系统与权变。',
    keyPoints: [
      { title: '泰勒科学管理', detail: '工作定额、标准化、科学挑选和培训工人、差别计件工资制、管理工作专业化、例外原则；核心目标是提高劳动生产率。' },
      { title: '法约尔理论', detail: '管理职能为计划、组织、指挥、协调、控制；注意教材中的五项表述不含“领导”。' },
      { title: '韦伯理论', detail: '强调理性—合法权威、职责分工、层级制、规则和非人格化管理。' },
      { title: '行为科学', detail: '重视人的社会心理因素。霍桑实验说明人不仅是经济人，也具有社会需要。' },
      { title: '现代管理理论', detail: '西蒙的决策理论、系统理论、权变理论等。权变理论强调因时因地因人制宜，劳伦斯和洛希是重要代表。' },
    ],
    answerFrame: '论述科学管理：先列泰勒六项内容，再概括古典理论四个特点——生产率目标、科学求实、重视个人积极性、强调规章制度；最后可写对社会心理关注不足。',
    trap: '西蒙对应决策理论；劳伦斯和洛希对应权变理论；不要混淆。',
  },
  {
    id: 'environment-culture', code: '第三章', title: '组织环境与组织文化', group: '基础与环境',
    focus: '环境分类、SWOT和文化层次会大量以企业案例做成单选题。',
    keyPoints: [
      { title: '一般与具体环境', detail: '政治法律、经济、社会文化、技术、自然等属外部一般环境；供应商、顾客、竞争者属具体/任务环境。' },
      { title: '环境不确定性', detail: '由复杂程度和变动程度共同决定。因素多且变化快，属于复杂、动态、高不确定环境。' },
      { title: 'SWOT', detail: 'S优势、W劣势属于内部；O机会、T威胁来自外部。ST是利用自身优势回避或减轻外部威胁。' },
      { title: '组织文化', detail: '组织成员共同认可和遵循的价值观、行为规范和物质表现的总和。' },
      { title: '文化层次', detail: '物质层、行为层、制度层、理念层，其中理念层是核心层。' },
    ],
    answerFrame: '答环境分析作用：识别机会与威胁；认识优势与劣势；提高战略决策适应性；降低不确定性风险；增强竞争力。',
    trap: '技术是一般环境；供应商、顾客、竞争者是具体环境。ST不是“抓住机会”，而是“用优势抗威胁”。',
  },
  {
    id: 'ethics-responsibility', code: '第四章', title: '管理道德与社会责任', group: '基础与环境',
    focus: '道德发展层次、管理道德培育五途径和社会责任对象为必背分点。',
    keyPoints: [
      { title: '管理道德', detail: '管理者在管理活动中处理人与人、个人与组织、组织与社会关系时应遵循的道德规范和准则。' },
      { title: '道德发展', detail: '分为前惯例、惯例、原则三层。原则层次强调遵守自己选择的伦理准则。' },
      { title: '培育途径', detail: '挑选高道德素质管理者；道德教育；提炼规范道德准则；列入岗位考核；提供正式保护机制。' },
      { title: '社会责任', detail: '组织不仅追求经济目标，还应对员工、顾客、竞争者、政府、社区和社会发展承担责任。' },
      { title: '责任实践', detail: '保护员工权益、保障质量、诚信竞争、依法纳税、保护环境、参与教育文化卫生等公共事业。' },
    ],
    answerFrame: '答培育管理道德：严格按“五项途径”分点。结尾写教育、制度、考核和保护相结合，形成组织道德文化。',
    trap: '赞助教育、科学、文化、卫生设施，体现的是对社会发展的责任。',
  },
  {
    id: 'forecast-decision', code: '第五章', title: '预测与决策', group: '计划与组织',
    focus: '预测四原理、决策起点、程序和分类必须做到“题干一出现就能匹配”。',
    keyPoints: [
      { title: '预测', detail: '根据过去和现在的信息，运用科学方法推断未来发展趋势。预测原理包括惯性、因果、相似、概率。' },
      { title: '因果原理', detail: '某项政策、变量或原因变化，必然影响另一个结果，如创新补贴政策影响企业创新成本。' },
      { title: '决策起点', detail: '决策是从多个方案中选择合理方案的过程，起点是识别机会或发现问题。' },
      { title: '决策程序', detail: '识别机会/问题—确定目标—拟订方案—评价方案—选择方案—实施与追踪反馈。' },
      { title: '决策分类', detail: '有战略/战术/业务决策，程序化/非程序化决策，确定型/风险型/不确定型决策。突发且无既定规程的问题属非程序化决策。' },
    ],
    answerFrame: '答决策程序，按“识别—目标—方案—评价—选择—实施反馈”顺序写。材料题必须回扣实施后追踪、评价和修正。',
    trap: '决策起点是识别机会/问题，不是确定目标；政策影响成本体现因果原理。',
  },
  {
    id: 'planning', code: '第六章', title: '计划', group: '计划与组织',
    focus: '重点辨析愿景、使命、目标、战略，并拿下计划工作原理。',
    keyPoints: [
      { title: '计划职能', detail: '对未来行动作预先安排，是管理的首要职能，能明确方向、降低风险、配置资源并为后续职能提供依据。' },
      { title: '计划层次', detail: '战略计划影响全局和长远发展；战术计划服务战略；作业计划最具体、时间较短。' },
      { title: '四个概念', detail: '愿景是希望达到的未来图景；使命说明组织存在理由；目标是具体成果；战略是实现目标的总体行动方案。' },
      { title: '计划原理', detail: '许诺原理、限定因素原理、灵活性原理、改变航道原理。量力而行、留有余地体现灵活性原理。' },
      { title: '常用技术', detail: '目标管理、滚动计划法、网络计划技术、预算、SWOT分析等。' },
    ],
    answerFrame: '答计划作用：明确目标和行动方向；减少不确定性；合理配置资源；为组织、领导和控制提供依据；提高协调性和效率。',
    trap: '“留有余地”是灵活性原理；愿景是未来图景，不等于战略或具体目标。',
  },
  {
    id: 'organizing', code: '第七章', title: '组织', group: '计划与组织',
    focus: '部门化、管理幅度、职权、组织结构和人员配备是客观题与简答题重地。',
    keyPoints: [
      { title: '组织设计', detail: '包括工作专门化、部门化、职权配置、管理幅度与层次、组织结构选择等。' },
      { title: '部门划分', detail: '按职能、产品、地区、顾客、流程划分。按亚洲、欧洲、北美洲设销售分支，属于按地区划分。' },
      { title: '管理幅度', detail: '管理者直接有效管理的下属人数。任务复杂、下属分散、能力不足时宜采用较小管理幅度。' },
      { title: '职权与结构', detail: '职权包括直线、参谋、职能职权；常见结构有直线制、职能制、直线—职能制、事业部制、矩阵制、网络型。' },
      { title: '人员配备', detail: '包括招聘、甄选、培训、考核与调整。员工培训目标是获得新知识技能、发展能力、统一价值观、增强信息交流。' },
    ],
    answerFrame: '答影响管理幅度因素：管理者能力与授权、下属素质、工作复杂度、计划明确性、沟通条件、地域分散度。最后判断条件复杂时宜较小幅度。',
    trap: '内部招聘的典型缺点是来源局限、近亲繁殖和内部矛盾，不是招聘费用高。',
  },
  {
    id: 'organizational-change', code: '第八章', title: '组织变革', group: '计划与组织',
    focus: '需会按“动因—内容—过程—阻力—新举措”回答整道论述题。',
    keyPoints: [
      { title: '组织变革', detail: '组织为适应内外环境变化，对人员、结构、技术或文化作出的调整。' },
      { title: '变革动因', detail: '外部有政治经济环境、技术、资源、竞争、全球化变化；内部有战略调整、设备技术、员工素质、规模范围扩大。' },
      { title: '变革内容', detail: '人员变革、结构变革、技术变革、组织文化变革。权力关系、集权程度、岗位再设计和层级调整属结构变革。' },
      { title: '变革过程', detail: '解冻—变革—再冻结：打破旧平衡，推行新做法，制度化巩固。' },
      { title: '阻力与举措', detail: '阻力来自习惯、利益、未知恐惧、群体规范；可教育沟通、参与、支持培训、协商。新举措有扁平化、柔性化、网络化等。' },
    ],
    answerFrame: '论述变革：先区分外部与内部动因；再写人员、结构、技术、文化四项内容；最后结合案例说明层级压缩是扁平化和结构变革。',
    trap: '从6级缩减至3级是组织结构扁平化，不是运行柔性化。',
  },
  {
    id: 'leadership', code: '第九章', title: '领导', group: '领导与激励',
    focus: '权力来源、X/Y理论、四分图与权变理论是近年反复考查的情境题。',
    keyPoints: [
      { title: '领导目的', detail: '领导是运用影响力引导和激励成员实现组织目标的过程，根本目的是实现组织目标。' },
      { title: '权力来源', detail: '法定权、奖赏权、强制权、专长权、参照权。高级技师即使退休仍受请教，主要来自专长权。' },
      { title: 'X/Y理论', detail: 'X理论假设员工厌恶工作、需严密控制；Y理论认为员工能自我控制、愿承担责任，应提供挑战性工作和发展机会。' },
      { title: '行为理论', detail: '特质理论关注个人品质，行为理论关注领导行为。四分图中只关心岗位工作是高组织、低关心人。' },
      { title: '权变理论', detail: '不存在普遍唯一最佳领导方式，应根据领导者、下属和情境匹配领导方式。' },
    ],
    answerFrame: '答领导权力来源：按法定、奖赏、强制、专长、参照逐一说明来源与表现，最后写有效领导要恰当组合运用。',
    trap: '技术威望对应专长权；参加剪彩是管理者人际关系角色。',
  },
  {
    id: 'motivation', code: '第十章', title: '激励', group: '领导与激励',
    focus: '激励过程、双因素、期望/公平与强化理论是选择题密集区，也是简答热点。',
    keyPoints: [
      { title: '激励过程', detail: '未满足的需要—动机—行为—目标—需要满足/新的需要。激励过程起点是未满足的需要。' },
      { title: '内容型理论', detail: '包括马斯洛、ERG、成就需要和赫茨伯格双因素理论。' },
      { title: '双因素理论', detail: '激励因素：成就、认可、工作本身、责任、晋升、成长；保健因素：政策、监督、人际关系、工作条件、工资福利、安全等。' },
      { title: '过程型理论', detail: '期望理论强调努力—绩效—报酬与报酬价值；公平理论强调比较后的公平感；目标设置理论强调明确目标。' },
      { title: '强化理论', detail: '正强化、负强化、惩罚、自然消退。额外奖金奖励突出业绩属于正强化；行为准则为目标、小步子、及时反馈、正负强化结合。' },
    ],
    answerFrame: '答强化理论行为准则：目标明确；复杂任务小步推进；及时反馈行为结果；对正确行为正强化、对错误行为适度负强化，奖惩结合。',
    trap: '工作条件、工资福利、安全是保健因素；成就、认可、责任是激励因素。负强化不等于惩罚。',
  },
  {
    id: 'communication', code: '第十一章', title: '沟通', group: '沟通与控制',
    focus: '要会画出沟通过程，也要会从“尊重、理解、反馈、渠道”提出改进措施。',
    keyPoints: [
      { title: '沟通含义', detail: '信息发送者借助一定渠道传递思想、感情和信息，接受者理解并形成反馈的过程。' },
      { title: '沟通过程', detail: '发送者—编码—信息/渠道—接收者—解码—反馈。明确目标是沟通的重要前提。' },
      { title: '沟通类型', detail: '正式与非正式、上行下行横向斜向、口头书面非语言电子沟通等。' },
      { title: '障碍管理', detail: '过滤、选择性知觉、情绪、语言差异、层级过多、渠道不畅、信息过载都会造成失真。' },
      { title: '有效技巧', detail: '明确目的、尊重、理解、平等相容、倾听、换位思考、及时反馈、语言清晰。对客户谦恭容忍体现尊重原则。' },
    ],
    answerFrame: '答提高沟通有效性：明确目标；选合适渠道；准确表达；尊重理解对象；倾听与反馈；控制情绪并减少层级失真；形成开放信任文化。',
    trap: '沟通不等于单向传话，理解与反馈才构成完整沟通。',
  },
  {
    id: 'controlling', code: '第十二章', title: '控制', group: '沟通与控制',
    focus: '控制过程和库存控制是必背，注意把前馈、现场、反馈控制与“查错”区分开。',
    keyPoints: [
      { title: '控制含义', detail: '按计划标准衡量实际工作，发现偏差并采取纠正措施，保证组织目标实现。' },
      { title: '控制过程', detail: '制定标准—衡量实际工作—比较实际与标准—分析偏差—采取纠正措施。' },
      { title: '控制类型', detail: '前馈/预先控制重在防患于未然；现场/同期控制在活动中纠偏；反馈/事后控制在活动后总结修正。' },
      { title: '有效控制', detail: '要求及时、准确、经济、适应、客观、可接受并抓住重点。' },
      { title: '库存控制', detail: '常用ABC分类法、经济批量法、订货点法、定期补充法。A类少量高价值物资应严格重点控制。' },
    ],
    answerFrame: '答控制过程，严格依次写“标准—衡量—比较—分析—纠偏”，结尾说明通过反馈促进计划改进和持续管理。',
    trap: '控制绝非只在事后查错；德尔菲法属于预测方法，不是库存控制方法。',
  },
];

const QUIZ: QuizQuestion[] = [
  { question: '管理有效性的衡量指标是？', options: ['速度和规模', '效率和效果', '利润和成本', '权力和地位'], answer: 1, explanation: '效率反映投入与产出关系，效果反映目标达成程度；二者统一才体现管理有效性。' },
  { question: '法约尔提出的五项管理职能中，不包括？', options: ['计划', '组织', '协调', '领导'], answer: 3, explanation: '法约尔的经典表述是计划、组织、指挥、协调、控制。' },
  { question: 'SWOT分析中的ST组合是指？', options: ['发挥优势并利用机会', '利用机会弥补劣势', '利用优势回避或减轻威胁', '减少劣势并回避威胁'], answer: 2, explanation: 'ST的核心是用内部优势应对外部威胁。' },
  { question: '遵守自己选择的伦理准则，属于道德发展的哪个层次？', options: ['前惯例层次', '惯例层次', '原则层次', '利益层次'], answer: 2, explanation: '原则层次强调以自己选择的伦理原则进行判断和行动。' },
  { question: '决策过程的起点是？', options: ['确定目标', '识别机会或问题', '拟订可行方案', '选择最优方案'], answer: 1, explanation: '先发现机会或问题，才会启动目标、方案和选择等后续程序。' },
  { question: '计划制定中“量力而行，留有余地”体现的原理是？', options: ['许诺原理', '限定因素原理', '灵活性原理', '改变航道原理'], answer: 2, explanation: '留有余地是为了应对未来变化，体现计划的灵活性。' },
  { question: '销售部按亚洲、欧洲和北美洲设立分支机构，属于哪种部门化？', options: ['按职能划分', '按顾客划分', '按地区划分', '按流程划分'], answer: 2, explanation: '按地域设立的组织单元属于按地区划分部门。' },
  { question: '组织由6级管理层次减少到3级，属于？', options: ['人员变革', '组织结构扁平化', '技术变革', '组织运行柔性化'], answer: 1, explanation: '压缩层级是结构变革中的组织结构扁平化。' },
  { question: '退休总工程师仍因专业能力被员工请教，其主要影响力来源于？', options: ['法定权', '奖赏权', '专长权', '强制权'], answer: 2, explanation: '职位退休后仍有技术影响力，说明来源于专业知识和技能，即专长权。' },
  { question: '赫茨伯格双因素理论中，属于保健因素的是？', options: ['责任感', '工作成就', '工资福利', '个人发展机会'], answer: 2, explanation: '工资福利、工作条件和安全等属于保健因素；成就、责任等属于激励因素。' },
  { question: '企业以额外奖金奖励突出业绩，依据强化理论属于？', options: ['正强化', '负强化', '惩罚', '自然消退'], answer: 0, explanation: '给予愉快结果以增加期望行为发生概率，属于正强化。' },
  { question: '下列不属于常用库存控制方法的是？', options: ['ABC分类法', '经济批量法', '订货点法', '德尔菲法'], answer: 3, explanation: '德尔菲法用于预测；库存控制常用ABC、经济批量、订货点和定期补充法。' },
];

const GROUPS: Chapter['group'][] = ['基础与环境', '计划与组织', '领导与激励', '沟通与控制'];
const STORAGE_KEY = 'code-game-13683-study-progress';

function getStoredProgress(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export default function ManagementPrinciplesStudy() {
  const { addScore, completeLevel } = useGameStore();
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz' | 'strategy'>('learn');
  const [activeId, setActiveId] = useState(CHAPTERS[0].id);
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
      // Persistence is optional in privacy-restricted browsers.
    }
  }, [learnedIds]);

  useEffect(() => {
    if (learnedIds.length === CHAPTERS.length) completeLevel('management-principles-study');
  }, [learnedIds.length, completeLevel]);

  const markLearned = () => {
    if (!learnedIds.includes(activeId)) {
      setLearnedIds(previous => [...previous, activeId]);
      addScore(15);
    }
  };

  const moveChapter = (direction: -1 | 1) => {
    const index = CHAPTERS.findIndex(chapter => chapter.id === activeId);
    const next = CHAPTERS[index + direction];
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
      if (finalScore >= 10) completeLevel('management-principles-study');
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
      <section className="rounded-3xl border border-emerald-400/30 bg-slate-950/90 shadow-2xl shadow-emerald-950/30 overflow-hidden">
        <div className="relative px-5 sm:px-8 py-6 sm:py-7 border-b border-emerald-400/20 bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-950">
          <div className="absolute -right-10 -top-12 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-emerald-400/15 border border-emerald-300/30 text-emerald-300 shadow-lg shadow-emerald-500/10"><BookOpenCheck className="w-7 h-7" /></div>
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.16em] text-emerald-200/80 uppercase"><Sparkles size={13} /> 自考专业课 · 13683</div>
                <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-emerald-50">管理学原理（中级）</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">围绕60分通过设计：12章高频考点、分点型主观题框架和12题即时自测，先拿稳理论配对与案例判断题。</p>
              </div>
            </div>
            <div className="min-w-[210px] rounded-2xl bg-slate-950/55 border border-slate-700/80 px-4 py-3 backdrop-blur">
              <div className="flex items-center justify-between text-xs text-slate-400"><span className="font-mono">学习进度</span><span className="font-bold text-emerald-300">{learnedIds.length} / {CHAPTERS.length}</span></div>
              <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
              <p className="mt-2 text-[11px] text-slate-500">完成全部章节或自测达到10/12即可通关</p>
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
            return <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`flex items-center gap-2 shrink-0 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${selected ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-emerald-100 hover:bg-slate-800'}`}><Icon size={16} />{tab.label}</button>;
          })}
        </div>

        {activeTab === 'learn' && (
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] min-h-[610px]">
            <aside className="border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/60 p-3 sm:p-4">
              <div className="flex items-center justify-between px-2 pb-3"><span className="text-xs font-mono tracking-widest text-slate-500">MANAGEMENT MAP</span><span className="text-xs text-emerald-300">{progress}%</span></div>
              <div className="max-h-[390px] lg:max-h-[610px] overflow-y-auto pr-1 space-y-4">
                {GROUPS.map(group => <div key={group}><p className="px-2 mb-1.5 text-[10px] uppercase tracking-[0.18em] text-slate-600">{group}</p><div className="space-y-1">{CHAPTERS.filter(chapter => chapter.group === group).map(chapter => {
                  const active = chapter.id === activeId;
                  const done = learnedIds.includes(chapter.id);
                  return <button key={chapter.id} type="button" onClick={() => setActiveId(chapter.id)} className={`w-full text-left px-3 py-2.5 rounded-xl transition-all border ${active ? 'bg-emerald-500/15 border-emerald-400/35 text-emerald-100' : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}><span className="flex items-center gap-2 text-xs"><span className={`flex h-5 w-5 items-center justify-center rounded-full border ${done ? 'border-emerald-400/60 bg-emerald-400/15 text-emerald-300' : active ? 'border-emerald-300/50 text-emerald-300' : 'border-slate-700 text-slate-600'}`}>{done ? <CheckCircle2 size={12} /> : <span className="font-mono text-[9px]">{chapter.code.replace('第', '').replace('章', '')}</span>}</span><span className="font-mono text-[10px] opacity-75">{chapter.code}</span></span><span className="block mt-1 pl-7 text-xs leading-snug">{chapter.title}</span></button>;
                })}</div></div>)}
              </div>
            </aside>

            <main className="p-4 sm:p-7 lg:p-8 bg-gradient-to-br from-slate-900/40 to-slate-950">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-800"><div><div className="flex items-center gap-2 text-xs font-mono text-emerald-300"><CircleDot size={14} /> {activeChapter.code} · {activeChapter.group}</div><h3 className="mt-2 text-2xl font-black text-slate-50">{activeChapter.title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">{activeChapter.focus}</p></div><button type="button" onClick={markLearned} disabled={learnedIds.includes(activeId)} className={`shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${learnedIds.includes(activeId) ? 'bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 cursor-default' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-[0.97]'}`}><CheckCircle2 size={17} />{learnedIds.includes(activeId) ? '本章已掌握' : '标记本章掌握'}</button></div>
              <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-3">{activeChapter.keyPoints.map((point, index) => <article key={point.title} className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 hover:border-emerald-400/30 transition-colors"><div className="flex items-start gap-3"><span className="flex shrink-0 h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-mono font-bold text-emerald-300 border border-emerald-400/15">{String(index + 1).padStart(2, '0')}</span><div><h4 className="text-sm font-bold text-emerald-100">{point.title}</h4><p className="mt-1.5 text-sm leading-relaxed text-slate-300">{point.detail}</p></div></div></article>)}</div>
              <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-4"><section className="rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-4"><div className="flex items-center gap-2 text-cyan-300 font-bold text-sm"><Brain size={17} /> 主观题得分框架</div><p className="mt-2 text-sm leading-relaxed text-slate-300">{activeChapter.answerFrame}</p></section><section className="rounded-2xl border border-rose-400/20 bg-rose-500/5 p-4"><div className="flex items-center gap-2 text-rose-300 font-bold text-sm"><ShieldCheck size={17} /> 易错警报</div><p className="mt-2 text-sm leading-relaxed text-slate-300">{activeChapter.trap}</p></section></div>
              <div className="mt-6 flex items-center justify-between gap-3"><button type="button" onClick={() => moveChapter(-1)} disabled={activeId === CHAPTERS[0].id} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100 disabled:opacity-35 disabled:hover:bg-transparent"><ChevronLeft size={18} />上一章</button><span className="text-xs font-mono text-slate-600">{CHAPTERS.findIndex(chapter => chapter.id === activeId) + 1} / {CHAPTERS.length}</span><button type="button" onClick={() => moveChapter(1)} disabled={activeId === CHAPTERS[CHAPTERS.length - 1].id} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-35 disabled:hover:bg-transparent">下一章<ChevronRight size={18} /></button></div>
            </main>
          </div>
        )}

        {activeTab === 'quiz' && <div className="max-w-3xl mx-auto p-5 sm:p-8 min-h-[610px]">{!quizDone ? <><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="font-mono text-xs tracking-widest text-emerald-300">CHECKPOINT {String(quizIndex + 1).padStart(2, '0')} / {QUIZ.length}</div><h3 className="mt-2 text-xl font-bold text-slate-100">通关自测：选择最符合题意的一项</h3></div><div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-400">当前正确 <span className="font-bold text-emerald-300">{correctCount}</span> 题</div></div><div className="mt-5 h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-all" style={{ width: `${((quizIndex + (answered ? 1 : 0)) / QUIZ.length) * 100}%` }} /></div><section className="mt-7 rounded-3xl border border-slate-700 bg-slate-900/70 p-5 sm:p-7"><p className="text-lg sm:text-xl font-bold leading-relaxed text-slate-100">{quizIndex + 1}. {currentQuestion.question}</p><div className="mt-6 space-y-3">{currentQuestion.options.map((option, index) => { const correct = index === currentQuestion.answer; const chosenOption = chosen === index; const state = answered ? (correct ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-100' : chosenOption ? 'border-rose-400/60 bg-rose-500/10 text-rose-100' : 'border-slate-700 text-slate-500') : 'border-slate-700 bg-slate-950/50 text-slate-300 hover:border-emerald-400/45 hover:bg-emerald-500/5'; return <button key={option} type="button" onClick={() => chooseAnswer(index)} className={`w-full flex gap-3 text-left p-4 rounded-2xl border transition-all ${state}`}><span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs font-mono">{String.fromCharCode(65 + index)}</span><span className="text-sm leading-relaxed">{option}</span></button>; })}</div>{answered && <div className={`mt-5 rounded-2xl p-4 border ${chosen === currentQuestion.answer ? 'border-emerald-400/30 bg-emerald-500/10' : 'border-rose-400/30 bg-rose-500/10'}`}><div className="flex gap-2"><CheckCircle2 size={18} className={chosen === currentQuestion.answer ? 'text-emerald-300 shrink-0 mt-0.5' : 'text-rose-300 shrink-0 mt-0.5'} /><p className="text-sm leading-relaxed text-slate-200">{chosen === currentQuestion.answer ? '回答正确。' : '本题需要再记。'} {currentQuestion.explanation}</p></div></div>}</section><div className="mt-5 flex justify-end"><button type="button" disabled={!answered} onClick={nextQuestion} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold disabled:opacity-40 disabled:hover:bg-emerald-500 active:scale-[0.97] transition-all">{quizIndex === QUIZ.length - 1 ? '提交成绩' : '下一题'}<ArrowRight size={17} /></button></div></> : <div className="min-h-[520px] flex items-center justify-center"><section className="max-w-xl w-full text-center rounded-3xl border border-emerald-400/30 bg-gradient-to-b from-emerald-500/10 to-slate-900 p-7 sm:p-10"><div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-400/15 border border-emerald-300/30 text-emerald-300"><span className="font-black text-2xl">{correctCount >= 10 ? '✓' : '!'}</span></div><h3 className="mt-5 text-2xl font-black text-emerald-50">自测完成：{correctCount} / {QUIZ.length}</h3><p className="mt-3 text-sm leading-relaxed text-slate-300">{correctCount >= 10 ? '已达到通关线。建议将错题的理论、原理和情境对应关系再默写一遍，再进入限时主观题训练。' : '尚未达到通关线。请回到对应章节，优先复盘“人名—理论、概念—限定词、案例—理论归属”三类错误。'}</p><div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center"><button type="button" onClick={resetQuiz} className="inline-flex justify-center items-center gap-2 px-4 py-3 rounded-xl border border-slate-600 text-slate-200 hover:bg-slate-800"><RotateCcw size={16} />重新自测</button><button type="button" onClick={() => setActiveTab('learn')} className="inline-flex justify-center items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"><BookOpenCheck size={16} />返回章节</button></div></section></div>}</div>}

        {activeTab === 'strategy' && <div className="p-5 sm:p-8 min-h-[610px]"><div className="max-w-4xl mx-auto"><div className="flex items-center gap-3"><div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-300"><ListChecks size={22} /></div><div><h3 className="text-xl font-black text-slate-100">13683 保通过作战卡</h3><p className="mt-1 text-sm text-slate-400">先记理论归属，再做案例匹配，最后用分点结构完成简答和论述。</p></div></div><div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">{[['客观题抓限定词', '题干出现“起点、核心、目的、层次、原则、来源”等词，优先调取固定表述；情境题先找行为，再定位章节理论。'], ['简答题直接分点', '先用一句教材术语定义，再列3至6个要点。每点独立成句，关键词放句首；不要只讲自己的理解。'], ['论述题加案例回扣', '按“理论界定—分点展开—材料对应—管理措施”作答。变革、道德、激励、控制题可直接调用本页框架。']].map(([title, detail], index) => <article key={title} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5"><span className="font-mono text-emerald-300 text-xs">0{index + 1}</span><h4 className="mt-2 font-bold text-slate-100">{title}</h4><p className="mt-2 text-sm leading-relaxed text-slate-400">{detail}</p></article>)}</div><section className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-5"><div className="flex items-center gap-2 text-cyan-200 font-bold"><Clock3 size={18} />高频答题清单</div><p className="mt-2 text-sm leading-relaxed text-slate-300">必须能默写：泰勒六项内容、管理道德五途径、决策六步、员工培训四目标、组织变革四内容、权力五来源、双因素分类、强化四类型、库存控制四方法。近期公开试题的客观题覆盖环境、计划、组织、领导、激励、沟通等全书模块，因此复习时不能只押某一章。</p></section><section className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-5"><div className="flex items-center gap-2 text-emerald-200 font-bold"><Target size={18} />10天冲刺节奏</div><div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">{['1—2天：基础、理论、环境、道德', '3—4天：预测、决策、计划', '5—6天：组织、变革', '7—8天：领导、激励', '9—10天：沟通、控制、整卷'].map((item, index) => <div key={item} className="rounded-xl bg-slate-950/60 border border-slate-700 p-3"><span className="font-mono text-emerald-300">PHASE {index + 1}</span><p className="mt-1.5 text-slate-300 leading-relaxed">{item}</p></div>)}</div></section></div></div>}
      </section>
    </div>
  );
}
