/* 核心：时区 / 每日轮换 / 本地状态 / Demo 数据源 / 计分排名 */
(function () {
  const QZ = (window.QZ = window.QZ || {});
  const TZ = "Asia/Jakarta";
  const EPOCH = (window.QZ_DATA && window.QZ_DATA.v) || "2026-11-21";
  const N = (window.QZ_DATA && window.QZ_DATA.n) || 0;
  const STORAGE_KEY = "wahda-quiz-h5-v1";
  const DAY_MS = 86400000;

  /* ---------- 日期与时区（Jakarta 固定 GMT+7，无夏令时） ---------- */

  function dateInTz(d = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(d);
    const g = (t) => (parts.find((p) => p.type === t) || {}).value;
    return `${g("year")}-${g("month")}-${g("day")}`;
  }

  function toUTC(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  }

  function dayIndex(dateStr = dateInTz()) {
    return Math.round((toUTC(dateStr) - toUTC(EPOCH)) / DAY_MS);
  }

  function dateOf(index) {
    const d = new Date(toUTC(EPOCH) + index * DAY_MS);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
  }

  function msToNextDay() {
    const jakartaPseudo = Date.now() + 7 * 3600 * 1000;
    const d = new Date(jakartaPseudo);
    const next = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1);
    return Math.max(0, next - jakartaPseudo);
  }

  function formatDate(dateStr, lang) {
    const d = new Date(toUTC(dateStr));
    return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-GB", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC"
    }).format(d);
  }

  /* ---------- 每日一题：顺序取题 + 轮次循环 ---------- */

  function dayInfo(index) {
    const order = window.QZ_DATA.order;
    const round = Math.floor(index / N) + 1;
    const pos = ((index % N) + N) % N;
    const question = window.QZ_DATA.qs[order[pos]];
    return { index, round, pos, total: N, question, date: dateOf(index) };
  }

  /* ---------- 本地状态（Demo：默认已登录，数据存在本机） ---------- */

  function loadState() {
    let raw = {};
    try {
      raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (e) {
      raw = {};
    }
    return {
      lang: raw.lang === "zh" ? "zh" : "en",
      answers: raw.answers && typeof raw.answers === "object" ? raw.answers : {},
      likes: raw.likes && typeof raw.likes === "object" ? raw.likes : {},
      posts: raw.posts && typeof raw.posts === "object" ? raw.posts : {},
      feeds: raw.feeds && typeof raw.feeds === "object" ? raw.feeds : {},
      dayOverride: Number.isInteger(raw.dayOverride) ? raw.dayOverride : null
    };
  }

  const state = loadState();

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* 隐私模式下忽略写入失败，页面仍可用 */
    }
  }

  function answerOf(index) {
    return state.answers[String(index)] || null;
  }

  function submitChoice(index, choice, correct) {
    state.answers[String(index)] = { choice, correct, ts: Date.now() };
    save();
  }

  /* 讨论题：第一条回答进帖内「我的回答」，后续追加进评论区，避免重复展示 */
  function myPosts(index) {
    return Array.isArray(state.posts[String(index)]) ? state.posts[String(index)] : [];
  }

  function submitOpen(index, text) {
    const key = String(index);
    const list = myPosts(index).slice();
    list.push({ id: key + "-p" + list.length, text, ts: Date.now() });
    state.posts[key] = list;
    state.answers[key] = { text: list[0].text, ts: list[0].ts };
    save();
  }

  function setLang(lang) {
    state.lang = lang === "zh" ? "zh" : "en";
    save();
  }

  /* 分享到自己的 Feeds：按天记录，可再次点击撤回 */
  function feedShared(index) {
    return !!state.feeds[String(index)];
  }

  function toggleFeedShare(index) {
    const key = String(index);
    if (state.feeds[key]) {
      delete state.feeds[key];
      save();
      return false;
    }
    state.feeds[key] = { ts: Date.now() };
    save();
    return true;
  }

  function toggleLike(commentId) {
    if (state.likes[commentId]) delete state.likes[commentId];
    else state.likes[commentId] = true;
    save();
    return !!state.likes[commentId];
  }

  function likeCount(base, commentId) {
    return base + (state.likes[commentId] ? 1 : 0);
  }

  /* ---------- 文案 ---------- */

  function t(key, vars) {
    const dict = window.QZ_I18N[state.lang] || window.QZ_I18N.en;
    let out = dict[key] != null ? dict[key] : (window.QZ_I18N.en[key] != null ? window.QZ_I18N.en[key] : key);
    if (vars) Object.keys(vars).forEach((k) => { out = out.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]); });
    return out;
  }

  function pick(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    if (Array.isArray(obj)) return obj[state.lang === "zh" ? 1 : 0] || obj[0] || "";
    return obj[state.lang] || obj.en || "";
  }

  /* ---------- Demo 数据源（确定性伪随机，同一日期刷新一致） ---------- */

  function hashStr(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let x = Math.imul(a ^ (a >>> 15), 1 | a);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  function personDay(person, index) {
    const r = mulberry32(hashStr(person.id + ":" + index));
    const answered = r() < 0.74;
    const correct = answered && r() < 0.64;
    const offset = Math.floor(r() * 16 * 3600 * 1000) + 6 * 3600 * 1000;
    return {
      answered,
      correct,
      choice: answered ? Math.floor(r() * 4) : null,
      ts: answered ? toUTC(dateOf(index)) + offset : null
    };
  }

  function myTotals() {
    const list = Object.values(state.answers);
    return {
      totalCorrect: list.filter((a) => a && a.correct).length,
      totalAnswered: list.length
    };
  }

  function boardEntries(index) {
    const entries = window.QZ_SEED.people.map((p) => {
      const d = personDay(p, index);
      return {
        id: p.id, name: p.name, country: p.country, initials: p.initials,
        answered: d.answered, todayCorrect: d.correct ? 1 : 0,
        totalCorrect: p.base, ts: d.ts, isMe: false
      };
    });

    const me = window.QZ_SEED.me;
    const mine = answerOf(index);
    const totals = myTotals();
    entries.push({
      id: me.id, name: me.name, country: me.country, initials: me.initials,
      answered: !!mine, todayCorrect: mine && mine.correct ? 1 : 0,
      totalCorrect: totals.totalCorrect, ts: mine ? mine.ts : null, isMe: true
    });
    return entries;
  }

  function sortToday(entries) {
    return entries.slice().sort((a, b) => {
      if (a.answered !== b.answered) return a.answered ? -1 : 1;
      if (b.todayCorrect !== a.todayCorrect) return b.todayCorrect - a.todayCorrect;
      if (a.ts && b.ts && a.ts !== b.ts) return a.ts - b.ts;
      return a.name.localeCompare(b.name);
    });
  }

  function sortAll(entries) {
    return entries.slice().sort((a, b) => {
      if (b.totalCorrect !== a.totalCorrect) return b.totalCorrect - a.totalCorrect;
      return a.name.localeCompare(b.name);
    });
  }

  function leaderboard(index, scope) {
    const entries = boardEntries(index);
    const sorted = scope === "all" ? sortAll(entries) : sortToday(entries);
    const total = sorted.length;
    const rank = sorted.findIndex((e) => e.isMe) + 1;
    return { entries: sorted, total, rank };
  }

  /* 好友答题情况：取前 14 位用户，对应当日状态；答对显示正确项，答错显示一个错误项 */
  function friendActivity(index, question) {
    const answerIndex = question && question.a != null ? question.a : 0;
    const correctLetter = "ABCD"[answerIndex];
    const wrongLetters = ["A", "B", "C", "D"].filter((l) => l !== correctLetter);

    const friends = window.QZ_SEED.people.slice(0, 14).map((p) => {
      const d = personDay(p, index);
      const r = mulberry32(hashStr(p.id + ":pick:" + index))();
      return {
        id: p.id, name: p.name, country: p.country, initials: p.initials,
        answered: d.answered, correct: d.correct,
        letter: d.correct ? correctLetter : wrongLetters[Math.floor(r * wrongLetters.length)],
        ms: d.ts
      };
    }).filter((f) => f.answered).sort((a, b) => a.ms - b.ms);

    const answeredCount = friends.length;
    const correctCount = friends.filter((f) => f.correct).length;
    const rate = answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0;

    return { list: friends, answeredCount, correctCount, rate, correctLetter };
  }

  /* 讨论题评论：按主题匹配种子评论，点赞数随日期轻微浮动 */
  function commentsOf(index, question) {
    const seed = window.QZ_SEED;
    const cat = question.c || "";
    const topic = seed.topics.find((tp) => tp.match.some((m) => cat.indexOf(m) >= 0));
    const items = (topic ? topic.items : []).concat(seed.common).slice(0, 6);
    const jitter = (mulberry32(hashStr(question.i + ":" + index))() * 9) | 0;

    const list = items.map((item, i) => {
      const author = seed.people[item.a % seed.people.length];
      return {
        id: question.i + "-c" + i,
        author,
        text: pick({ en: item.en, zh: item.zh }),
        likes: item.likes + jitter,
        isMine: false,
        replies: (item.replies || []).map((r, j) => {
          const ra = seed.people[r.a % seed.people.length];
          return {
            id: question.i + "-c" + i + "-r" + j,
            author: ra,
            text: pick({ en: r.en, zh: r.zh })
          };
        })
      };
    });

    const mine = answerOf(index);
    if (mine && mine.text && myPosts(index).length === 0) {
      /* 兼容旧数据：早期版本只存了 answers[index].text */
      list.unshift({
        id: question.i + "-mine",
        author: seed.me,
        text: mine.text,
        likes: 0,
        isMine: true,
        replies: []
      });
    }

    /* 第 2 条起的「我的发言」作为评论追加在最上方 */
    myPosts(index).slice(1).reverse().forEach((p) => {
      list.unshift({
        id: p.id,
        author: seed.me,
        text: p.text,
        likes: 0,
        isMine: true,
        replies: []
      });
    });
    return list;
  }

  QZ.core = {
    TZ, EPOCH, N, DAY_MS,
    dateInTz, dayIndex, dateOf, msToNextDay, formatDate, dayInfo,
    state, save, answerOf, submitChoice, submitOpen, setLang,
    toggleLike, likeCount, t, pick, myPosts,
    feedShared, toggleFeedShare,
    boardEntries, leaderboard, friendActivity, commentsOf, myTotals,
    reset() {
      state.answers = {};
      state.likes = {};
      state.posts = {};
      state.feeds = {};
      save();
    }
  };
})();
