/* 视图：纯模板函数，返回 HTML 字符串；交互由 app.js 事件委托处理
   视觉结构：深色 hero 版块 → 数据卡 → 打卡格 → 内容卡
   所有事件钩子保持不变：data-act / data-nav / data-input */
(function () {
  const QZ = window.QZ;
  const C = QZ.core;

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  const icon = {
    back: '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5.5 8 12l6.5 6.5"/></svg>',
    share: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15.5V3.6"/><path d="M7.9 7.6 12 3.5l4.1 4.1"/><path d="M5 13.6v5.2a2.2 2.2 0 0 0 2.2 2.2h9.6a2.2 2.2 0 0 0 2.2-2.2v-5.2"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 12.6 9.6 17.4 19.2 6.8"/></svg>',
    cross: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6.6 6.6l10.8 10.8M17.4 6.6 6.6 17.4"/></svg>',
    heart: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.2s-7.2-4.6-7.2-9.4A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.2 3.4c0 4.8-7.2 9.4-7.2 9.4z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13"/><path d="M12.4 5.8 19 12l-6.6 6.2"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="5.5" y="10.5" width="13" height="9.5" rx="2.4"/><path d="M8.6 10.5V8a3.4 3.4 0 0 1 6.8 0v2.5"/></svg>',
    link: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10.4 13.6a4 4 0 0 0 5.6 0l2.4-2.4a4 4 0 0 0-5.6-5.6l-1.3 1.3"/><path d="M13.6 10.4a4 4 0 0 0-5.6 0l-2.4 2.4a4 4 0 0 0 5.6 5.6l1.3-1.3"/></svg>',
    search: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.2"/><path d="M15.6 15.6 20 20"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9.5 12 15.5 18 9.5"/></svg>',
    flame: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12.4 2.6c3.2 3.9 5.1 6.6 5.1 9.6a5.5 5.5 0 0 1-11 0c0-1.7.7-3.2 1.7-4.6.3 1.1.8 1.9 1.5 2.5-.3-2.1.4-4.6 2.7-7.5z"/></svg>',    trophy: '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3.8h8v4.4a4 4 0 0 1-8 0V3.8z"/><path d="M8 5.2H5.4v1.5a3 3 0 0 0 2.7 3"/><path d="M16 5.2h2.6v1.5a3 3 0 0 1-2.7 3"/><path d="M12 12.2v4"/><path d="M8.4 20.2h7.2l-.7-2.6H9.1l-.7 2.6z"/></svg>',
    target: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8.1"/><circle cx="12" cy="12" r="2.3" fill="currentColor" stroke="none"/></svg>',    users: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="9.2" cy="8" r="3.2"/><path d="M3.4 19.2c0-3.2 2.6-5.4 5.8-5.4s5.8 2.2 5.8 5.4"/><circle cx="17.2" cy="9" r="2.5"/><path d="M16.2 14.2c2.5.2 4.4 2.1 4.4 4.4"/></svg>',
    chevronR: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 6 15.5 12 9.5 18"/></svg>',
    crown: '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M3.6 17.4h16.8l-1.4-8.9-3.9 3.1L12 6.2 8.9 11.6 5 8.5z"/><rect x="3.6" y="18.6" width="16.8" height="2" rx="1"/></svg>',
    feed: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="3.6" y="4.6" width="16.8" height="14.8" rx="3.2"/><path d="M7.4 9.4h9.2M7.4 12.8h9.2M7.4 16.2h5.2"/></svg>'
  };

  const social = {
    whatsapp: '<svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor"><path d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.2 21.8l4.9-1.3A9.8 9.8 0 1 0 12 2.2Zm0 1.9a7.9 7.9 0 1 1-4.1 14.7l-.3-.2-2.9.8.8-2.8-.2-.3A7.9 7.9 0 0 1 12 4.1Z"/><path d="M9.3 7.6c.2 0 .4 0 .5.4l.8 1.8c.1.2 0 .4-.1.5l-.5.6c-.1.1-.2.3-.1.5.2.4.8 1.3 1.6 2 .8.7 1.5.9 1.7 1 .2.1.4 0 .5-.1l.6-.8c.1-.2.3-.2.5-.1l1.7.8c.3.1.4.2.4.4 0 .2 0 .9-.3 1.3-.3.5-1.2.9-1.7.9-.4 0-1.2.1-3-.7-2.4-1-3.9-3.5-4-3.7-.1-.2-.9-1.3-.9-2.4 0-1.2.6-1.8.8-2 .2-.3.5-.4.7-.4Z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-3.6 1.5-3.6 3.8V12H8v3h2.4v7h3.1v-7h2.7l.4-3h-3.1V9.6c0-.4.2-.6.5-.6z"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor"><path d="M3 3h4.6l4.7 6.3L17.9 3H21l-6.8 8.2L21.4 21h-4.6l-5-6.7L5.6 21H2.5l7.2-8.7z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor"><path d="M21.3 4.1 2.9 11.2c-.9.3-.9 1.5.1 1.7l4.3 1.2 1.6 5c.2.7 1.1.9 1.6.3l2.3-2.5 4.3 3.2c.6.4 1.5.1 1.7-.7l3-13.5c.2-.9-.5-1.5-1.5-1.2zM9 13.4l8.2-5.6-6.4 6.8-.3 2.6z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" width="21" height="21"><defs><mask id="igmask"><rect width="24" height="24" fill="#fff"/><circle cx="12" cy="12" r="3.9" fill="#000"/><circle cx="17.3" cy="6.7" r="1.15" fill="#000"/></mask></defs><rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5.2" fill="currentColor" mask="url(#igmask)"/></svg>',
    copy: '<svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor"><path d="M8.4 15.6a1.1 1.1 0 0 1 0-1.55l5.65-5.65a1.1 1.1 0 0 1 1.55 1.55L9.95 15.6a1.1 1.1 0 0 1-1.55 0z"/><path d="M10.6 6.4 12.35 4.65a4.3 4.3 0 1 1 6.08 6.08L16.68 12.5l-1.55-1.55 1.75-1.77a2.1 2.1 0 1 0-2.97-2.97l-1.76 1.75z"/><path d="m13.4 17.6-1.75 1.75a4.3 4.3 0 1 1-6.08-6.08L7.32 11.5l1.55 1.55-1.75 1.77a2.1 2.1 0 1 0 2.97 2.97l1.76-1.75z"/></svg>',
  };

  /* 几何纹样底纹：八芒星 + 连结点，纯几何、无具象元素 */
  let uid = 0;
  function girih(cls) {
    const id = "gir" + (++uid);
    return `<svg class="girih ${cls || ""}" aria-hidden="true" focusable="false" preserveAspectRatio="none">
      <defs><pattern id="${id}" width="66" height="66" patternUnits="userSpaceOnUse">
        <g fill="none" stroke="currentColor" stroke-width="1">
          <rect x="18" y="18" width="30" height="30"/>
          <rect x="18" y="18" width="30" height="30" transform="rotate(45 33 33)"/>
          <circle cx="33" cy="33" r="4.6"/>
          <path d="M33 0v9M33 57v9M0 33h9M57 33h9"/>
        </g>
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#${id})"/>
    </svg>`;
  }

  /* 环形进度：pct 0–100 */
  function donut(pct, size, stroke) {
    const s = size || 68;
    const w = stroke || 7;
    const r = (s - w) / 2;
    const c = 2 * Math.PI * r;
    const on = Math.max(0, Math.min(100, pct)) / 100 * c;
    return `<svg class="donut-svg" viewBox="0 0 ${s} ${s}" width="${s}" height="${s}" aria-hidden="true">
      <circle cx="${s / 2}" cy="${s / 2}" r="${r}" fill="none" stroke="var(--g-100)" stroke-width="${w}"/>
      <circle cx="${s / 2}" cy="${s / 2}" r="${r}" fill="none" stroke="var(--g-500)" stroke-width="${w}"
        stroke-linecap="round" stroke-dasharray="${on} ${c - on}"
        transform="rotate(-90 ${s / 2} ${s / 2})"/>
    </svg>`;
  }

  function avatar(initials, cls, img) {
    const inner = img
      ? `<img src="assets/avatars/${esc(img)}.jpg" alt="" loading="lazy">`
      : esc(initials);
    return `<span class="av ${cls || ""}">${inner}</span>`;
  }

  function langSwitch() {
    const zh = C.state.lang === "zh";
    return `<button class="lang" data-act="lang" aria-label="${esc(zh ? "Switch to English" : "切换到中文")}">${zh ? "中" : "EN"}</button>`;
  }

  function topbar(opts) {
    const left = opts.back
      ? `<button class="icon-btn" data-act="back" aria-label="${esc(C.t("nav.back"))}">${icon.back}</button>`
      : `<span class="wordmark">wahda<i>.</i></span>`;

    const actions = [];
    if (opts.lang) actions.push(langSwitch());
    if (opts.share) actions.push(`<button class="icon-btn" data-nav="share" aria-label="${esc(C.t("nav.share"))}">${icon.share}</button>`);
    if (opts.avatar) actions.push(avatar(window.QZ_SEED.me.initials, "sm", window.QZ_SEED.me.id));

    return `<header class="topbar">
      <div class="tb-left">${left}</div>
      <div class="tb-title">${esc(opts.title || "")}</div>
      <div class="tb-actions">${actions.join("")}</div>
    </header>`;
  }

  const hostOf = (url) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch (e) {
      return "";
    }
  };

  const pad3 = (n) => String(n).padStart(3, "0");

  /* 调试入口只在 ?demo 下出现，正式页面保持干净 */
  function isDemo() {
    return typeof location !== "undefined" && /(\?|&)demo\b/.test(location.search);
  }

  /* 提交时间（雅加达 UTC+7），今日榜用来区分同分用户 */
  function timeOf(ts) {
    if (!ts) return "";
    const d = new Date(ts + 7 * 3600 * 1000);
    return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  }

  function dateParts(dateStr) {
    const d = new Date(dateStr + "T00:00:00Z");
    const mon = new Intl.DateTimeFormat(C.state.lang === "zh" ? "zh-CN" : "en-GB", {
      month: "short", timeZone: "UTC"
    }).format(d);
    return { day: String(d.getUTCDate()).padStart(2, "0"), mon };
  }

  /* 连续答题天数：今天未答则从昨天开始回溯，避免当天归零
     首页 v4.6 起不再展示（改由「我的表现」承担），保留供后续打卡/推送场景复用 */
  function streakOf(index) {
    let start = index;
    if (!C.dayDone(index)) start = index - 1;
    let n = 0;
    for (let i = start; i >= 0 && i > start - 400; i--) {
      if (C.dayDone(i)) n++;
      else break;
    }
    return n;
  }

  /* 本周 7 格：以当前题所在日期为准，周一起算 */
  function weekOf(index) {
    const d = new Date(C.dateOf(index) + "T00:00:00Z");
    const mondayOffset = (d.getUTCDay() + 6) % 7;
    const start = index - mondayOffset;
    const labels = C.state.lang === "zh"
      ? ["一", "二", "三", "四", "五", "六", "日"]
      : ["M", "T", "W", "T", "F", "S", "S"];
    return labels.map((label, i) => {
      const idx = start + i;
      const a = C.answerOf(idx);
      const posted = idx >= 0 && C.myPosts(idx).length > 0;
      return {
        label,
        index: idx,
        done: !!a || posted,
        correct: !!(a && a.correct),
        /* 只做了开放题：显示圆点，不给对错 */
        openOnly: !a && posted,
        isToday: idx === index,
        future: idx > index
      };
    });
  }

  /* ---------------- 首页 ---------------- */

  /* 小知识 / 小故事：本期预留占位（交互示意图 3A 答案页区块），文案待运营补充 */
  function knowBlock() {
    return `<section class="know">
      <div class="know-top">
        <span class="know-ico">${icon.lock}</span>
        <span class="know-k">${esc(C.t("result.knowTitle"))}</span>
        <span class="know-tag">${esc(C.t("result.reserved"))}</span>
      </div>
      <p>${esc(C.t("result.knowBody"))}</p>
    </section>`;
  }

  /* 我的表现：历史正确率 + 赢过好友比例，两块都用百分比呈现 */
  function perfBlock(stats) {
    const card = (k, pct, sub, cls) => `<div class="perf-card${cls ? " " + cls : ""}">
      <span class="pc-k">${esc(k)}</span>
      <b class="pc-n">${pct}<em>%</em></b>
      <span class="pc-bar" role="presentation"><i style="width:${pct}%"></i></span>
      <span class="pc-sub">${esc(sub)}</span>
    </div>`;
    return `<section class="perf">
      <div class="sec-head">
        <h2>${esc(C.t("home.perfTitle"))}</h2>
        <span class="sec-tag">${esc(C.t("home.perfTag"))}</span>
      </div>
      <div class="perf-row">
        ${card(C.t("home.accuracy"), stats.accuracy, C.t("home.accuracySub", { n: stats.answered }))}
        ${card(C.t("home.beat"), stats.beatPct, C.t("home.beatSub", { a: stats.beaten, b: stats.friends }), "is-beat")}
      </div>
    </section>`;
  }

  /* 评论区（开放题在首页与讨论页共用）：首页只显示前 limit 条，超出给 See all */
  function commentsBlock(comments, opts) {
    const o = opts || {};
    const limit = o.limit || 0;
    const shown = limit > 0 ? comments.slice(0, limit) : comments;
    const hidden = comments.length - shown.length;
    const sortBtn = o.sort
      ? `<button class="sort-btn" data-act="sort">${esc(C.t("disc.sortLikes"))}${icon.chevron}</button>`
      : "";
    const seeAll = hidden > 0
      ? `<button class="friends-more comments-more" data-nav="discussion">
          <span>${esc(C.t("disc.seeAll", { n: comments.length }))}</span>
          <i>${icon.arrow}</i>
        </button>`
      : "";
    return `<div class="sec-head sec-head--split">
      <h2>${esc(C.t("disc.comments", { n: comments.length }))}</h2>
      ${sortBtn}
    </div>

    <ul class="comments">
      ${shown.length === 0 ? `<li class="empty">${icon.users}${esc(C.t("disc.empty"))}</li>` : shown.map((c) => `
        <li class="comment ${c.isMine ? "mine" : ""}">
          ${avatar(c.author.initials, "sm", c.author.id)}
          <div class="c-body">
            <div class="c-name">${esc(c.isMine ? C.t("disc.you") : c.author.name)}<em>${esc(c.isMine ? window.QZ_SEED.me.country : c.author.country)}</em></div>
            <p class="c-text">${esc(c.text)}</p>
            <div class="c-actions">
              <button class="c-reply" data-act="reply" data-id="${esc(c.id)}">${esc(C.t("disc.reply"))}</button>
              ${c.replies.length ? `<button class="c-toggle" data-act="toggle-replies" data-id="${esc(c.id)}">${esc(C.t("disc.viewReplies", { n: c.replies.length }))}</button>` : ""}
            </div>
            ${c.replies.length ? `<ul class="replies" data-replies="${esc(c.id)}" hidden>
              ${c.replies.map((r) => `<li>${avatar(r.author.initials, "xs", r.author.id)}<div><b>${esc(r.author.name)}</b><span>${esc(r.text)}</span></div></li>`).join("")}
            </ul>` : ""}
          </div>
          <button class="like-btn ${C.state.likes[c.id] ? "on" : ""}" data-act="like" data-id="${esc(c.id)}" aria-label="${esc(C.t("disc.like"))}" aria-pressed="${!!C.state.likes[c.id]}">
            ${icon.heart}<span>${C.likeCount(c.likes, c.id)}</span>
          </button>
        </li>`).join("")}
    </ul>
    ${seeAll}`;
  }

  /* 首页：DAILY QUIZ 头部（含本周打卡）→ 选择题 → 开放题 → 评论 → 分享 → 统计 */
  function home(info, opts) {
    const index = info.index;
    const q = info.question;
    const oq = info.open.question;
    const mine = C.answerOf(index);
    const posts = C.myPosts(index);
    const choiceDone = !!mine;
    const openDone = posts.length > 0;
    const doneCount = (choiceDone ? 1 : 0) + (openDone ? 1 : 0);
    const selected = opts ? opts.selected : null;
    const comments = C.commentsOf(index, oq);
    const week = weekOf(index);
    const weekDone = week.filter((w) => w.done).length;
    /* 分享到我的 Feeds：本阶段只做入口与本地状态，不接真实转发 */
    const shared = C.feedShared(index);
    const dp = dateParts(info.date);
    /* 按天轮换清真寺底图：m1 麦加 · m2 麦地那 · m3 阿布扎比 · m4 伊斯坦布尔 · m5 布城 */
    const mIdx = (index % 5) + 1;

    /* 选择题：选项常驻题目下方，提交后就地判语 */
    const optionsPanel = `<div class="hero-answer">
      <div class="options options--hero" role="radiogroup" aria-label="${esc(C.t("nav.today"))}">
        ${q.o.map((o, i) => `
          <button class="option option--hero${selected === i ? " is-on" : ""}" data-act="pick" data-i="${i}" role="radio" aria-checked="${selected === i}">
            <span class="letter">${"ABCD"[i]}</span>
            <span class="option-text">${esc(C.pick(o))}</span>
            <span class="option-mark" aria-hidden="true">${selected === i ? icon.check : ""}</span>
          </button>`).join("")}
      </div>
      <button class="cta" data-act="submit" ${selected == null ? "disabled" : ""}>
        <span class="cta-label">${esc(C.t("q.submit"))}</span>
        <span class="cta-icon">${icon.arrow}</span>
      </button>
    </div>`;

    const verdict = mine ? (() => {
      const ok = !!mine.correct;
      return `<div class="hero-verdict ${ok ? "is-ok" : "is-no"}">
        <span class="hv-ico">${ok ? icon.check : icon.cross}</span>
        <div class="hv-body">
          <b>${esc(ok ? C.t("result.correctTitle") : C.t("result.wrongTitle"))}</b>
          <span>${esc(C.t("result.correctAnswer"))} · ${"ABCD"[q.a]}. ${esc(C.pick(q.o[q.a]))}</span>
        </div>
      </div>`;
    })() : "";

    /* 本周打卡：并入 DAILY QUIZ 卡片顶部 */
    const heroWeek = `<div class="hero-week" aria-label="${esc(C.t("home.week"))}">
      ${week.map((w) => `
        <span class="hw${w.done ? " is-done" : ""}${w.done && !w.correct && !w.openOnly ? " is-wrong" : ""}${w.openOnly ? " is-openonly" : ""}${w.isToday ? " is-today" : ""}${w.future ? " is-future" : ""}">
          <em>${esc(w.label)}</em>
          <i>${w.openOnly ? '<b class="hw-dot"></b>' : (w.done ? (w.correct ? icon.check : icon.cross) : "")}</i>
        </span>`).join("")}
      <span class="hw-count">${esc(C.t("home.weekDone", { n: weekDone }))}</span>
    </div>`;

    const openPlaceholder = posts.length ? C.t("disc.continue") : C.t("disc.placeholder");

    return `${topbar({ lang: true, avatar: true })}
<main class="page page--home">

  <section class="hero${choiceDone ? " is-done" : ""}" style="background-image:
      radial-gradient(120% 90% at 88% 4%, rgba(20, 128, 92, 0.5) 0%, rgba(20, 128, 92, 0) 52%),
      linear-gradient(158deg, rgba(9, 71, 53, 0.9) 0%, rgba(6, 53, 38, 0.93) 58%, rgba(3, 32, 22, 0.95) 100%),
      url('assets/mosque/m${mIdx}.jpg')">
    ${girih("hero-girih")}
    <div class="hero-glow" aria-hidden="true"></div>

    <div class="hero-top">
      <span class="hero-pill"><i aria-hidden="true"></i>${esc(C.t("home.pill"))}</span>
      <span class="hero-stamp" aria-hidden="true">
        ${C.state.lang === "zh"
          ? `<em>${esc(dp.mon)}</em><b>${esc(dp.day)}</b>`
          : `<b>${esc(dp.day)}</b><em>${esc(dp.mon)}</em>`}
      </span>
    </div>

    ${heroWeek}

    <span class="hero-meta">
      <span>${esc(C.t("home.dayNo", { n: pad3(info.pos + 1) }))}</span>
      <i aria-hidden="true"></i>
      <span>${esc(C.t("home.round", { round: info.round }))}</span>
      <i aria-hidden="true"></i>
      <span>${esc(C.t("home.todayCount"))}</span>
    </span>

    <span class="hero-step"><b>01</b>${esc(C.t("home.choiceTag"))}</span>
    <h1 class="hero-q">${esc(C.pick(q.q))}</h1>

    ${choiceDone ? verdict : optionsPanel}
  </section>

  ${choiceDone ? knowBlock() : ""}

  <section class="q-open${openDone ? " is-done" : ""}">
    <div class="qo-head">
      <span class="qo-no">02</span>
      <span class="qo-tag">${esc(C.t("home.openTag"))}</span>
      <span class="qo-state ${openDone ? "is-done" : ""}">${esc(openDone ? C.t("home.openAnswered") : C.t("home.openPending"))}</span>
    </div>
    <h2 class="qo-q">${esc(C.pick(oq.q))}</h2>

    <div class="composer">
      <label class="sr-only" for="answer-box">${esc(openPlaceholder)}</label>
      <textarea id="answer-box" data-input="answer" rows="2" maxlength="500" placeholder="${esc(openPlaceholder)}"></textarea>
      <button class="post-btn" data-act="post">${esc(C.t("disc.post"))}${icon.arrow}</button>
    </div>
  </section>

  ${commentsBlock(comments, { limit: 6 })}

  ${choiceDone ? perfBlock(C.myStats()) : ""}

  ${doneCount > 0 ? `<div class="share-row">
    <button class="btn btn--line feed-share${shared ? " is-on" : ""}" data-act="feed-share" aria-pressed="${shared}">
      <span class="btn-ico">${shared ? icon.check : icon.feed}</span>
      <span>${esc(shared ? C.t("feed.shared") : C.t("feed.share"))}</span>
    </button>
    <button class="btn btn--line" data-nav="share">
      <span>${esc(C.t("result.share"))}</span>
      <span class="btn-ico">${icon.share}</span>
    </button>
  </div>` : ""}

  ${isDemo() ? `<footer class="home-foot">
    <details class="demo-box">
      <summary>${esc(C.t("home.demo"))} · ${esc(C.t("home.demoHint"))}</summary>
      <div class="demo-controls">
        <input type="date" data-act="pick-date" value="${info.date}" aria-label="${esc(C.t("home.demoHint"))}" />
        <button class="btn btn--line btn--xs" data-act="reset">${esc(C.t("home.reset"))}</button>
      </div>
    </details>
  </footer>` : ""}
</main>`;
  }

  /* ---------------- 选择题 ---------------- */

  function question(info, selected) {
    const q = info.question;

    return `${topbar({ back: true, title: C.t("nav.today"), lang: true, share: true })}
<main class="page">
  <div class="q-head">
    <span class="q-count">${esc(C.t("q.progress", { n: info.pos + 1, total: info.total }))}</span>
    <span class="q-type">${esc(C.t("q.single"))}</span>
  </div>

  <article class="q-card">
    ${girih("q-card-mark")}
    <h1 class="q-text">${esc(C.pick(q.q))}</h1>
    ${q.m ? `<div class="q-image">${icon.lock}<span>${esc(C.t("q.image"))}</span></div>` : ""}
  </article>

  <div class="options" role="radiogroup" aria-label="${esc(C.t("nav.today"))}">
    ${q.o.map((o, i) => `
      <button class="option${selected === i ? " is-on" : ""}" data-act="pick" data-i="${i}" role="radio" aria-checked="${selected === i}">
        <span class="letter">${"ABCD"[i]}</span>
        <span class="option-text">${esc(C.pick(o))}</span>
        <span class="option-mark" aria-hidden="true">${selected === i ? icon.check : ""}</span>
      </button>`).join("")}
  </div>

  <button class="cta" data-act="submit" ${selected == null ? "disabled" : ""}>
    <span class="cta-label">${esc(C.t("q.submit"))}</span>
    <span class="cta-icon">${icon.arrow}</span>
  </button>
  <p class="hint">${esc(C.t("q.hint"))}</p>
</main>`;
  }

  /* ---------------- 答案页 ---------------- */

  function result(info, opts) {
    const q = info.question;
    const mine = C.answerOf(info.index) || {};
    const ok = !!mine.correct;
    const friends = C.friendActivity(info.index, q);
    /* 好友较多时默认只列 6 位，避免整页被名单淹没 */
    const LIMIT = 6;
    const openAll = !!(opts && opts.friendsOpen);
    const shown = openAll ? friends.list : friends.list.slice(0, LIMIT);
    const hidden = friends.list.length - LIMIT;

    return `${topbar({ back: true, title: C.t("nav.answer"), lang: true, share: true })}
<main class="page">

  <section class="verdict ${ok ? "is-ok" : "is-no"}">
    <div class="seal">
      <span class="seal-halo" aria-hidden="true"></span>
      <span class="seal-ring" aria-hidden="true"></span>
      <span class="seal-ico">${ok ? icon.check : icon.cross}</span>
    </div>
    <span class="verdict-tag">${esc(ok ? C.t("result.sealOk") : C.t("result.sealNo"))}</span>
    <h1 class="verdict-title">${esc(ok ? C.t("result.correctTitle") : C.t("result.wrongTitle"))}</h1>
    <p class="verdict-sub">${esc(C.formatDate(info.date, C.state.lang))} · ${esc(C.t("home.round", { round: info.round }))}</p>
  </section>

  <p class="q-ref">${esc(C.pick(q.q))}</p>

  <article class="ans-card is-correct">
    <span class="ac-k">${esc(C.t("result.correctAnswer"))}</span>
    <div class="ac-row">
      <b class="ac-letter">${"ABCD"[q.a]}</b>
      <span class="ac-text">${esc(C.pick(q.o[q.a]))}</span>
    </div>
  </article>

  ${!ok && mine.choice != null ? `<article class="ans-card is-yours">
    <span class="ac-k">${esc(C.t("result.yourAnswer"))}</span>
    <div class="ac-row">
      <b class="ac-letter">${"ABCD"[mine.choice]}</b>
      <span class="ac-text">${esc(C.pick(q.o[mine.choice]))}</span>
    </div>
  </article>` : ""}

  ${knowBlock()}

  <section class="fstat">
    <div class="fstat-donut">
      ${donut(friends.rate, 72, 7)}
      <span class="fd-pct">${friends.rate}<em>%</em></span>
    </div>
    <div class="fstat-body">
      <b>${esc(C.t("result.friendsCorrect", { a: friends.correctCount, b: friends.answeredCount }))}</b>
      <span>${esc(C.t("result.friendsAnswered", { n: friends.answeredCount }))}</span>
    </div>
  </section>

  <ul class="friend-list">
    ${shown.map((f) => `
      <li>
        ${avatar(f.initials, "sm", f.id)}
        <span class="f-name">${esc(f.name)}<em>${esc(f.country)}</em></span>
        <span class="f-tag ${f.correct ? "ok" : "no"}">${f.correct ? icon.check : icon.cross}${esc(f.letter)}</span>
      </li>`).join("")}
  </ul>

  ${hidden > 0 ? `<button class="friends-more" data-act="more-friends">
    <span>${esc(openAll ? C.t("result.collapse") : C.t("result.showAll", { n: friends.list.length }))}</span>
    <i class="${openAll ? "up" : ""}">${icon.chevron}</i>
  </button>` : ""}

  ${q.s ? `<a class="link-row" href="${esc(q.s)}" target="_blank" rel="noopener noreferrer">
    ${icon.link}<span>${esc(C.t("result.source"))}</span><em>${esc(hostOf(q.s))}</em>${icon.arrow}
  </a>` : ""}

  <div class="actions">
    <button class="btn btn--line btn--block" data-nav="share">${esc(C.t("result.share"))}</button>
  </div>
</main>`;
  }

  /* ---------------- 讨论题 ---------------- */

  function discussion(info) {
    /* v4.1 起每天固定两题：讨论页固定跟随「开放题」这一条 */
    const q = info.open.question;
    const posts = C.myPosts(info.index);
    const first = posts[0];
    const comments = C.commentsOf(info.index, q);
    const placeholder = first ? C.t("disc.continue") : C.t("disc.placeholder");

    return `${topbar({ back: true, title: C.t("nav.today"), lang: true, share: true })}
<main class="page">
  <article class="post">
    ${girih("post-girih")}
    <div class="post-head">
      ${avatar("W", "brand")}
      <div class="post-who">
        <b>Wahda</b>
        <span>${esc(C.t("disc.official"))} · ${esc(C.t("common.today"))} 09:00</span>
      </div>
      <span class="tag post-tag">${esc(C.t("home.openTag"))}</span>
    </div>

    <h1 class="q-text">${esc(C.pick(q.q))}</h1>
    <p class="post-intro">${esc(C.t("disc.intro"))}</p>

    ${first ? `<div class="my-answer"><span class="my-answer-k">${esc(C.t("disc.you"))}</span><p>${esc(first.text)}</p></div>` : ""}

    <div class="composer">
      <label class="sr-only" for="answer-box">${esc(placeholder)}</label>
      <textarea id="answer-box" data-input="answer" rows="2" maxlength="500" placeholder="${esc(placeholder)}"></textarea>
      <button class="post-btn" data-act="post">${esc(C.t("disc.post"))}${icon.arrow}</button>
    </div>
  </article>

  ${commentsBlock(comments, { sort: true })}
</main>`;
  }

  /* ---------------- 分享 ---------------- */

  function share(info) {
    const q = info.question;
    const channels = [
      ["whatsapp", "WhatsApp", "#25d366"],
      ["facebook", "Facebook", "#1877f2"],
      ["x", "X", "#0b0b0b"],
      ["telegram", "Telegram", "#2aabee"],
      ["instagram", "Instagram", "#e1306c"],
      ["copy", C.t("share.copy"), "#0c5b43"]
    ];

    return `${topbar({ back: true, title: C.t("share.title"), lang: true })}
<main class="page">
  <div class="sec-head">
    <h2>${esc(C.t("share.defaultLabel"))}</h2>
  </div>

  <figure class="plate-card">
    ${girih("pc-girih")}
    <span class="pc-corner tl" aria-hidden="true"></span>
    <span class="pc-corner tr" aria-hidden="true"></span>
    <span class="pc-corner bl" aria-hidden="true"></span>
    <span class="pc-corner br" aria-hidden="true"></span>
    <div class="pc-inner">
      <div class="pc-kicker"><i aria-hidden="true"></i>${esc(C.t("share.cardKicker"))}</div>
      <blockquote class="pc-q">${esc(C.pick(q.q))}</blockquote>
      <div class="pc-body">
        <b>${esc(C.t("share.cardBody"))}</b>
        <p>${esc(C.t("share.cardBodySub"))}</p>
      </div>
      <div class="pc-store">
        <span class="pc-store-k">${esc(C.t("share.storeLabel"))}</span>
        <span class="pc-search">${icon.search}<b>Wahda</b></span>
        <span class="pc-store-n">${esc(C.t("share.stores"))}</span>
      </div>
    </div>
  </figure>

  <div class="sec-head">
    <h2>${esc(C.t("share.to"))}</h2>
  </div>

  <div class="social-grid">
    ${channels.map(([key, label, color]) => `
      <button class="social" data-act="share-channel" data-ch="${key}" style="--ch:${color}">
        <span class="social-icon">${social[key]}</span>
        <span class="social-label">${esc(label)}</span>
      </button>`).join("")}
  </div>

  <div class="actions">
    <button class="cta" data-act="share-channel" data-ch="native">
      <span class="cta-label">${esc(C.t("share.imageLink"))}</span>
      <span class="cta-icon">${icon.arrow}</span>
    </button>
    <button class="btn btn--line btn--block" data-act="share-channel" data-ch="save">${esc(C.t("share.saveCard"))}</button>
  </div>

  <p class="note">${esc(C.t("share.resultAttached"))}</p>
  <p class="note note--dim">${esc(C.t("share.pending"))}</p>
</main>`;
  }

  function notFound() {
    return `${topbar({ back: true, title: "" })}
<main class="page"><p class="hint">404</p></main>`;
  }

  QZ.views = { home, question, result, discussion, share, notFound, icon, esc };
})();
