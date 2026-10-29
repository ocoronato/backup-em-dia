/* =========================================================
   Backup em Dia — interatividade
   Menu, rolagem, regra 3-2-1, linha do tempo,
   demonstração de restauração e checklist.
   ========================================================= */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menu mobile ---------- */
  const header = $(".site-header");
  const navToggle = $("#nav-toggle");
  const nav = $("#menu-principal");

  function closeMenu() {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu");
  }

  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });

  $$("a", nav).forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  /* ---------- Cabeçalho com sombra e botão "voltar ao topo" ---------- */
  const toTop = $("#to-top");
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    toTop.classList.toggle("is-visible", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Link ativo no menu conforme a seção visível ---------- */
  const navLinks = $$("a[href^='#']", nav);
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Animação ao rolar ----------
     Só os elementos que ainda estão abaixo da tela ganham o deslize;
     o conteúdo nunca fica invisível. */
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });

    $$(".reveal").forEach((el, i) => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add("will-reveal");
        el.style.transitionDelay = (i % 3) * 70 + "ms";
        revealer.observe(el);
      }
    });
  }

  /* ---------- Navegação por teclado em grupos de abas ---------- */
  function arrowKeys(tabs, activate) {
    tabs.forEach((tab, i) => {
      tab.addEventListener("keydown", (e) => {
        let next = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + tabs.length) % tabs.length;
        if (next === null) return;
        e.preventDefault();
        tabs[next].focus();
        activate(next);
      });
    });
  }

  /* ---------- Regra 3-2-1 ---------- */
  const RULE = {
    tres: {
      title: "3 cópias",
      text: "O arquivo original no computador conta como a primeira cópia. As outras duas são backups. Se uma falhar, ainda resta outra.",
      on: ["pc", "hd", "cloud"]
    },
    dois: {
      title: "2 tipos de armazenamento",
      text: "As cópias ficam em mídias diferentes, por exemplo um HD externo e a nuvem. Assim, um mesmo problema dificilmente atinge as duas ao mesmo tempo.",
      on: ["hd", "cloud"]
    },
    um: {
      title: "1 cópia fora da empresa",
      text: "Pelo menos uma cópia fica longe do escritório, como na nuvem ou em um HD guardado em outro endereço. Ela protege contra incêndio, alagamento ou furto no local.",
      on: ["cloud"],
      zone: "out"
    }
  };

  const NODE_INFO = {
    pc: { title: "Computador", text: "Onde você trabalha no dia a dia. Guarda os arquivos originais, mas sozinho não é backup: se ele falhar, tudo vai junto." },
    hd: { title: "HD externo", text: "Cópia física, rápida de restaurar. Conecte para fazer o backup e depois desconecte e guarde em local seguro, longe do alcance de vírus." },
    cloud: { title: "Nuvem", text: "Cópia online, fora da empresa. Ative a verificação em duas etapas e use o histórico de versões para recuperar arquivos antigos." }
  };

  const ruleTabs = $$(".rule-tab");
  const diagram = $("#rule-panel");
  const nodes = $$(".node", diagram);
  const ruleTitle = $("#rule-info-title");
  const ruleText = $("#rule-info-text");

  function setRule(index) {
    const tab = ruleTabs[index];
    const mode = RULE[tab.dataset.mode];

    ruleTabs.forEach((t, i) => {
      const active = i === index;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
    });
    diagram.setAttribute("aria-labelledby", tab.id);

    nodes.forEach((n) => {
      const on = mode.on.includes(n.dataset.node);
      n.classList.toggle("is-on", on);
      n.classList.toggle("is-dim", !on);
      n.classList.remove("is-picked");
    });
    $(".zone-out", diagram).classList.toggle("is-on", mode.zone === "out");

    ruleTitle.textContent = mode.title;
    ruleText.textContent = mode.text;
  }

  ruleTabs.forEach((tab, i) => tab.addEventListener("click", () => setRule(i)));
  arrowKeys(ruleTabs, setRule);

  nodes.forEach((node) => {
    node.addEventListener("click", () => {
      const info = NODE_INFO[node.dataset.node];
      nodes.forEach((n) => n.classList.toggle("is-picked", n === node));
      ruleTitle.textContent = info.title;
      ruleText.textContent = info.text;
    });
  });

  setRule(0);

  /* ---------- Linha do tempo da rotina ---------- */
  const ROUTINE = [
    {
      freq: "Diariamente",
      title: "Realizar backup dos arquivos importantes e dos dados que foram modificados.",
      items: [
        "Deixe o backup automático, em um horário fora do expediente.",
        "Se usar HD externo, conecte-o para que a cópia aconteça e desconecte depois.",
        "Antes de viagens, atualizações ou de mandar o computador para o conserto, faça também um backup manual."
      ]
    },
    {
      freq: "Semanalmente",
      title: "Verificar se os backups foram realizados corretamente e se não existem falhas.",
      items: [
        "Leia os avisos e relatórios do programa ou serviço de backup.",
        "Confira a data da última cópia e se todos os arquivos importantes entraram.",
        "Veja se ainda há espaço livre no HD ou na nuvem e troque mídias com defeito."
      ]
    },
    {
      freq: "Mensalmente",
      title: "Realizar testes de restauração para confirmar que os arquivos podem ser recuperados.",
      items: [
        "Restaure um arquivo em outra pasta e abra para conferir.",
        "Anote quanto tempo levou para recuperar.",
        "Varie o teste: às vezes um arquivo, às vezes uma pasta inteira."
      ]
    },
    {
      freq: "A cada 3 meses",
      title: "Revisar a estratégia de backup, os dispositivos utilizados e as permissões de acesso.",
      items: [
        "Surgiram novos sistemas, planilhas ou tipos de dados que precisam entrar no backup?",
        "Os HDs e equipamentos estão em bom estado? A conta na nuvem tem espaço suficiente?",
        "Remova acessos de quem não precisa mais, revise senhas e a verificação em duas etapas.",
        "Atualize o passo a passo escrito de como recuperar os dados."
      ]
    }
  ];

  const tlSteps = $$(".tl-step");
  const tlPanel = $("#tl-panel");
  const tlFreq = $("#tl-freq");
  const tlTitle = $("#tl-title");
  const tlList = $("#tl-list");

  function setRoutine(index) {
    const r = ROUTINE[index];
    tlSteps.forEach((s, i) => {
      const active = i === index;
      s.classList.toggle("is-active", active);
      s.setAttribute("aria-selected", String(active));
      s.tabIndex = active ? 0 : -1;
    });
    tlFreq.textContent = r.freq;
    tlTitle.textContent = r.title;
    tlList.innerHTML = "";
    r.items.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      tlList.appendChild(li);
    });
    tlPanel.classList.remove("is-changing");
    void tlPanel.offsetWidth; // reinicia a animação
    tlPanel.classList.add("is-changing");
  }

  tlSteps.forEach((step, i) => step.addEventListener("click", () => setRoutine(i)));
  arrowKeys(tlSteps, setRoutine);

  /* ---------- Demonstração de restauração ---------- */
  const icon = (id) => `<svg><use href="#${id}"/></svg>`;

  const DEMO = [
    {
      title: "Um arquivo importante é perdido",
      desc: "O computador do escritório apresentou defeito e a planilha de vendas do mês não abre mais.",
      win: "Pasta: Financeiro",
      html: `
        <div class="f-row">${icon("i-file")}<span class="f-name">clientes.xlsx</span><span class="f-meta">ok</span></div>
        <div class="f-row is-lost">${icon("i-alert")}<span class="f-name">vendas-do-mes.xlsx</span><span class="f-meta">não abre</span></div>
        <div class="f-row">${icon("i-file")}<span class="f-name">contrato-fornecedor.pdf</span><span class="f-meta">ok</span></div>
        <p class="win-note">Sem backup, seria preciso refazer a planilha de memória.</p>`
    },
    {
      title: "O responsável acessa a cópia de segurança",
      desc: "Quem cuida do backup abre o local onde as cópias ficam guardadas: o HD externo ou o serviço de nuvem.",
      win: "Onde está o backup?",
      html: `
        <span class="f-label">Escolha a origem</span>
        <div class="src-grid">
          <div class="src">${icon("i-hdd")}HD externo<small>Guardado no cofre</small></div>
          <div class="src is-sel">${icon("i-cloud")}Nuvem<small>Acesso pela internet</small></div>
        </div>
        <p class="win-note">Ter duas origens ajuda: se uma falhar, existe a outra.</p>`
    },
    {
      title: "Localiza a versão correta do arquivo",
      desc: "No histórico, escolhe a versão salva antes do problema. Por isso é útil o backup guardar várias versões.",
      win: "Versões de vendas-do-mes.xlsx",
      html: `
        <span class="f-label">Versões disponíveis</span>
        <div class="f-row is-faded">${icon("i-clock")}<span class="f-name">Hoje, 09:40</span><span class="f-meta">corrompida</span></div>
        <div class="f-row is-sel">${icon("i-clock")}<span class="f-name">Ontem, 19:00</span><span class="f-meta">selecionada</span></div>
        <div class="f-row">${icon("i-clock")}<span class="f-name">Anteontem, 19:00</span><span class="f-meta">anterior</span></div>
        <div class="f-row">${icon("i-clock")}<span class="f-name">7 dias atrás, 19:00</span><span class="f-meta">anterior</span></div>`
    },
    {
      title: "Realiza a restauração",
      desc: "O arquivo é copiado de volta para o computador. Restaurar em outra pasta evita substituir algo por engano.",
      win: "Restaurando…",
      html: `
        <div class="f-row is-sel">${icon("i-restore")}<span class="f-name">vendas-do-mes.xlsx</span><span class="f-meta">versão de ontem</span></div>
        <div class="restore-bar run"><span></span></div>
        <p class="win-note">Destino: Financeiro / Restaurados</p>`
    },
    {
      title: "O arquivo é recuperado e a empresa continua trabalhando",
      desc: "A planilha abre normalmente, é conferida e o trabalho segue. Agora é anotar o que aconteceu e quanto tempo levou.",
      win: "Pasta: Financeiro",
      html: `
        <div class="f-row">${icon("i-file")}<span class="f-name">clientes.xlsx</span><span class="f-meta">ok</span></div>
        <div class="f-row is-ok">${icon("i-check")}<span class="f-name">vendas-do-mes.xlsx</span><span class="f-meta">recuperado</span></div>
        <div class="f-row">${icon("i-file")}<span class="f-name">contrato-fornecedor.pdf</span><span class="f-meta">ok</span></div>
        <p class="win-success">${icon("i-shield-check")}Arquivo aberto e conferido.</p>`
    }
  ];

  const demoBtns = $$("#demo-steps button");
  const demoCount = $("#demo-count");
  const demoTitle = $("#demo-title");
  const demoDesc = $("#demo-desc");
  const winTitle = $("#win-title");
  const winContent = $("#win-content");
  const prevBtn = $("#demo-prev");
  const nextBtn = $("#demo-next");
  let demoIndex = 0;

  function setDemo(index) {
    demoIndex = index;
    const d = DEMO[index];
    demoBtns.forEach((b, i) => {
      b.classList.toggle("is-active", i === index);
      b.classList.toggle("is-done", i < index);
      if (i === index) b.setAttribute("aria-current", "step");
      else b.removeAttribute("aria-current");
    });
    demoCount.textContent = `Etapa ${index + 1} de ${DEMO.length}`;
    demoTitle.textContent = d.title;
    demoDesc.textContent = d.desc;
    winTitle.textContent = d.win;
    winContent.innerHTML = d.html;
    winContent.classList.remove("is-changing");
    void winContent.offsetWidth;
    winContent.classList.add("is-changing");

    prevBtn.disabled = index === 0;
    const last = index === DEMO.length - 1;
    nextBtn.innerHTML = last ? `${icon("i-restore")}Recomeçar` : `Próxima etapa ${icon("i-arrow-right")}`;
  }

  demoBtns.forEach((b) => b.addEventListener("click", () => setDemo(Number(b.dataset.go))));
  prevBtn.addEventListener("click", () => { if (demoIndex > 0) setDemo(demoIndex - 1); });
  nextBtn.addEventListener("click", () => setDemo(demoIndex === DEMO.length - 1 ? 0 : demoIndex + 1));
  setDemo(0);

  /* ---------- Checklist com barra de progresso ----------
     As marcações ficam salvas só neste navegador (localStorage). */
  const STORAGE_KEY = "backup-em-dia-checklist";
  const checks = $$("#check-list input[type='checkbox']");
  const fill = $("#progress-fill");
  const bar = $("#progress-bar");
  const pctEl = $("#progress-pct");
  const textEl = $("#progress-text");
  const msgEl = $("#progress-msg");

  function loadChecks() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      checks.forEach((c) => { c.checked = saved.includes(c.id); });
    } catch (e) { /* armazenamento indisponível: segue sem salvar */ }
  }

  function saveChecks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checks.filter((c) => c.checked).map((c) => c.id)));
    } catch (e) { /* ignora */ }
  }

  function message(done, total) {
    if (done === 0) return "Comece pelo primeiro item: saber o que proteger.";
    if (done === total) return "Excelente! Sua empresa segue as boas práticas. Mantenha a rotina e revise a cada 3 meses.";
    if (done / total < 0.5) return "Bom começo. Cada item marcado diminui o risco de perder dados.";
    return "Você está no caminho certo. Faltam poucos passos para uma proteção completa.";
  }

  function updateProgress() {
    const done = checks.filter((c) => c.checked).length;
    const total = checks.length;
    const pct = Math.round((done / total) * 100);
    fill.style.width = pct + "%";
    bar.setAttribute("aria-valuenow", String(pct));
    pctEl.textContent = pct + "%";
    textEl.textContent = `${done} de ${total} ações`;
    msgEl.textContent = message(done, total);
    msgEl.classList.toggle("is-done", done === total);
  }

  checks.forEach((c) => c.addEventListener("change", () => { saveChecks(); updateProgress(); }));
  $("#check-reset").addEventListener("click", () => {
    checks.forEach((c) => { c.checked = false; });
    saveChecks();
    updateProgress();
  });

  loadChecks();
  updateProgress();
})();
