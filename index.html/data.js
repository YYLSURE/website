/* 人格旅行 · 网页版数据层（题库 + 人格属地库） */

const QUESTIONS = [
  {
    id: 1,
    dimension: '出行偏好',
    title: '终于盼来假期，你最理想的旅行节奏是？',
    options: [
      { key: 'A', text: '找一处湖畔山居，听雨发呆，让时间慢下来', type: 'healing' },
      { key: 'B', text: '钻进还没被人群占领的村寨与小巷', type: 'niche' },
      { key: 'C', text: '登顶俯瞰，把壮阔山河尽收眼底', type: 'wild' },
      { key: 'D', text: '睡到自然醒，在茶馆里消磨半日时光', type: 'chill' }
    ]
  },
  {
    id: 2,
    dimension: '审美喜好',
    title: '下面哪一种画面，最容易让你心动？',
    options: [
      { key: 'A', text: '烟雨朦胧、如水墨画一般的朦胧景致', type: 'healing' },
      { key: 'B', text: '粗粝真实、未经修饰的原生生活质感', type: 'niche' },
      { key: 'C', text: '刀劈斧削、直冲天际的奇峰绝壁', type: 'wild' },
      { key: 'D', text: '朱墙黛瓦、飞檐斗拱的肃穆古建筑', type: 'culture' }
    ]
  },
  {
    id: 3,
    dimension: '性格特质',
    title: '朋友通常会用哪个词来形容你？',
    options: [
      { key: 'A', text: '温和细腻，是大家身边的「治愈系」', type: 'healing' },
      { key: 'B', text: '好奇独立，总走和别人不一样的路', type: 'niche' },
      { key: 'C', text: '敢闯敢拼，天生的肾上腺素爱好者', type: 'wild' },
      { key: 'D', text: '从容随和，天塌下来也不慌不忙', type: 'chill' }
    ]
  },
  {
    id: 4,
    dimension: '休闲习惯',
    title: '不用出门的休息日，你最常做什么？',
    options: [
      { key: 'A', text: '读书、煮茶、侍弄花花草草', type: 'healing' },
      { key: 'B', text: '翻地图刷攻略，标记下一个冷门目的地', type: 'niche' },
      { key: 'C', text: '徒步、露营、安排一场户外运动', type: 'wild' },
      { key: 'D', text: '逛吃逛吃，用味蕾认识一座城', type: 'chill' }
    ]
  },
  {
    id: 5,
    dimension: '旅行方式',
    title: '出发去一座城，你最期待的体验是？',
    options: [
      { key: 'A', text: '住进有故事的民宿，和老板彻夜聊天', type: 'romantic' },
      { key: 'B', text: '不做攻略，迷路本身也是一种风景', type: 'niche' },
      { key: 'C', text: '把当地极限体验清单全部拉满', type: 'wild' },
      { key: 'D', text: '请讲解蹭导游，把古迹看出门道', type: 'culture' }
    ]
  },
  {
    id: 6,
    dimension: '夜晚偏好',
    title: '旅途中的夜晚，你更想要怎样度过？',
    options: [
      { key: 'A', text: '海边或古城的小酒馆，听一场驻唱', type: 'romantic' },
      { key: 'B', text: '围坐篝火，听当地人讲祖辈的故事', type: 'culture' },
      { key: 'C', text: '夜市从头吃到尾，越热闹越有烟火气', type: 'chill' },
      { key: 'D', text: '在星空下露营，等一场壮丽日出', type: 'wild' }
    ]
  },
  {
    id: 7,
    dimension: '理想画面',
    title: '如果只能定格一个旅行瞬间，你希望是？',
    options: [
      { key: 'A', text: '苍山洱海之间，风吹过发梢与自由', type: 'romantic' },
      { key: 'B', text: '古城墙上骑行看夕阳，恍若梦回长安', type: 'culture' },
      { key: 'C', text: '西湖烟雨中乘一叶小舟轻轻荡漾', type: 'healing' },
      { key: 'D', text: '老街竹椅上，端着一碗盖碗茶发呆', type: 'chill' }
    ]
  }
];

const PERSONALITIES = {
  healing: {
    id: 'healing',
    name: '治愈人文型',
    destination: '杭州',
    region: '浙江 · 江南',
    tags: ['温柔细腻', '自然疗愈', '诗意栖居'],
    summary:
      '你内心柔软而细腻，偏爱安静与自然。旅行对你而言不是赶路，而是一场身心的疗愈——一片湖、一阵雨、一盏茶，就能让你重新充满电量。',
    culture:
      '杭州是南宋古都，吴越文化温润内敛。丝绸、龙井、宋词浸润着城市的每一条街巷，白居易与苏轼主持修筑的堤岸，至今仍在诉说「淡妆浓抹总相宜」的生活美学，与你温柔细腻的气质天然契合。',
    scenery:
      '西湖烟雨、九溪烟树、龙井茶山，水汽氤氲的朦胧感与低饱和的自然色调，没有咄咄逼人的壮美，只有恰到好处的舒展，恰好适配你偏爱舒缓、治愈氛围的审美。',
    spots: [
      { name: '西湖 · 苏堤', desc: '晨雾未散时沿堤慢行，看一山一水皆成诗', image: 'https://picsum.photos/id/1039/300/300' },
      { name: '灵隐寺 · 飞来峰', desc: '古刹禅意与山林清幽，抚平所有焦躁', image: 'https://picsum.photos/id/1018/300/300' },
      { name: '龙井村 · 九溪', desc: '茶园叠翠、溪水叮咚，走累了便进村喝一杯', image: 'https://picsum.photos/id/787/300/300' }
    ],
    experiences: ['龙井村采茶品茶', '西湖手摇船', '法喜寺静心抄经', '南宋御街逛文创'],
    foods: ['东坡肉', '龙井虾仁', '片儿川', '桂花藕粉'],
    tips: '建议 2-3 天慢节奏游玩，春秋两季气候最宜；适合情侣、闺蜜结伴，以及想独自散心的人。',
    accent: '#7fa98b',
    accentLight: '#e9f0ea',
    hero: 'https://picsum.photos/id/1015/750/500'
  },
  niche: {
    id: 'niche',
    name: '小众探索型',
    destination: '黔东南',
    region: '贵州 · 苗侗之乡',
    tags: ['独立好奇', '原生秘境', '反套路'],
    summary:
      '你天生好奇、不爱随大流，拒绝千篇一律的打卡清单。旅行的乐趣在于「发现」本身——那些地图上被忽略的角落，才是你的理想国。',
    culture:
      '黔东南被誉为「全球十大返璞归真旅游地」之一。侗族大歌、苗族银饰、鼓楼与风雨桥，保存着未被商业化稀释的原生民族文化，足够满足你对「真实」与「独特」的执念。',
    scenery:
      '肇兴侗寨的晨雾、加榜梯田的曲线、岜沙苗寨的树影，云雾缭绕的山地村寨粗粝而生动。这里没有网红滤镜，每一处都是朋友圈里不会撞款的风景。',
    spots: [
      { name: '肇兴侗寨', desc: '五座鼓楼沿河而立，夜晚满寨皆是侗族大歌', image: 'https://picsum.photos/id/1044/300/300' },
      { name: '加榜梯田', desc: '云雾在梯田上流动，晨雾里恍若仙境', image: 'https://picsum.photos/id/1015/300/300' },
      { name: '镇远古镇', desc: '㵲阳河穿城而过，S 形太极图般的千年古城', image: 'https://picsum.photos/id/1082/300/300' }
    ],
    experiences: ['听一场无伴奏侗族大歌', '跟苗家阿婆学染蓝靛土布', '梯田徒步摄影', '长桌宴上喝糯米酒'],
    foods: ['酸汤鱼', '侗家糯米饭', '腌鱼腌肉', '苗家烧鱼'],
    tips: '建议 3-4 天深度慢游，山路较多宜轻装出行；适合独立旅行者、摄影爱好者与文化探索者。',
    accent: '#a08e6e',
    accentLight: '#f0ebe1',
    hero: 'https://picsum.photos/id/1036/750/500'
  },
  wild: {
    id: 'wild',
    name: '热血山河型',
    destination: '张家界',
    region: '湖南 · 湘西',
    tags: ['果敢热血', '极限挑战', '山河壮阔'],
    summary:
      '你骨子里带着一股闯劲，信奉「世之奇伟瑰怪，常在于险远」。旅行要的是心跳与震撼，越是壮阔险峻的风景，越能点燃你。',
    culture:
      '湘西是巫傩文化与巴楚文化交融之地，土家族、苗族的豪迈血性浸润着这片山水。赶年、茅古斯舞与贺龙故里的红色记忆，都透着一股不服输的江湖气，与你的热血同频。',
    scenery:
      '三千奇峰拔地而起，八百秀水蜿蜒其间。袁家界的悬浮山、天门山的通天索道、大峡谷的玻璃桥，每一处都在挑战胆量与想象，硬核程度拉满。',
    spots: [
      { name: '武陵源 · 袁家界', desc: '《阿凡达》悬浮山原型，云雾起时如临仙境', image: 'https://picsum.photos/id/1018/300/300' },
      { name: '天门山 · 玻璃栈道', desc: '乘索道穿云而上，贴壁而行挑战心跳', image: 'https://picsum.photos/id/1036/300/300' },
      { name: '大峡谷玻璃桥', desc: '横跨深谷的全透明桥面，勇敢者的打卡地', image: 'https://picsum.photos/id/3/300/300' }
    ],
    experiences: ['天门山索道穿云', '玻璃桥高空漫步', '金鞭溪峡谷徒步', '看一场《魅力湘西》'],
    foods: ['三下锅', '湘西腊肉', '岩耳炖鸡', '葛根粉'],
    tips: '建议 2-3 天体力型行程，热门票提前预订错峰进山；适合年轻好友结伴、户外玩家与冒险爱好者。',
    accent: '#b9806f',
    accentLight: '#f5e9e4',
    hero: 'https://picsum.photos/id/1039/750/500'
  },
  chill: {
    id: 'chill',
    name: '慢享休闲型',
    destination: '成都',
    region: '四川 · 天府之国',
    tags: ['从容松弛', '烟火美食', '巴适生活'],
    summary:
      '你深谙「生活在别处」的真谛：旅行不过是换个地方好好生活。不赶景点、不拼步数，舒服自在，就是最好的行程。',
    culture:
      '「天府之国」两千余年未曾更名。盖碗茶、龙门阵、采耳朵，成都人把日子过成了哲学；蜀汉文化与市井烟火在此共生，松弛感是这座城最深的人文。',
    scenery:
      '宽窄巷子的青砖、人民公园的浓荫、锦江夜色与青城后山的苍翠，城市与自然只隔一碗茶的距离。氛围闲适而不冷清，热闹却不喧嚣。',
    spots: [
      { name: '人民公园 · 鹤鸣茶社', desc: '竹椅盖碗茶，老成都的下午从这里开始', image: 'https://picsum.photos/id/787/300/300' },
      { name: '宽窄巷子', desc: '青砖院落连起老巷，逛吃逛喝刚刚好', image: 'https://picsum.photos/id/1039/300/300' },
      { name: '大熊猫繁育基地', desc: '看团子们吃播打滚，治愈值直接拉满', image: 'https://picsum.photos/id/1015/300/300' }
    ],
    experiences: ['茶馆采耳摆龙门阵', '看一场川剧变脸', '夜游锦里红灯笼', '都江堰青城山一日小憩'],
    foods: ['红油火锅', '冷锅串串', '担担面', '冰粉甜水面'],
    tips: '适合 2-3 天不赶路的 City Walk，四季皆宜；适配家庭出游、情侣与所有想「躺平度假」的人。',
    accent: '#8fa9b5',
    accentLight: '#e9f0f3',
    hero: 'https://picsum.photos/id/1044/750/500'
  },
  culture: {
    id: 'culture',
    name: '人文古韵型',
    destination: '西安',
    region: '陕西 · 关中平原',
    tags: ['厚重博学', '历史痴迷', '古建爱好者'],
    summary:
      '你对时间有执念，喜欢在砖瓦与铭文里打捞故事。旅行于你是一场跨越千年的对话——一座城的厚度，比它的颜值更让你心动。',
    culture:
      '十三朝古都，三千一百年建城史。周礼、秦制、汉风、唐韵层层叠压，兵马俑、碑林、明城墙、大雁塔……随便走几步，都可能与某位历史人物擦肩而过。',
    scenery:
      '城墙夕照、钟楼灯火、骊山晚照与终南云海，古都的天际线庄重大气；秋日银杏与春日樱花，又为这份厚重添上一抹温柔。',
    spots: [
      { name: '秦始皇兵马俑', desc: '千人千面的地下军阵，直面两千年前的帝国', image: 'https://picsum.photos/id/3/300/300' },
      { name: '西安城墙', desc: '骑单车环行 13.7 公里，俯瞰长安古今', image: 'https://picsum.photos/id/1044/300/300' },
      { name: '陕西历史博物馆', desc: '一天看尽万年，文物密度全国领先', image: 'https://picsum.photos/id/1018/300/300' }
    ],
    experiences: ['城墙上骑行看夕阳', '碑林观摩拓片', '汉服夜游大唐不夜城', '回民坊寻访老字号'],
    foods: ['肉夹馍', '羊肉泡馍', 'biangbiang面', '甑糕'],
    tips: '建议安排 3 天人文专线，热门场馆务必提前预约；适合历史迷、亲子家庭与文化研学人群。',
    accent: '#9a8fa6',
    accentLight: '#efedf2',
    hero: 'https://picsum.photos/id/1082/750/500'
  },
  romantic: {
    id: 'romantic',
    name: '浪漫文艺型',
    destination: '大理',
    region: '云南 · 苍山洱海',
    tags: ['浪漫自由', '文艺敏感', '风花雪月'],
    summary:
      '你敏感而浪漫，对美有天然的雷达。旅行是收集灵感与故事的过程：一场日落、一段民谣、一次偶遇，都能成为你铭记很久的瞬间。',
    culture:
      '大理是南诏古都与白族文化之乡，扎染、甲马、三道茶里藏着边地民族的诗意。几十年来，作家、画家与音乐人在此落脚，让「风花雪月」从风景变成一种生活方式。',
    scenery:
      '下关风、上关花、苍山雪、洱海月。环海公路、喜洲稻田、双廊落日，每一帧都像为你的审美量身定制，随手一拍就是电影画面。',
    spots: [
      { name: '洱海环湖 · 喜洲', desc: '稻田与白族民居相映，转角楼遇见最蓝的风', image: 'https://picsum.photos/id/1036/300/300' },
      { name: '苍山洗马潭', desc: '索道穿云直上高山冰湖，俯瞰整个洱海', image: 'https://picsum.photos/id/1015/300/300' },
      { name: '大理古城 · 人民路', desc: '石板路、旧书店与街头民谣，文艺浓度超标', image: 'https://picsum.photos/id/787/300/300' }
    ],
    experiences: ['喜洲白族扎染体验', '洱海生态廊道骑行', '人民路听一场民谣', '龙龛码头等日出'],
    foods: ['白族酸辣鱼', '喜洲粑粑', '乳扇沙琪玛', '野生菌火锅'],
    tips: '建议 3-4 天环湖慢旅，3-5 月与 9-11 月气候最佳；适合情侣、文艺青年与数字游民。',
    accent: '#c0939c',
    accentLight: '#f6ebed',
    hero: 'https://picsum.photos/id/1018/750/500'
  }
};

const PERSONALITY_ORDER = ['healing', 'niche', 'wild', 'chill', 'culture', 'romantic'];

function calculatePersonality(answers) {
  const score = {};
  PERSONALITY_ORDER.forEach((id) => (score[id] = 0));
  answers.forEach((t) => t && (score[t] += 1));
  return PERSONALITY_ORDER.reduce((best, id) => (score[id] > score[best] ? id : best), PERSONALITY_ORDER[0]);
}
