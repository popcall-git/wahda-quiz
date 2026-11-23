/* 应用入口：hash 路由、事件委托、倒计时 */
(function () {
  const C = window.QZ.core;
  const V = window.QZ.views;
  const app = document.getElementById("app");
  const toastEl = document.getElementById("toast");
  const ui = { selected: null, sort: "likes", friendsOpen: false };
  let toastTimer = null;

  /* ---------- 路由 ---------- */

  function parse() {
    const raw = location.hash.replace(/^#\/?/, "");
    const [head, sub] = raw.split("/");
    return { name: head || "home", sub: sub || "" };
  }

  function navigate(hash) {
    if (location.hash === hash) render(false);
    else location.hash = hash;
  }

  function currentIndex() {
    if (C.state.dayOverride != null) return C.state.dayOverride;
    return Math.max(0, C.dayIndex());
  }

  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  /* ---------- 渲染 ---------- */

  function render(keepScroll) {
    const y = window.scrollY;
    const route = parse();
    const index = currentIndex();
    const info = C.dayInfo(index);
    let html = "";

    if (route.name === "home") {
      html = V.home(info, { selected: ui.selected, friendsOpen: ui.friendsOpen });
    } else if (route.name === "q") {
      if (info.question.t === 0 && C.answerOf(index)) {
        history.replaceState(null, "", "#/a");
        return render(keepScroll);
      }
      html = info.question.t === 0
        ? V.question(info, ui.selected)
        : V.discussion(info);
    } else if (route.name === "a") {
      if (info.question.t === 0 && !C.answerOf(index)) {
        history.replaceState(null, "", "#/q");
        return render(keepScroll);
      }
      html = info.question.t === 0 ? V.result(info, { friendsOpen: ui.friendsOpen }) : V.discussion(info);
    } else if (route.name === "d") {
      /* 开放题讨论页：显示该题的全部答复 */
      html = V.discussion(info);
    } else if (route.name === "s") {
      html = V.share(info);
    } else {
      html = V.notFound();
    }

    app.innerHTML = html;
    /* keepScroll = 页内状态更新（选题、切换语言），不重放入场动效 */
    app.dataset.enter = keepScroll ? "0" : "1";
    document.documentElement.lang = C.state.lang === "zh" ? "zh-CN" : "en";
    if (keepScroll) window.scrollTo(0, y);
    else window.scrollTo(0, 0);
  }

  let lastDate = C.dateInTz();
  setInterval(() => {
    const d = C.dateInTz();
    if (d !== lastDate) {
      lastDate = d;
      if (C.state.dayOverride == null) render(false);
    }
  }, 30000);

  /* ---------- 事件 ---------- */

  document.addEventListener("click", (e) => {
    const actEl = e.target.closest("[data-act]");
    const navEl = e.target.closest("[data-nav]");

    if (actEl) {
      const act = actEl.dataset.act;

      if (act === "back") {
        /* 顶栏返回固定回首页，不跟随浏览历史 */
        navigate("#/");
        return;
      }

      if (act === "lang") {
        C.setLang(C.state.lang === "en" ? "zh" : "en");
        render(true);
        return;
      }

      if (act === "more-friends") {
        ui.friendsOpen = !ui.friendsOpen;
        render(true);
        return;
      }

      if (act === "pick") {
        ui.selected = Number(actEl.dataset.i);
        render(true);
        return;
      }

      if (act === "submit") {
        const index = currentIndex();
        const q = C.dayInfo(index).question;
        if (ui.selected == null) return;
        if (C.answerOf(index)) {
          navigate(parse().name === "home" ? "#/" : "#/a");
          return;
        }
        const onHome = parse().name === "home";
        C.submitChoice(index, ui.selected, ui.selected === q.a);
        ui.selected = null;
        /* 首页内联答题：提交后就地展示结果，不跳转、不跳回顶部 */
        if (onHome) render(true);
        else navigate("#/a");
        return;
      }

      if (act === "post") {
        const index = currentIndex();
        const input = document.querySelector('[data-input="answer"]');
        const text = (input && input.value.trim()) || "";
        if (!text) {
          if (input) input.focus();
          toast(C.t("disc.placeholder"));
          return;
        }
        C.submitOpen(index, text);
        toast(C.t("disc.posted"));
        render(true);
        return;
      }

      if (act === "feed-share") {
        /* 预留入口：只在本地记录状态，不做真实转发 */
        const on = C.toggleFeedShare(currentIndex());
        toast(C.t(on ? "feed.posted" : "feed.removed"));
        render(true);
        return;
      }

      if (act === "like") {
        const id = actEl.dataset.id;
        if (!id) return;
        C.toggleLike(id);
        render(true);
        return;
      }

      if (act === "toggle-replies") {
        const id = actEl.dataset.id;
        const box = document.querySelector(`[data-replies="${id}"]`);
        if (!box) return;
        box.hidden = !box.hidden;
        actEl.textContent = box.hidden
          ? C.t("disc.viewReplies", { n: box.children.length })
          : C.t("disc.hideReplies");
        return;
      }

      if (act === "reply") {
        const input = document.querySelector('[data-input="answer"]');
        const item = actEl.closest(".comment");
        const name = item ? (item.querySelector(".c-name") || {}).textContent : "";
        if (input) {
          input.value = name ? `@${name.split("·")[0].trim()} ` : "";
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
        return;
      }

      if (act === "sort") {
        ui.sort = ui.sort === "likes" ? "likes" : "likes";
        toast(C.t("disc.sortLikes"));
        return;
      }

      if (act === "share-channel") {
        toast(C.t("share.pending"));
        return;
      }

      if (act === "reset") {
        if (confirm(C.t("home.reset") + "?")) {
          C.reset();
          ui.selected = null;
          render(false);
        }
        return;
      }
    }

    if (navEl) {
      const target = navEl.dataset.nav;
      if (target === "question") {
        ui.selected = null;
        navigate("#/q");
      } else if (target === "result") {
        navigate("#/a");
      } else if (target === "share") {
        navigate("#/s");
      } else if (target === "discussion") {
        navigate("#/d");
      } else {
        navigate("#/");
      }
    }
  });

  document.addEventListener("change", (e) => {
    const el = e.target.closest('[data-act="pick-date"]');
    if (!el) return;
    const value = el.value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
    const index = C.dayIndex(value);
    C.state.dayOverride = index < 0 ? 0 : index;
    C.save();
    ui.selected = null;
    navigate("#/");
    render(false);
  });

  document.addEventListener("keydown", (e) => {
    if ((e.target.tagName === "TEXTAREA") && e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      const btn = document.querySelector('[data-act="post"]');
      if (btn) btn.click();
    }
  });

  window.addEventListener("hashchange", () => render(false));
  window.addEventListener("scroll", () => {}, { passive: true });

  render(false);
})();
