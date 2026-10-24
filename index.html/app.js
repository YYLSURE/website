/* ===== 人格旅行 · 网页版应用逻辑（零依赖 SPA） ===== */
(function () {
  'use strict';

  const STORAGE_KEY = 'pt_history_records';
  const TOTAL = QUESTIONS.length;

  // ---------- 本地历史档案 ----------
  function getHistory() {
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(list)
        ? list.filter((i) => i && i.personalityId).sort((a, b) => b.createdAt - a.createdAt)
        : [];
    } catch (e) {
      console.error('[History] read failed:', e);
      return [];
    }
  }
  function addHistory(personalityId) {
    try {
      const list = getHistory();
      list.unshift({ id: String(Date.now()), personalityId, createdAt: Date.now() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('[History] save failed:', e);
    }
  }
  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // ---------- Toast ----------
  let toastTimer = null;
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
  }

  // ---------- 路由 ----------
  const routes = ['home', 'quiz', 'result', 'mine', 'about'];
  function go(hash) {
    location.hash = hash;
  }

  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, '');
    const [name, query = ''] = raw.split('?');
    const params = {};
    new URLSearchParams(query).forEach((v, k) => (params[k] = v));
    return { name: name || 'home', params };
  }

  function showView(name) {
    routes.forEach((r) => {
      document.getElementById('view-' + r).classList.toggle('active', r === name);
    });
    window.scrollTo(0, 0);

    const tabbar = document.getElementById('tabbar');
    const topnav = document.getElementById('topnav');
    const showTab = name === 'home' || name === 'mine';
    tabbar.classList.toggle('hidden', !showTab);

    const navTitles = { quiz: '趣味测试', result: '我的旅行人格', about: '关于我们' };
    if (navTitles[name]) {
      topnav.classList.remove('hidden');
      document.getElementById('topnavTitle').textContent = navTitles[name];
    } else {
      topnav.classList.add('hidden');
    }

    document.querySelectorAll('#tabbar button').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === name);
    });
  }

  // ---------- 答题页 ----------
  const quizState = { current: 0, answers: [], locking: false };

  function renderQuiz() {
    const q = QUESTIONS[quizState.current];
    const selected = quizState.answers[quizState.current];

    document.getElementById('quizProgress').textContent = `${quizState.current + 1} / ${TOTAL}`;
    document.getElementById('quizTrackFill').style.width =
      `${Math.round(((quizState.current + 1) / TOTAL) * 100)}%`;
    document.getElementById('quizBack').disabled = quizState.current === 0;

    const block = document.getElementById('quizBlock');
    block.innerHTML = `
      <span class="dimension-tag">${q.dimension}</span>
      <span class="quiz-title">${q.title}</span>
      <div class="options">
        ${q.options
          .map(
            (o) => `
          <button class="option ${selected === o.type ? 'selected' : ''}" data-type="${o.type}">
            <span class="option-badge">${o.key}</span>
            <span class="option-text">${o.text}</span>
          </button>`
          )
          .join('')}
      </div>`;

    // 重启动画
    block.style.animation = 'none';
    void block.offsetWidth;
    block.style.animation = '';

    block.querySelectorAll('.option').forEach((btn) => {
      btn.addEventListener('click', () => selectOption(btn.dataset.type));
    });
  }

  function selectOption(type) {
    if (quizState.locking) return;
    quizState.locking = true;
    quizState.answers[quizState.current] = type;
    renderQuiz();

    setTimeout(() => {
      quizState.locking = false;
      if (quizState.current < TOTAL - 1) {
        quizState.current += 1;
        renderQuiz();
      } else {
        const id = calculatePersonality(quizState.answers);
        addHistory(id);
        go(`result?id=${id}&from=quiz`);
      }
    }, 300);
  }

  // ---------- 结果页 ----------
  function renderResult(id, from) {
    const p = PERSONALITIES[id];
    const el = document.getElementById('view-result');
    if (!p) {
      el.innerHTML = '';
      toast('报告不存在，请重新测试');
      setTimeout(() => go('home'), 900);
      return;
    }

    el.innerHTML = `
      <div class="result-hero">
        <img src="${p.hero}" alt="${p.destination}" />
        <div class="result-hero-mask">
          <span class="result-region">${p.region}</span>
          <span class="result-name">${p.destination} · ${p.name}</span>
          <div class="result-tags">${p.tags.map((t) => `<span>${t}</span>`).join('')}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title-row"><span class="title-bar"></span><span class="card-title">专属旅行人格</span></div>
        <p>${p.summary}</p>
      </div>

      <div class="card">
        <div class="card-title-row">
          <span class="title-bar"></span>
          <span class="card-title">为什么是${p.destination}</span>
          <span class="card-sub">人文与风景的契合</span>
        </div>
        <div class="match-item">
          <div class="match-badge" style="background:${p.accentLight};color:${p.accent}">文</div>
          <div>
            <span class="match-label">人文底蕴</span>
            <span class="match-text">${p.culture}</span>
          </div>
        </div>
        <div class="match-item">
          <div class="match-badge" style="background:${p.accentLight};color:${p.accent}">景</div>
          <div>
            <span class="match-label">自然风景</span>
            <span class="match-text">${p.scenery}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title-row"><span class="title-bar"></span><span class="card-title">专属旅行攻略</span></div>
        ${p.spots
          .map(
            (s) => `
          <div class="spot-item">
            <img src="${s.image}" alt="${s.name}" />
            <div class="spot-body">
              <span class="spot-name">${s.name}</span>
              <span class="spot-desc">${s.desc}</span>
            </div>
          </div>`
          )
          .join('')}
        <div class="guide-group">
          <span class="guide-label">特色人文体验</span>
          <div class="pill-row">
            ${p.experiences.map((x) => `<span class="pill" style="background:${p.accentLight};color:${p.accent}">${x}</span>`).join('')}
          </div>
        </div>
        <div class="guide-group">
          <span class="guide-label">本地特色美食</span>
          <div class="pill-row">
            ${p.foods.map((x) => `<span class="pill" style="background:#f2f0ea;color:#8a7f6b">${x}</span>`).join('')}
          </div>
        </div>
        <div class="tips-box" style="background:${p.accentLight}">
          <span>出行建议　${p.tips}</span>
        </div>
      </div>

      <div class="action-bar">
        <div class="action-row">
          <button class="btn-outline" id="btnShare">分享好友</button>
          <button class="btn-save" id="btnPoster">保存海报</button>
        </div>
        <button class="btn-retake" id="btnRetake">重新测试</button>
      </div>`;

    document.getElementById('btnRetake').addEventListener('click', () => {
      resetQuiz();
      go('quiz');
    });
    document.getElementById('btnPoster').addEventListener('click', () => savePoster(p));
    document.getElementById('btnShare').addEventListener('click', () => shareResult(p));
  }

  // ---------- Canvas 海报 ----------
  function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    let line = '';
    let curY = y;
    let count = 0;
    for (let i = 0; i < text.length; i++) {
      const test = line + text[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        count++;
        if (count === maxLines) {
          ctx.fillText(line.slice(0, -1) + '…', x, curY);
          return curY + lineHeight;
        }
        ctx.fillText(line, x, curY);
        line = text[i];
        curY += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) {
      ctx.fillText(line, x, curY);
      curY += lineHeight;
    }
    return curY;
  }

  function savePoster(p) {
    const W = 640;
    const H = 1180;
    const canvas = document.getElementById('posterCanvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f6f5f1';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = p.accent;
    ctx.fillRect(0, 0, W, 280);

    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.font = '20px sans-serif';
    ctx.fillText('人格旅行 · 专属报告', 48, 72);

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 46px sans-serif';
    ctx.fillText(p.name, 48, 152);

    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '24px sans-serif';
    ctx.fillText(`适配属地 · ${p.destination}（${p.region}）`, 48, 204);

    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '20px sans-serif';
    ctx.fillText(p.tags.join('    '), 48, 246);

    let y = 336;
    ctx.fillStyle = '#9aa09b';
    ctx.font = '20px sans-serif';
    ctx.fillText('人格特质', 48, y);
    y += 44;
    ctx.fillStyle = '#3f4441';
    ctx.font = '26px sans-serif';
    y = wrapText(ctx, p.summary, 48, y, W - 96, 40, 4) + 28;

    ctx.fillStyle = '#9aa09b';
    ctx.font = '20px sans-serif';
    ctx.fillText('必打卡景点', 48, y);
    y += 44;
    ctx.fillStyle = '#55726a';
    ctx.font = '26px sans-serif';
    p.spots.forEach((s, i) => {
      ctx.fillText(`${i + 1}. ${s.name}`, 48, y);
      y += 46;
    });
    y += 8;

    ctx.fillStyle = '#9aa09b';
    ctx.font = '20px sans-serif';
    ctx.fillText('特色美食', 48, y);
    y += 44;
    ctx.fillStyle = '#3f4441';
    ctx.font = '24px sans-serif';
    y = wrapText(ctx, p.foods.join('、'), 48, y, W - 96, 36, 2) + 24;

    ctx.fillStyle = '#9aa09b';
    ctx.font = '20px sans-serif';
    ctx.fillText('出行建议', 48, y);
    y += 44;
    ctx.fillStyle = '#6c726d';
    ctx.font = '24px sans-serif';
    wrapText(ctx, p.tips, 48, y, W - 96, 36, 3);

    ctx.strokeStyle = '#e7e5de';
    ctx.beginPath();
    ctx.moveTo(48, 1096);
    ctx.lineTo(W - 48, 1096);
    ctx.stroke();

    ctx.fillStyle = '#6c726d';
    ctx.font = '20px sans-serif';
    ctx.fillText('人格旅行 · 让人格，遇见风景', 48, 1140);
    ctx.fillStyle = '#9aa09b';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(new Date().toISOString().slice(0, 10).replace(/-/g, '.'), W - 48, 1140);
    ctx.textAlign = 'left';

    const link = document.createElement('a');
    link.download = `人格旅行-${p.name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast('海报已生成并开始下载');
  }

  async function shareResult(p) {
    const shareData = {
      title: `我的旅行人格是${p.name}，在${p.destination}找到了归属`,
      text: '30 秒测出你的专属旅行人格与属地风景',
      url: location.origin + location.pathname
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        try {
          await navigator.clipboard.writeText(shareData.url);
        } catch (clipErr) {
          const ta = document.createElement('textarea');
          ta.value = shareData.url;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        toast('链接已复制，去分享给好友吧');
      }
    } catch (e) {
      // 用户取消分享时不提示错误
      if (e && e.name !== 'AbortError') console.error('[Share] failed:', e);
    }
  }

  // ---------- 我的 ----------
  function formatDate(ts) {
    const d = new Date(ts);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function renderMine() {
    const records = getHistory();
    const list = document.getElementById('mineList');
    const sub = document.getElementById('mineSub');
    const clearBtn = document.getElementById('btnClear');

    sub.textContent = records.length > 0 ? `已收藏 ${records.length} 份人格旅行报告` : '测一次，收藏一座与你契合的城';
    clearBtn.style.display = records.length > 0 ? 'block' : 'none';

    if (records.length === 0) {
      list.innerHTML = `
        <div class="empty">
          <div class="empty-circle">旅</div>
          <div class="empty-title">还没有旅行档案</div>
          <div class="empty-desc">30 秒测试，解锁你的专属旅行人格</div>
          <button class="btn-primary" id="btnEmptyStart">开启第一次测试</button>
        </div>`;
      document.getElementById('btnEmptyStart').addEventListener('click', () => {
        resetQuiz();
        go('quiz');
      });
      return;
    }

    list.innerHTML = records
      .map((r) => {
        const p = PERSONALITIES[r.personalityId];
        if (!p) return '';
        return `
        <button class="record-card" data-id="${r.personalityId}">
          <img src="${p.hero.replace('750/500', '200/200')}" alt="${p.name}" />
          <div class="record-body">
            <span class="record-name">${p.name} · ${p.destination}</span>
            <span class="record-meta">${p.tags.join(' / ')}</span>
            <span class="record-date">${formatDate(r.createdAt)}</span>
          </div>
          <span class="record-arrow">›</span>
        </button>`;
      })
      .join('');

    list.querySelectorAll('.record-card').forEach((btn) => {
      btn.addEventListener('click', () => go(`result?id=${btn.dataset.id}`));
    });
  }

  // ---------- 初始化 ----------
  function resetQuiz() {
    quizState.current = 0;
    quizState.answers = [];
    quizState.locking = false;
  }

  function router() {
    const { name, params } = parseHash();
    if (routes.indexOf(name) === -1) {
      go('home');
      return;
    }
    showView(name);
    if (name === 'quiz') renderQuiz();
    if (name === 'result') renderResult(params.id, params.from);
    if (name === 'mine') renderMine();
  }

  document.getElementById('btnStart').addEventListener('click', () => {
    resetQuiz();
    go('quiz');
  });
  document.getElementById('quizBack').addEventListener('click', () => {
    if (quizState.current > 0) {
      quizState.current -= 1;
      renderQuiz();
    }
  });
  document.getElementById('topnavBack').addEventListener('click', () => {
    const { name } = parseHash();
    if (name === 'quiz') go('home');
    else if (name === 'result') {
      if (getHistory().length > 0) go('mine');
      else go('home');
    } else if (name === 'about') go('mine');
    else history.back();
  });
  document.querySelectorAll('#tabbar button').forEach((btn) => {
    btn.addEventListener('click', () => go(btn.dataset.tab));
  });
  document.getElementById('btnAbout').addEventListener('click', () => go('about'));
  document.getElementById('btnAboutBack').addEventListener('click', () => go('mine'));
  document.getElementById('btnClear').addEventListener('click', () => {
    if (getHistory().length === 0) return;
    if (confirm('确定清空全部旅行档案吗？此操作不可恢复')) {
      clearHistory();
      renderMine();
      toast('已清空');
    }
  });

  window.addEventListener('hashchange', router);
  if (!location.hash) location.hash = '#/home';
  router();
})();
