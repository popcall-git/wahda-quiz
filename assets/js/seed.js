/* Demo 种子数据：登录用户、好友/榜单用户、讨论题评论池。
   当前为纯前端演示，用户与好友数据为本地模拟；接入真实接口时只需替换 core.js 中的 DataSource。 */
(function () {
  const people = [
    { id: "u01", name: "Yusuf", country: "Türkiye", initials: "YK", base: 142 },
    { id: "u02", name: "Sara", country: "Malaysia", initials: "SA", base: 138 },
    { id: "u03", name: "Mariam", country: "Egypt", initials: "MA", base: 131 },
    { id: "u04", name: "Nur", country: "Indonesia", initials: "NU", base: 127 },
    { id: "u05", name: "Bilal", country: "Nigeria", initials: "BI", base: 119 },
    { id: "u06", name: "Aisha", country: "Pakistan", initials: "AI", base: 116 },
    { id: "u07", name: "Omar", country: "Jordan", initials: "OM", base: 110 },
    { id: "u08", name: "Fatima", country: "Morocco", initials: "FA", base: 104 },
    { id: "u09", name: "Zaid", country: "United Arab Emirates", initials: "ZA", base: 98 },
    { id: "u10", name: "Layla", country: "Lebanon", initials: "LA", base: 94 },
    { id: "u11", name: "Ibrahim", country: "Saudi Arabia", initials: "IB", base: 91 },
    { id: "u12", name: "Hafsa", country: "Bangladesh", initials: "HA", base: 87 },
    { id: "u13", name: "Ali", country: "Iraq", initials: "AL", base: 83 },
    { id: "u14", name: "Sumayya", country: "South Africa", initials: "SU", base: 79 },
    { id: "u15", name: "Hamza", country: "United Kingdom", initials: "HM", base: 74 },
    { id: "u16", name: "Khadija", country: "Qatar", initials: "KH", base: 70 },
    { id: "u17", name: "Idris", country: "Senegal", initials: "ID", base: 66 },
    { id: "u18", name: "Ruqayya", country: "India", initials: "RU", base: 62 },
    { id: "u19", name: "Musa", country: "Germany", initials: "MU", base: 58 },
    { id: "u20", name: "Asma", country: "France", initials: "AS", base: 54 },
    { id: "u21", name: "Tariq", country: "United States", initials: "TA", base: 51 },
    { id: "u22", name: "Safiya", country: "Kenya", initials: "SF", base: 47 },
    { id: "u23", name: "Ismail", country: "Canada", initials: "IS", base: 43 },
    { id: "u24", name: "Zainab", country: "Tunisia", initials: "ZN", base: 39 },
    { id: "u25", name: "Abdallah", country: "Ghana", initials: "AB", base: 34 },
    { id: "u26", name: "Maryam", country: "Tunisia", initials: "MR", base: 30 },
    { id: "u27", name: "Salman", country: "Singapore", initials: "SL", base: 26 }
  ];

  const common = [
    {
      a: 1,
      en: "This is such a good question. I never realised how differently we do things across countries.",
      zh: "这个问题很好。我以前没意识到各国做法差别这么大。",
      likes: 46
    },
    {
      a: 4,
      en: "Saving this to ask my family tonight.",
      zh: "先收藏，晚上问问家里人。",
      likes: 31,
      replies: [{ a: 9, en: "Please come back and tell us what they said.", zh: "记得回来告诉我们他们怎么说。" }]
    },
    {
      a: 7,
      en: "In my experience it really depends on the community you grow up in.",
      zh: "以我的经验，这真的取决于你成长所在的社群。",
      likes: 58
    },
    {
      a: 12,
      en: "Thanks for asking this — the replies are more interesting than the question itself.",
      zh: "谢谢提这个问题，评论区比问题本身还精彩。",
      likes: 27
    },
    {
      a: 16,
      en: "I think intention matters more than the exact form.",
      zh: "我觉得举意比具体形式更重要。",
      likes: 64,
      replies: [
        { a: 3, en: "Agreed, but form still helps us stay consistent.", zh: "同意，但形式也能帮我们保持稳定。" },
        { a: 20, en: "That balance is the hard part.", zh: "平衡才是最难的。" }
      ]
    },
    {
      a: 22,
      en: "Every country has its own flavour of the same tradition.",
      zh: "同一个传统，每个国家都有自己的味道。",
      likes: 39
    }
  ];

  const topics = [
    {
      match: ["Ramadan & Eid", "Ramadan"],
      items: [
        { a: 3, en: "In Indonesia we prepare ketupat and visit the elders on the first day.", zh: "在印尼，我们会准备 Ketupat，第一天去拜访长辈。", likes: 128, replies: [{ a: 11, en: "Ketupat with rendang is unbeatable.", zh: "配仁当的 Ketupat 无可替代。" }] },
        { a: 2, en: "Here in Egypt we make kahk and visit family right after the Eid prayer.", zh: "在埃及，我们会做 Kahk，礼拜结束后就走亲访友。", likes: 96 },
        { a: 1, en: "Türkiye: family breakfast first, then neighbours, then everyone else.", zh: "土耳其：先家庭早餐，再拜访邻居，然后才是其他人。", likes: 87 },
        { a: 5, en: "Malaysia: new clothes, asking forgiveness, and a lot of rendang.", zh: "马来西亚：新衣服、互相请求原谅，还有很多仁当。", likes: 74 }
      ]
    },
    {
      match: ["Work, Prayer & Dress"],
      items: [
        { a: 6, en: "I asked my manager for a flexible lunch break and it worked better than I expected.", zh: "我跟经理申请了弹性午休，效果比预想的好。", likes: 91, replies: [{ a: 15, en: "How did you frame it in the conversation?", zh: "你是怎么跟他谈的？" }] },
        { a: 13, en: "A quiet room and a prayer mat in my bag solved most of it.", zh: "一间安静的房间和包里的礼拜毯，基本解决了问题。", likes: 68 },
        { a: 19, en: "The dress code was a harder conversation than prayer, honestly.", zh: "说实话，着装规范比礼拜更难谈。", likes: 55 }
      ]
    },
    {
      match: ["Marriage & Family"],
      items: [
        { a: 8, en: "We talked about expectations before involving our families, and it helped a lot.", zh: "我们在见家长之前先聊了彼此的期待，帮助很大。", likes: 102 },
        { a: 10, en: "Culture and religion get mixed together — untangling them takes time.", zh: "文化和宗教常被混在一起，理清它们需要时间。", likes: 88, replies: [{ a: 4, en: "This is the most honest answer here.", zh: "这是这里最诚实的回答。" }] },
        { a: 14, en: "My parents and I disagreed at first, but we found a middle ground.", zh: "父母和我一开始意见不同，后来找到了折中。", likes: 61 }
      ]
    },
    {
      match: ["Friendship, Converts"],
      items: [
        { a: 17, en: "Being new to the community is lonely at first. Small invitations matter more than big ones.", zh: "刚进入社群时会孤单，小小的邀请比盛大的更珍贵。", likes: 113 },
        { a: 23, en: "I wish people asked more questions instead of assuming.", zh: "希望大家多问一些问题，而不是先假设。", likes: 77 },
        { a: 21, en: "Having one friend who checks in every week changed my whole year.", zh: "有一个每周问候我的朋友，改变了我这一年。", likes: 69 }
      ]
    },
    {
      match: ["Leisure, Sport & Travel"],
      items: [
        { a: 15, en: "We plan trips around prayer times — it makes the whole journey calmer.", zh: "我们会按礼拜时间安排行程，整个旅途更从容。", likes: 82 },
        { a: 18, en: "Finding halal food is easier than finding a quiet place to pray, honestly.", zh: "说实话，找清真餐比找安静的礼拜处容易。", likes: 57 },
        { a: 24, en: "Sports and faith were never in conflict for me, it was only scheduling.", zh: "对我来说运动和信仰从不冲突，只是时间安排问题。", likes: 44 }
      ]
    },
    {
      match: ["Money, Work & Marriage"],
      items: [
        { a: 9, en: "We keep a shared budget and separate savings. It removed a lot of tension.", zh: "我们有共同预算，也各自储蓄，减少了很多摩擦。", likes: 95 },
        { a: 11, en: "Mahr was discussed openly with both families, which I really appreciated.", zh: "聘礼是两家人公开谈的，我很感激这一点。", likes: 71 },
        { a: 25, en: "Money conversations are easier when they happen early.", zh: "钱的事越早谈越容易。", likes: 53 }
      ]
    },
    {
      match: ["Online Privacy"],
      items: [
        { a: 20, en: "I keep my family photos private and ask before tagging anyone.", zh: "我的家庭照片是私密的，标记别人前会先问。", likes: 106 },
        { a: 22, en: "Posting less made my life calmer, honestly.", zh: "说实话，少发一点，生活更平静。", likes: 78 },
        { a: 12, en: "Consent online should work exactly the same way as offline.", zh: "线上的同意应该和线下完全一样。", likes: 92 }
      ]
    },
    {
      match: ["Everyday Ethics"],
      items: [
        { a: 26, en: "I try to ask myself who benefits before I decide.", zh: "决定之前我会先问自己：这对谁有好处。", likes: 63 },
        { a: 7, en: "Honesty was uncomfortable at first, but it saved the relationship.", zh: "诚实一开始不舒服，但保住了这段关系。", likes: 70 },
        { a: 16, en: "There is usually a third option we don't see immediately.", zh: "通常还有第三个我们一时想不到的选项。", likes: 48 }
      ]
    },
    {
      match: ["Ramadan Sport"],
      items: [
        { a: 24, en: "I train after iftar and keep it light in the last ten days.", zh: "我在开斋后训练，最后十天会减量。", likes: 66 },
        { a: 14, en: "Hydration is the whole game during Ramadan training.", zh: "斋月训练的关键就是补水。", likes: 59 },
        { a: 19, en: "My coach adjusted the programme instead of asking me to stop.", zh: "教练调整了计划，而不是让我停练。", likes: 45 }
      ]
    }
  ];

  window.QZ_SEED = {
    me: { id: "me", name: "Amina", country: "Indonesia", initials: "AM" },
    people,
    common,
    topics
  };
})();
