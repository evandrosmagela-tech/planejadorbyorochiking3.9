// ==UserScript==
// @name         OROCHIKING - Painel Unificado
// @namespace    orochiking.painel
// @version      36.0
// @description  Painel único (preto/dourado) OROCHIKING. Abre no Assistente de Saque, navega e ativa cada script no lugar certo (com confirmação de 1 clique pra não cair no bloqueio de popup), com monitor de captcha (alerta visual + sonoro contínuo).
// @match        https://*/game.php*
// @match        http://*/game.php*
// @include      *://*.tribalwars.com.br/*
// @include      *://tribalwars.com.br/*
// @include      *://*.tribalwars.net/*
// @include      *://tribalwars.net/*
// @include      *://*.tribalwars.com.pt/*
// @include      *://tribalwars.com.pt/*
// @include      *://*.tribalwars.co.uk/*
// @include      *://tribalwars.co.uk/*
// @include      *://*.tribalwars.us/*
// @include      *://tribalwars.us/*
// @include      *://*.tribalwars.nl/*
// @include      *://tribalwars.nl/*
// @include      *://*.tribalwars.se/*
// @include      *://tribalwars.se/*
// @include      *://*.tribalwars.no/*
// @include      *://tribalwars.no/*
// @include      *://*.tribalwars.dk/*
// @include      *://tribalwars.dk/*
// @include      *://*.tribalwars.gr/*
// @include      *://tribalwars.gr/*
// @include      *://*.tribalwars.ae/*
// @include      *://tribalwars.ae/*
// @include      *://*.tribalwars.ch/*
// @include      *://tribalwars.ch/*
// @include      *://*.tribalwars.it/*
// @include      *://tribalwars.it/*
// @include      *://*.tribalwars.cz/*
// @include      *://tribalwars.cz/*
// @include      *://*.tribalwars.ro/*
// @include      *://tribalwars.ro/*
// @include      *://*.tribalwars.hu/*
// @include      *://tribalwars.hu/*
// @include      *://*.tribalwars.lt/*
// @include      *://tribalwars.lt/*
// @include      *://*.tribalwars.lv/*
// @include      *://tribalwars.lv/*
// @include      *://*.tribalwars.ee/*
// @include      *://tribalwars.ee/*
// @include      *://*.tribalwars.bg/*
// @include      *://tribalwars.bg/*
// @include      *://*.tribalwars.hr/*
// @include      *://tribalwars.hr/*
// @include      *://*.tribalwars.rs/*
// @include      *://tribalwars.rs/*
// @include      *://*.tribalwars.si/*
// @include      *://tribalwars.si/*
// @include      *://*.tribalwars.com.es/*
// @include      *://tribalwars.com.es/*
// @include      *://*.tribalwars.com.tr/*
// @include      *://tribalwars.com.tr/*
// @include      *://*.tribalwars.co.il/*
// @include      *://tribalwars.co.il/*
// @include      *://*.tribalwars.asia/*
// @include      *://tribalwars.asia/*
// @include      *://*.tribalwars.works/*
// @include      *://tribalwars.works/*
// @include      *://*.die-staemme.de/*
// @include      *://die-staemme.de/*
// @include      *://*.staemme.ch/*
// @include      *://staemme.ch/*
// @include      *://*.plemiona.pl/*
// @include      *://plemiona.pl/*
// @include      *://*.guerretribale.fr/*
// @include      *://guerretribale.fr/*
// @include      *://*.guerrastribales.es/*
// @include      *://guerrastribales.es/*
// @include      *://*.tribals.it/*
// @include      *://tribals.it/*
// @include      *://*.divokekmeny.cz/*
// @include      *://divokekmeny.cz/*
// @include      *://*.divoke-kmene.sk/*
// @include      *://divoke-kmene.sk/*
// @include      *://*.triburile.ro/*
// @include      *://triburile.ro/*
// @include      *://*.klanhaboru.hu/*
// @include      *://klanhaboru.hu/*
// @include      *://*.fyletikesmaxes.gr/*
// @include      *://fyletikesmaxes.gr/*
// @include      *://*.stamkrig.dk/*
// @include      *://stamkrig.dk/*
// @include      *://*.stammekrigen.no/*
// @include      *://stammekrigen.no/*
// @include      *://*.heimot.fi/*
// @include      *://heimot.fi/*
// @include      *://*.gentys.lt/*
// @include      *://gentys.lt/*
// @include      *://*.ciltis.lv/*
// @include      *://ciltis.lv/*
// @include      *://*.vojnaplemen.si/*
// @include      *://vojnaplemen.si/*
// @include      *://*.klanlar.org/*
// @include      *://klanlar.org/*
// @include      *://*.voynaplemyon.com/*
// @include      *://voynaplemyon.com/*
// @include      *://*.tribalwars2.com/*
// @include      *://tribalwars2.com/*
// @run-at       document-idle
// @grant        none
// @updateURL    https://raw.githubusercontent.com/evandrosmagela-tech/planejadorbyorochiking3.9/refs/heads/main/planejadororochiking.js
// @downloadURL  https://raw.githubusercontent.com/evandrosmagela-tech/planejadorbyorochiking3.9/refs/heads/main/planejadororochiking.js
// ==/UserScript==

(function () {

  /* ============================================================
     DISFARCE DE FUNÇÕES NATIVAS

     O painel precisa trocar o fetch e o XMLHttpRequest do navegador
     (é assim que o monitor de captcha enxerga as respostas). O
     problema: uma função trocada se entrega numa linha de código —
     normalmente fetch.toString() devolve "function fetch() { [native
     code] }", e a nossa devolvia o nosso código-fonte inteiro.

     Aqui a gente faz as funções trocadas responderem exatamente como
     as nativas responderiam, inclusive na verificação mais robusta
     (Function.prototype.toString.call(fn)), que ignora o toString
     próprio da função. E a própria troca do toString também se
     disfarça, pra não virar um rastro novo.
  ============================================================ */
  var disfarcarComoNativa = (function () {
    var textoNativo = new WeakMap();
    var toStringOriginal = Function.prototype.toString;

    function toStringDisfarcado() {
      if (textoNativo.has(this)) { return textoNativo.get(this); }
      return toStringOriginal.call(this);
    }
    textoNativo.set(toStringDisfarcado, 'function toString() { [native code] }');

    try {
      Object.defineProperty(Function.prototype, 'toString', {
        value: toStringDisfarcado, writable: true, configurable: true, enumerable: false
      });
    } catch (e) {}

    return function (fn, nome) {
      try {
        textoNativo.set(fn, 'function ' + nome + '() { [native code] }');
        Object.defineProperty(fn, 'name', { value: nome, configurable: true });
      } catch (e) {}
      return fn;
    };
  })();

  /* ============================================================
     LIMPEZA DO RASTRO DA INJEÇÃO

     O loader do Tampermonkey injeta o painel numa tag <script
     id="ork-painel-script"> e ela ficava no HTML pra sempre —
     qualquer script do jogo acharia com uma busca simples. Como o
     código já está rodando nessa altura, a tag não serve pra mais
     nada: removemos. (O loader não muda; é o painel que limpa.)
  ============================================================ */
  try {
    var tagInjecao = document.getElementById('ork-painel-script');
    if (tagInjecao && tagInjecao.parentNode) { tagInjecao.parentNode.removeChild(tagInjecao); }
  } catch (e) {}

  /* ============================================================
     ESCONDER AS VARIÁVEIS GLOBAIS DO PAINEL

     O painel usa ~23 variáveis globais com prefixo __ORK_ e
     __OROCHIKING_ (estado do freio, do captcha, do loop, etc.).
     Qualquer script que listasse as propriedades da janela
     (Object.keys(window)) veria todas elas, com um nome que
     identifica o painel na hora.

     Aqui elas viram "não enumeráveis": continuam funcionando
     exatamente igual pra leitura e escrita, só param de aparecer
     nessas listagens. A varredura se repete de tempos em tempos
     porque algumas variáveis só nascem depois (quando você ativa
     uma ferramenta). É tudo local — não gera nenhuma requisição.
  ============================================================ */
  (function esconderGlobais() {
    var padrao = /^__(ORK|OROCHIKING|FarmHard)/;
    function varrer() {
      try {
        var nomes = Object.getOwnPropertyNames(window);
        for (var i = 0; i < nomes.length; i++) {
          if (!padrao.test(nomes[i])) { continue; }
          var d = Object.getOwnPropertyDescriptor(window, nomes[i]);
          if (!d || !d.enumerable || !d.configurable) { continue; }
          if (!('value' in d)) { continue; } // só propriedades comuns, não getters
          Object.defineProperty(window, nomes[i], {
            value: d.value, writable: true, configurable: true, enumerable: false
          });
        }
      } catch (e) {}
    }
    varrer();
    setTimeout(varrer, 2000);
    setInterval(varrer, 8000);
  })();

  /* ============================================================
     MARCADOR DE VERSÃO
     Serve pra você conferir, em 2 segundos, qual versão está realmente
     rodando — sem depender de adivinhar se o GitHub já propagou.
     No Console (F12) digite:  __ORK_VERSAO__
  ============================================================ */
  window.__ORK_VERSAO__ = 51;

  /* ============================================================
     NOVIDADES / CHANGELOG

     Pra avisar cada pessoa uma única vez quando você sobe uma versão
     nova no GitHub. Como funciona:
       - Cada entrada tem um "id" único (use a data, fica fácil).
       - Na primeira vez que a pessoa abre o painel depois da atualização,
         aparece o popup com as novidades que ela ainda não viu.
       - Ela fecha no X, fica marcado como visto, e nunca mais aparece
         — até você adicionar uma entrada nova com um id novo.

     PRA ANUNCIAR UMA ATUALIZAÇÃO NOVA: adicione um objeto no TOPO da
     lista abaixo (o mais recente primeiro), com id/data/itens. Só isso.
  ============================================================ */
  var ORK_NOVIDADES = [
    {
      id: '2026-09-25-farm-distancia',
      data: '25/09/2026',
      titulo: 'Farm Hard volta a priorizar a distância',
      itens: [
        'Corrigido: o Farm Hard estava escolhendo sempre a bárbara mais RICA, mesmo longe, e deixava de atacar as de perto.',
        'Agora (padrão) ele ataca a mais PERTO que passa nos filtros de recurso — se a de perto não tem recurso suficiente, vai pra próxima. Igual era antes.',
        'O botão "Farmar N1-N8" virou "💰 Priorizar a mais rica" (desligado): só ligue se quiser atacar a mais rica mesmo que esteja longe.'
      ]
    },
    {
      id: '2026-09-25-247-v2',
      data: '25/09/2026',
      titulo: 'Automatização 24/7: Balanceador + Farm Player',
      itens: [
        'Modo 🌾 Farm: agora dá pra ligar/desligar a Cunhagem e o Balanceador dentro do ciclo (Farm → Cunhagem → Balanceador → Pausa).',
        'Novo modo ⚔️ Farm Player: repete sozinho o ataque salvo no Ataque Mass (tropas, alvos e aldeias atacantes), com intervalo sorteado.',
        'Se a sessão cair, ele reloga, reabre o Ataque e continua o loop nas mesmas coordenadas.',
        'A configuração do 24/7 agora fica salva só na aba em que você ativou (fechou a aba, configura de novo). Se estava rodando antes da atualização, ative de novo.'
      ]
    },
    {
      id: '2026-09-24-balanceador',
      data: '24/09/2026',
      titulo: 'Nova ferramenta: Balanceador Hard',
      itens: [
        'Nova aba Balancear: equilibra os recursos entre suas aldeias pelo mercado, sozinho, sem clicar em enviar.',
        'Mesma lógica do Resources Balancer: fator de média, clusters por região e recursos pra construção do Gerente de Conta.',
        'Envia com 1 a 3s aleatórios entre cada aldeia e repete no intervalo que você escolher. Roda de qualquer tela.',
        'Botão "Calcular (sem enviar)" mostra antes o total, a média, o excedente, o déficit e quem vai receber.'
      ]
    },
    {
      id: '2026-09-24-auto247',
      data: '24/09/2026',
      titulo: 'Nova ferramenta: Automatização 24/7',
      itens: [
        'Nova aba 24/7: farma, cunha e descansa sozinho, em ciclo, numa aba só.',
        'Farm Hard no preset que você escolher (padrão 1.5x + Normal) por 2-3 min, depois cunhagem em todas as páginas, depois pausa configurável.',
        'Todos os tempos são sorteados em milissegundos. Captcha: tudo espera e continua sozinho quando você resolver.',
        'Opcional: deslogar e relogar a cada N ciclos (precisa do script OROCHIKING Relogin no Tampermonkey).'
      ]
    },
    {
      id: '2026-09-24-keypress-fundo',
      data: '24/09/2026',
      titulo: 'Nova ferramenta: KeyPress Hard (roda em segundo plano)',
      itens: [
        'Nova aba KeyPress: manda os modelos A, B ou C do Assistente de Saque sozinho — não precisa ficar na tela do Assistente, roda de qualquer tela.',
        'Modelo A + B: manda o A enquanto tiver tropa e o que sobrar vai no B, na mesma passada. Ou escolha só B ou só C.',
        'Passa por todas as páginas do Assistente enquanto tiver tropa e repete no intervalo que você escolher (sempre com atraso aleatório). Com várias abas abertas, só uma executa.',
        'Bolinha ⌨️ no canto mostra a contagem pro próximo ciclo — clique nela pra parar. Para sozinho se aparecer captcha.'
      ]
    },
    {
      id: '2026-09-23-farmhard-layout',
      data: '23/09/2026',
      titulo: 'Farm Hard com painel novo, mais compacto',
      itens: [
        'O popup do Farm Hard ficou largo e baixo (2 colunas) — não tapa mais a tela de cima a baixo.',
        'Novo botão de minimizar (–) no topo: deixa só a barra com o status visível enquanto farma.',
        'As explicações dos filtros e modos agora aparecem ao passar o mouse em cima de cada um.'
      ]
    },
    {
      id: '2026-09-23-modo-n',
      data: '23/09/2026',
      titulo: 'Botão Farmar N1-N8 (mundos N)',
      itens: [
        'Novo botão no Farm Hard: Farmar N1-N8. Ligado, prioriza a bárbara mais PERTO (distância do próprio Assistente) — ideal pros mundos N.',
        'Desligado (padrão), continua priorizando recurso, igual sempre foi nas rodadas de conquistador. Nada muda pra elas.',
        'Todos os outros filtros (CL, CP, recurso mínimo) valem igual nos dois modos.'
      ]
    },
    {
      id: '2026-09-22-mundonovo',
      data: '22/09/2026',
      titulo: 'Farm Hard funciona em qualquer rodada',
      itens: [
        'Corrigido: o Farm Hard agora funciona em mundos/rodadas recém-abertos, onde algumas bárbaras ainda não têm o botão C — antes uma delas travava o farm inteiro.',
        'Ataca no C qualquer bárbara válida, com ou sem muralha, em qualquer configuração de mundo. Sem precisar ligar nada.'
      ]
    },
    {
      id: '2026-09-22-freio-coord',
      data: '22/09/2026',
      titulo: 'Modo Freio turbinado (farm + cunhagem)',
      itens: [
        'No Modo Freio, o farm e a cunhagem agora se coordenam: a cunhagem só roda nas pausas do farm, pra nunca dispararem requisição ao mesmo tempo (o que mais gera captcha).',
        'No Freio, o Farm Hard roda em 1.25x com pausas automáticas (Ritmo Humano ligado junto).',
        'Menos requisição simultânea = bem menos risco de captcha rodando os dois a noite toda.'
      ]
    },
    {
      id: '2026-09-22-cunhagem',
      data: '22/09/2026',
      titulo: 'Cunhagem numa aba só',
      itens: [
        'A cunhagem agora passa sozinha por todas as páginas de aldeias (de 1.000 em 1.000) numa aba só — não precisa mais abrir uma aba por página.',
        'Cada página é cunhada com um intervalo aleatório entre elas, pra reduzir o risco de captcha.',
        'Continua na bolinha discreta no canto: clica pra parar.'
      ]
    },
    {
      id: '2026-09-21',
      data: '21/09/2026',
      titulo: 'Farm Hard turbinado + Ritmo Humano',
      itens: [
        'Ritmo Humano: o Farm Hard agora pode rodar em blocos com pausas curtas e aleatórias, pra reduzir o risco de captcha.',
        'Farm Hard escolhe a bárbara mais rica e não repete ataque na mesma (mais recurso por ataque).',
        'Novos filtros no Farm Hard: CL mínima, CP mínima (mescláveis) e recurso mínimo da bárbara.',
        'Botão FREIO no painel: modo de baixo risco pra deixar rodando de madrugada.'
      ]
    }
  ];

  function orkNovidadeNaoVista() {
    // A entrada mais recente é sempre a PRIMEIRA da lista. Só mostramos ela —
    // se a pessoa ainda não a viu. Assim nunca aparecem vários popups em sequência
    // pra quem pulou algumas versões: mostra só a última novidade.
    if (!ORK_NOVIDADES.length) { return null; }
    var maisRecente = ORK_NOVIDADES[0];
    var vista = false;
    try { vista = localStorage.getItem('ork_novidade_vista_' + maisRecente.id) === '1'; } catch (e) {}
    return vista ? null : maisRecente;
  }

  // Ao fechar, marca a atual E todas as anteriores como vistas, pra elas nunca
  // aparecerem depois (a pessoa já está vendo a versão mais nova).
  function orkMarcarTodasVistas() {
    for (var i = 0; i < ORK_NOVIDADES.length; i++) {
      try { localStorage.setItem('ork_novidade_vista_' + ORK_NOVIDADES[i].id, '1'); } catch (e) {}
    }
  }

  function orkMostrarNovidade(n) {
    if (!n || document.getElementById('ork-novidade-overlay')) { return; }

    var estilo = document.createElement('style');
    estilo.id = 'ork-novidade-estilo';
    estilo.textContent =
      '#ork-novidade-overlay{position:fixed;inset:0;background:rgba(0,0,0,.62);z-index:2147483000;' +
      'display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}' +
      '#ork-novidade-card{width:340px;max-width:92vw;max-height:82vh;overflow:auto;' +
      'background:linear-gradient(165deg,rgba(26,26,26,.98),rgba(8,8,8,.99));' +
      'border:1px solid rgba(255,196,0,.18);border-radius:16px;' +
      'box-shadow:0 24px 60px rgba(0,0,0,.7);color:#ececec;' +
      "font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,Arial,sans-serif}" +
      '#ork-novidade-head{background:linear-gradient(100deg,#e8ac0a,#ffdc63 50%,#e8ac0a);color:#1a1400;' +
      'padding:13px 15px;display:flex;align-items:center;justify-content:space-between;font-weight:800}' +
      '#ork-novidade-head .ork-nv-tag{font-size:14px;letter-spacing:.5px;text-transform:uppercase}' +
      '#ork-novidade-x{cursor:pointer;width:24px;height:24px;border-radius:50%;background:rgba(0,0,0,.12);' +
      'display:flex;align-items:center;justify-content:center;font-size:15px;transition:background .15s}' +
      '#ork-novidade-x:hover{background:rgba(0,0,0,.28)}' +
      '#ork-novidade-body{padding:15px 16px}' +
      '#ork-novidade-data{font-size:10.5px;color:#8a8a8a;margin-bottom:3px}' +
      '#ork-novidade-titulo{font-size:14px;font-weight:800;color:#ffd84d;margin-bottom:11px}' +
      '#ork-novidade-lista{list-style:none;margin:0;padding:0}' +
      '#ork-novidade-lista li{position:relative;padding:0 0 9px 18px;font-size:12px;line-height:1.5;color:#ddd}' +
      '#ork-novidade-lista li:before{content:"›";position:absolute;left:3px;top:-1px;color:#e8ac0a;font-weight:800}' +
      '#ork-novidade-btn{width:100%;margin-top:6px;padding:10px;border:none;border-radius:10px;' +
      'background:linear-gradient(100deg,#e8ac0a,#ffdc63);color:#1a1400;font-weight:800;font-size:12px;' +
      'cursor:pointer;letter-spacing:.4px;text-transform:uppercase}' +
      '#ork-novidade-btn:hover{filter:brightness(1.07)}';
    document.head.appendChild(estilo);

    var itensHtml = '';
    for (var i = 0; i < n.itens.length; i++) {
      var li = document.createElement('li');
      li.textContent = n.itens[i]; // textContent = seguro, nada de HTML injetado
      itensHtml += li.outerHTML;
    }

    var overlay = document.createElement('div');
    overlay.id = 'ork-novidade-overlay';
    overlay.innerHTML =
      '<div id="ork-novidade-card">' +
        '<div id="ork-novidade-head"><span class="ork-nv-tag">✨ Nova atualização</span>' +
        '<span id="ork-novidade-x">&times;</span></div>' +
        '<div id="ork-novidade-body">' +
          '<div id="ork-novidade-data">OROCHIKING • ' + n.data + '</div>' +
          '<div id="ork-novidade-titulo"></div>' +
          '<ul id="ork-novidade-lista">' + itensHtml + '</ul>' +
          '<button id="ork-novidade-btn">Entendi, fechar</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    // titulo via textContent (evita qualquer HTML no que você digita)
    overlay.querySelector('#ork-novidade-titulo').textContent = n.titulo;

    function fechar() {
      orkMarcarTodasVistas();
      try { overlay.remove(); estilo.remove(); } catch (e) {}
    }
    overlay.querySelector('#ork-novidade-x').addEventListener('click', fechar);
    overlay.querySelector('#ork-novidade-btn').addEventListener('click', fechar);
    // clicar fora do card também fecha (conta como visto)
    overlay.addEventListener('click', function (e) { if (e.target === overlay) { fechar(); } });
  }

  console.log('%c[OROCHIKING] Painel v' + (window.__ORK_VERSAO__ || '?') + ' carregado', 'background:#e8ac0a;color:#1a1400;font-weight:bold;padding:2px 6px;border-radius:3px');

  /* ============================================================
     FORA DO JOGO (a sessão caiu e fomos parar na tela de
     login/seleção de mundo): tenta relogar sozinho e para por
     aqui — nada do resto do painel roda sem game_data.
  ============================================================ */
  if (typeof game_data === 'undefined') {
    (function orkRelogarNaTelaDeLogin() {
      // Só age se a Automatização 24/7 pediu (cookie ork_relogin) ou está ativa
      // (cookie ork_auto247_mundo). Logout manual sem automação = não faz nada.
      function lerCookie(n) {
        var m = document.cookie.match(new RegExp('(?:^|; )' + n + '=([^;]*)'));
        return m ? decodeURIComponent(m[1]) : '';
      }
      var mundo = (lerCookie('ork_relogin') || lerCookie('ork_auto247_mundo')).toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!mundo) { return; }
      // casa o mundo EXATO: br14 não pode casar com br144, brc1 não casa com brc12
      var reMundo = new RegExp('/page/(join|play)/' + mundo + '(?![a-z0-9])');
      var reMundoSolto = new RegExp('(^|[^a-z0-9])' + mundo + '(?![a-z0-9])');
      if (window.__ORK_RELOGIN_AGENDADO__) { return; }
      window.__ORK_RELOGIN_AGENDADO__ = true;
      // proteção contra loop: no máximo 3 tentativas a cada 10 minutos nesta aba
      var hist = [];
      try { hist = JSON.parse(sessionStorage.getItem('ork_relogin_tentativas') || '[]'); } catch (e) {}
      var agora = Date.now();
      hist = hist.filter(function (t) { return agora - t < 600000; });
      if (hist.length >= 3) { console.warn('[OROCHIKING] Relogin: 3 tentativas em 10 min, parei pra não entrar em loop.'); return; }
      setTimeout(function () {
        try { hist = JSON.parse(sessionStorage.getItem('ork_relogin_tentativas') || '[]').filter(function (t) { return Date.now() - t < 600000; }); } catch (e) { hist = []; }
        if (hist.length >= 3) { return; }
        hist.push(Date.now());
        try { sessionStorage.setItem('ork_relogin_tentativas', JSON.stringify(hist)); } catch (e) {}
        var caminho = window.location.pathname;
        var naPaginaDoMundo = reMundo.test(caminho);
        // 1) já estamos na página de entrada do mundo (ex: /page/join/brs1):
        //    clica no botão de entrar/jogar dela, sem recarregar a mesma página
        if (naPaginaDoMundo) {
          var cands = document.querySelectorAll('button, input[type="submit"], a.btn, a.button, a[href], .btn');
          for (var k = 0; k < cands.length; k++) {
            var el = cands[k];
            if (el.offsetParent === null) { continue; }
            var txt = ((el.textContent || '') + ' ' + (el.value || '')).trim().toLowerCase();
            var href = el.getAttribute('href') || '';
            if (href && href.indexOf(caminho) !== -1) { continue; } // link pra própria página
            var botaoEntrar = el.tagName !== 'A' || /btn|button/.test(el.className || '');
            if ((botaoEntrar && /jogar|entrar|login|play|join|participar|iniciar|jouer|connexion/.test(txt)) || (reMundoSolto.test(href) && href.indexOf('game.php') !== -1)) {
              console.log('[OROCHIKING] Relogin: na página do mundo, clicando em "' + txt.slice(0, 30) + '".');
              el.click();
              return;
            }
          }
          var senhaM = document.querySelector('input[type="password"]');
          if (senhaM && senhaM.form) {
            var sub = senhaM.form.querySelector('[type="submit"], .btn-login');
            if (sub) { console.log('[OROCHIKING] Relogin: clicando em Entrar (senha salva).'); sub.click(); return; }
          }
          console.warn('[OROCHIKING] Relogin: estou em ' + caminho + ' mas não achei o botão de entrar. Manda um print desta tela.');
          return;
        }
        // 2) botão/link do mundo na lista (senha salva / já logado no site)
        var links = document.querySelectorAll('a[href]');
        for (var i = 0; i < links.length; i++) {
          var h = links[i].getAttribute('href') || '';
          if (reMundo.test(h)) {
            console.log('[OROCHIKING] Relogin: entrando em ' + mundo + ' pelo botão do mundo.');
            links[i].click();
            return;
          }
        }
        // 3) formulário de login com senha salva: clica em entrar
        var senha = document.querySelector('input[type="password"]');
        var entrar = senha && senha.form ? senha.form.querySelector('[type="submit"], a.btn-login, .btn-login') : null;
        if (senha && entrar) {
          console.log('[OROCHIKING] Relogin: clicando em Entrar (senha salva do navegador).');
          entrar.click();
          return;
        }
        // 4) endereço de entrada do mundo (formato confirmado no Speed: /page/join/brs1)
        console.log('[OROCHIKING] Relogin: abrindo /page/join/' + mundo);
        window.location.href = '/page/join/' + mundo;
      }, 3000 + Math.floor(Math.random() * 3001));
    })();
    return;
  }

  if (typeof $ === 'undefined') { return; }

  try {
    var __partesHost = window.location.hostname.split('.');
    var __dominioBase = __partesHost.slice(1).join('.');
    var __mundoAtual = (window.game_data && window.game_data.world) ? window.game_data.world : __partesHost[0];
    if (__dominioBase && __mundoAtual) {
      localStorage.setItem('ork_mundo_' + __dominioBase, __mundoAtual);
      sessionStorage.removeItem('ork_tentando_relogar');
    }
  } catch (e) {}

  /* ============================================================
     LIBERAÇÃO DE ACESSO

     Modo principal: LICENÇA. O loader do Tampermonkey valida o nick
     contra o licenses.json do GitHub e injeta aqui o resultado em
     window.__ORK_LICENCA_OK__ (true/false), junto com
     window.__ORK_LICENCA_INFO__ (texto "Licenciado: nick — válido até ...").

     Modo reserva: se essa variável não existir, é porque o painel foi
     carregado SEM o loader de licença (ex: colado direto no Tampermonkey
     ou aberto por bookmarklet). Nesse caso volta pra lista fixa de nicks,
     pra não quebrar quem usa assim.

     Importante: o trecho de relogin automático roda ANTES daqui de
     propósito — mesmo sem licença válida, a sessão consegue se recuperar
     sozinha; o loader revalida a licença quando a página recarregar.
  ============================================================ */
  var NICKS_LIBERADOS = ['Orochi.2009', 'Juniro1717', 'Jordy Alba', 'Bleda', 'EliteTeam5', 'Mr-magg'];

  function nickAtual() {
    try {
      return (game_data.player && game_data.player.name) ? String(game_data.player.name).trim() : '';
    } catch (e) { return ''; }
  }

  function temLoaderDeLicenca() {
    try { return typeof window.__ORK_LICENCA_OK__ !== 'undefined'; } catch (e) { return false; }
  }

  function acessoLiberado() {
    if (temLoaderDeLicenca()) {
      try { return window.__ORK_LICENCA_OK__ === true; } catch (e) { return false; }
    }
    var nick = nickAtual().toLowerCase();
    return NICKS_LIBERADOS.some(function (n) { return n.toLowerCase() === nick; });
  }

  function textoLicenca() {
    try {
      if (window.__ORK_LICENCA_INFO__) { return String(window.__ORK_LICENCA_INFO__); }
    } catch (e) {}
    return '';
  }

  if (!acessoLiberado()) {
    console.warn('[OROCHIKING] Painel bloqueado: ' +
      (temLoaderDeLicenca() ? 'licença não liberada para este nick.' : 'nick fora da lista local.'));
    return;
  }

  /* ============================================================
     MANTER A ABA ATIVA EM SEGUNDO PLANO

     O Chrome e outros navegadores, de propósito, "atrasam" o setTimeout/
     setInterval de uma aba em segundo plano (minimizada ou em outra aba
     do navegador) pra economizar bateria/CPU — depois de alguns minutos
     em segundo plano, o navegador pode deixar até 1 MINUTO entre uma
     chamada e outra, mesmo configurado pra rodar a cada poucos segundos.
     É exatamente por isso que a Cunhagem (e qualquer timer do painel)
     ficava atrasada só quando a aba não estava em foco.

     A técnica pra evitar isso é tocar um som praticamente inaudível sem
     parar: navegadores tratam abas "tocando algo" como abas ativas de
     verdade e NÃO aplicam esse limite, porque cortar o áudio no meio
     seria perceptível pro usuário. Isso vale pra TODOS os timers do
     painel (Farm Hard, loop do Ataque, Cunhar Moedas, Coletor Hard
     Farming, monitor de sessão, monitor de captcha) — não precisa
     mexer em cada um separadamente.
  ============================================================ */
  (function manterAbaAtivaEmSegundoPlano() {
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) { return; }
      var ctx = new AudioCtx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      gain.gain.value = 0.00001; // praticamente inaudível
      osc.frequency.value = 20;  // abaixo do que o ouvido humano capta
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(0);

      // Navegadores exigem uma interação do usuário pra "destravar" áudio
      // (política de autoplay) — o AudioContext nasce suspenso até isso
      // acontecer. Qualquer clique/tecla no painel já serve pra destravar.
      function tentarRetomar() {
        if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
          ctx.resume().catch(function () {});
        }
      }
      tentarRetomar();
      ['click', 'keydown', 'touchstart'].forEach(function (evento) {
        document.addEventListener(evento, tentarRetomar, { passive: true });
      });
      // se o navegador suspender nele de novo com o tempo, insiste sozinho
      setInterval(tentarRetomar, 15000);

      window.__ORK_ABA_ATIVA__ = true;
      console.log('[OROCHIKING] Mantendo a aba ativa em segundo plano — timers não devem mais atrasar quando minimizada.');
    } catch (e) {
      console.warn('[OROCHIKING] não consegui ativar o "manter aba ativa":', e);
    }
  })();

  /* ============================================================
     COLETOR HARD FARMING — ícone flutuante sempre disponível

     Diferente dos outros coletores (que precisam de uma tela específica,
     tipo o Mapa), esse script busca tudo sozinho por trás dos panos (via
     fetch), então não depende de estar em nenhuma tela em particular.
     Por isso ele não vira uma aba com "Ativar" — o próprio ícone
     dourado fica flutuando no canto da tela o tempo todo, em qualquer
     lugar do jogo, exatamente como no popup original que você mandou.
  ============================================================ */
  try {
    (function () {
    
      if (typeof window.game_data === 'undefined' || !window.game_data || !window.game_data.village) return;
      if (window.__OROCHIKING_COLETOR__) return;
      window.__OROCHIKING_COLETOR__ = true;
    
      const game_data = window.game_data;
    
      const CONFIG_PADRAO = {
        ativo: false,
        grupo: '0',
        raio: 20,
        maxPorOrigem: 10,
        pontosMin: 0,
        pontosMax: 12500,
        modelo: 'a',
        pausa: 250,
        detalhado: false,
        repetirAlvo: false,
        pularAssistente: true,
        pularEmVoo: true,
        repetir: false,
        intervalo: 30,
        aberto: true,
        pos: null,
      };
    
      const CHAVE_CONFIG = 'orochiking_cfg_' + location.host;
      const UNIDADES = ['spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy', 'ram', 'catapult', 'knight'];
    
      let cfg = carregarConfig();
      let parar = false;
      let rodando = false;
      let timerAuto = null;
      let motivoFim = '';
    
      const dorme = (ms) => new Promise((r) => setTimeout(r, ms));
      const dist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    
      function carregarConfig() {
        try {
          const salvo = JSON.parse(localStorage.getItem(CHAVE_CONFIG) || '{}');
          return Object.assign({}, CONFIG_PADRAO, salvo && typeof salvo === 'object' ? salvo : {});
        } catch (e) { return Object.assign({}, CONFIG_PADRAO); }
      }
    
      function salvarConfig() {
        try { localStorage.setItem(CHAVE_CONFIG, JSON.stringify(cfg)); } catch (e) { /* quota */ }
      }
    
      // ============================================================
      // INTERFACE COM DESIGN OROCHIKING
      // ============================================================
      const LOGO_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
        + '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
      const FECHAR_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18 M6 6 18 18"/></svg>';
      const ENGRENAGEM_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.12 2.12l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m2.12-2.12l4.24-4.24M19.78 19.78l-4.24-4.24m-2.12-2.12l-4.24-4.24"/></svg>';
    
      const host = document.createElement('div');
      host.id = 'orochiking_host';
      host.style.cssText = 'position:fixed;z-index:2147483000;top:0;left:0;width:0;height:0;';
      document.body.appendChild(host);
      const raiz = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
    
      raiz.innerHTML = `
    <style>
      :host, * { box-sizing: border-box; }
    
      .btn-flutuante {
        position: fixed; right: 20px; bottom: 20px; width: 54px; height: 54px; border-radius: 50%;
        background: linear-gradient(100deg,#e8ac0a,#ffdc63 50%,#e8ac0a);
        color: #1a1400; border: 1px solid rgba(255,196,0,.35); cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 10px 26px rgba(0,0,0,.5), 0 0 0 1px rgba(0,0,0,.35);
        font-family: 'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,Arial,sans-serif;
        font-weight: 800; transition: all .2s ease;
      }
      .btn-flutuante:hover { transform: scale(1.07); box-shadow: 0 12px 30px rgba(0,0,0,.6); }
      .btn-flutuante svg { width: 26px; height: 26px; }
      .btn-flutuante.on { animation: pulse 1.8s infinite; }
    
      @keyframes pulse {
        0%, 100% { box-shadow: 0 10px 26px rgba(0,0,0,.5), 0 0 0 1px rgba(0,0,0,.35); }
        50% { box-shadow: 0 10px 26px rgba(0,0,0,.5), 0 0 0 6px rgba(232,172,10,.35); }
      }
    
      .painel {
        position: fixed; right: 20px; bottom: 84px; width: 340px;
        background: linear-gradient(165deg, rgba(26,26,26,.97), rgba(8,8,8,.98));
        backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        color: #ececec; border: 1px solid rgba(255,196,0,.16); border-radius: 16px;
        box-shadow: 0 24px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(0,0,0,.4);
        font: 12px/1.5 'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,Arial,sans-serif;
        overflow: hidden;
      }
    
      .cabecalho {
        background: linear-gradient(100deg,#e8ac0a,#ffdc63 50%,#e8ac0a);
        color: #1a1400; padding: 12px 14px; cursor: move; user-select: none;
        display: flex; align-items: center; gap: 10px;
        box-shadow: 0 1px 0 rgba(255,255,255,.35) inset;
        font-weight: 800; font-size: 12.5px; text-transform: uppercase; letter-spacing: 1px;
      }
    
      .cabecalho svg { width: 17px; height: 17px; flex-shrink: 0; }
    
      .titulo { flex: 1; }
    
      .fechar { width: 22px; height: 22px; border: 0; border-radius: 50%; background: rgba(0,0,0,.08); color: #1a1400;
        cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center;
        transition: background .15s ease; }
      .fechar:hover { background: rgba(0,0,0,.22); }
    
      .fechar svg { width: 15px; height: 15px; }
    
      .corpo { padding: 14px; max-height: 65vh; overflow-y: auto; }
    
      .secao-titulo { margin: 16px 0 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px;
        color: #ffd84d; font-weight: 800; padding-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,.08); }
    
      .linha { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
    
      .linha label { color: #bbb; font-size: 11px; }
    
      input[type=text], input[type=number], select {
        width: 110px; background: #111; color: #ececec; border: 1px solid rgba(255,255,255,.12); border-radius: 7px;
        padding: 6px 8px; font: inherit; text-align: right; font-weight: 600;
      }
    
      select { text-align: left; }
    
      input[type=text]:focus, input[type=number]:focus, select:focus {
        outline: none; border-color: #e8ac0a;
      }
    
      .chave { display: flex; align-items: center; gap: 8px; margin: 8px 0; cursor: pointer; color: #bbb; font-size: 11px; }
    
      .chave input { accent-color: #e8ac0a; cursor: pointer; }
    
      .mestre {
        background: rgba(255,255,255,.035); border: 1px solid rgba(255,255,255,.075); border-radius: 12px;
        padding: 11px 13px; margin-bottom: 12px;
      }
    
      .mestre strong { color: #ffd84d; font-size: 12px; }
    
      .selo { font-size: 9.5px; padding: 3px 10px; border-radius: 20px; background: rgba(255,255,255,.06);
        color: #8a8a8a; font-weight: 800; text-transform: uppercase; letter-spacing: .4px; }
    
      .selo.on { background: #1a1400; color: #ffcf3d; }
    
      .acoes { display: flex; gap: 8px; margin-top: 14px; }
    
      .acoes button {
        flex: 1; padding: 9px 12px; border-radius: 9px; border: 1px solid rgba(255,255,255,.14); cursor: pointer;
        background: #1c1c1c; color: #ffd84d; font: inherit; font-weight: 800; text-transform: uppercase;
        font-size: 10.5px; letter-spacing: .4px; transition: all .15s ease;
      }
    
      .acoes button.primario {
        background: linear-gradient(100deg,#e8ac0a,#ffdc63); color: #1a1400; border-color: transparent;
        box-shadow: 0 6px 16px rgba(232,172,10,.25);
      }
    
      .acoes button:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
    
      .acoes button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    
      .status { margin-top: 12px; font-weight: 700; color: #ffd84d; font-size: 11.5px; padding: 9px 10px;
        background: rgba(232,172,10,.08); border-left: 3px solid #e8ac0a; border-radius: 8px; }
    
      .registro {
        margin-top: 10px; max-height: 180px; overflow-y: auto; background: #111; border: 1px solid rgba(255,255,255,.1);
        border-radius: 9px; padding: 9px; font-size: 10px; white-space: pre-wrap; color: #cbd5e1;
        font-family: 'Consolas', 'Courier New', monospace;
      }
    
      .oculto { display: none !important; }
    
      /* Scrollbar personalizado */
      .corpo::-webkit-scrollbar, .registro::-webkit-scrollbar {
        width: 6px;
      }
      .corpo::-webkit-scrollbar-track, .registro::-webkit-scrollbar-track {
        background: transparent;
      }
      .corpo::-webkit-scrollbar-thumb, .registro::-webkit-scrollbar-thumb {
        background: rgba(232,172,10,.5);
        border-radius: 3px;
      }
      .corpo::-webkit-scrollbar-thumb:hover, .registro::-webkit-scrollbar-thumb:hover {
        background: #ffd84d;
      }
    </style>
    
    <button class="btn-flutuante" id="bolha" title="Coletor Hard Farming">${LOGO_SVG}</button>
    
    <div class="painel oculto" id="painel">
      <div class="cabecalho" id="alca">
        ${ENGRENAGEM_SVG}
        <span class="titulo">COLETOR HARD</span>
        <span class="selo" id="selo">parado</span>
        <button class="fechar" id="fechar">${FECHAR_SVG}</button>
      </div>
      
      <div class="corpo">
        <div class="mestre">
          <strong>🔌 ATIVO</strong>
          <label class="chave" style="margin:4px 0 0;"><input type="checkbox" id="ativo"> Ligar o coletor</label>
        </div>
        
        <div class="secao-titulo">⚔️ Configuração de Farm</div>
        <div class="linha"><label>Grupo de origens</label><input type="text" id="grupo" placeholder="0"></div>
        <div class="linha"><label>Raio de ação (campos)</label><input type="number" id="raio" min="5" max="50"></div>
        <div class="linha"><label>Máx. comandos/origem</label><input type="number" id="maxPorOrigem" min="1" max="100"></div>
        <div class="linha"><label>Template do assistente</label>
          <select id="modelo"><option value="a">Modelo A</option><option value="b">Modelo B</option></select></div>
    
        <div class="secao-titulo">🎯 Filtros de Alvo</div>
        <div class="linha"><label>Pontos mín. da bárbara</label><input type="number" id="pontosMin"></div>
        <div class="linha"><label>Pontos máx. da bárbara</label><input type="number" id="pontosMax"></div>
        <label class="chave"><input type="checkbox" id="repetirAlvo"> Permite múltiplos ataques no mesmo alvo</label>
        <label class="chave"><input type="checkbox" id="pularAssistente"> Pular alvos já no assistente</label>
        <label class="chave"><input type="checkbox" id="pularEmVoo"> Pular alvos com ataque a caminho</label>
    
        <div class="secao-titulo">⏱️ Cronograma</div>
        <div class="linha"><label>Pausa entre comandos (ms)</label><input type="number" id="pausa" min="100" max="5000"></div>
        <label class="chave"><input type="checkbox" id="repetir"> Repetir ciclos automaticamente</label>
        <div class="linha"><label>Intervalo entre ciclos (min)</label><input type="number" id="intervalo" min="5" max="1440"></div>
        <label class="chave"><input type="checkbox" id="detalhado"> Log detalhado de cada comando</label>
    
        <div class="acoes">
          <button class="primario" id="iniciar">▶ INICIAR</button>
          <button id="parar">⏹ PARAR</button>
        </div>
        
        <div class="status" id="status">Pronto para farming. Ative e clique em INICIAR.</div>
        <div class="registro" id="registro"></div>
      </div>
    </div>`;
    
      const $ = (id) => raiz.getElementById(id);
      const painel = $('painel');
      const bolha = $('bolha');
    
      // ============================================================
      // POPULACAO E EVENTOS DA INTERFACE
      // ============================================================
      ['grupo', 'raio', 'maxPorOrigem', 'pontosMin', 'pontosMax', 'pausa', 'intervalo'].forEach((k) => {
        $(k).value = cfg[k];
        $(k).addEventListener('change', () => {
          const v = k === 'grupo' ? String($(k).value).trim() || '0' : parseInt($(k).value, 10);
          cfg[k] = (k === 'grupo') ? v : (Number.isFinite(v) ? v : CONFIG_PADRAO[k]);
          $(k).value = cfg[k];
          salvarConfig();
        });
      });
    
      $('modelo').value = cfg.modelo === 'b' ? 'b' : 'a';
      $('modelo').addEventListener('change', () => { cfg.modelo = $('modelo').value; salvarConfig(); });
    
      ['repetirAlvo', 'pularAssistente', 'pularEmVoo', 'repetir', 'detalhado'].forEach((k) => {
        $(k).checked = !!cfg[k];
        $(k).addEventListener('change', () => {
          cfg[k] = $(k).checked;
          salvarConfig();
          if (k === 'repetir') agendarAuto();
        });
      });
    
      $('ativo').checked = !!cfg.ativo;
      $('ativo').addEventListener('change', () => {
        cfg.ativo = $('ativo').checked;
        salvarConfig();
        if (!cfg.ativo) {
          parar = true;
          cancelarAuto();
          status('❌ Desativado.');
        } else {
          status('✓ Ativo. Clique em INICIAR.');
          agendarAuto();
        }
        refletirEstado();
      });
    
      bolha.addEventListener('click', () => {
        cfg.aberto = painel.classList.contains('oculto');
        aplicarAbertura();
        salvarConfig();
      });
    
      $('fechar').addEventListener('click', () => {
        cfg.aberto = false;
        aplicarAbertura();
        salvarConfig();
      });
    
      $('iniciar').addEventListener('click', () => { if (!rodando) executar(); });
      $('parar').addEventListener('click', () => { parar = true; cancelarAuto(); status('⏹ Parando...'); });
    
      function aplicarAbertura() {
        painel.classList.toggle('oculto', !cfg.aberto);
      }
    
      function refletirEstado() {
        const selo = $('selo');
        if (rodando) {
          selo.textContent = '⚡ RODANDO';
          selo.classList.add('on');
        } else if (cfg.ativo) {
          selo.textContent = '✓ ATIVO';
          selo.classList.add('on');
        } else {
          selo.textContent = 'parado';
          selo.classList.remove('on');
        }
        bolha.classList.toggle('on', cfg.ativo);
        $('iniciar').disabled = !cfg.ativo || rodando;
      }
    
      // Arrasto do painel
      (function arrastar() {
        const alca = $('alca');
        let ox = 0, oy = 0, ativoArrasto = false;
        alca.addEventListener('mousedown', (e) => {
          if (e.target.closest('.fechar')) return;
          const r = painel.getBoundingClientRect();
          ox = e.clientX - r.left;
          oy = e.clientY - r.top;
          ativoArrasto = true;
          e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
          if (!ativoArrasto) return;
          cfg.pos = { x: Math.max(0, e.clientX - ox), y: Math.max(0, e.clientY - oy) };
          posicionar();
        });
        document.addEventListener('mouseup', () => {
          if (ativoArrasto) { ativoArrasto = false; salvarConfig(); }
        });
      })();
    
      function posicionar() {
        if (!cfg.pos) return;
        painel.style.left = cfg.pos.x + 'px';
        painel.style.top = cfg.pos.y + 'px';
        painel.style.right = 'auto';
        painel.style.bottom = 'auto';
      }
    
      function status(txt) { $('status').textContent = txt; }
    
      function log(txt) {
        const el = $('registro');
        el.textContent += txt + '\n';
        el.scrollTop = el.scrollHeight;
        console.log('[OROCHIKING COLETOR]', txt);
      }
    
      function det(txt) {
        if (cfg.detalhado) log(txt);
        else console.log('[OROCHIKING COLETOR]', txt);
      }
    
      aplicarAbertura();
      posicionar();
      refletirEstado();
    
      // ============================================================
      // CICLO AUTOMATICO
      // ============================================================
      function cancelarAuto() {
        if (timerAuto) { clearTimeout(timerAuto); timerAuto = null; }
      }
    
      function agendarAuto() {
        cancelarAuto();
        if (!cfg.ativo || !cfg.repetir) return;
        const ms = Math.max(1, cfg.intervalo) * 60000;
        timerAuto = setTimeout(() => {
          if (cfg.ativo && cfg.repetir && !rodando) executar();
        }, ms);
        const hora = new Date(Date.now() + ms).toTimeString().slice(0, 5);
        status($('status').textContent + ' ⏰ Próximo: ' + hora);
      }
    
      // ============================================================
      // CARREGAMENTO DE DADOS
      // ============================================================
      async function carregarOrigens(grupo) {
        const base = '/game.php?village=' + game_data.village.id
          + '&screen=overview_villages&mode=combined&group=' + encodeURIComponent(grupo);
        const origens = [];
    
        const lerDoc = (doc) => {
          doc.querySelectorAll('#combined_table tr.row_a, #combined_table tr.row_b').forEach((row) => {
            try {
              const vn = row.querySelector('.quickedit-vn');
              if (!vn) return;
              const id = parseInt(vn.getAttribute('data-id'), 10);
              if (!Number.isFinite(id)) return;
              const rotulo = (row.querySelector('.quickedit-label') || {}).textContent || '';
              const c = rotulo.match(/(\d{1,3})\|(\d{1,3})/);
              if (!c) return;
              const tropas = {};
              UNIDADES.forEach((u) => { tropas[u] = 0; });
              const tipadas = row.querySelectorAll('[class*="unit-item-"]');
              if (tipadas.length > 0) {
                tipadas.forEach((cel) => {
                  const m = (cel.className || '').match(/unit-item-([a-z]+)/);
                  if (!m || !UNIDADES.includes(m[1])) return;
                  tropas[m[1]] = parseInt((cel.textContent || '0').replace(/\D/g, ''), 10) || 0;
                });
              } else {
                const cabecalhos = [];
                doc.querySelectorAll('#combined_table th img').forEach((img) => {
                  const m = (img.getAttribute('src') || '').match(/unit_([a-z]+)/);
                  if (m) cabecalhos.push(m[1]);
                });
                row.querySelectorAll('.unit-item').forEach((cel, i) => {
                  const chave = cabecalhos[i];
                  if (!chave || !UNIDADES.includes(chave)) return;
                  tropas[chave] = parseInt((cel.textContent || '0').replace(/\D/g, ''), 10) || 0;
                });
              }
              origens.push({ id, x: +c[1], y: +c[2], coord: c[1] + '|' + c[2], tropas });
            } catch (e) { console.warn('[OROCHIKING] linha de aldeia:', e); }
          });
        };
    
        const totalPaginas = (doc) => {
          for (const sel of doc.querySelectorAll('select')) {
            const opts = Array.from(sel.options || []).filter((o) => /[?&]page=/.test(o.value || ''));
            const reais = opts.filter((o) => !/page=-1/.test(o.value));
            if (reais.length > 0) return reais.length;
          }
          return 1;
        };
    
        try {
          const r1 = await fetch(base + '&page=-1&', { credentials: 'include' });
          const doc1 = new DOMParser().parseFromString(await r1.text(), 'text/html');
          const total = totalPaginas(doc1);
          lerDoc(doc1);
    
          if (total > 100) {
            for (let p = 101; p < total && !parar; p++) {
              status('📚 Carregando aldeias - página ' + (p + 1) + '/' + total);
              try {
                const rp = await fetch(base + '&page=' + p + '&', { credentials: 'include' });
                lerDoc(new DOMParser().parseFromString(await rp.text(), 'text/html'));
              } catch (e) { console.warn('[OROCHIKING] página', p, e); }
              await dorme(80);
            }
          }
        } catch (e) {
          console.warn('[OROCHIKING] carregarOrigens:', e);
        }
        return origens;
      }
    
      async function carregarTemplates() {
        const r = await fetch('/game.php?village=' + game_data.village.id + '&screen=am_farm', { credentials: 'include' });
        const doc = new DOMParser().parseFromString(await r.text(), 'text/html');
        const templates = {};
        doc.querySelectorAll('form[action*="action=edit_all"] tr').forEach((tr) => {
          try {
            const idInput = tr.querySelector('input[type="hidden"][name*="template"][name*="[id]"]');
            if (!idInput) return;
            const icone = tr.previousElementSibling && tr.previousElementSibling.querySelector('a.farm_icon_a, a.farm_icon_b');
            if (!icone) return;
            const m = (icone.className || '').match(/farm_icon_([ab])\b/);
            if (!m) return;
            const tid = parseInt(idInput.value, 10);
            if (!Number.isFinite(tid) || tid <= 0) return;
            const unidades = {};
            tr.querySelectorAll('input[type="text"], input[type="number"]').forEach((inp) => {
              const chave = (inp.name || '').split('[')[0];
              if (!UNIDADES.includes(chave)) return;
              const q = parseInt(inp.value || '0', 10) || 0;
              if (q > 0) unidades[chave] = q;
            });
            templates[m[1]] = { id: tid, unidades };
          } catch (e) { console.warn('[OROCHIKING] template:', e); }
        });
        return templates;
      }
    
      async function carregarConquistas() {
        const donoAtual = new Map();
        const maisRecente = new Map();
        const aplicar = (texto) => {
          for (const linha of texto.split('\n')) {
            if (!linha) continue;
            const p = linha.split(',');
            if (p.length < 3) continue;
            const id = +p[0];
            const ts = +p[1] || 0;
            if (!Number.isFinite(id)) continue;
            if ((maisRecente.get(id) || 0) > ts) continue;
            maisRecente.set(id, ts);
            donoAtual.set(id, +p[2] || 0);
          }
        };
        try {
          const r = await fetch('/map/conquer.txt', { credentials: 'include' });
          if (r.ok) {
            const t = await r.text();
            if (t && !/^\s*</.test(t)) { aplicar(t); return donoAtual; }
          }
        } catch (e) { console.warn('[OROCHIKING] conquer.txt:', e); }
        return donoAtual;
      }
    
      const SETOR = 20;
      const SETORES_POR_PEDIDO = 8;
    
      async function carregarBarbarasAoVivo(origens, minhasIds, minhasCoords) {
        const setores = new Map();
        origens.forEach((o) => {
          const x0 = Math.floor((o.x - cfg.raio) / SETOR) * SETOR;
          const x1 = Math.floor((o.x + cfg.raio) / SETOR) * SETOR;
          const y0 = Math.floor((o.y - cfg.raio) / SETOR) * SETOR;
          const y1 = Math.floor((o.y + cfg.raio) / SETOR) * SETOR;
          for (let sx = x0; sx <= x1; sx += SETOR) {
            for (let sy = y0; sy <= y1; sy += SETOR) {
              if (sx < 0 || sy < 0) continue;
              setores.set(sx + '_' + sy, { sx, sy });
            }
          }
        });
    
        const lista = [...setores.values()];
        if (lista.length === 0) return null;
    
        const alvos = [];
        const vistos = new Set();
        let pedidos = 0;
        let falhou = 0;
    
        for (let i = 0; i < lista.length && !parar; i += SETORES_POR_PEDIDO) {
          const lote = lista.slice(i, i + SETORES_POR_PEDIDO);
          const qs = lote.map((s) => s.sx + '_' + s.sy + '=1').join('&');
          status('🗺️ Mapa ao vivo - ' + Math.min(i + lote.length, lista.length) + '/' + lista.length + ' setores');
          try {
            const r = await fetch('/map.php?v=2&' + qs, {
              credentials: 'include',
              headers: { 'x-requested-with': 'XMLHttpRequest' },
            });
            const j = await r.json();
            const secs = Array.isArray(j) ? j : (j && Array.isArray(j.sectors) ? j.sectors : []);
            pedidos++;
            secs.forEach((sec) => {
              const vilas = (sec && sec.data && sec.data.villages) || {};
              Object.keys(vilas).forEach((dx) => {
                Object.keys(vilas[dx]).forEach((dy) => {
                  const c = vilas[dx][dy];
                  if (!c) return;
                  if (+c[4] !== 0) return;
                  const id = +c[0];
                  const x = (+sec.x) + (+dx);
                  const y = (+sec.y) + (+dy);
                  const coord = x + '|' + y;
                  if (vistos.has(id)) return;
                  if (minhasIds.has(id) || minhasCoords.has(coord)) return;
                  const pts = parseInt(String(c[3] || '0').replace(/\D/g, ''), 10) || 0;
                  if (pts < cfg.pontosMin || pts > cfg.pontosMax) return;
                  vistos.add(id);
                  alvos.push({ id, x, y, pontos: pts });
                });
              });
            });
          } catch (e) {
            falhou++;
            console.warn('[OROCHIKING] map.php lote', i, e);
            if (falhou >= 3 && pedidos === 0) return null;
          }
          await dorme(120);
        }
        if (pedidos === 0) return null;
        det('Mapa ao vivo: ' + lista.length + ' setores em ' + pedidos + ' pedido(s)');
        return { alvos, fonte: 'mapa ao vivo', setores: lista.length };
      }
    
      async function carregarBarbaras(minhasIds, minhasCoords) {
        let texto = null;
        try {
          const r = await fetch('/map/village.txt', { credentials: 'include' });
          if (r.ok) {
            const t = await r.text();
            if (t && t.length > 50 && !/^\s*</.test(t)) texto = t;
          }
        } catch (e) { console.warn('[OROCHIKING] village.txt:', e); }
    
        if (!texto) {
          try {
            const r = await fetch('/map/village.txt.gz', { credentials: 'include' });
            if (r.ok && r.body && typeof DecompressionStream === 'function') {
              texto = await new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).text();
            }
          } catch (e) { console.warn('[OROCHIKING] village.txt.gz:', e); }
        }
    
        if (texto) {
          const conquistas = await carregarConquistas();
          const alvos = [];
          let corrigidas = 0;
          for (const linha of texto.split('\n')) {
            if (!linha) continue;
            const p = linha.split(',');
            if (p.length < 6) continue;
            const id = +p[0];
            const dono = conquistas.has(id) ? conquistas.get(id) : (+p[4] || 0);
            if (dono !== 0) { if (+p[4] === 0) corrigidas++; continue; }
            const coord = (+p[2]) + '|' + (+p[3]);
            if (minhasIds.has(id) || minhasCoords.has(coord)) continue;
            const pts = +p[5] || 0;
            if (pts < cfg.pontosMin || pts > cfg.pontosMax) continue;
            alvos.push({ id, x: +p[2], y: +p[3], pontos: pts });
          }
          if (corrigidas > 0) det('Descartadas ' + corrigidas + ' aldeias já conquistadas.');
          return { alvos, fonte: 'mapa' };
        }
    
        log('⚠️ Dump do mapa indisponível - usando assistente de saque.');
        const alvos = [];
        const base = '/game.php?village=' + game_data.village.id + '&screen=am_farm&order=distance&dir=asc&Farm_page=';
        let paginas = 1;
        for (let p = 0; p < paginas && p < 50 && !parar; p++) {
          const r = await fetch(base + p, { credentials: 'include' });
          const doc = new DOMParser().parseFromString(await r.text(), 'text/html');
          if (p === 0) {
            for (const sel of doc.querySelectorAll('select')) {
              const opts = Array.from(sel.options || []).filter((o) => /Farm_page=/.test(o.value || ''));
              const reais = opts.filter((o) => !/Farm_page=-1/.test(o.value));
              if (reais.length > 0) { paginas = reais.length; break; }
            }
          }
          doc.querySelectorAll('#plunder_list tr[id^="village_"]').forEach((row) => {
            const id = parseInt((row.id || '').split('_')[1], 10);
            const link = row.querySelector('a[href*="screen=report&mode=all&view="]');
            const c = link && (link.textContent || '').match(/(\d{1,3})\|(\d{1,3})/);
            if (!Number.isFinite(id) || !c) return;
            if (minhasIds.has(id) || minhasCoords.has(c[1] + '|' + c[2])) return;
            alvos.push({ id, x: +c[1], y: +c[2], pontos: 0 });
          });
          await dorme(60);
        }
        return { alvos, fonte: 'assistente' };
      }
    
      async function carregarAssistente() {
        const ids = new Set();
        const idsComAtaque = new Set();
        let escondeAtacadas = false;
        const base = '/game.php?village=' + game_data.village.id + '&screen=am_farm&order=distance&dir=asc&Farm_page=';
        let paginas = 1;
    
        for (let p = 0; p < paginas && !parar; p++) {
          status('📋 Assistente - página ' + (p + 1) + '/' + paginas);
          let html = '';
          try {
            const r = await fetch(base + p, { credentials: 'include' });
            html = await r.text();
          } catch (e) { console.warn('[OROCHIKING] am_farm página', p, e); break; }
          const doc = new DOMParser().parseFromString(html, 'text/html');
          if (p === 0) {
            escondeAtacadas = /farm\.hide_attacked\s*=\s*true/.test(html);
            for (const sel of doc.querySelectorAll('select')) {
              const opts = Array.from(sel.options || []).filter((o) => /Farm_page=/.test(o.value || ''));
              const reais = opts.filter((o) => !/Farm_page=-1/.test(o.value));
              if (reais.length > 0) { paginas = reais.length; break; }
            }
            if (paginas === 1) {
              let max = 0;
              doc.querySelectorAll('#plunder_list_nav a.paged-nav-item, a.paged-nav-item').forEach((a) => {
                const m = (a.getAttribute('href') || '').match(/Farm_page=(\d+)/);
                if (m && +m[1] + 1 > max) max = +m[1] + 1;
              });
              const atual = (doc.querySelector('#plunder_list_nav strong.paged-nav-item') || {}).textContent || '';
              const ma = atual.match(/(\d+)/);
              if (ma && +ma[1] > max) max = +ma[1];
              if (max > paginas) paginas = max;
            }
          }
          doc.querySelectorAll('#plunder_list tr[id^="village_"]').forEach((row) => {
            const id = parseInt((row.id || '').split('_')[1], 10);
            if (!Number.isFinite(id)) return;
            ids.add(id);
            const img = row.querySelector('img[src*="graphic/command/attack.webp"]');
            const n = img ? parseInt(((img.getAttribute('data-title') || img.title || '').match(/\d+/) || ['0'])[0], 10) : 0;
            if (n > 0) idsComAtaque.add(id);
          });
          await dorme(60);
        }
        return { ids, idsComAtaque, paginas, escondeAtacadas };
      }
    
      async function carregarEmVoo() {
        const coords = new Set();
        const base = '/game.php?village=' + game_data.village.id
          + '&screen=overview_villages&mode=commands&type=attack&group=0';
    
        const lerDoc = (doc) => {
          doc.querySelectorAll('#commands_table tr.row_a, #commands_table tr.row_ax, #commands_table tr.row_b, #commands_table tr.row_bx')
            .forEach((row) => {
              const rotulo = row.querySelector('.quickedit-label');
              const m = ((rotulo || {}).textContent || '').match(/(\d{1,3}\|\d{1,3})/);
              if (m) coords.add(m[1]);
            });
        };
    
        try {
          const r1 = await fetch(base + '&page=-1&&type=attack', { credentials: 'include' });
          const doc1 = new DOMParser().parseFromString(await r1.text(), 'text/html');
          lerDoc(doc1);
          let total = 1;
          for (const sel of doc1.querySelectorAll('select')) {
            const opts = Array.from(sel.options || []).filter((o) => /[?&]page=/.test(o.value || ''));
            const reais = opts.filter((o) => !/page=-1/.test(o.value));
            if (reais.length > 0) { total = reais.length; break; }
          }
          if (total > 100) {
            for (let p = 100; p < total && !parar; p++) {
              status('✈️ Ataques em voo - página ' + (p + 1) + '/' + total);
              try {
                const rp = await fetch(base + '&page=' + p + '&&type=attack&', { credentials: 'include' });
                lerDoc(new DOMParser().parseFromString(await rp.text(), 'text/html'));
              } catch (e) { console.warn('[OROCHIKING] commands página', p, e); }
              await dorme(50);
            }
          }
        } catch (e) { console.warn('[OROCHIKING] ataques a caminho:', e); }
        return coords;
      }
    
      // ============================================================
      // ENVIO DE COMANDOS
      // ============================================================
      const TIMEOUT_MS = 10000;
      const semAcento = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    
      function classificar(status, texto, excecao) {
        const t = semAcento(texto);
        if (excecao === 'timeout') return { tipo: 'timeout', rotulo: 'Sem resposta em ' + (TIMEOUT_MS / 1000) + 's', fatal: false };
        if (excecao) return { tipo: 'rede', rotulo: 'Falha de rede (' + excecao + ')', fatal: false };
        if (status === 429) return { tipo: 'limite', rotulo: 'Limite de requisições (429)', fatal: false, esperar: 5000 };
        if (status === 401 || status === 403) return { tipo: 'sessao', rotulo: 'Sessão recusada (HTTP ' + status + ')', fatal: true };
        if (/bot_protection|bot protection|captcha|botprotect/.test(t)) return { tipo: 'captcha', rotulo: 'Proteção anti-bot ativa (captcha)', fatal: true };
        if (/nao esta logado|not logged|login/.test(t) && /<html/.test(t)) return { tipo: 'sessao', rotulo: 'Sessão expirada - recarregue', fatal: true };
        if (/token|csrf|chave.*invalid|invalid.*key/.test(t)) return { tipo: 'sessao', rotulo: 'Token inválido - recarregue', fatal: true };
        if (/aldeias de jogadores|aldeia de jogador|player village|jogadores/.test(t)) {
          return { tipo: 'alvo_jogador', rotulo: 'Alvo é aldeia de jogador (desatualizado)', fatal: false, brando: true, marcarAlvo: true };
        }
        if (/unidades suficientes|not enough units|enough troops|tropas suficientes/.test(t)) return { tipo: 'sem_tropa', rotulo: 'Origem sem tropa', fatal: false, brando: true, esgotaOrigem: true };
        if (/nao existe|not exist|village not found|aldeia.*nao.*encontrad|invalid target|alvo invalido/.test(t)) {
          return { tipo: 'alvo', rotulo: 'Alvo não existe mais', fatal: false, brando: true, marcarAlvo: true };
        }
        if (/propria aldeia|own village|atacar a si/.test(t)) return { tipo: 'alvo', rotulo: 'Alvo é sua aldeia', fatal: false, brando: true, marcarAlvo: true };
        if (/limite|maximo|too many|excedid/.test(t)) return { tipo: 'limite_jogo', rotulo: 'Limite do jogo atingido', fatal: false };
        if (status && status >= 500) return { tipo: 'servidor', rotulo: 'Servidor respondeu ' + status, fatal: false };
        return { tipo: 'desconhecido', rotulo: 'Resposta inesperada', fatal: false };
      }
    
      const CHAVE_DESCARTE = 'orochiking_descartados_' + location.host;
      const VALIDADE_DESCARTE = 14 * 24 * 3600 * 1000;
    
      function lerDescartados() {
        try {
          const bruto = JSON.parse(localStorage.getItem(CHAVE_DESCARTE) || '{}');
          const agora = Date.now();
          const limpo = {};
          Object.keys(bruto).forEach((id) => { if (agora - (bruto[id] || 0) < VALIDADE_DESCARTE) limpo[id] = bruto[id]; });
          return limpo;
        } catch (e) { return {}; }
      }
    
      function gravarDescartados(mapa) {
        try { localStorage.setItem(CHAVE_DESCARTE, JSON.stringify(mapa)); } catch (e) { /* quota */ }
      }
    
      async function enviar(origemId, alvoId, templateId) {
        const csrf = window.csrf_token || '';
        if (!csrf) return { ok: false, diag: { tipo: 'sessao', rotulo: 'CSRF vazio - recarregue', fatal: true } };
        const url = '/game.php?village=' + origemId + '&screen=am_farm&mode=farm&ajaxaction=farm&json=1';
        const corpo = 'source=' + origemId + '&target=' + alvoId + '&template_id=' + templateId + '&h=' + encodeURIComponent(csrf);
        const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
        const relogio = ctrl ? setTimeout(() => { try { ctrl.abort(); } catch (e) { } }, TIMEOUT_MS) : null;
        try {
          const r = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'accept': 'application/json, text/javascript, */*; q=0.01',
              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'tribalwars-ajax': '1',
              'x-requested-with': 'XMLHttpRequest',
            },
            body: corpo,
            signal: ctrl ? ctrl.signal : undefined,
          });
          if (relogio) clearTimeout(relogio);
          const texto = await r.text();
          let j = null;
          try { j = JSON.parse(texto); } catch (e) { }
          if (j && ((j.response && j.response.success) || j.success)) return { ok: true };
          const motivo = (j && j.response && j.response.error) ? String(j.response.error)
            : (j && j.error) ? (typeof j.error === 'string' ? j.error : JSON.stringify(j.error))
            : texto;
          return { ok: false, diag: classificar(r.status, motivo, null) };
        } catch (e) {
          if (relogio) clearTimeout(relogio);
          const abortado = e && (e.name === 'AbortError' || /abort/i.test(e.message || ''));
          return { ok: false, diag: classificar(0, '', abortado ? 'timeout' : ((e && e.message) || 'excecao')) };
        }
      }
    
      // ============================================================
      // EXECUCAO PRINCIPAL
      // ============================================================
      async function executar() {
        if (!cfg.ativo) {
          status('🔴 Ative o interruptor primeiro.');
          return;
        }
        parar = false;
        rodando = true;
        motivoFim = '';
        let resumido = false;
        const descartados = lerDescartados();
        cancelarAuto();
        refletirEstado();
        $('registro').textContent = '';
    
        try {
          log('═══════════════════════════════════════');
          log('🚀 INICIANDO CICLO DE FARMING');
          log('═══════════════════════════════════════');
          
          status('⚙️ Lendo templates...');
          const templates = await carregarTemplates();
          const tpl = templates[cfg.modelo];
          if (!tpl) {
            motivoFim = 'Modelo ' + cfg.modelo.toUpperCase() + ' não existe';
            status('❌ ' + motivoFim);
            return;
          }
          const composicao = Object.entries(tpl.unidades);
          if (composicao.length === 0) {
            motivoFim = 'Modelo ' + cfg.modelo.toUpperCase() + ' está vazio';
            status('❌ ' + motivoFim);
            return;
          }
          log('✓ Modelo ' + cfg.modelo.toUpperCase() + ' (id ' + tpl.id + '): ' + composicao.map(([u, q]) => q + ' ' + u).join(', '));
    
          status('📚 Carregando aldeias...');
          const origens = await carregarOrigens(cfg.grupo);
          if (origens.length === 0) {
            motivoFim = 'Nenhuma aldeia no grupo ' + cfg.grupo;
            status('❌ ' + motivoFim);
            return;
          }
    
          let comSpy = 0;
          let spyTotal = 0;
          origens.forEach((o) => {
            let cota = cfg.maxPorOrigem;
            composicao.forEach(([u, q]) => { cota = Math.min(cota, Math.floor((o.tropas[u] || 0) / q)); });
            o.cota = Math.max(0, cota);
            if ((o.tropas.spy || 0) > 0) { comSpy++; spyTotal += o.tropas.spy; }
          });
          const aptas = origens.filter((o) => o.cota > 0);
          log('✓ Aldeias: ' + origens.length + ' | Com explorador: ' + comSpy + ' | Aptas: ' + aptas.length + ' | Teto: ' + aptas.reduce((s, o) => s + o.cota, 0) + ' comandos');
    
          if (aptas.length === 0) {
            motivoFim = 'Nenhuma aldeia com tropa para o modelo';
            status('❌ ' + motivoFim);
            return;
          }
    
          const minhasIds = new Set(origens.map((o) => o.id));
          const minhasCoords = new Set(origens.map((o) => o.coord));
          if (String(cfg.grupo) !== '0') {
            try {
              (await carregarOrigens('0')).forEach((v) => { minhasIds.add(v.id); minhasCoords.add(v.coord); });
            } catch (e) { console.warn('[OROCHIKING] lista completa:', e); }
          }
    
          status('🗺️ Carregando barbaras...');
          let resultado = await carregarBarbarasAoVivo(aptas, minhasIds, minhasCoords);
          if (!resultado) {
            det('Map.php indisponível - usando dump.');
            resultado = await carregarBarbaras(minhasIds, minhasCoords);
          }
          const { alvos, fonte } = resultado;
          if (alvos.length === 0) {
            motivoFim = 'Nenhum alvo encontrado';
            status('⚠️ ' + motivoFim);
            return;
          }
          log('✓ Barbaras: ' + alvos.length + ' (' + fonte + ')');
    
          let livres = alvos;
          const cortes = [];
          if (Object.keys(descartados).length > 0) {
            const antes = livres.length;
            livres = livres.filter((a) => !descartados[a.id]);
            if (antes !== livres.length) cortes.push('-' + (antes - livres.length) + ' recusados antes');
          }
          if (cfg.pularAssistente) {
            if (fonte === 'assistente') {
              log('⚠️ Alvos do assistente - filtro ignorado');
            } else {
              const assist = await carregarAssistente();
              const antes = livres.length;
              livres = livres.filter((a) => !assist.ids.has(a.id));
              if (antes !== livres.length) cortes.push('-' + (antes - livres.length) + ' no assistente');
            }
          }
          if (cfg.pularEmVoo && !parar) {
            status('✈️ Lendo ataques em voo...');
            const emVoo = await carregarEmVoo();
            const antes = livres.length;
            livres = livres.filter((a) => !emVoo.has(a.x + '|' + a.y));
            if (antes !== livres.length) cortes.push('-' + (antes - livres.length) + ' em voo');
          }
          log('✓ Alvos livres: ' + livres.length + (cortes.length ? ' (' + cortes.join(' | ') + ')' : ''));
    
          if (livres.length === 0) {
            motivoFim = 'Todos os alvos já cobertos';
            status('⚠️ ' + motivoFim);
            return;
          }
    
          status('🎯 Pareando origens e alvos...');
          const pares = [];
          const alvosNoRaio = new Set();
          const limiteCandidatos = cfg.maxPorOrigem * 5;
          aptas.forEach((o) => {
            const perto = [];
            for (const a of livres) {
              if (Math.abs(a.x - o.x) > cfg.raio || Math.abs(a.y - o.y) > cfg.raio) continue;
              const d = dist(o, a);
              if (d > cfg.raio || d === 0) continue;
              perto.push({ a, d });
            }
            perto.sort((p, q) => p.d - q.d);
            perto.slice(0, limiteCandidatos).forEach(({ a, d }) => {
              alvosNoRaio.add(a.id);
              pares.push({ origem: o, alvo: a, d });
            });
          });
          pares.sort((p, q) => p.d - q.d);
    
          const usadosPorOrigem = new Map();
          const alvosUsados = new Set();
          const plano = [];
          for (const p of pares) {
            const usados = usadosPorOrigem.get(p.origem.id) || 0;
            if (usados >= p.origem.cota) continue;
            if (!cfg.repetirAlvo && alvosUsados.has(p.alvo.id)) continue;
            usadosPorOrigem.set(p.origem.id, usados + 1);
            alvosUsados.add(p.alvo.id);
            plano.push(p);
          }
          log('✓ Plano: ' + plano.length + ' comandos de ' + usadosPorOrigem.size + ' origens');
    
          if (plano.length === 0) {
            motivoFim = 'Nenhum alvo no raio';
            status('⚠️ ' + motivoFim);
            return;
          }
    
          log('═══════════════════════════════════════');
          log('🎯 DISPARANDO ' + plano.length + ' COMANDOS');
          log('═══════════════════════════════════════');
    
          let ok = 0;
          let falhas = 0;
          let durasSeguidas = 0;
          const motivos = new Map();
          const esgotadas = new Set();
          let puladosPorOrigem = 0;
          let novosDescartes = 0;
          motivoFim = '';
    
          for (let i = 0; i < plano.length; i++) {
            if (parar) { motivoFim = 'parado por você'; break; }
            if (!cfg.ativo) { motivoFim = 'interruptor desligado'; break; }
            const p = plano[i];
            if (esgotadas.has(p.origem.id)) { puladosPorOrigem++; continue; }
    
            const r = await enviar(p.origem.id, p.alvo.id, tpl.id);
            if (r.ok) {
              ok++;
              durasSeguidas = 0;
              if (cfg.detalhado) log('  ✓ ' + p.origem.coord + ' → ' + p.alvo.x + '|' + p.alvo.y);
            } else {
              falhas++;
              const d = r.diag;
              motivos.set(d.rotulo, (motivos.get(d.rotulo) || 0) + 1);
              if (cfg.detalhado) log('  ✗ ' + p.origem.coord + ' → ' + p.alvo.x + '|' + p.alvo.y + ': ' + d.rotulo);
              if (d.marcarAlvo) { descartados[p.alvo.id] = Date.now(); novosDescartes++; }
              if (d.esgotaOrigem) esgotadas.add(p.origem.id);
              if (d.fatal) { motivoFim = d.rotulo; break; }
              if (d.esperar) { await dorme(d.esperar); }
              if (!d.brando) {
                durasSeguidas++;
                if (durasSeguidas >= 10) { motivoFim = '10 falhas seguidas'; break; }
              }
            }
    
            status('📤 ' + (i + 1) + '/' + plano.length + ' | ✓ ' + ok + ' | ✗ ' + falhas);
            /* Freio ligado: pausa bem maior entre comandos (minimo 1,2s) */ var pausaEfetiva = window.__ORK_FREIO__ ? Math.max(1200, cfg.pausa * 4) : cfg.pausa; if (pausaEfetiva > 0 && i < plano.length - 1) await dorme(pausaEfetiva);
          }
    
          if (novosDescartes > 0) gravarDescartados(descartados);
          if (!motivoFim) motivoFim = 'ciclo concluído';
          resumido = true;
          
          log('═══════════════════════════════════════');
          log('✅ RESULTADO FINAL');
          log('═══════════════════════════════════════');
          log('Enviados: ' + ok);
          log('Falhas: ' + falhas);
          log('Pulados: ' + (puladosPorOrigem > 0 ? puladosPorOrigem : '0'));
          log('Marcados: ' + (novosDescartes > 0 ? novosDescartes : '0'));
          log('Status: ' + motivoFim);
          
          if (motivos.size > 0) {
            log('Top erros:');
            [...motivos.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
              .forEach(([m, n]) => log('  ' + n + 'x ' + m));
          }
          log('═══════════════════════════════════════');
          
          status('✅ ' + ok + ' comandos - ' + motivoFim);
        } catch (e) {
          console.error('[OROCHIKING]', e);
          motivoFim = 'erro: ' + ((e && e.message) || e);
          resumido = true;
          log('❌ Interrompido - ' + motivoFim);
          status('❌ ' + motivoFim);
        } finally {
          rodando = false;
          if (!motivoFim) motivoFim = 'encerrado';
          if (!resumido) log('Encerrado sem envios.');
          refletirEstado();
          agendarAuto();
        }
      }
    
      // API de console/teste
      window.__OROCHIKING__ = {
        iniciar: executar,
        parar: () => { parar = true; cancelarAuto(); },
        cfg: () => cfg,
        motivo: () => motivoFim,
        raiz,
      };
    
      if (cfg.ativo && cfg.repetir) agendarAuto();
    })();
    
  } catch (e) {
    console.error('[OROCHIKING] erro ao iniciar Coletor Hard Farming:', e);
  }

  /* ============================================================
     MONITOR DE SESSÃO — detecta se a sessão caiu (deslogado) e
     recarrega a página sozinho pra cair na tela de relogar.
  ============================================================ */
  (function monitorSessao() {
    // ANTES: baixava a página inteira a cada EXATOS 90s, em toda aba, pra sempre.
    // Com várias abas abertas isso virava vários carregamentos de página cravados
    // no relógio, 24h por dia — padrão que nenhum humano faz e que sistemas anti-bot
    // procuram, além de somar carga no servidor.
    //
    // AGORA:
    //  - intervalo aleatório entre 4 e 7 min (nunca o mesmo tempo duas vezes)
    //  - não checa se a aba teve atividade de rede recente (se as ferramentas
    //    estão conseguindo fazer requisições, a sessão obviamente está viva —
    //    não precisa gastar mais uma só pra confirmar)
    //  - com o FREIO ligado, espaça ainda mais (8 a 12 min)
    function proximaChecagem() {
      var min = window.__ORK_FREIO__ ? 8 : 4;
      var max = window.__ORK_FREIO__ ? 12 : 7;
      var espera = (min + Math.random() * (max - min)) * 60000;
      setTimeout(checar, espera);
    }

    function checar() {
      try {
        // se alguma ferramenta fez requisição com sucesso há pouco, a sessão está viva
        var ultimaAtividade = window.__ORK_ULTIMA_REDE_OK__ || 0;
        if (Date.now() - ultimaAtividade < 3 * 60000) { return proximaChecagem(); }

        fetch(window.location.href, { credentials: 'include' })
          .then(function (r) { return r.text(); })
          .then(function (html) {
            var t = html.toLowerCase();
            var pareceDeslogado = t.indexOf('var game_data') === -1 &&
              (t.indexOf('login_form') !== -1 || t.indexOf('page/join') !== -1 || t.indexOf('mundos actuais') !== -1 || t.indexOf('mundos atuais') !== -1);
            if (pareceDeslogado) {
              console.warn('[OROCHIKING] Sessão parece ter caído — recarregando.');
              window.location.reload();
              return;
            }
            proximaChecagem();
          })
          .catch(function (e) {
            console.warn('[OROCHIKING] monitor de sessão: falha ao checar', e && e.message);
            proximaChecagem();
          });
      } catch (e) { proximaChecagem(); }
    }

    proximaChecagem();
  })();

  /* ============================================================
     RETOMAR FARM DORMINDO DEPOIS DE RELOGAR SOZINHO
  ============================================================ */
  (function retomarDormindoAposRelogin() {
    var querRetomar = null;
    try { querRetomar = localStorage.getItem('ork_retomar_dormindo'); } catch (e) {}
    if (querRetomar !== '1') return;
    if (document.getElementById('fh-fechar')) return; // Farm Hard já está aberto, nada a fazer
    setTimeout(function () {
      try { rodarFarmDormindo(); } catch (e) { console.error('[OROCHIKING] erro ao retomar Farm Dormindo', e); }
    }, 1500);
  })();

  /* ============================================================
     MONITOR DE CAPTCHA (roda em toda tela, sempre, independente do painel)
     Detecta o desafio anti-bot, toca um alarme, mostra um aviso grande
     e tenta parar o Farm Hard imediatamente. Some sozinho quando resolvida.
  ============================================================ */
  // Só o container real do desafio e os iframes de verdade. Termos genéricos
  // como "captcha" no id/classe foram removidos: o próprio jogo carrega estruturas
  // de proteção anti-bot vazias/ocultas em páginas normais, e isso disparava
  // alarme sem nenhum captcha na tela.
  // Sinais DEFINITIVOS: um iframe de desafio real só existe quando há captcha.
  // Não exigem checagem de tamanho — a presença já basta.
  var SELETORES_CAPTCHA_FORTES = [
    'iframe[src*="hcaptcha" i]', 'iframe[src*="recaptcha" i]', '.captcha iframe', '.captcha canvas'
  ];
  // Sinais FRACOS: containers que o jogo mantém vazios em páginas normais.
  // Só contam se estiverem ocupando espaço de verdade na tela.
  var SELETORES_CAPTCHA = [
    '#bot_check', '#bot_check_wrapper', '.bot-protect-row'
  ];
  // Textos que só existem quando o desafio está REALMENTE visível pro jogador.
  var TEXTOS_CAPTCHA = [
    'proteção contra bots', 'proteção de bot', 'sou humano',
    'bot protection', 'i am human', 'verificação de bot'
  ];

  // Visível de verdade: além de display/visibility, precisa ocupar espaço na tela.
  // Um container vazio de 0x0 (que o jogo mantém em páginas normais) não conta.
  function estaEscondido(el) {
    var estilo = window.getComputedStyle ? window.getComputedStyle(el) : null;
    return !!(estilo && (estilo.display === 'none' || estilo.visibility === 'hidden'));
  }

  function elementoVisivel(el) {
    if (!el) return false;
    if (estaEscondido(el)) return false;
    var largura = el.offsetWidth || 0, altura = el.offsetHeight || 0;
    if (!largura && !altura && el.getBoundingClientRect) {
      var r = el.getBoundingClientRect();
      largura = r.width; altura = r.height;
    }
    // container declarado com tamanho no style conta mesmo sem layout calculado
    if (!largura && !altura && el.getAttribute && /(width|height)s*:s*[1-9]/.test(el.getAttribute('style') || '')) return true;
    return largura >= 40 && altura >= 40;
  }

  function captchaNaTela() {
    // 1) sinais definitivos (iframe de desafio): basta não estar escondido
    for (var f = 0; f < SELETORES_CAPTCHA_FORTES.length; f++) {
      try {
        var forte = document.querySelector(SELETORES_CAPTCHA_FORTES[f]);
        if (forte && !estaEscondido(forte)) { return true; }
      } catch (e) {}
    }
    // 2) containers genéricos: só valem se ocuparem espaço real
    for (var i = 0; i < SELETORES_CAPTCHA.length; i++) {
      try {
        var el = document.querySelector(SELETORES_CAPTCHA[i]);
        if (el && elementoVisivel(el)) { return true; }
      } catch (e) {}
    }
    // 3) texto visível do desafio
    try {
      var texto = ((document.body.innerText || document.body.textContent) || '').toLowerCase();
      for (var j = 0; j < TEXTOS_CAPTCHA.length; j++) {
        if (texto.indexOf(TEXTOS_CAPTCHA[j]) !== -1) { return true; }
      }
    } catch (e) {}
    return false;
  }

  // Marcadores fortes numa RESPOSTA de rede. Mesmo assim, nunca disparam o alarme
  // sozinhos: servem só pra pedir uma reconferência antecipada no DOM (ver abaixo),
  // porque o HTML normal do jogo menciona bot_check em scripts internos sem ter
  // captcha nenhum na tela.
  function textoIndicaCaptcha(texto) {
    if (!texto) return false;
    var t = String(texto).toLowerCase();
    return (
      t.indexOf('bot_protection') !== -1 ||
      t.indexOf('"captcha_required"') !== -1 ||
      t.indexOf('proteção contra bots') !== -1 ||
      t.indexOf('bot protection') !== -1
    );
  }

  var alarmeAtivo = false;
  var audioCtx = null;
  var pararSomAtual = null;

  function tocarAlarme() {
    try {
      if (!audioCtx) { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      var tocando = true;
      var grave = false;
      function bipe() {
        if (!tocando || !alarmeAtivo) return;
        if (audioCtx.state === 'suspended') { audioCtx.resume(); }
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(grave ? 620 : 1250, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.5, audioCtx.currentTime + 0.02);
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime + 0.16);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.22);
        grave = !grave;
        setTimeout(bipe, 220);
      }
      bipe();
      return function pararSom() { tocando = false; };
    } catch (e) { return function () {}; }
  }

  function pararFarmHard() {
    try {
      var fechar = document.getElementById('fh-fechar');
      if (fechar) { fechar.click(); return; }
      var pausar = document.getElementById('fh-pausar');
      if (pausar) { pausar.click(); }
    } catch (e) {}
    try {
      if (window.__ORK_ColetorFarmInterval) {
        clearInterval(window.__ORK_ColetorFarmInterval);
        window.__ORK_ColetorFarmInterval = null;
      }
    } catch (e) {}
    try { if (typeof pararCunharPorSeguranca === 'function') pararCunharPorSeguranca(); } catch (e) {}
    try { if (typeof kpPararPorSeguranca === 'function') kpPararPorSeguranca('captcha'); } catch (e) {}
    try { localStorage.removeItem('ork_retomar_dormindo'); } catch (e) {}
  }

  function mostrarOverlay() {
    if (document.getElementById('ork-captcha-overlay')) return;
    var estilo = document.createElement('style');
    estilo.id = 'ork-captcha-estilo';
    estilo.textContent =
      '@keyframes ork-pulsar{0%{background:#7a0000}50%{background:#c40000}100%{background:#7a0000}}' +
      '#ork-captcha-overlay{position:fixed;top:0;left:0;right:0;padding:16px;text-align:center;' +
      /* pointer-events:none e essencial: sem isso a faixa fica por cima da pagina
         e engole os cliques — inclusive os do proprio captcha que voce precisa resolver */
      'pointer-events:none;' +
      'z-index:9999999;color:#fff;font-family:Verdana,Arial,sans-serif;font-weight:800;font-size:16px;' +
      'letter-spacing:.5px;box-shadow:0 4px 24px rgba(0,0,0,.6);animation:ork-pulsar 1s infinite}';
    document.head.appendChild(estilo);
    var overlay = document.createElement('div');
    overlay.id = 'ork-captcha-overlay';
    overlay.textContent = '🚨 CAPTCHA DETECTADO — SCRIPTS PARADOS. RESOLVA AGORA! 🚨';
    document.body.appendChild(overlay);
  }

  function removerOverlay() {
    var overlay = document.getElementById('ork-captcha-overlay');
    if (overlay) overlay.remove();
    var estilo = document.getElementById('ork-captcha-estilo');
    if (estilo) estilo.remove();
  }

  /* ============================================================
     ATIVAR/DESATIVAR MODO CAPTCHA — chamado tanto pela checagem
     visual (DOM, a cada 1,2s) quanto pela inspeção das respostas
     de rede (instantâneo, no mesmo request que revelou o captcha).
  ============================================================ */
  // Um sinal na rede NUNCA liga o alarme sozinho — ele só antecipa a conferência
  // no DOM. Se o desafio realmente aparecer na tela, o alarme toca; se não
  // aparecer (caso comum: menção a bot_check dentro do JS normal da página),
  // nada acontece. Isso elimina o alarme tocando sem captcha nenhum na tela.
  function conferirCaptchaNoDom() {
    var tentativas = 0;
    (function tentar() {
      tentativas++;
      if (captchaNaTela()) { ativarModoCaptcha(); return; }
      if (tentativas < 6) { setTimeout(tentar, 400); }
    })();
  }

  /* Durante o captcha, bloqueamos APENAS as chamadas de automação dos nossos
     próprios scripts (farm, envio de ataque, cunhagem). Tudo o mais passa.

     Antes eu bloqueava TODAS as requisições da página — inclusive as do próprio
     desafio. Era exatamente por isso que o captcha às vezes nem aparecia, e quando
     aparecia não dava pra resolver: o hCaptcha precisa de rede pra carregar e pra
     validar a resposta. Desligar o Tampermonkey "resolvia" porque tirava esse
     bloqueio do caminho. */
  function ehRequisicaoDeAutomacao(alvo) {
    try {
      var u = '';
      if (typeof alvo === 'string') { u = alvo; }
      else if (alvo && alvo.url) { u = alvo.url; }
      else if (alvo) { u = String(alvo); }
      u = u.toLowerCase();
      if (!u || u.indexOf('game.php') === -1) { return false; }

      // nunca bloqueia nada relacionado ao desafio
      if (/captcha|bot_check|botcheck|bot-protect/.test(u)) { return false; }

      return (
        /ajaxaction=farm_from_report/.test(u) ||   // Farm Hard / Coletor para Farmar
        /screen=place/.test(u) ||                   // Ataque Mass (confirmar e enviar)
        /screen=snob/.test(u) ||                    // Cunhagem automática
        /action=command/.test(u)
      );
    } catch (e) { return false; }
  }

  function ativarModoCaptcha() {
    window.__ORK_CAPTCHA_BLOQUEADO__ = true;
    if (alarmeAtivo) return;
    alarmeAtivo = true;
    pararFarmHard();
    mostrarOverlay();
    pararSomAtual = tocarAlarme();
    console.warn('[OROCHIKING] Captcha detectado — envios automáticos pausados. O captcha e a navegação normal seguem liberados; resolva o desafio.');
  }

  function desativarModoCaptcha() {
    window.__ORK_CAPTCHA_BLOQUEADO__ = false;
    if (!alarmeAtivo) return;
    alarmeAtivo = false;
    removerOverlay();
    if (pararSomAtual) { pararSomAtual(); pararSomAtual = null; }
  }

  (function monitorCaptchaVisual() {
    setInterval(function () {
      if (captchaNaTela()) { ativarModoCaptcha(); }
      else { desativarModoCaptcha(); }
    }, 1200);
  })();

  /* ============================================================
     INTERCEPTOR DE REDE — inspeciona as respostas em busca de
     sinais de captcha (mais rápido que esperar o DOM atualizar) e
     BLOQUEIA qualquer requisição nova enquanto o captcha durar,
     pra não escalar pra um captcha mais chato.
  ============================================================ */
  (function interceptarRede() {
    try {
      var fetchOriginal = window.fetch;
      if (fetchOriginal) {
        var novoFetch = function fetch(input, init) {
          if (window.__ORK_CAPTCHA_BLOQUEADO__ && ehRequisicaoDeAutomacao(input)) {
            return Promise.reject(new TypeError('Failed to fetch'));
          }
          return fetchOriginal.call(window, input, init).then(function (resposta) {
            try { if (resposta && resposta.ok) { window.__ORK_ULTIMA_REDE_OK__ = Date.now(); } } catch (e) {}
            try {
              resposta.clone().text().then(function (texto) {
                if (textoIndicaCaptcha(texto)) { conferirCaptchaNoDom(); }
              }).catch(function () {});
            } catch (e) {}
            return resposta;
          });
        };
        disfarcarComoNativa(novoFetch, 'fetch');
        window.fetch = novoFetch;
      }
    } catch (e) {}

    try {
      var xhrOpenOriginal = XMLHttpRequest.prototype.open;
      var xhrSendOriginal = XMLHttpRequest.prototype.send;

      // Guarda a URL de cada requisição num WeakMap, em vez de pendurar uma
      // propriedade nossa (__orkUrl) no próprio objeto — que ficava visível pra
      // qualquer script que inspecionasse a requisição.
      var urlDaRequisicao = new WeakMap();

      var novoOpen = function open(metodo, url) {
        try { urlDaRequisicao.set(this, url); } catch (e) {}
        return xhrOpenOriginal.apply(this, arguments);
      };

      var novoSend = function send() {
        var urlReq = urlDaRequisicao.get(this);
        if (window.__ORK_CAPTCHA_BLOQUEADO__ && ehRequisicaoDeAutomacao(urlReq)) { return; }
        var xhr = this;
        try {
          xhr.addEventListener('load', function () {
            try { if (xhr.status >= 200 && xhr.status < 300) { window.__ORK_ULTIMA_REDE_OK__ = Date.now(); } } catch (e) {}
            try { if (textoIndicaCaptcha(xhr.responseText)) { conferirCaptchaNoDom(); } } catch (e) {}
          });
        } catch (e) {}
        return xhrSendOriginal.apply(xhr, arguments);
      };

      disfarcarComoNativa(novoOpen, 'open');
      disfarcarComoNativa(novoSend, 'send');
      XMLHttpRequest.prototype.open = novoOpen;
      XMLHttpRequest.prototype.send = novoSend;
    } catch (e) {}
  })();

  /* ============================================================
     CONFIGURAÇÃO DE DESTINOS
  ============================================================ */
  var DESTINOS = {
    ataque:   'screen=overview_villages&mode=combined',
    rename:   'screen=overview_villages&mode=combined',
    cancelar: 'screen=overview_villages&mode=prod',
    defender: 'screen=overview_villages&mode=incomings&subtype=attacks',
    barbaras: 'screen=map',
    ranking:  'screen=ranking',
    cunhar:   'screen=snob&mode=coin'
  };

  function urlPara(chaveDestino) {
    var vid = (game_data.village && game_data.village.id) ? game_data.village.id : '';
    return 'game.php?village=' + vid + '&' + DESTINOS[chaveDestino];
  }

  /* ============================================================
     FERRAMENTAS
  ============================================================ */

  function checaFarmar() {
    return !!(window.game_data && window.game_data.village);
  }
  function rodarFarmar() {
    (function(){ var FH_VERSAO = 42; /* Trava de instancia unica COM versao. Antes era so um true/false: se uma copia    ANTIGA do painel ja tivesse rodado na pagina, a nova desistia e reabria o popup    velho, dando a impressao de que a atualizacao nao pegou. Agora, se a copia que    ja esta na pagina for mais antiga, ela e descartada e esta assume. */ if (window.__FarmHardAtivo) { var versaoAtual = window.__FarmHardVersao || 0; if (versaoAtual >= FH_VERSAO) { if (typeof window.__FarmHardMostrar === "function") { window.__FarmHardMostrar(); } return; } console.warn("[OROCHIKING] Farm Hard v" + versaoAtual + " antigo detectado na pagina — substituindo pela v" + FH_VERSAO + "."); try { var velho = document.getElementById("farmhard-popup"); if (velho) { velho.remove(); } } catch (e) {} try { if (typeof window.__FarmHardParar === "function") { window.__FarmHardParar(); } } catch (e) {} } window.__FarmHardAtivo = true; window.__FarmHardVersao = FH_VERSAO; function _FarmarAS() { /* Script Escrito por ThiioM :) - Ajustado - Farm Hard 1.0 */ /* Lockr Script */ !function(t,e){t.Lockr=function(t,e){"use strict";return e.prefix="",e._getPrefixedKey=function(t,e){return e=e||{},e.noPrefix?t:this.prefix+t},e.set=function(t,e,r){var a=this._getPrefixedKey(t,r);try{localStorage.setItem(a,JSON.stringify({data:e}))}catch(t){}},e.get=function(t,e,r){var a,i=this._getPrefixedKey(t,r);try{a=JSON.parse(localStorage.getItem(i))}catch(t){a=localStorage[i]?{data:localStorage.getItem(i)}:null}return null===a?e:"object"==typeof a&&void 0!==a.data?a.data:e},e}(t,{})}(this); let CLMinimo = 0; let UltimaCLLida = null; let AldeiasPuladasCL = 0; /* ===== RITMO HUMANO =====    Liga/desliga o farm sozinho em blocos com tempos aleatorios, pra nao rodar    24h no mesmo ritmo (o que grita 'robo' pro servidor). Reaproveita a variavel    Pausado que ja existe: quando 'descansando', o farm so espera, sem perder    estado — os ataques em andamento voltam normalmente. */ let RitmoHumanoOn = false; let rhTimeout = null; let rhDescansando = false; /* Faixas por velocidade (em segundos). Cada ciclo sorteia dentro da faixa, entao    nunca cai no valor exato. Velocidade alta = blocos mais curtos (mais arriscado). */ const rhFaixas = () => { if (VelocidadeFator >= 2) { return { rodaMin: 150, rodaMax: 300, paraMin: 90, paraMax: 180 }; } if (VelocidadeFator >= 1.25) { return { rodaMin: 210, rodaMax: 360, paraMin: 60, paraMax: 150 }; } return { rodaMin: 300, rodaMax: 540, paraMin: 60, paraMax: 240 }; }; const rhSorteia = (min, max) => Math.round((min + Math.random() * (max - min)) * 1000); const rhAgendaProximo = () => { if (!RitmoHumanoOn || !Rodando) { return; } const f = rhFaixas(); if (!rhDescansando) { /* estava rodando -> agora descansa */ rhDescansando = true; Pausado = true; /* avisa que o farm ESTA EM PAUSA — janela livre pra cunhagem */ try { window.__ORK_FARM_EM_PAUSA__ = true; } catch (e) {} const ms = rhSorteia(f.paraMin, f.paraMax); AtualizarStatus('Ritmo humano: descansando ' + Math.round(ms/1000) + 's'); console.log('[OROCHIKING] Ritmo humano: pausa de ' + Math.round(ms/1000) + 's'); rhTimeout = setTimeout(rhAgendaProximo, ms); } else { /* estava descansando -> volta a rodar */ rhDescansando = false; Pausado = false; /* avisa que o farm VOLTOU A RODAR — cunhagem deve segurar */ try { window.__ORK_FARM_EM_PAUSA__ = false; } catch (e) {} const ms = rhSorteia(f.rodaMin, f.rodaMax); AtualizarStatus('Ritmo humano: farmando ' + Math.round(ms/1000) + 's'); console.log('[OROCHIKING] Ritmo humano: rodando ' + Math.round(ms/1000) + 's'); rhTimeout = setTimeout(rhAgendaProximo, ms); } }; const rhLigar = () => { if (RitmoHumanoOn) { return; } RitmoHumanoOn = true; rhDescansando = false; Pausado = false; try { window.__ORK_FARM_EM_PAUSA__ = false; } catch (e) {} const f = rhFaixas(); const ms = rhSorteia(f.rodaMin, f.rodaMax); console.log('[OROCHIKING] Ritmo humano LIGADO — 1o bloco de ' + Math.round(ms/1000) + 's'); if (rhTimeout) { clearTimeout(rhTimeout); } rhTimeout = setTimeout(rhAgendaProximo, ms); }; const rhDesligar = () => { RitmoHumanoOn = false; rhDescansando = false; /* farm nao esta mais gerenciando pausas — nao bloqueia a cunhagem */ try { window.__ORK_FARM_EM_PAUSA__ = true; } catch (e) {} if (rhTimeout) { clearTimeout(rhTimeout); rhTimeout = null; } /* so tira a pausa se foi o ritmo humano que pausou (nao mexe numa pausa manual) */ if (Rodando) { Pausado = false; } console.log('[OROCHIKING] Ritmo humano desligado.'); }; let CPMinimo = 0; let UltimaCPLida = null; const FH_MIN_RECURSOS = 150000; let RecursoMinimo = 0; const LerRecursoMinimo = () => { const el = document.getElementById('fh-recmin'); RecursoMinimo = el ? (parseInt(el.value, 10) || 0) : 0; return RecursoMinimo; }; const MinimoEfetivo = () => { return RecursoMinimo > 0 ? RecursoMinimo : FH_MIN_RECURSOS; }; const AtualizarStatusRec = () => { const el = document.getElementById('fh-recmin-status'); if (!el) { return; } if (RecursoMinimo <= 0) { el.style.color = '#8a8a8a'; el.innerText = '150k'; el.title = 'usando o mínimo padrão de 150 mil'; } else { el.style.color = '#7ed17e'; el.innerText = (RecursoMinimo / 1000) + 'k'; el.title = 'só bárbaras com ' + RecursoMinimo.toLocaleString('pt-BR') + '+ de recurso total'; } }; let RelatoriosUsados = new Set(); let AlvosPuladosRepetidos = 0; const MarcarRelatorioUsado = (rid) => { RelatoriosUsados.add(rid); /* relatorio antigo nunca volta (o novo tem outro numero), entao da pra esquecer os mais velhos */ if (RelatoriosUsados.size > 40000) { const manter = Array.from(RelatoriosUsados).slice(-20000); RelatoriosUsados = new Set(manter); } }; const LiberarRelatorio = (rid) => { RelatoriosUsados.delete(rid); }; let MotivosFalha = {}; let UltimoResumoFalha = 0; const RegistrarMotivoFalha = (motivo) => { let m = String(Array.isArray(motivo) ? motivo[0] : motivo).slice(0, 90); MotivosFalha[m] = (MotivosFalha[m] || 0) + 1; /* a cada 30s no maximo, mostra um resumo agrupado no Console (sem inundar de mensagens) */ if (Date.now() - UltimoResumoFalha > 30000) { UltimoResumoFalha = Date.now(); const lista = Object.keys(MotivosFalha).sort((a, b) => MotivosFalha[b] - MotivosFalha[a]).map((k) => MotivosFalha[k] + 'x  ' + k); console.log('[OROCHIKING] Farm Hard - motivos das falhas ate agora:\n  ' + lista.join('\n  ') + '\n  (alvos pulados por ja terem ataque a caminho: ' + AlvosPuladosRepetidos + ')'); } };
    const LerCLMinimo = () => { const el = document.getElementById('fh-clmin'); CLMinimo = el ? (parseInt(el.value, 10) || 0) : 0; return CLMinimo; }; const LerCPMinimo = () => { const el = document.getElementById('fh-cpmin'); CPMinimo = el ? (parseInt(el.value, 10) || 0) : 0; return CPMinimo; };
    const AtualizarStatusCP = () => { const el = document.getElementById('fh-cpmin-status'); if (!el) { return; } if (CPMinimo <= 0) { el.style.color = '#8a8a8a'; el.innerText = 'off'; el.title = ''; return; } if (UltimaCPLida === null) { el.style.color = '#ffb347'; el.innerText = '...'; el.title = 'lendo cavalaria pesada'; return; } if (UltimaCPLida === -1) { el.style.color = '#ff8a6b'; el.innerText = 'erro'; el.title = 'nao consegui ler a CP do seu mundo'; return; } el.style.color = '#7ed17e'; el.innerText = UltimaCPLida + ''; el.title = 'CP lida: ' + UltimaCPLida; }; const AtualizarStatusCL = () => { const el = document.getElementById('fh-clmin-status'); if (!el) { return; } if (CLMinimo <= 0) { el.style.color = '#8a8a8a'; el.innerText = 'off'; el.title = ''; return; } if (UltimaCLLida === null) { el.style.color = '#ffb347'; el.innerText = '...'; el.title = 'lendo cavalaria'; return; } if (UltimaCLLida === -1) { el.style.color = '#ff8a6b'; el.innerText = 'erro'; el.title = 'nao consegui ler a CL do seu mundo'; return; } el.style.color = '#7ed17e'; el.innerText = UltimaCLLida + ''; el.title = 'CL lida: ' + UltimaCLLida + ' | aldeias puladas: ' + AldeiasPuladasCL; };
    /* Le a cavalaria leve disponivel NA ALDEIA a partir da tabela
       "Disponibilidade / Desta aldeia" da pagina am_farm (que o script ja busca).
    
       A versao anterior errava a coluna: procurava classes que nao existem nessa
       tabela e acabava caindo num indice fixo, lendo o machado em vez da cavalaria.
       Agora o indice da coluna e descoberto pelo cabecalho: acha a celula cuja
       imagem e unit_light (independente de idioma) e le a MESMA posicao na linha
       de numeros. */
    /* Le a quantidade de uma unidade na tabela de tropas em casa (Disponibilidade),
       achando a coluna certa pela imagem/titulo do cabecalho — funciona em qualquer
       idioma e em mundos com conjuntos de unidades diferentes. reImg casa o src do
       icone (unit_light, unit_heavy...) e reTitulo casa o title em varios idiomas. */
    const LerUnidadeDisponivel = (data, reImg, reTitulo) => {
      try {
        const doc = new DOMParser().parseFromString(String(data), "text/html");
        const tabela = doc.querySelector("#units_home") || doc.querySelector("table.vis");
        if (!tabela) { return -1; }
        const linhas = Array.prototype.slice.call(tabela.querySelectorAll("tr"));
    
        let coluna = -1;
        for (let l = 0; l < linhas.length && coluna === -1; l++) {
          const cels = Array.prototype.slice.call(linhas[l].children);
          for (let c = 0; c < cels.length; c++) {
            const img = cels[c].querySelector("img");
            const src = img ? (img.getAttribute("src") || "") : "";
            const titulo = cels[c].getAttribute("title") || "";
            if (reImg.test(src) || reTitulo.test(titulo)) { coluna = c; break; }
          }
        }
        if (coluna === -1) { return -1; }
    
        for (let l = 0; l < linhas.length; l++) {
          const cels = Array.prototype.slice.call(linhas[l].children);
          const cel = cels[coluna];
          if (!cel || cel.tagName === "TH") { continue; }
          const bruto = String(cel.textContent).replace(/[^0-9]/g, "");
          if (bruto !== "") { return parseInt(bruto, 10); }
        }
      } catch (e) {}
      return -1;
    };
    const LerCavalariaDisponivel = (data) => LerUnidadeDisponivel(data,
      /unit_light\./i, /cavalaria leve|light cavalry|leichte kavallerie/i);
    const LerCavalariaPesadaDisponivel = (data) => LerUnidadeDisponivel(data,
      /unit_heavy\./i, /cavalaria pesada|heavy cavalry|schwere kavallerie|paladino a cavalo/i);
    let TemArqueiro = $.inArray('archer', game_data.units) > -1; let TemPaladino = $.inArray('knight', game_data.units) > -1; let Ids = []; let Grupos = []; let Ponteiros = []; let GrupoAtual = 0; let NumGrupos = 1; let Rodando = false; let Pausado = false; let Iniciado = false; let AtaquesEnviados = 0, AtaquesFalhados = 0, AtaquesPendentes = 0; let fhRankIntervalo = null; let fhTentativasIds = 0; let VelocidadeFator = (window.__ORK_FREIO__ ? 1.25 : 1); const NUM_FILAS = 5; const apenasnumeros = string => parseInt(string.replace(/[^0-9]/g, '')); const aleatorio = (inferior, superior) => Math.round(parseInt(inferior) + (Math.random() * (superior - inferior))); /* Quantas filas ficam ativas de acordo com a velocidade - quanto mais devagar, menos filas simultaneas (menos parece robo) */ const FilasParaVelocidade = (fator) => { if (fator <= 0.5) { return 1; } if (fator <= 1) { return 2; } if (fator <= 1.25) { return 3; } if (fator <= 1.5) { return 4; } return 5; }; const MontarGrupos = (n) => { Grupos = []; Ponteiros = []; let total = Ids.length; const elTot = document.getElementById("fh-total-aldeias"); if (elTot) { elTot.innerText = "(" + total + " aldeias)"; } if (total === 0 || n < 1) { return; } let base = Math.floor(total / n); let resto = total % n; let idx = 0; for (let g = 0; g < n; g++) { let tamanho = base + (g < resto ? 1 : 0); if (tamanho > 0) { Grupos.push(Ids.slice(idx, idx + tamanho)); Ponteiros.push(0); } idx += tamanho; } GrupoAtual = 0; }; const ProximaAldeia = () => { if (Grupos.length === 0) { return null; } let tentativas = 0; while (tentativas < Grupos.length) { let grupo = Grupos[GrupoAtual]; if (!grupo || grupo.length === 0) { GrupoAtual = (GrupoAtual + 1) % Grupos.length; tentativas++; continue; } let id_ = grupo[Ponteiros[GrupoAtual]]; Ponteiros[GrupoAtual]++; if (Ponteiros[GrupoAtual] >= grupo.length) { Ponteiros[GrupoAtual] = 0; } GrupoAtual = (GrupoAtual + 1) % Grupos.length; return id_; } return null; }; /* ===== POPUP Farm Hard 1.0 ===== */ const fhEstilo = document.createElement("style"); fhEstilo.innerHTML = `#farmhard-popup{position:fixed;top:70px;right:20px;width:600px;max-width:calc(100vw - 20px);background:linear-gradient(160deg,#1a1a1a,#050505);border:1px solid #3a3a3a;border-radius:12px;box-shadow:0 14px 34px rgba(0,0,0,0.75),0 0 0 1px rgba(255,196,0,0.12);font-family:"Segoe UI",Arial,Helvetica,sans-serif;color:#eee;z-index:999999;overflow:hidden}#farmhard-popup.fh-minimizado{width:360px}#farmhard-popup.fh-minimizado #farmhard-body{display:none}#farmhard-header{background:linear-gradient(100deg,#FFB800,#FFDD55 55%,#FFB800);color:#141200;padding:7px 10px 7px 12px;display:flex;align-items:center;gap:10px;cursor:move}.fh-hl{white-space:nowrap}.fh-hr{display:flex;gap:2px}#fh-title-main{font-size:13px;font-weight:800;letter-spacing:1.1px}#fh-title-version{font-size:8.5px;background:#141200;color:#FFC400;padding:1px 6px;border-radius:9px;margin-left:6px;font-weight:700;vertical-align:middle}#farmhard-status{flex:1;min-width:0;text-align:center;font-size:10px;font-weight:700;color:#3d3000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#farmhard-header span.fh-close{cursor:pointer;font-weight:bold;font-size:15px;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:0.15s;color:#141200}#farmhard-header span.fh-close:hover{background:rgba(0,0,0,0.18)}#farmhard-body{padding:9px;max-height:calc(100vh - 110px);overflow-y:auto}#farmhard-rank{display:flex;align-items:center;gap:9px;background:#161616;border:1px solid #2c2c2c;border-radius:8px;padding:6px 10px;margin-bottom:8px}#farmhard-rank-label{font-size:9.5px;color:#FFC400;font-weight:800;letter-spacing:0.5px;text-transform:uppercase;white-space:nowrap}#farmhard-rank-track{flex:1;height:9px;background:#0a0a0a;border:1px solid #2c2c2c;border-radius:6px;overflow:hidden}#farmhard-rank-fill{height:100%;width:0%;background:linear-gradient(90deg,#FFB800,#FFEB99);box-shadow:0 0 8px rgba(255,196,0,0.55);transition:width 0.5s ease}#farmhard-rank-texto{font-size:9.5px;color:#aaa;white-space:nowrap}#fh-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.fh-col{display:flex;flex-direction:column;gap:8px}.fh-card{background:#161616;border:1px solid #2c2c2c;border-radius:8px;padding:7px 9px}.fh-card-tit{font-size:9.5px;color:#888;font-weight:800;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:6px;cursor:default}#farmhard-speed-opcoes{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}.fh-vel{background:#1c1c1c;border:1px solid #333;border-radius:7px;padding:4px 1px;color:#ddd;font-weight:800;font-size:10.5px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:1px;transition:0.15s;font-family:inherit}.fh-vel:hover{border-color:#665400}.fh-vel.ativa{border-color:#FFC400;background:#241f08;color:#fff}.fh-vel-tag{font-size:7.5px;font-weight:700;white-space:nowrap}#fh-rot{display:grid;grid-template-columns:1fr 1fr;gap:4px}.fh-opcao{position:relative;display:flex;align-items:center;gap:6px;background:#1c1c1c;border:1px solid #2c2c2c;border-radius:7px;padding:4px 7px;font-size:10.5px;color:#ccc;cursor:pointer;transition:0.15s}.fh-opcao:hover{border-color:#665400;background:#1c1a10}.fh-opcao.ativa{border-color:#FFC400;background:#241f08;color:#fff}.fh-badge{width:16px;height:16px;flex-shrink:0;border-radius:50%;background:#2c2c2c;color:#999;font-size:9.5px;font-weight:800;display:flex;align-items:center;justify-content:center}.fh-opcao.ativa .fh-badge{background:#FFC400;color:#141200}.fh-opcao input{position:absolute;opacity:0;width:0;height:0}.fh-filtro-linha{display:flex;align-items:center;gap:6px;margin-bottom:4px}.fh-filtro-linha:last-child{margin-bottom:0}.fh-filtro-label{font-size:10.5px;color:#bbb;flex:1;white-space:nowrap;cursor:help}.fh-filtro-num{width:70px;background:#111;border:1px solid rgba(255,255,255,.12);color:#ececec;border-radius:6px;padding:2px 6px;font-size:11px}.fh-filtro-num:focus{outline:none;border-color:#e8ac0a}.fh-filtro-status{font-size:9.5px;color:#8a8a8a;min-width:36px;text-align:right}.fh-ritmo-btn{border:1px solid rgba(255,255,255,.14);background:#1c1c1c;color:#8a8a8a;border-radius:14px;padding:2px 12px;font-size:9.5px;font-weight:800;cursor:pointer;text-transform:uppercase;letter-spacing:.4px;transition:all .15s;min-width:48px}.fh-ritmo-btn:hover{filter:brightness(1.15)}.fh-ritmo-btn.on{background:linear-gradient(100deg,#e8ac0a,#ffdc63);color:#1a1400;border-color:transparent}#fh-rodape{display:flex;align-items:center;gap:8px;margin-top:8px}#farmhard-contador{display:flex;align-items:center;gap:4px;background:#161616;border:1px solid #2c2c2c;border-radius:8px;padding:4px 8px;flex:1}.fh-cont-item{display:flex;align-items:baseline;justify-content:center;gap:5px;flex:1}.fh-cont-item span{font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.4px}#farmhard-contador b{color:#FFC400;font-size:15px}#farmhard-botoes{display:flex;gap:6px}#farmhard-botoes button{padding:8px 16px;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:11px;transition:0.15s;font-family:inherit}#fh-iniciar{background:linear-gradient(100deg,#FFB800,#FFDD55);color:#141200;box-shadow:0 3px 10px rgba(255,184,0,0.35)}#fh-iniciar:hover{filter:brightness(1.08)}#fh-pausar{background:#232323;color:#FFC400;border:1px solid #3a3a3a !important}#fh-pausar:hover{background:#2b2b2b}#fh-fechar{background:#2a1010;color:#ff6b6b;border:1px solid #4a1c1c !important}#fh-fechar:hover{background:#341313}@media (max-width:640px){#fh-grid{grid-template-columns:1fr}#fh-rodape{flex-direction:column;align-items:stretch}#farmhard-botoes button{flex:1}#farmhard-rank-texto{display:none}}`; document.head.appendChild(fhEstilo); const fhHtml = `<div id="farmhard-popup"><div id="farmhard-header"><div class="fh-hl"><span id="fh-title-main">FARM HARD</span><span id="fh-title-version">4.2</span></div><div id="farmhard-status">Parado</div><div class="fh-hr"><span class="fh-close" id="fh-min" title="Minimizar">&ndash;</span><span class="fh-close" id="fh-x" title="Fechar">&times;</span></div></div><div id="farmhard-body"><div id="farmhard-rank"><div id="farmhard-rank-label">Top 1 Mundial</div><div id="farmhard-rank-track"><div id="farmhard-rank-fill"></div></div><div id="farmhard-rank-texto">Carregando...</div></div><div id="fh-grid"><div class="fh-col"><div class="fh-card"><div class="fh-card-tit">Velocidade de envio</div><div id="farmhard-speed-opcoes"><button class="fh-vel" data-fator="0.5">0.5x<span class="fh-vel-tag" style="color:#7ec8ff">Durma em Paz</span></button><button class="fh-vel ativa" data-fator="1">1x<span class="fh-vel-tag" style="color:#8a8a8a">Normal</span></button><button class="fh-vel" data-fator="1.25">1.25x<span class="fh-vel-tag" style="color:#7ed17e">Baixo risco</span></button><button class="fh-vel" data-fator="1.5">1.5x<span class="fh-vel-tag" style="color:#ffb347">Risco moderado</span></button><button class="fh-vel" data-fator="2">2x<span class="fh-vel-tag" style="color:#ff5f5f">Arriscado</span></button><button class="fh-vel" data-fator="2.5">2.5x<span class="fh-vel-tag" style="color:#ff2d2d">Muito arriscado</span></button></div></div><div class="fh-card"><div class="fh-card-tit">Rotação <span id="fh-total-aldeias" style="color:#FFC400;font-weight:800">(carregando aldeias...)</span></div><div id="fh-rot"><label class="fh-opcao ativa" title="Fila única (ex: 1 a 100)"><span class="fh-badge">1</span><span>Normal</span><input type="radio" name="fh-opcao" class="fh-opcao-input" value="1" checked></label><label class="fh-opcao" title="ex: 1-50 / 51-100"><span class="fh-badge">2</span><span>2 grupos</span><input type="radio" name="fh-opcao" class="fh-opcao-input" value="2"></label><label class="fh-opcao" title="ex: 1-30 / 31-60 / 61-100"><span class="fh-badge">3</span><span>3 grupos</span><input type="radio" name="fh-opcao" class="fh-opcao-input" value="3"></label><label class="fh-opcao" title="ex: 1-25 / 26-50 / 51-75 / 76-100"><span class="fh-badge">4</span><span>4 grupos</span><input type="radio" name="fh-opcao" class="fh-opcao-input" value="4"></label></div></div></div><div class="fh-col"><div class="fh-card" id="fh-clmin-box"><div class="fh-card-tit" title="CL/CP: farma se a aldeia tiver a leve OU a pesada mínima. Rec: só bárbara com recurso total acima do valor. 0 = off.">Filtros <span style="color:#555">(0 = off)</span></div><div class="fh-filtro-linha"><span class="fh-filtro-label" title="Cavalaria leve mínima na aldeia pra ela farmar (vale OU com a CP)">CL mín. por aldeia</span><input type="number" id="fh-clmin" class="fh-filtro-num" min="0" step="10" value="0"><span id="fh-clmin-status" class="fh-filtro-status">off</span></div><div class="fh-filtro-linha"><span class="fh-filtro-label" title="Cavalaria pesada mínima na aldeia pra ela farmar (vale OU com a CL)">CP mín. por aldeia</span><input type="number" id="fh-cpmin" class="fh-filtro-num" min="0" step="10" value="0"><span id="fh-cpmin-status" class="fh-filtro-status">off</span></div><div class="fh-filtro-linha"><span class="fh-filtro-label" title="Só ataca bárbara com pelo menos esse recurso total. 0 = padrão de 150k">Rec. mín. da bárbara</span><input type="number" id="fh-recmin" class="fh-filtro-num" min="0" step="10000" value="0"><span id="fh-recmin-status" class="fh-filtro-status">150k</span></div></div><div class="fh-card"><div class="fh-card-tit">Modos</div><div class="fh-filtro-linha"><span class="fh-filtro-label" title="Farma em blocos com pausas curtas e aleatórias — reduz captcha.">🕒 Ritmo humano</span><button type="button" id="fh-ritmo-btn" class="fh-ritmo-btn">off</button></div><div class="fh-filtro-linha"><span class="fh-filtro-label" title="Desligado (padrão): ataca a bárbara mais PERTO que passa nos filtros (distância do Assistente) — se a perto não tem recurso suficiente, vai pra próxima. Ligado: ataca a mais RICA, mesmo que esteja longe.">💰 Priorizar a mais rica</span><button type="button" id="fh-modon-btn" class="fh-ritmo-btn">off</button></div></div></div></div><div id="fh-rodape"><div id="farmhard-contador"><div class="fh-cont-item"><span>Enviados</span><b id="farmhard-contador-valor">0</b></div><div class="fh-cont-item"><span>Falhados</span><b id="farmhard-contador-falhas" style="color:#ff6b6b">0</b></div><div class="fh-cont-item"><span>Pendentes</span><b id="farmhard-contador-pend" style="color:#7ec8ff">0</b></div></div><div id="farmhard-botoes"><button id="fh-iniciar">Iniciar</button><button id="fh-pausar">Pausar</button><button id="fh-fechar">Fechar</button></div></div></div></div>`; const fhWrap = document.createElement("div"); fhWrap.innerHTML = fhHtml; document.body.appendChild(fhWrap.firstChild); (() => { const bm = document.getElementById("fh-min"); if (!bm) { return; } let fhMin = false; try { fhMin = localStorage.getItem("fh_minimizado") === "1"; } catch (e) {} const aplicar = () => { const p = document.getElementById("farmhard-popup"); if (p) { p.classList.toggle("fh-minimizado", fhMin); } bm.innerHTML = fhMin ? "+" : "&ndash;"; bm.title = fhMin ? "Expandir" : "Minimizar"; }; aplicar(); bm.addEventListener("mousedown", (e) => { e.stopPropagation(); }); bm.addEventListener("click", (e) => { e.stopPropagation(); fhMin = !fhMin; aplicar(); try { localStorage.setItem("fh_minimizado", fhMin ? "1" : "0"); } catch (e2) {} }); })(); const AtualizarStatus = (texto) => { const el = document.getElementById("farmhard-status"); if (el) { el.innerText = texto; } }; const AtualizarContador = () => { const el = document.getElementById("farmhard-contador-valor"); if (el) { el.innerText = AtaquesEnviados; } const elF = document.getElementById("farmhard-contador-falhas"); if (elF) { elF.innerText = AtaquesFalhados; } const elP = document.getElementById("farmhard-contador-pend"); if (elP) { elP.innerText = AtaquesPendentes; } }; const AtualizarBarraRanking = (meu, top) => { let pct = Math.min(100, (meu / top) * 100); const fill = document.getElementById("farmhard-rank-fill"); const texto = document.getElementById("farmhard-rank-texto"); if (fill) { fill.style.width = pct.toFixed(4) + "%"; } if (texto) { texto.innerText = meu.toLocaleString("pt-BR") + " / " + top.toLocaleString("pt-BR") + " (" + pct.toFixed(4) + "%)"; } }; const BuscarRanking = () => { $.ajax({ url: "/game.php?village=" + game_data.village.id + "&screen=info_player&mode=awards&group=0", type: "GET", headers: { "Upgrade-Insecure-Requests": 1 }, success: (data) => { let labelAlvo = null; let $doc = $(data); $doc.find("*").each( function() { if (labelAlvo !== null) { return false; } let txt = $(this).text(); if (txt) { txt = txt.replace(/\s+/g, " ").trim(); } if (txt && ["saqueador de recursos do dia","saqueador de recursos do dia!","looter of the day","resource looter of the day","pluenderer des tages","plunderer of the day","saqueador del dia","pilleur du jour","saccheggiatore del giorno","plunderaar van de dag","lupiezca dnia","jefe saqueador"].indexOf(txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) !== -1) { let escopo = this.parentElement; for (let up = 0; up < 5 && escopo; up++) { let pb = $(escopo).find(".progress-bar .label").first(); if (pb.length) { labelAlvo = pb; return false; } escopo = escopo.parentElement; } } }); if (labelAlvo) { let texto = labelAlvo.text().replace(/\s+/g, ""); let partes = texto.split("/"); if (partes.length === 2) { let meu = parseInt(partes[0].replace(/[^0-9]/g, '')); let top = parseInt(partes[1].replace(/[^0-9]/g, '')); if (!isNaN(meu) && !isNaN(top) && top > 0) { Lockr.set('FarmHard_Meu', meu); Lockr.set('FarmHard_Top', top); AtualizarBarraRanking(meu, top); } } } else { const texto = document.getElementById("farmhard-rank-texto"); if (texto) { texto.innerText = "Conquista nao encontrada"; } } }, error: () => { const texto = document.getElementById("farmhard-rank-texto"); if (texto) { texto.innerText = "Erro ao buscar ranking"; } } }); }; let fhMeuCache = Lockr.get('FarmHard_Meu'); let fhTopCache = Lockr.get('FarmHard_Top'); if (fhMeuCache && fhTopCache) { AtualizarBarraRanking(fhMeuCache, fhTopCache); } BuscarRanking(); fhRankIntervalo = setInterval(BuscarRanking, 60000); window.__FarmHardMostrar = () => { const p = document.getElementById("farmhard-popup"); if (p) { p.style.display = "block"; } }; const fhHeader = document.getElementById("farmhard-header"); let fhArrastando = false, fhOffX = 0, fhOffY = 0; fhHeader.addEventListener("mousedown", (e) => { fhArrastando = true; const rect = document.getElementById("farmhard-popup").getBoundingClientRect(); fhOffX = e.clientX - rect.left; fhOffY = e.clientY - rect.top; }); document.addEventListener("mousemove", (e) => { if (!fhArrastando) { return; } const p = document.getElementById("farmhard-popup"); if (!p) { return; } p.style.left = (e.clientX - fhOffX) + "px"; p.style.top = (e.clientY - fhOffY) + "px"; p.style.right = "auto"; }); document.addEventListener("mouseup", () => { fhArrastando = false; }); document.querySelectorAll(".fh-vel").forEach((btn) => { btn.addEventListener("click", () => { VelocidadeFator = parseFloat(btn.getAttribute("data-fator")); /* Freio ligado: piso de 1.25x (o freio agora prioriza farm + cunhagem coordenados,    entao o farm roda num ritmo util mas ainda cauteloso, nao no minimo absoluto).    Se voce escolher menos que 1.25x com o freio ligado, sobe pra 1.25x. */ if (window.__ORK_FREIO__ && VelocidadeFator < 1.25) { VelocidadeFator = 1.25; AtualizarStatus("FREIO: velocidade minima 1.25x"); console.log("[OROCHIKING] Freio: Farm Hard no piso de 1.25x."); } document.querySelectorAll(".fh-vel").forEach((b) => { b.classList.remove("ativa"); }); btn.classList.add("ativa"); }); }); /* Filtro de CL minima: salva a preferencia e atualiza o status ao digitar */ (() => { const elCl = document.getElementById("fh-clmin"); if (!elCl) { return; } try { const salvo = localStorage.getItem("fh_cl_minimo"); if (salvo !== null) { elCl.value = salvo; } } catch (e) {} LerCLMinimo(); AtualizarStatusCL(); const elCp = document.getElementById("fh-cpmin"); if (elCp) { try { const sp = localStorage.getItem("fh_cp_minimo"); if (sp !== null) { elCp.value = sp; } } catch (e) {} LerCPMinimo(); AtualizarStatusCP(); elCp.addEventListener("input", () => { LerCPMinimo(); try { localStorage.setItem("fh_cp_minimo", String(CPMinimo)); } catch (e) {} if (CPMinimo <= 0) { UltimaCPLida = null; } AtualizarStatusCP(); }); } elCl.addEventListener("input", () => { LerCLMinimo(); try { localStorage.setItem("fh_cl_minimo", String(CLMinimo)); } catch (e) {} if (CLMinimo <= 0) { UltimaCLLida = null; AldeiasPuladasCL = 0; } AtualizarStatusCL(); }); })(); (() => { const btnR = document.getElementById('fh-ritmo-btn'); if (btnR) { try { if (localStorage.getItem('fh_ritmo_humano') === '1') { btnR.classList.add('on'); btnR.innerText = 'on'; } } catch (e) {} btnR.addEventListener('click', () => { const ligar = !btnR.classList.contains('on'); btnR.classList.toggle('on', ligar); btnR.innerText = ligar ? 'on' : 'off'; try { localStorage.setItem('fh_ritmo_humano', ligar ? '1' : '0'); } catch (e) {} if (ligar) { if (Rodando) { rhLigar(); } } else { rhDesligar(); } }); } (() => { const btnN = document.getElementById('fh-modon-btn'); if (!btnN) { return; } try { if (localStorage.getItem('fh_prioriza_rica') === '1') { btnN.classList.add('on'); btnN.innerText = 'on'; } } catch (e) {} btnN.addEventListener('click', () => { const ligar = !btnN.classList.contains('on'); btnN.classList.toggle('on', ligar); btnN.innerText = ligar ? 'on' : 'off'; try { localStorage.setItem('fh_prioriza_rica', ligar ? '1' : '0'); } catch (e) {} AtualizarStatus(ligar ? 'Priorizando a bárbara mais rica' : 'Priorizando a bárbara mais perto'); console.log('[OROCHIKING] Farm Hard: ' + (ligar ? 'priorizando a MAIS RICA' : 'priorizando a MAIS PERTO (padrão)')); }); })(); (() => { const elR = document.getElementById('fh-recmin'); if (!elR) { return; } try { const salvo = localStorage.getItem('fh_recurso_minimo'); if (salvo !== null) { elR.value = salvo; } } catch (e) {} LerRecursoMinimo(); AtualizarStatusRec(); elR.addEventListener('input', () => { LerRecursoMinimo(); try { localStorage.setItem('fh_recurso_minimo', String(RecursoMinimo)); } catch (e) {} AtualizarStatusRec(); }); })(); })(); /* Pegar ID das Aldeias */ $.ajax({ url: "/game.php?village=" + game_data.village.id + "&screen=info_player&id=" + game_data.player.id, data: {}, type: "GET", headers: { "Upgrade-Insecure-Requests": 1 }, success: (data) => { let _ids = data.match(/(data-id="(\d+)")+/g); if (_ids) { for (let x of _ids) { x = x.replace(/[^0-9]/g, ''); Ids.push(x); } } if (data.match(/Player\.getAllVillages/)) { $.ajax({ url: "/game.php?village=" + game_data.village.id + "&screen=info_player&ajax=fetch_villages&player_id=" + game_data.player.id, data: {}, type: "GET", dataType: "json", success: (data) => { let _ids_ = data.villages ? data.villages.match(/(data-id="(\d+)")+/g) : null; if (_ids_) { for (let r of _ids_) { r = r.replace(/[^0-9]/g, ''); Ids.push(r); } } MontarGrupos(NumGrupos); }, error: () => { MontarGrupos(NumGrupos); } }); } else { MontarGrupos(NumGrupos); } }, error: () => { AtualizarStatus("Erro ao buscar aldeias"); } }); /* Função Enviar Atk Botão C - AS */ const EnviarAtaque_ = (Relatorio_id_, id_) => { AtaquesPendentes++; AtualizarContador(); $.ajax({ url: "/game.php?village=" + id_ + "&screen=am_farm&mode=farm&ajaxaction=farm_from_report&json=1&&h=" + csrf_token + "&client_time=" + Math.round(Timing.getCurrentServerTime() / 1e3), data: { report_id: Relatorio_id_ }, type: "POST", dataType: "json", headers: { "TribalWars-Ajax": 1 }, success: (resp, textStatus, xhr) => { AtaquesPendentes--; if (xhr && xhr.status === 200 && resp && !resp.error) { AtaquesEnviados++; } else { AtaquesFalhados++; /* falhou: libera o relatorio pra essa barbara poder ser atacada de novo */ LiberarRelatorio(Relatorio_id_); RegistrarMotivoFalha(resp && resp.error ? resp.error : ('HTTP ' + (xhr ? xhr.status : '?'))); } AtualizarContador(); }, error: (xhr) => { AtaquesPendentes--; AtaquesFalhados++; LiberarRelatorio(Relatorio_id_); RegistrarMotivoFalha('rede ' + (xhr && xhr.status ? xhr.status : 'sem resposta')); AtualizarContador(); } }); }; class Alvo { constructor(Relatorio_id_, Madeira, Argila, Ferro, Distancia) { this.Relatorio_id_ = Relatorio_id_; this.Madeira = Madeira; this.Argila = Argila; this.Ferro = Ferro; this.Distancia = (typeof Distancia === 'number' ? Distancia : 999999); } get Recursos() { return this.Madeira + this.Argila + this.Ferro; } } /* Cada fila tem um indice fixo - se a velocidade atual pede menos filas do que o indice desta, ela so espera (nao farma) ate a velocidade subir de novo */ const Trabalhador = (indiceFila) => { if (!Rodando) { return; } if (Pausado) { setTimeout(() => Trabalhador(indiceFila), 300); return; } let filasAtivas = FilasParaVelocidade(VelocidadeFator); if (indiceFila >= filasAtivas) { setTimeout(() => Trabalhador(indiceFila), 1000); return; } if (Grupos.length === 0) { MontarGrupos(NumGrupos); } if (Grupos.length === 0) { setTimeout(() => Trabalhador(indiceFila), 300); return; } let inicio = Date.now(); let id_ = ProximaAldeia(); if (!id_) { setTimeout(() => Trabalhador(indiceFila), 300); return; } $.ajax({ url: "/game.php?village=" + id_ + "&screen=am_farm", type: "GET", headers: { "Upgrade-Insecure-Requests": 1 }, success: (data) => { LerCLMinimo(); LerCPMinimo(); LerRecursoMinimo(); /* Filtro de cavalaria: pula a aldeia se ela nao tiver a CL minima NEM a CP minima.    Ou seja, basta cumprir UM dos dois pra farmar (permite mesclar CL com CP,    como em aldeias que tem pesada junto com lanca). So bloqueia quando a leitura    funcionou (-1 = markup nao lido, nao bloqueia). */ if (CLMinimo > 0 || CPMinimo > 0) { const clDisponivel = (CLMinimo > 0) ? LerCavalariaDisponivel(data) : -1; const cpDisponivel = (CPMinimo > 0) ? LerCavalariaPesadaDisponivel(data) : -1; if (CLMinimo > 0) { UltimaCLLida = clDisponivel; AtualizarStatusCL(); } if (CPMinimo > 0) { UltimaCPLida = cpDisponivel; AtualizarStatusCP(); } const clOk = (CLMinimo > 0) && (clDisponivel === -1 || clDisponivel >= CLMinimo); const cpOk = (CPMinimo > 0) && (cpDisponivel === -1 || cpDisponivel >= CPMinimo); /* passa se qualquer criterio ativo foi cumprido (ou nao pode ser lido) */ const podeFarmar = clOk || cpOk; if (!podeFarmar) { AldeiasPuladasCL++; AtualizarStatusCL(); AtualizarStatusCP(); let gastoPulo = Date.now() - inicio; let alvoIntervaloPulo = Math.round(1000 / VelocidadeFator); let minimoPulo = Math.max(75, Math.round(150 / VelocidadeFator)); let basePulo = Math.max(minimoPulo, alvoIntervaloPulo - gastoPulo); let esperaPulo = aleatorio(Math.round(basePulo * 0.85), Math.round(basePulo * 1.15)); setTimeout(() => Trabalhador(indiceFila), esperaPulo); return; } } let Alvos = []; if (!Lockr.get('Alvos_Muralha')) { Lockr.set('Alvos_Muralha', []); } let array = Lockr.get('Alvos_Muralha'); $(data).find('tr[id^=village_]').each( function(e) { let id = $(this).attr('id').match(/village_(\d+)/)[1]; let coord = $(this).find('td').eq(3).text().match(/(\d+)\|(\d+)/g); let Relatorio_id_ = $(this).find('td').eq(3).find('a').attr('href').match(/view=(\d+)/)[1]; /* distancia que o proprio Assistente mostra (td[7]), ex '1', '1.4', '3'.    Usada so quando o modo N1-N8 esta ligado, pra priorizar as mais perto. */ let Distancia = parseFloat(String($(this).find('td').eq(7).text()).replace(',', '.')); if (isNaN(Distancia)) { Distancia = 999999; } let Madeira = apenasnumeros($(this).find('td').eq(5).find('span.nowrap').eq(0).text()); let Argila = apenasnumeros($(this).find('td').eq(5).find('span.nowrap').eq(1).text()); let Ferro = apenasnumeros($(this).find('td').eq(5).find('span.nowrap').eq(2).text()); let Muralha = apenasnumeros($(this).find('td').eq(6).text()); /* PROTEÇÃO PRA MUNDO NOVO / QUALQUER RODADA:    Antes, se uma linha não tivesse o botão C (comum em bárbara nunca atacada    numa rodada recém-aberta), o .attr("class") vinha undefined e o .match()    QUEBRAVA a passada inteira — o farm parava de achar alvos. Agora:    1) pega o botão C com segurança (string vazia se não existir);    2) considera o alvo válido se o C existe E não está desabilitado;    3) Muralha pode ser NaN em layout diferente — tratamos como 0, não trava. */ var _btnC = $(this).find('a.farm_icon.farm_icon_c'); var _classeC = (_btnC.length ? (_btnC.attr('class') || '') : ''); var _cAtivo = (_btnC.length > 0 && _classeC.indexOf('farm_icon_disabled') === -1); var _muralhaNum = isNaN(Muralha) ? 0 : Muralha; if( $(this).find('td').eq(5).find('span').eq(0).text() !== "?" ) { if (_cAtivo) { if (_muralhaNum > 0) { let aux = [ id, "&", coord, "&", _muralhaNum ]; if(array.indexOf(aux.join('')) === -1 ) { array.push(aux.join('')); } } Alvos.push(new Alvo(Relatorio_id_, Madeira, Argila, Ferro, Distancia)); } } }); Lockr.set('Alvos_Muralha', array); if (Alvos.length !== 0) { /* ESCOLHA DO ALVO — tres correcoes:    (1) antes exigia madeira, argila E ferro >= 50 mil ao mesmo tempo, pulando barbaras ricas        com recurso desigual; agora vale o TOTAL (mesmo minimo de 150 mil que ja existia na pratica);    (2) antes pegava o PRIMEIRO da lista; agora pega o MAIS RICO;    (3) antes varias aldeias batiam na mesma barbara usando o MESMO relatorio velho (o relatorio so        atualiza quando o ataque chega), e so o primeiro ataque trazia recurso. Agora cada relatorio        e usado uma unica vez: quando o ataque chega, sai um relatorio novo e o alvo volta a valer. */ let melhor = null; let minRec = MinimoEfetivo(); /* modoDistancia ligado (Farmar N1-N8): escolhe o alvo MAIS PROXIMO (a distancia    que o proprio Assistente mostra). Desligado (padrao, rodadas de conquistador):    escolhe o MAIS RICO, exatamente como antes. Todo o resto (filtros CL/CP/recurso,    botao C, 1 ataque por relatorio) e identico nos dois modos. */ /* v51: PADRAO = a barbara MAIS PERTO (distancia do Assistente) que passa nos filtros de recurso e ainda nao tem ataque a caminho pelo mesmo relatorio. Igual era antes da v31. Empate de distancia: a mais rica. So com o botao 'Priorizar a mais rica' ligado ele volta a escolher pela riqueza. */ let modoRica = false; try { modoRica = (localStorage.getItem('fh_prioriza_rica') === '1'); } catch (e) {} for (let t = 0; t < Alvos.length; t++) { if (Alvos[t].Recursos < minRec) { continue; } if (RelatoriosUsados.has(Alvos[t].Relatorio_id_)) { AlvosPuladosRepetidos++; continue; } if (melhor === null) { melhor = Alvos[t]; } else if (modoRica) { if (Alvos[t].Recursos > melhor.Recursos) { melhor = Alvos[t]; } } else { if (Alvos[t].Distancia < melhor.Distancia || (Alvos[t].Distancia === melhor.Distancia && Alvos[t].Recursos > melhor.Recursos)) { melhor = Alvos[t]; } } } if (melhor !== null) { MarcarRelatorioUsado(melhor.Relatorio_id_); EnviarAtaque_(melhor.Relatorio_id_, id_); } } let gasto = Date.now() - inicio; let alvoIntervalo = Math.round(1000 / VelocidadeFator); let minimo = Math.max(75, Math.round(150 / VelocidadeFator)); let base = Math.max(minimo, alvoIntervalo - gasto); let espera = aleatorio(Math.round(base * 0.85), Math.round(base * 1.15)); setTimeout(() => Trabalhador(indiceFila), espera); }, error: () => { let gasto = Date.now() - inicio; let alvoIntervalo = Math.round(1000 / VelocidadeFator); let minimo = Math.max(75, Math.round(150 / VelocidadeFator)); let base = Math.max(minimo, alvoIntervalo - gasto); let espera = aleatorio(Math.round(base * 0.85), Math.round(base * 1.15)); setTimeout(() => Trabalhador(indiceFila), espera); } }); }; const IniciarFilas = () => { AtualizarStatus("Rodando (" + Ids.length + " aldeias, " + Grupos.length + " grupos)"); for (let l = 0; l < NUM_FILAS; l++) { setTimeout(() => Trabalhador(l), l * 150); } }; const __ids = () => { if (Ids[0] !== undefined) { if (Grupos.length === 0) { MontarGrupos(NumGrupos); } IniciarFilas(); } else { fhTentativasIds++; if (fhTentativasIds > 20) { AtualizarStatus("Erro: aldeias nao carregaram. Feche e abra novamente."); return; } setTimeout(__ids, 1000); } }; document.getElementById("fh-iniciar").onclick = () => { Rodando = true; Pausado = false; /* Freio ligado forca o Ritmo Humano: as pausas do farm sao a janela em que a    cunhagem pode rodar sem competir com ele. */ try { const b = document.getElementById("fh-ritmo-btn"); if (window.__ORK_FREIO__ && b && !b.classList.contains("on")) { b.classList.add("on"); b.innerText = "on"; try { localStorage.setItem("fh_ritmo_humano","1"); } catch(e){} } if ((window.__ORK_FREIO__ || (b && b.classList.contains("on")))) { rhLigar(); } } catch (e) {} document.getElementById("fh-pausar").innerText = "Pausar"; AtualizarStatus("Iniciando..."); if (!Iniciado) { Iniciado = true; fhTentativasIds = 0; setTimeout(__ids, 500); } else { AtualizarStatus("Rodando..."); } }; document.getElementById("fh-pausar").onclick = () => { if (!Rodando) { return; } Pausado = !Pausado; document.getElementById("fh-pausar").innerText = Pausado ? "Continuar" : "Pausar"; AtualizarStatus(Pausado ? "Pausado" : "Rodando..."); }; const FecharTudo = () => { Rodando = false; try { window.__ORK_FARM_EM_PAUSA__ = true; } catch (e) {} rhDesligar(); if (fhRankIntervalo) { clearInterval(fhRankIntervalo); } const p = document.getElementById("farmhard-popup"); if (p) { p.remove(); } window.__FarmHardAtivo = false; }; document.getElementById("fh-fechar").onclick = FecharTudo; document.getElementById("fh-x").onclick = FecharTudo; document.querySelectorAll(".fh-opcao-input").forEach((el) => { el.addEventListener("change", (ev) => { NumGrupos = parseInt(ev.target.value); MontarGrupos(NumGrupos); document.querySelectorAll(".fh-opcao").forEach((o) => { o.classList.remove("ativa"); }); ev.target.closest(".fh-opcao").classList.add("ativa"); }); }); } _FarmarAS(); })();
  }

  function checaFarmDormindo() {
    return checaFarmar();
  }
  function rodarFarmDormindo() {
    rodarFarmar();
    try { localStorage.setItem('ork_retomar_dormindo', '1'); } catch (e) {}
    setTimeout(function () {
      try {
        var botaoLento = document.querySelector('.fh-vel[data-fator="0.5"]');
        if (botaoLento) { botaoLento.click(); }
        var grupo2 = document.querySelector('.fh-opcao-input[value="2"]');
        if (grupo2 && !grupo2.checked) {
          grupo2.checked = true;
          grupo2.dispatchEvent(new Event('change', { bubbles: true }));
        }
        var fechar = document.getElementById('fh-fechar');
        if (fechar) {
          fechar.addEventListener('click', function () {
            try { localStorage.removeItem('ork_retomar_dormindo'); } catch (e) {}
          });
        }
        var iniciar = document.getElementById('fh-iniciar');
        if (iniciar) { iniciar.click(); }
      } catch (e) {
        console.error('[OROCHIKING] erro ao configurar Farm Dormindo', e);
      }
    }, 600);
  }

  function checaAtaque() {
    return !!(window.game_data && game_data.screen === 'overview_villages' && game_data.mode === 'combined');
  }
  function rodarAtaqueOriginal() {
    (function () {
      if (1) {
        // ==========================================================
        //  ATAQUE MASS v2
        //  Mudanças nesta versão:
        //   1) Coordenadas em formato normal "X|Y" (sem "&"), uma por
        //      linha ou separadas por vírgula. O script resolve o ID
        //      da aldeia sozinho, consultando /map/village.txt (arquivo
        //      público do próprio jogo, usado por qualquer ferramenta
        //      de mapa).
        //   2) Seleção do prédio-alvo da catapulta.
        //   3) Sincronização de chegada: você escolhe um horário
        //      (hora do servidor) e o script calcula o atraso de envio
        //      de cada linha (origem->destino) pra todas chegarem juntas.
        //
        //  NÃO incluído (proposital): loop automático infinito que
        //  reenvia sozinho sem você clicar em nada. Ver explicação
        //  que te mandei no chat.
        // ==========================================================
    
        var Aldeia = function (_coord, _id, _alvoId, _alvoC, _data, _time) {
          this.coord = _coord;
          this.id = _id;
          this.alvoId = _alvoId;
          this.alvoC = _alvoC;
          this.data = _data;
          this.time = _time;
        };
    
        aldeias = [];
        aldeiasAux = [];
        aldeiasLength = 0;
        deuError = 0;
    
        setParam = function (name, value) {
          localStorage.setItem(name, value);
        };
        getParam = function (name) {
          return localStorage.getItem(name);
        };
    
        random = function (inferior, superior) {
          var numPossibilidades = superior - inferior,
            aleat = Math.random() * numPossibilidades;
          return Math.round(parseInt(inferior) + aleat);
        };
    
        usefullVillages = function () {
          $(".quickedit-vn").each(function (index) {
            aldeias[index] = new Aldeia(
              $(this).find("a span").text().match(/\d{1,3}[|]\d{1,3}/g)[0],
              $(this).data("id"),
              0,
              0,
              {},
              ""
            );
          });
        };
    
        // ----------------------------------------------------------
        // 1) Parser de coordenadas "normais" (X|Y) + resolução de ID
        // ----------------------------------------------------------
    
        // Aceita "555|551", separado por linha, vírgula ou espaço.
        // Também aceita, por compatibilidade, o formato antigo "id&555|551".
        parseCoordsInput = function (raw) {
          raw = (raw || "").replace(/\r/g, "");
          // Aceita quebra de linha, vírgula, ponto-e-vírgula OU espaço como separador
          var parts = raw.split(/[\n,;\s]+/).map(function (s) {
            return s.trim();
          }).filter(Boolean);
          var coords = [];
          parts.forEach(function (p) {
            var legacy = p.match(/^\d+&(\d{1,3}\|\d{1,3})$/);
            var plain = p.match(/^(\d{1,3})\|(\d{1,3})$/);
            if (legacy) {
              coords.push(legacy[1]);
            } else if (plain) {
              coords.push(plain[1] + "|" + plain[2]);
            }
          });
          return coords;
        };
    
        // Baixa o mapa público de aldeias do mundo (id,nome,x,y,dono,pontos)
        // e monta um dicionário "X|Y" -> id
        villageMapCache = null;
        fetchVillageMap = function (callback) {
          if (villageMapCache) {
            callback(villageMapCache);
            return;
          }
          $.ajax({
            url: "/map/village.txt",
            type: "GET",
            dataType: "text",
            success: function (data) {
              var map = {};
              var lines = data.replace(/\r/g, "").split("\n");
              var parsed = 0;
              for (var i = 0; i < lines.length; i++) {
                if (!lines[i]) continue;
                var cols = lines[i].split(",");
                // formato: id,nome,x,y,dono,pontos
                var id = (cols[0] || "").trim(),
                  x = (cols[2] || "").trim(),
                  y = (cols[3] || "").trim();
                if (id !== "" && x !== "" && y !== "") {
                  map[x + "|" + y] = id;
                  parsed++;
                }
              }
              console.log("[AtaqueMass] village.txt: " + lines.length + " linhas, " + parsed + " aldeias mapeadas");
              villageMapCache = map;
              callback(map);
            },
            error: function (xhr) {
              console.error("[AtaqueMass] falha ao buscar /map/village.txt", xhr.status, xhr.statusText);
              var msgFalhaMapa = "Não consegui carregar /map/village.txt para resolver as coordenadas (status " + xhr.status + "). Tente novamente.";
              if (window.__ORK_LOOP_SILENCIOSO__) {
                console.warn("[AtaqueMass] " + msgFalhaMapa);
              } else {
                alert(msgFalhaMapa);
              }
            },
          });
        };
    
        // Recebe lista de coords "X|Y", devolve string no formato interno
        // "id&X|Y,id&X|Y,..." (mesmo formato que o resto do script já usa)
        resolveCoordsToIdString = function (coordsList, callback) {
          fetchVillageMap(function (map) {
            var resolved = [],
              naoEncontradas = [];
            coordsList.forEach(function (c) {
              if (map[c]) {
                resolved.push(map[c] + "&" + c);
              } else {
                naoEncontradas.push(c);
              }
            });
            if (naoEncontradas.length) {
              console.log("Coordenadas não encontradas no mapa: " + naoEncontradas.join(", "));
            }
            callback(resolved.join(","), naoEncontradas);
          });
        };
    
        getAlvos = function (alvos) {
          var infoAlvos = { id: [], coord: [] };
          if (alvos === "") {
            // string vazia = "sem alvos em cache", não "sem argumento".
            // Não cair no fallback de reler a caixa de texto (que agora é formato puro, sem id).
            return infoAlvos;
          }
          if (alvos === null || typeof alvos === "undefined" || alvos == -1) {
            // Sem cache algum ainda: usa a lista já resolvida (id&coord), nunca o texto
            // cru da caixa (que é só "X|Y", sem id, e quebraria o split abaixo).
            var cached = getParam("coordsIds");
            alvos = cached ? cached.split(",") : [];
          } else {
            alvos = alvos.split(",");
          }
          var infoAlvosLen = alvos.length;
          for (var k = 0; k < infoAlvosLen; k++) {
            alvos[k] = alvos[k].split("&");
            infoAlvos.id[k] = alvos[k][0];
            infoAlvos.coord[k] = alvos[k][1];
          }
          return infoAlvos;
        };
    
        sortCoords = function () {
          var len = aldeias.length,
            lenAlvos,
            x,
            y,
            prim,
            seg,
            coord = [],
            id,
            string = "",
            objAlvo = getAlvos(getParam("coordsRes"));
          lenAlvos = objAlvo.coord.length;
          if (lenAlvos <= 0) {
            objAlvo = getAlvos(getParam("coordsIds"));
            lenAlvos = objAlvo.coord.length;
          }
          for (var i = 0; i < len; i++) {
            if (!lenAlvos) {
              // Recicla a lista de alvos já resolvida (id&coord) salva no localStorage,
              // e não o texto cru da caixa (que agora é só "X|Y", sem id).
              objAlvo = getAlvos(getParam("coordsIds"));
              lenAlvos = objAlvo.coord.length;
            }
            x = aldeias[i].coord.split("|");
            for (var j = 0; j < lenAlvos; j++) {
              y = objAlvo.coord[j].split("|");
              if (!j) prim = Math.sqrt(Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2));
              seg = Math.sqrt(Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2));
              if (prim >= seg) {
                prim = seg;
                coord = y;
                id = objAlvo.id[j];
              }
            }
            prim = objAlvo.coord.indexOf(coord.join("|"));
            objAlvo.coord.splice(prim, 1);
            objAlvo.id.splice(prim, 1);
            lenAlvos--;
            aldeias[i].alvoC = coord.join("|");
            aldeias[i].alvoId = id;
          }
          seg = objAlvo.coord.length;
          for (var m = 0; m < seg; m++) {
            string += objAlvo.id[m] + "&" + objAlvo.coord[m];
            if (m < seg - 1) string += ",";
          }
          setParam("coordsRes", string);
          $("#combined_table tbody tr:eq(0) th:eq(0)").html(
            "<b>Alvos Restantes: " + lenAlvos + "</b>"
          );
        };
    
        removeVillage = function (id) {
          var len = aldeias.length;
          while (len && len--) {
            if (aldeias[len].id == id) {
              aldeias.splice(len, 1);
              return;
            }
          }
        };
        removeVillageAux = function (id) {
          var len = aldeiasAux.length;
          while (len--) {
            if (aldeiasAux[len].id == id) {
              aldeiasAux.splice(len, 1);
              return;
            }
          }
        };
    
        // ----------------------------------------------------------
        // Helpers de tempo (sincronização de chegada)
        // ----------------------------------------------------------
        durationToMs = function (str) {
          // Aceita "H:MM:SS" ou "MM:SS"
          if (!str) return null;
          var p = str.trim().split(":").map(Number);
          if (p.some(isNaN)) return null;
          if (p.length === 3) return (p[0] * 3600 + p[1] * 60 + p[2]) * 1000;
          if (p.length === 2) return (p[0] * 60 + p[1]) * 1000;
          return null;
        };
    
        // Constrói o timestamp (ms, hora do servidor) do próximo horário
        // HH:MM:SS informado pelo usuário, a partir de agora.
        buildTargetTimestamp = function (hh, mm, ss) {
          var now = Timing.getCurrentServerTime();
          var d = new Date(now);
          d.setHours(hh, mm, ss, 0);
          var ts = d.getTime();
          if (ts <= now) ts += 24 * 3600 * 1000; // já passou hoje, agenda pra amanhã
          return ts;
        };
    
        // ----------------------------------------------------------
        // Contagem regressiva ao vivo na coluna "Status" enquanto o
        // ataque ainda não foi disparado
        // ----------------------------------------------------------
        countdownTimers = {};
    
        formatCountdown = function (ms) {
          var s = Math.max(0, Math.ceil(ms / 1000));
          var hh = Math.floor(s / 3600),
            mm = Math.floor((s % 3600) / 60),
            ss = s % 60;
          var pad = function (n) {
            return n < 10 ? "0" + n : "" + n;
          };
          return (hh > 0 ? hh + ":" + pad(mm) : mm) + ":" + pad(ss);
        };
    
        startCountdown = function (rowIndex, fireAtMs) {
          stopCountdown(rowIndex);
          var cell = function () {
            return $("#amxResultsTable tbody tr:eq(" + rowIndex + ") td:eq(3)");
          };
          var tick = function () {
            var rem = fireAtMs - Date.now();
            if (rem <= 0) {
              cell().text("Enviando...").css({ "text-align": "center", color: "#92400e", "font-weight": "600" });
              return;
            }
            cell()
              .text("Envio em " + formatCountdown(rem))
              .css({ "text-align": "center", color: "var(--text-lo)", "font-family": "'JetBrains Mono',monospace" });
          };
          tick();
          countdownTimers[rowIndex] = setInterval(tick, 1000);
        };
    
        stopCountdown = function (rowIndex) {
          if (countdownTimers[rowIndex]) {
            clearInterval(countdownTimers[rowIndex]);
            delete countdownTimers[rowIndex];
          }
        };
    
        // ----------------------------------------------------------
        // Barra de progresso — carregar 100+ ataques demora dezenas de
        // segundos (o jogo limita a velocidade das requisições), então
        // sem isso parece que travou.
        // ----------------------------------------------------------
        progressState = { done: 0, total: 0 };
    
        progressStart = function (n) {
          progressState.done = 0;
          progressState.total = n * 2; // duas fases: consultar tropas + confirmar
          $("#amxProgress").show();
          progressRender();
        };
    
        progressTick = function () {
          progressState.done = Math.min(progressState.done + 1, progressState.total);
          progressRender();
        };
    
        progressRender = function () {
          var pct = progressState.total ? Math.round((progressState.done / progressState.total) * 100) : 0;
          $("#amxProgressFill").css("width", pct + "%");
          // "total" guarda passos internos (2 por aldeia: consultar tropas + confirmar) —
          // mostramos em aldeias pra ficar mais claro pra quem tá acompanhando.
          var aldeiasFeitas = Math.floor(progressState.done / 2);
          var aldeiasTotal = Math.round(progressState.total / 2);
          $("#amxProgressText").text(
            "Carregando ataques... " + aldeiasFeitas + "/" + aldeiasTotal + " aldeias (" + pct + "%)" +
            (pct < 100 ? " — isso pode levar até 1 minuto ou mais em lotes grandes, aguarde" : "")
          );
        };
    
        progressHide = function () {
          $("#amxProgress").hide();
        };
    
        // Callback usado pelo Demolidor pra emendar a próxima rodada assim que a
        // atual terminar de enviar. Fora do Demolidor fica null e só mostramos o alerta normal.
        onRoundDoneCallback = null;
        finishRound = function () {
          var cb = onRoundDoneCallback;
          onRoundDoneCallback = null;
          if (cb) {
            cb();
          } else {
            alert("Todos os comandos foram enviados!");
          }
        };
    
        // ----------------------------------------------------------
        // Ciclo da rodada: estimativa de quando as tropas voltam pra casa,
        // pra você saber quando dá pra mandar de novo (farm/demolidor).
        // ----------------------------------------------------------
        roundReturnAtMs = 0;
        cycleTimer = null;
    
        startCycleCountdown = function () {
          clearInterval(cycleTimer);
          if (!roundReturnAtMs) return;
          $("#amxCycleStatus").show();
          $("#amxRepeatBtn").prop("disabled", true).removeClass("amx-btn-ready").text("Aguardando tropas voltarem...");
          var tick = function () {
            var rem = roundReturnAtMs - Date.now();
            if (rem <= 0) {
              clearInterval(cycleTimer);
              $("#amxCycleText").text("✅ Tropas devem ter voltado — já dá pra mandar de novo.");
              $("#amxRepeatBtn").prop("disabled", false).addClass("amx-btn-ready").text("🔁 Repetir Mesmos Ataques");
              return;
            }
            $("#amxCycleText").text("⏳ Tropas retornando... pronto em " + formatCountdown(rem) + " (estimativa)");
          };
          tick();
          cycleTimer = setInterval(tick, 1000);
        };
    
        
        // ----------------------------------------------------------
        // firstRequest: consulta a janela de comando de cada aldeia
        // (sem alterações na lógica de tropas, só adiciona o prédio-alvo)
        // ----------------------------------------------------------
        firstRequest = function () {
          var comando = $("#comando").val();
          var spear = getParam("spear"),
            sword = getParam("sword"),
            axe = getParam("axe"),
            archer = getParam("archer"),
            spy = getParam("spy"),
            light = getParam("light"),
            heavy = getParam("heavy"),
            marcher = getParam("marcher"),
            ram = getParam("ram"),
            catapult = getParam("catapult"),
            snob = getParam("snob"),
            building = getParam("buildingAlvo"),
            count = 0,
            i = 0;
          aldeiasLength = aldeias.length;
          var totalPrimeiraPassada = aldeias.length; // fixo: não muda mesmo com erros removendo aldeias durante a passada
          var concluidosPrimeiraPassada = 0; // conta CADA resposta (sucesso ou erro) uma única vez
          for (let aldeia of aldeias) {
            setTimeout(
              function () {
                $.ajax({
                  type: "GET",
                  url:
                    "/game.php?village=" +
                    aldeia.id +
                    "&screen=place&ajax=command&target=" +
                    aldeia.alvoId +
                    "&client_time=" +
                    Math.round(Timing.getCurrentServerTime() / 1e3),
                  data: {},
                  dataType: "json",
                  headers: { "TribalWars-Ajax": 1 },
                  success: function (data) {
                    progressTick();
                    var string,
                      len,
                      tropas = {},
                      spearN, swordN, axeN, archerN, spyN, marcherN, lightN, heavyN, ramN, catapultN, snobN, first;
                    if (!data.error) {
                      data = $(data.response.dialog);
                      string = data.serialize().split("&");
                      len = string.length;
                      spearN = jQuery("#unit_input_spear", data).data("all-count");
                      swordN = jQuery("#unit_input_sword", data).data("all-count");
                      axeN = jQuery("#unit_input_axe", data).data("all-count");
                      archerN = jQuery("#unit_input_archer", data).data("all-count");
                      spyN = jQuery("#unit_input_spy", data).data("all-count");
                      marcherN = jQuery("#unit_input_marcher", data).data("all-count");
                      lightN = jQuery("#unit_input_light", data).data("all-count");
                      heavyN = jQuery("#unit_input_heavy", data).data("all-count");
                      ramN = jQuery("#unit_input_ram", data).data("all-count");
                      catapultN = jQuery("#unit_input_catapult", data).data("all-count");
                      snobN = jQuery("#unit_input_snob", data).data("all-count");
                      for (var l = 0; l < len; l++) {
                        tropas[string[l].split("=")[0]] = string[l].split("=")[1];
                      }
                      first = aldeia.alvoC.split("|");
                      tropas.x = first[0];
                      tropas.y = first[1];
                      tropas.spear = spearN > parseInt(spear) ? spear : spearN;
                      tropas.sword = swordN > parseInt(sword) ? sword : swordN;
                      tropas.axe = axeN > parseInt(axe) ? axe : axeN;
                      tropas.archer = archerN > parseInt(archer) ? archer : archerN;
                      tropas.spy = spyN > parseInt(spy) ? spy : spyN;
                      tropas.marcher = marcherN > parseInt(marcher) ? marcher : marcherN;
                      tropas.light = lightN > parseInt(light) ? light : lightN;
                      tropas.heavy = parseInt(heavy) < heavyN ? parseInt(heavy) : heavyN;
                      tropas.ram = ramN > parseInt(ram) ? ram : ramN;
                      tropas.catapult = catapultN > parseInt(catapult) ? catapult : catapultN;
                      tropas.snob = parseInt(snob) && parseInt(snobN) ? 1 : 0;
                      tropas["string"] = "";
    
                      // NOVO: prédio-alvo da catapulta
                      if (parseInt(tropas.catapult) > 0 && building) {
                        tropas.building = building;
                        aldeia.building = building; // guardamos aqui também: o passo seguinte
                        // (secondRequest) substitui aldeia.data inteiro pelo dialog do
                        // servidor, que traria o building padrão do jogo, apagando essa escolha.
                      }
    
                      // Escolta das levas de nobre: prioriza cavalaria leve; se a aldeia não tiver
                      // cavalaria leve (ou não tiver o suficiente pra todas as levas extras), usa
                      // cavalaria pesada disponível no lugar — tanto na leva principal quanto nas extras.
                      var lightRequested = parseInt(light) || 0;
                      if (lightRequested > 0 && lightN <= 0 && heavyN > 0) {
                        var heavyRequestedMain = parseInt(heavy) || 0;
                        tropas.heavy = heavyRequestedMain > 0 ? Math.min(heavyRequestedMain, heavyN) : heavyN;
                      }
    
                      if (snobN > 1 && parseInt(snob) > 1) {
                        var extraCount = Math.min(parseInt(snob), snobN) - 1; // quantas levas extras (2..snob)
                        var precisaLight = 25 * extraCount;
                        var temLightSuficiente = precisaLight > 0 && lightN >= precisaLight;
    
                        if (temLightSuficiente) {
                          tropas.light = tropas.light ? tropas.light - precisaLight : 0;
                        } else if (heavyN > 0) {
                          // Não tem cavalaria leve suficiente pras levas extras -> reserva cavalaria
                          // pesada da leva principal pra sobrar pras extras.
                          tropas.heavy = tropas.heavy ? Math.max(0, tropas.heavy - 25 * extraCount) : tropas.heavy;
                        }
    
                        for (var k = 2; k <= snob && k <= snobN; k++) {
                          tropas["string"] += "train[" + k + "][axe]=0&";
                          tropas["string"] += "train[" + k + "][marcher]=0&";
                          if (temLightSuficiente) {
                            tropas["string"] += "train[" + k + "][light]=25&train[" + k + "][heavy]=0&";
                          } else {
                            tropas["string"] += "train[" + k + "][light]=0&train[" + k + "][heavy]=" + (heavyN > 0 ? 25 : 0) + "&";
                          }
                          tropas["string"] += "train[" + k + "][snob]=1";
                          if (k < snobN) tropas["string"] += "&";
                        }
                      }
                      if (comando == "attack") {
                        tropas.attack = "l";
                      } else if (comando == "support") {
                        tropas.support = "l";
                      } else {
                        UI.ErrorMessage("Tipo de comando não especificado!");
                        throw new Error("Tipo de comando não especificado!");
                      }
                      aldeia.data = tropas;
                      i++;
                    } else if (data.error == _("9a07c3a91c3f2b7a6a8bc675d1bcb913")) {
                      // Mesmo limite de "5 no mesmo segundo", só que já nessa primeira consulta
                      // de tropas — comum quando muitas aldeias são consultadas quase juntas.
                      // Não é erro definitivo: recoloca pra tentar de novo na próxima passada.
                      console.log("First Request: " + data.error + " — reagendando " + aldeia.coord);
                      removeVillage(aldeia.id);
                      aldeiasAux.push(aldeia);
                      aldeiasLength--;
                    } else {
                      removeVillage(aldeia.id);
                      console.log("First Request: " + data.error);
                    }
                    concluidosPrimeiraPassada++;
                    if (concluidosPrimeiraPassada == totalPrimeiraPassada) secondRequest();
                  },
                  error: function (data) {
                    progressTick();
                    console.log("Error First Request: " + data.status + " {" + data.error + "}");
                    // Qualquer erro (não só 429/405) volta pra fila de retry — antes isso
                    // travava a passada inteira (throw quebrado), deixando aldeias sem enviar.
                    removeVillage(aldeia.id);
                    aldeiasAux.push(aldeia);
                    aldeiasLength--;
                    concluidosPrimeiraPassada++;
                    if (concluidosPrimeiraPassada == totalPrimeiraPassada) secondRequest();
                  },
                });
              },
              // Ritmo de engatilhamento (consultar tropas) — 20% mais rápido que o original (200-220ms).
              // Isso é só a fase de consultar/montar os comandos; o envio final continua no
              // ritmo original de ~5/seg, por pedido explícito.
              random(160, 176) + random(160, 176) * count
            );
            count++;
          }
        };
    
        // ----------------------------------------------------------
        // scheduleSend: agenda e dispara o envio final (popup_command) de UMA aldeia.
        // Chamada assim que essa aldeia termina de confirmar — não espera as outras.
        // Com sincronismo desligado, respeita só o ritmo de ~5 envios/seg (sendCursor);
        // com sincronismo ligado, calcula o atraso individual pro horário de chegada.
        // ----------------------------------------------------------
        scheduleSend = function (aldeia, syncOn, targetTs) {
          var delayMs;
          var durMsGeneric = durationToMs(aldeia.time);
          if (syncOn) {
            if (durMsGeneric == null) {
              // não conseguiu ler a duração, cai no ritmo padrão de ~5/seg
              var nowFallback = Date.now();
              sendCursor = Math.max(sendCursor, nowFallback);
              delayMs = sendCursor - nowFallback;
              sendCursor += 200;
            } else {
              // A "Duração" exibida pelo jogo é arredondada pro segundo cheio (geralmente
              // pra cima), então usar ela ao pé da letra pode fazer o ataque chegar um
              // pouquinho ANTES do horário escolhido. Aqui adicionamos uma margem de
              // segurança de 1s pra nunca chegar antes — só depois, na pior das hipóteses.
              var SAFETY_MARGIN_MS = 1000;
              var nowServer = Timing.getCurrentServerTime();
              delayMs = targetTs + (aldeia.retryOffsetMs || 0) - durMsGeneric - nowServer + SAFETY_MARGIN_MS;
              if (delayMs < 100) {
                console.log(
                  "Aviso: " + aldeia.coord + " -> " + aldeia.alvoC + " precisaria ter sido enviado no passado para chegar no horário escolhido. Enviando o quanto antes."
                );
                var nowLate = Date.now();
                sendCursor = Math.max(sendCursor, nowLate);
                delayMs = sendCursor - nowLate;
                sendCursor += 200;
              }
            }
          } else {
            // Sem sincronismo: manda assim que confirmar, só respeitando o ritmo de ~5/seg
            // — é aqui que ganhamos o tempo que antes ficava esperando a leva inteira
            // confirmar e você clicar em Enviar.
            var now = Date.now();
            sendCursor = Math.max(sendCursor, now);
            delayMs = sendCursor - now + (aldeia.retryOffsetMs || 0);
            sendCursor += 200;
          }
    
          if (aldeia.rowIndex) {
            startCountdown(aldeia.rowIndex, Date.now() + delayMs);
          }
    
          // Estimativa de quando a tropa volta pra aldeia de origem: ida (duração) + volta
          // (aprox. igual à ida). Usamos isso pra saber quando toda a rodada "esvaziou".
          if (durMsGeneric != null) {
            var candidateReturn = Date.now() + delayMs + 2 * durMsGeneric;
            if (candidateReturn > roundReturnAtMs) roundReturnAtMs = candidateReturn;
          }
    
          setTimeout(function () {
            $.ajax({
              url:
                "/game.php?village=" +
                aldeia.id +
                "&screen=place&ajaxaction=popup_command&h=" +
                csrf_token +
                "&client_time=" +
                Math.round(Timing.getCurrentServerTime() / 1e3),
              data: aldeia.data,
              type: "POST",
              dataType: "json",
              headers: { "TribalWars-Ajax": 1 },
              success: function (data) {
                stopCountdown(aldeia.rowIndex);
                if (!data.error) {
                  $("#amxResultsTable tbody tr:eq(" + aldeia.rowIndex + ") td:eq(3)")
                    .text("ENVIADO!")
                    .css("text-align", "center")
                    .css("color", "#0d1117")
                    .css("font-weight", "700")
                    .css("background-color", "#4ade80");
                  removeVillage(aldeia.id);
                } else if (data.error != _("9a07c3a91c3f2b7a6a8bc675d1bcb913")) {
                  $("#amxResultsTable tbody tr:eq(" + aldeia.rowIndex + ") td:eq(3)")
                    .text("Erorr!")
                    .css("text-align", "center")
                    .css("color", "#fff")
                    .css("font-weight", "700")
                    .css("background-color", "#ff5c5c");
                  removeVillage(aldeia.id);
                  console.log("Third Request: " + data.error);
                } else {
                  // Limite do jogo: já tem 5 comandos chegando nessa aldeia no mesmo segundo.
                  // Não é erro definitivo — tira dessa passada e recoloca pra tentar de novo,
                  // igual já fazíamos com rate-limit (429). Se tiver sincronismo de chegada
                  // ligado, empurra 1s a mais no horário-alvo dela a cada tentativa, senão
                  // ela cairia sempre no mesmo segundo lotado de novo.
                  $("#amxResultsTable tbody tr:eq(" + aldeia.rowIndex + ") td:eq(3)")
                    .text("5 no mesmo segundo — tentando de novo...")
                    .css("text-align", "center")
                    .css("color", "#1a0e05")
                    .css("font-weight", "700")
                    .css("background-color", "#eab308");
                  console.log("Third Request 2: " + data.error + " — reagendando " + aldeia.coord + " -> " + aldeia.alvoC);
                  aldeia.retryOffsetMs = (aldeia.retryOffsetMs || 0) + 1000;
                  removeVillage(aldeia.id);
                  removeVillageAux(aldeia.id);
                  aldeiasAux.push(aldeia);
                }
                onSendSettled();
              },
              error: function (data) {
                stopCountdown(aldeia.rowIndex);
                console.log("Error Third Request: " + data.status + " {" + data.error + "}");
                // Qualquer erro (não só 429/405) volta pra fila de retry — antes isso
                // travava a passada inteira (throw quebrado), deixando aldeias sem enviar.
                removeVillage(aldeia.id);
                removeVillageAux(aldeia.id);
                aldeiasAux.push(aldeia);
                aldeiasLength--;
                onSendSettled();
              },
            });
          }, delayMs);
        };
    
        // Controla quando essa "passada" (leva de confirmações + envios) termina de
        // verdade, pra então fechar a rodada (finishRound) ou tentar de novo as que
        // caíram por rate-limit (aldeiasAux) — sem depender de nenhum clique.
        onSendSettled = function () {
          sendSettledCount++;
          checkPassComplete();
        };
    
        var MAX_TENTATIVAS_ALDEIA = 8;
    
        checkPassComplete = function () {
          if (!allConfirmsDone) return; // ainda tem confirmação em andamento, espera
          if (sendSettledCount < confirmedForSend) return; // ainda faltam envios terminarem
          startCycleCountdown();
    
          // BUG CORRIGIDO: antes a condição era só "!aldeias.length". Quando TODAS as
          // aldeias já tinham saído de `aldeias` (as enviadas com sucesso saem, e as que
          // caíram no limite de "5 no mesmo segundo" também saem — mas vão pra fila
          // aldeiasAux), a rodada era encerrada e a fila de retentativa ia junto pro lixo.
          // Resultado: de 100 comandos, os ~10 que bateram no limite nunca eram reenviados.
          // Agora a rodada só fecha quando as DUAS filas estão vazias.
          if (aldeiasAux.length) {
            // Conta a tentativa de cada uma e desiste das que já insistiram demais,
            // pra não criar um ciclo infinito martelando o servidor (risco de captcha).
            var paraTentarDeNovo = [];
            for (var t = 0; t < aldeiasAux.length; t++) {
              var alv = aldeiasAux[t];
              alv.tentativas = (alv.tentativas || 0) + 1;
              if (alv.tentativas <= MAX_TENTATIVAS_ALDEIA) {
                paraTentarDeNovo.push(alv);
              } else {
                console.warn("[AtaqueMass] desistindo de " + alv.coord + " -> " + alv.alvoC +
                  " após " + (alv.tentativas - 1) + " tentativas.");
              }
            }
            aldeiasAux = [];
            aldeias = $.merge(aldeias, paraTentarDeNovo);
          }
    
          if (!aldeias.length) {
            finishRound();
          } else {
            console.log("[AtaqueMass] reenviando " + aldeias.length + " comando(s) que não passaram na passada anterior.");
            deuError = 1; // limpa a tabela antes de mostrar a nova tentativa (retry)
            firstRequest();
          }
        };
    
        // ----------------------------------------------------------
        // secondRequest: confirma cada aldeia e, assim que ela confirma, já agenda o
        // envio dela (scheduleSend) — não espera a leva inteira confirmar nem precisa
        // de clique em "Enviar". É isso que reduz o tempo total: enquanto as últimas
        // aldeias ainda estão confirmando, as primeiras já estão sendo enviadas.
        // ----------------------------------------------------------
        secondRequest = function () {
          let count = 0,
            i = 0;
          var totalSegundaPassada = aldeias.length; // fixo: não muda mesmo com erros removendo aldeias durante a passada
          var concluidosSegundaPassada = 0; // conta CADA resposta (sucesso ou erro) uma única vez
          if (deuError) {
            garantirTabelaResultados().empty().append(resultHeaderRow());
            deuError = 0;
          }
    
          // Sincronismo de chegada é calculado uma vez por passada (mesmo horário-alvo
          // pra todo mundo); sem sincronismo, cada aldeia só pega a próxima vaga livre
          // no ritmo de ~5/seg (sendCursor), assim que confirma.
          var syncOn = $("#syncChegada").is(":checked");
          var targetTs = null;
          if (syncOn) {
            var timeVal = $("#syncTime").val(); // "HH:MM" ou "HH:MM:SS"
            var tParts = (timeVal || "").split(":").map(function (n) {
              return parseInt(n) || 0;
            });
            if (!timeVal) {
              if (window.__ORK_LOOP_SILENCIOSO__) {
                console.warn("[AtaqueMass] Sincronizar chegada marcado sem horário definido — usando escalonamento padrão.");
              } else {
                alert("Sincronizar chegada está marcado, mas nenhum horário foi definido. Ligando o escalonamento padrão.");
              }
              syncOn = false;
            } else {
              targetTs = buildTargetTimestamp(tParts[0] || 0, tParts[1] || 0, tParts[2] || 0);
            }
          }
          sendCursor = Date.now();
          confirmedForSend = 0;
          sendSettledCount = 0;
          allConfirmsDone = false;
    
          for (let aldeia of aldeias) {
            setTimeout(
              function () {
                $.ajax({
                  type: "POST",
                  url:
                    "/game.php?village=" +
                    aldeia.id +
                    "&screen=place&ajax=confirm&h=" +
                    csrf_token +
                    "&client_time=" +
                    Math.round(Timing.getCurrentServerTime() / 1e3),
                  data: aldeia.data,
                  dataType: "json",
                  headers: { "TribalWars-Ajax": 1 },
                  success: function (data) {
                    progressTick();
                    if (!data.error) {
                      string = aldeia.data["string"];
                      aldeia.data = $(data.response.dialog).serialize() + (string.length ? "&" + string : "");
                      // Reinjeta o prédio-alvo escolhido: o serialize() acima trouxe o
                      // "building" padrão do dialog do servidor, sobrescrevendo nossa escolha.
                      if (aldeia.building) {
                        aldeia.data = aldeia.data.replace(/([&?]|^)building=[^&]*/, "");
                        aldeia.data += "&building=" + encodeURIComponent(aldeia.building);
                      }
                      // Buscamos a linha da "Duração" pelo texto do rótulo, não por posição fixa —
                      // quando a aldeia leva catapultas, o jogo insere uma linha extra ("Alvo da
                      // catapulta") antes da Duração, o que deslocava tr:eq(3) pra linha errada
                      // em parte dos ataques (por isso alguns sincronizavam certo e outros não).
                      aldeia.time = jQuery("table.vis:eq(0) tr", data.response.dialog)
                        .filter(function () {
                          return $(this).find("td:eq(0)").text().indexOf("Dura") !== -1;
                        })
                        .find("td:eq(1)")
                        .text()
                        .trim();
                      if (!aldeia.time) {
                        // fallback pra posição antiga, caso o texto do rótulo mude
                        aldeia.time = jQuery("table.vis:eq(0) tr:eq(3) td:eq(1)", data.response.dialog).text();
                      }
                      garantirTabelaResultados().append(
                        '<tr><td style="text-align:center"><a href="/game.php?village=' +
                          aldeia.id +
                          '">' +
                          aldeia.coord +
                          '</a></td><td style="text-align:center"><a href="/game.php?village=' +
                          game_data.village.id +
                          "&screen=info_village&id=" +
                          aldeia.alvoId +
                          '">' +
                          aldeia.alvoC +
                          '</a></td><td style="text-align:center;">' +
                          aldeia.time +
                          '</td><td id="status">Na fila...</td></tr>'
                      );
                      // Guarda a linha exata dessa aldeia na tabela — as respostas do
                      // servidor não chegam necessariamente na mesma ordem das aldeias,
                      // então não dá pra confiar num contador sequencial pra achar a linha certa depois.
                      aldeia.rowIndex = garantirTabelaResultados().find("tr").length - 1;
                      i++;
                      confirmedForSend++;
                      scheduleSend(aldeia, syncOn, targetTs);
                    } else if (data.error == _("9a07c3a91c3f2b7a6a8bc675d1bcb913")) {
                      // Mesmo limite de "5 no mesmo segundo" do Third Request, só que aqui na
                      // confirmação — muito comum quando várias aldeias confirmam quase juntas.
                      // Não é erro definitivo: tira dessa passada e recoloca pra tentar de novo
                      // na próxima passada, em vez de descartar a aldeia de vez.
                      console.log("Second Request: " + data.error + " — reagendando " + aldeia.coord);
                      removeVillage(aldeia.id);
                      aldeiasAux.push(aldeia);
                      aldeiasLength--;
                    } else {
                      console.log("Second Request: " + data.error + " coord: " + aldeia.coord);
                      removeVillage(aldeia.id);
                      aldeiasLength--;
                    }
                    concluidosSegundaPassada++;
                    if (concluidosSegundaPassada == totalSegundaPassada) {
                      progressHide();
                      $("#listCommands").before(
                        "<p>Engatilhados " + confirmedForSend + " comando(s) — enviando automaticamente no ritmo de ~5/seg...</p>"
                      );
                      allConfirmsDone = true;
                      checkPassComplete();
                    }
                  },
                  error: function (data) {
                    progressTick();
                    console.log("Error Second Request: " + data.status + " {" + data.error + "}");
                    // Qualquer erro (não só 429/405) volta pra fila de retry — antes isso
                    // travava a passada inteira (throw quebrado), deixando aldeias sem enviar.
                    removeVillage(aldeia.id);
                    removeVillageAux(aldeia.id);
                    aldeiasAux.push(aldeia);
                    aldeiasLength--;
                    concluidosSegundaPassada++;
                    if (concluidosSegundaPassada == totalSegundaPassada) {
                      progressHide();
                      $("#listCommands").before(
                        "<p>Engatilhados " + confirmedForSend + " comando(s) — enviando automaticamente no ritmo de ~5/seg...</p>"
                      );
                      allConfirmsDone = true;
                      checkPassComplete();
                    }
                  },
                });
              },
              random(160, 176) + random(160, 176) * count
            );
            count++;
          }
        };
    
        // ----------------------------------------------------------
        // Interface — "console de comando" (tema escuro)
        // ----------------------------------------------------------
    
        // Linha de cabeçalho da tabela de resultados nativa do jogo
        // Tabela de resultados SEPARADA da tabela de aldeias de origem (#combined_table).
        // Antes o script reaproveitava a mesma tabela pra mostrar os resultados —
        // isso APAGAVA as linhas com os checkboxes de origem, e a partir da 2a rodada
        // não sobrava nenhuma aldeia pra reler. Guardar em cache era um remendo; a
        // causa de verdade era essa. Agora os resultados vão pra uma tabela própria,
        // e a tabela de origem nunca é tocada — fica sempre disponível pra reler.
        garantirTabelaResultados = function () {
          if (!$("#amxResultsTable").length) {
            $(
              '<table id="amxResultsTable" class="vis" style="margin-top:10px;width:100%">' +
              "<tbody></tbody></table>"
            ).insertAfter("#combined_table");
          }
          return $("#amxResultsTable tbody");
        };
    
        resultHeaderRow = function () {
          return (
            '<tr id="listCommands">' +
            '<th class="amx-th">Aldeias Próprias</th>' +
            '<th class="amx-th">Aldeias Alvos</th>' +
            '<th class="amx-th">Duração</th>' +
            '<th class="amx-th">Status</th>' +
            "</tr>"
          );
        };
    
        injectStyles = function () {
          if (document.getElementById("amx-style")) return;
          var css =
            "@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');" +
            ".amx{--bg:#14151a;--surface:#1c1d24;--surface-2:#22232b;--border:#33343d;--text-hi:#f2f3f5;--text-lo:#9a9ba3;--ember:#f5c518;--ember-dim:#d4a70f;--steel:#5eead4;--danger:#ff6b6b;--ok:#4ade80;--radius:10px;font-family:'Inter',sans-serif;color:var(--text-hi);background:var(--bg);border:1px solid var(--border);border-radius:14px;padding:20px 22px;margin:14px 0;box-shadow:0 10px 30px rgba(0,0,0,.4);}" +
            ".amx *{box-sizing:border-box;}" +
            ".amx-head{display:flex;align-items:center;gap:10px;margin-bottom:4px;}" +
            ".amx-flame{width:9px;height:9px;border-radius:50%;background:var(--ember);box-shadow:0 0 10px 2px rgba(255,138,61,.6);flex:none;}" +
            ".amx-title{font-family:'Cinzel',serif;font-weight:700;font-size:15px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-hi);}" +
            ".amx-sub{font-size:11px;color:var(--text-lo);margin:2px 0 14px 19px;}" +
            ".amx-divider{height:1px;background:linear-gradient(90deg,var(--ember) 0,var(--border) 18%,var(--border) 100%);margin:16px 0;border:none;}" +
            ".amx-label{font-size:10px;text-transform:uppercase;letter-spacing:.09em;color:var(--text-lo);font-weight:700;margin-bottom:8px;display:block;}" +
            ".amx-hint{font-size:11px;color:var(--text-lo);margin-top:6px;}" +
            ".amx-hint b{color:var(--steel);}" +
            ".amx-troops{display:flex;flex-wrap:wrap;gap:8px;}" +
            ".amx-troop{display:flex;align-items:center;gap:6px;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:5px 8px;}" +
            ".amx-troop img{width:20px;height:20px;filter:brightness(1.15);}" +
            ".amx-troop input{width:56px;background:var(--surface-2);border:1px solid var(--border);border-radius:5px;color:var(--text-hi);font-family:'JetBrains Mono',monospace;font-size:12px;padding:4px 6px;text-align:right;}" +
            ".amx-troop input:focus{outline:none;border-color:var(--ember);}" +
            ".amx-textarea{width:100%;min-height:110px;background:var(--surface);border:1px solid var(--border);border-radius:8px;color:var(--text-hi);font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.5;padding:10px;resize:vertical;}" +
            ".amx-textarea:focus{outline:none;border-color:var(--ember);}" +
            ".amx-count{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--steel);font-weight:600;margin-top:6px;}" +
            ".amx-row{display:flex;flex-wrap:wrap;gap:20px;align-items:flex-end;margin-top:14px;}" +
            ".amx-field{display:flex;flex-direction:column;min-width:180px;}" +
            ".amx-field select,.amx-field input[type=number],.amx-field input[type=time]{background:var(--surface-2);border:1px solid var(--border);border-radius:8px;color:var(--text-hi);font-family:'Inter',sans-serif;font-size:13px;padding:8px 10px;}" +
            ".amx-field select:focus,.amx-field input:focus{outline:none;border-color:var(--ember);box-shadow:0 0 0 3px rgba(255,138,61,.15);}" +
            ".amx-sync{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}" +
            ".amx-switch{position:relative;width:36px;height:20px;flex:none;}" +
            ".amx-switch input{opacity:0;width:0;height:0;}" +
            ".amx-slider{position:absolute;inset:0;background:var(--surface-2);border:1px solid var(--border);border-radius:20px;cursor:pointer;transition:.15s;}" +
            ".amx-slider:before{content:'';position:absolute;width:14px;height:14px;left:2px;top:2px;background:var(--text-lo);border-radius:50%;transition:.15s;}" +
            ".amx-switch input:checked + .amx-slider{background:var(--ember-dim);border-color:var(--ember);}" +
            ".amx-switch input:checked + .amx-slider:before{transform:translateX(16px);background:var(--ember);box-shadow:0 0 6px 1px rgba(255,138,61,.6);}" +
            ".amx-time{display:flex;align-items:center;}" +
            ".amx-time input[type=time]{width:130px;font-size:14px;font-family:'JetBrains Mono',monospace;color-scheme:dark;}" +
            ".amx-actions{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap;align-items:center;}" +
            ".amx-btn{font-family:'Inter',sans-serif;font-weight:600;font-size:12px;letter-spacing:.03em;padding:9px 18px;border-radius:8px;cursor:pointer;border:1px solid var(--border);background:var(--surface);color:var(--text-hi);transition:.15s;}" +
            ".amx-btn:hover{border-color:var(--text-lo);}" +
            ".amx-btn-primary{background:linear-gradient(180deg,var(--ember) 0,var(--ember-dim) 100%);border-color:var(--ember-dim);color:#1a0e05;}" +
            ".amx-btn-primary:hover{filter:brightness(1.08);}" +
            ".amx-btn:disabled{opacity:.5;cursor:not-allowed;}" +
            ".amx-btn-ready{background:linear-gradient(180deg,var(--ok),#22a35c);border-color:#22a35c;color:#06210f;font-weight:700;animation:amxPulse 1.4s ease-in-out infinite;}" +
            "@keyframes amxPulse{0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,.5);}50%{box-shadow:0 0 0 6px rgba(74,222,128,0);}}" +
            ".amx-th{text-align:center;color:#1a0e05;background:var(--ember);font-family:'Inter',sans-serif;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.04em;padding:8px;}" +
            ".amx-progress{display:none;margin-top:14px;}" +
            ".amx-progress-track{width:100%;height:8px;background:var(--surface-2);border:1px solid var(--border);border-radius:99px;overflow:hidden;}" +
            ".amx-progress-fill{height:100%;width:0%;background:linear-gradient(90deg,var(--ember-dim),var(--ember));transition:width .25s ease;}" +
            ".amx-progress-text{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--steel);margin-top:6px;}" +
            ".amx-section{margin-top:18px;padding-top:16px;border-top:1px solid var(--border);}" +
            ".amx-section-head{display:flex;align-items:center;gap:8px;margin-bottom:10px;}" +
            ".amx-section-icon{width:8px;height:8px;border-radius:2px;background:var(--steel);flex:none;}" +
            ".amx-section-title{font-family:'Cinzel',serif;font-weight:700;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:var(--text-hi);}" +
            ".amx-buildings{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;}" +
            ".amx-chip{display:flex;align-items:center;gap:6px;background:var(--surface);border:1px solid var(--border);border-radius:99px;padding:6px 12px;font-size:12px;cursor:pointer;user-select:none;font-family:'Inter',sans-serif;color:var(--text-hi);}" +
            ".amx-chip:focus{outline:none;}" +
            ".amx-chip:hover{border-color:var(--text-lo);}" +
            ".amx-chip input{accent-color:var(--ember);cursor:pointer;}" +
            ".amx-chip.amx-checked{border-color:var(--ember-dim);background:rgba(255,138,61,.12);color:var(--ember);}" +
            ".amx-chip.amx-sending{border-color:#eab308;background:rgba(234,179,8,.15);color:#eab308;animation:amxPulse2 1.2s ease-in-out infinite;}" +
            ".amx-chip.amx-done{border-color:var(--ok);background:rgba(74,222,128,.15);color:var(--ok);}" +
            ".amx-chip.amx-done:after{content:' ✓';font-weight:700;}" +
            "@keyframes amxPulse2{0%,100%{box-shadow:0 0 0 0 rgba(234,179,8,.5);}50%{box-shadow:0 0 0 5px rgba(234,179,8,0);}}" +
            ".amx-order-badge{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:var(--ember);color:#1a0e05;font-size:10px;font-weight:700;margin-left:2px;}" +
            ".amx-number{width:70px;}";
          $("<style id='amx-style'>" + css + "</style>").appendTo("head");
        };
    
        main = function () {
          var coords = getParam("coords"),
            comando = getParam("comando"),
            building = getParam("buildingAlvo"),
            i,
            tropas = "",
            href,
            spearIndex,
            snobIndex;
          coords = !coords ? "" : coords;
          comando = !comando ? "" : comando;
          building = !building ? "" : building;
    
          injectStyles();
    
          spearIndex = $('#combined_table tr:eq(0) th a img[src*="spear"]').parent().parent().index();
          snobIndex = $('#combined_table tr:eq(0) th a img[src*="snob"]').parent().parent().index();
          for (i = spearIndex; i <= snobIndex; i++) {
            href = $("#combined_table tr:eq(0) th:eq(" + i + ") a img").attr("src");
            tropas +=
              "<div class='amx-troop'><img src=" +
              href +
              ">" +
              "<input type='text' id='" +
              href.match(/unit_?[a-z]+/g)[0].split("_")[1] +
              "'/></div>";
          }
    
          var buildingList = [
            ["main", "Edifício Principal"],
            ["wall", "Muralha"],
            ["hide", "Esconderijo"],
            ["storage", "Armazém"],
            ["farm", "Fazenda"],
            ["place", "Praça de Reunião"],
            ["market", "Mercado"],
            ["smith", "Ferraria"],
            ["barracks", "Quartel"],
            ["stable", "Estábulo"],
            ["garage", "Oficina"],
            ["watchtower", "Torre de Vigia"],
            ["snob", "Academia"],
            ["statue", "Estátua"],
            ["church", "Igreja"],
            ["wood", "Bosque"],
            ["stone", "Poço de Argila"],
            ["iron", "Mina de Ferro"],
          ];
    
          var buildingOptions = [["", "-- Prédio (catapulta) --"]]
            .concat(buildingList)
            .map(function (o) {
              return (
                "<option value='" + o[0] + "'" + (building == o[0] ? " selected='selected'" : "") + ">" + o[1] + "</option>"
              );
            })
            .join("");
    
          var demolidorChips = buildingList
            .map(function (o) {
              return (
                "<label class='amx-chip' data-building='" + o[0] + "'>" +
                  "<input type='checkbox' class='demolidor-chk' value='" + o[0] + "'/>" +
                  "<span>" + o[1] + "</span>" +
                  "<span class='amx-order-badge' style='display:none'></span>" +
                "</label>"
              );
            })
            .join("");
    
          $("#overview_menu").after(
            "<div class='amx content-command'>" +
              "<div class='amx-head'><span class='amx-flame'></span><span class='amx-title'>OrochiKing 3.9</span><span style='font-size:10px;color:var(--text-lo);margin-left:8px;letter-spacing:.08em;text-transform:uppercase'>Planejador de Ataque em Massa</span></div>" +
              "<div class='amx-sub'>Console de coordenação — tropas, alvos e sincronismo de chegada</div>" +
    
              "<span class='amx-label'>Modelos de tropas (preenche sozinho)</span>" +
              "<div class='amx-buildings' id='amxTroopTemplates'>" +
                "<button type='button' class='amx-chip' data-tpl='full'><span>⚔️ Ataque Full</span></button>" +
                "<button type='button' class='amx-chip' data-tpl='farm'><span>🌾 Farmar Player</span></button>" +
                "<button type='button' class='amx-chip' data-tpl='fullnt'><span>👑 Full + NT (4 nobres)</span></button>" +
                "<button type='button' class='amx-chip' data-tpl='fullnobre'><span>👑 Full + 1 Nobre</span></button>" +
                "<button type='button' class='amx-chip' data-tpl='noblarbarbara'><span>🎯 Noblar Bárbara</span></button>" +
                "<button type='button' class='amx-chip' data-tpl='backtime'><span>⏱️ Back Time Player</span></button>" +
              "</div>" +
    
              "<span class='amx-label' style='margin-top:12px'>Tropas por envio</span>" +
              "<div class='amx-troops'>" + tropas + "</div>" +
              "<div class='amx-hint'>Deixe em <b>0</b> (ou vazio) as tropas que você <b>não</b> quer que sejam enviadas nesse comando.</div>" +
    
              "<hr class='amx-divider'/>" +
    
              "<span class='amx-label'>Coordenadas alvo</span>" +
              "<textarea name='coords' class='amx-textarea'>" + (!coords ? "" : coords) + "</textarea>" +
              "<div class='amx-count' name='nCoords'>Nº Alvos: 0</div>" +
              "<div style='font-size:11px;color:var(--text-lo);margin-top:4px'>Uma coordenada por linha (ou separadas por vírgula), formato <b style='color:var(--text-hi)'>555|551</b>. Sem ID, sem &amp;.</div>" +
    
              "<div class='amx-row'>" +
                "<div class='amx-field'>" +
                  "<span class='amx-label'>Tipo de comando</span>" +
                  "<select id='comando'>" +
                    "<option disabled='disabled' " + (comando == -1 || !comando ? "selected='selected'" : "") + "></option>" +
                    "<option value='attack'" + (comando == "attack" ? "selected='selected'" : "") + ">Ataque</option>" +
                    "<option value='support' " + (comando == "support" ? "selected='selected'" : "") + ">Apoio</option>" +
                  "</select>" +
                "</div>" +
                "<div class='amx-field'>" +
                  "<span class='amx-label'>Prédio-alvo (catapulta)</span>" +
                  "<select id='buildingAlvo'>" + buildingOptions + "</select>" +
                "</div>" +
                "<div class='amx-field'>" +
                  "<span class='amx-label'>Sincronizar chegada</span>" +
                  "<div class='amx-sync'>" +
                    "<label class='amx-switch'><input type='checkbox' id='syncChegada'/><span class='amx-slider'></span></label>" +
                    "<div class='amx-time'>" +
                      "<input type='time' id='syncTime' step='1'/>" +
                    "</div>" +
                    "<span style='font-size:11px;color:var(--text-lo)'>hora do servidor (HH:MM:SS)</span>" +
                  "</div>" +
                "</div>" +
              "</div>" +
    
              "<div class='amx-actions'>" +
                "<input type='submit' id='salvar' name='Att1' value='Salvar' class='amx-btn'/>" +
                "<input type='submit' name='send' value='Enviar Comandos' class='amx-btn amx-btn-primary'/>" +
              "</div>" +
    
              "<div class='amx-progress' id='amxProgress'>" +
                "<div class='amx-progress-track'><div class='amx-progress-fill' id='amxProgressFill'></div></div>" +
                "<div class='amx-progress-text' id='amxProgressText'>Carregando ataques...</div>" +
              "</div>" +
    
              "<div class='amx-cycle' id='amxCycleStatus' style='display:none;margin-top:14px;padding:10px 12px;background:var(--surface);border:1px solid var(--border);border-radius:8px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap'>" +
                "<span class='amx-hint' id='amxCycleText' style='margin:0'></span>" +
                "<button type='button' id='amxRepeatBtn' class='amx-btn' disabled>Repetir Mesmos Ataques</button>" +
              "</div>" +
              "<div class='amx-hint'>Tudo isso fica guardado enquanto essa aba do jogo permanecer aberta. Se fechar a aba ou recarregar a página (F5), perde tudo e precisa clicar no bookmarklet de novo.</div>" +
    
              "<div class='amx-section'>" +
                "<div class='amx-section-head'><span class='amx-section-icon'></span><span class='amx-section-title'>Demolidor</span></div>" +
                "<div class='amx-hint'>Escolhe os prédios (na ordem que aparecem abaixo) e uma leva de ataque é enviada pra cada um, um de cada vez, usando as mesmas tropas/alvos acima. Ele não fica rodando sozinho pra sempre — termina a lista e para. Quando terminar, use o botão \"Repetir Mesmos Ataques\" acima pra repetir a volta inteira assim que as tropas voltarem.</div>" +
                "<div class='amx-buildings' id='amxDemolidorChips'>" + demolidorChips + "</div>" +
                "<div class='amx-actions'>" +
                  "<button type='button' id='amxDemolidorStart' class='amx-btn amx-btn-primary'>Iniciar Demolidor</button>" +
                  "<span class='amx-hint' id='amxDemolidorStatus'></span>" +
                "</div>" +
              "</div>" +
            "</div>"
          );
    
    
          // ----------------------------------------------------------
          // Modelos de tropas: preenche os campos sozinho. O que não faz
          // parte do modelo escolhido vai pra 0 — nada fica "sobrando" de
          // uma seleção anterior.
          // ----------------------------------------------------------
          var ALL_UNITS = ["spear", "sword", "axe", "archer", "spy", "light", "heavy", "marcher", "ram", "catapult", "knight", "snob"];
          var troopTemplates = {
            // Ataque Full: bárbaro, cavalaria leve, arqueiro a cavalo, explorador, aríete, catapulta e paladino — "tudo que tiver disponível" (número alto = manda o máximo)
            full: { axe: 100000, light: 100000, marcher: 100000, spy: 100000, ram: 100000, catapult: 100000, knight: 100000 },
            // Farmar Player: explorador fixo (5) + cavalaria leve, pesada e catapulta no máximo
            farm: { spy: 5, light: 100000, heavy: 100000, catapult: 100000 },
            // Full + NT: mesmas tropas do ataque full + 4 nobres
            fullnt: { axe: 100000, light: 100000, marcher: 100000, spy: 100000, ram: 100000, catapult: 100000, knight: 100000, snob: 4 },
            // Full + Nobre: mesma coisa, só 1 nobre
            fullnobre: { axe: 100000, light: 100000, marcher: 100000, spy: 100000, ram: 100000, catapult: 100000, knight: 100000, snob: 1 },
            // Noblar Bárbara: 25 cavalaria leve + 1 nobre (número fixo, não "máximo")
            noblarbarbara: { light: 25, snob: 1 },
            // Back Time Player: bárbaro + cavalaria leve + pesada + catapulta no máximo,
            // 25 exploradores fixos (não "máximo") — modelo definido pelo usuário
            backtime: { axe: 100000, spy: 25, light: 100000, heavy: 100000, catapult: 100000 },
          };
    
          $("#amxTroopTemplates").on("click", "button[data-tpl]", function (e) {
            e.preventDefault();
            var tpl = troopTemplates[$(this).data("tpl")] || {};
            // Zera TODOS os campos de tropa que realmente existem na tela (em vez de uma
            // lista fixa de nomes) — em alguns mundos/idiomas o id real do campo pode não
            // bater com o nome que a gente espera, e aí o campo nunca era zerado de verdade.
            $(".amx-troop input").each(function () {
              var id = $(this).attr("id");
              $(this).val(tpl[id] !== undefined ? tpl[id] : 0);
            });
            $("#amxTroopTemplates button").removeClass("amx-checked");
            $(this).addClass("amx-checked");
          });
    
          $("input#salvar").click(function () {
            setParam("spear", $("#spear").val());
            setParam("sword", $("#sword").val());
            setParam("axe", $("#axe").val());
            setParam("archer", $("#archer").val());
            setParam("spy", $("#spy").val());
            setParam("light", $("#light").val());
            setParam("heavy", $("#heavy").val());
            setParam("marcher", $("#marcher").val());
            setParam("ram", $("#ram").val());
            setParam("catapult", $("#catapult").val());
            setParam("knight", $("#knight").val());
            setParam("snob", $("#snob").val());
            setParam("comando", $("#comando").val());
            setParam("buildingAlvo", $("#buildingAlvo").val());
            setParam("coords", $("textarea[name='coords']").val());
            UI.InfoMessage("Configurações salvas!");
          });
    
          usefullVillages();
          $("tr.nowrap").each(function (i) {
            $(this)
              .find("td:eq(1)")
              .prepend("<input type='checkbox' data-id='" + aldeias[i].id + "' data-coord='" + aldeias[i].coord + "' class='chkbox'/>");
          });
          $(".menu-side:eq(0)").after("<td class='qtdCheckbox' style='background: #0c0707;color: white;'></td>");
    
          function atualizarContadorAlvos() {
            var valor = $("textarea[name=coords]").val();
            var n = parseCoordsInput(valor).length;
            $("div[name=nCoords]").html("Nº Alvos: " + n);
          }
          atualizarContadorAlvos(); // já mostra certo ao abrir, sem precisar clicar na caixa
          $("textarea[name=coords]").on("input blur", atualizarContadorAlvos);
          $("textarea[name=coords]").change(function () {
            setParam("coordsRes", "");
          });
    
          $(".chkbox").change(function () {
            var qtcBoxChecked = $(".chkbox:checked").length;
            if (qtcBoxChecked) {
              $(".qtdCheckbox").html("Selecionados: " + qtcBoxChecked);
            } else {
              $(".qtdCheckbox").html("Selecionados: 0");
            }
          });
    
          // Unidade que nunca foi salva devolve undefined — antes isso era escrito
          // cru no campo e aparecia como "undefi" na tela. Agora vira 0.
          var amxPreencherTropa = function (id) {
            var v = getParam(id);
            if (v === undefined || v === null || v === "undefined" || v === "") { v = 0; }
            var n = parseInt(v, 10);
            $("#" + id).val(isNaN(n) ? 0 : n);
          };
          ["spear","sword","axe","archer","spy","light","heavy","marcher","ram","catapult","knight","snob"]
            .forEach(amxPreencherTropa);
    
          // executarEnvio: mesma lógica de antes, agora reutilizável — tanto o botão
          // "Enviar Comandos" quanto o Demolidor (que dispara uma rodada por vez,
          // sempre esperando a rodada anterior terminar) chamam essa função.
          // buildingOverride: se vier preenchido, força esse prédio-alvo pra essa rodada
          // (usado pelo Demolidor). onRoundDone: chamado quando a rodada inteira for enviada.
          executarEnvio = function (buildingOverride, onRoundDone) {
            console.log("[AtaqueMass] Iniciando envio" + (buildingOverride ? " (Demolidor: " + buildingOverride + ")" : ""));
            onRoundDoneCallback = onRoundDone || null;
    
            function continuarEnvio() {
              if ($("input.chkbox:checked").length) {
                aldeias.splice(0, aldeias.length);
                $("input.chkbox:checked").each(function (k) {
                  aldeias[k] = new Aldeia($(this).data("coord"), $(this).data("id"));
                });
              } else {
                usefullVillages();
              }
    
              // A partir da 2a rodada a tabela de aldeias da pagina ja foi substituida
              // pela tabela de RESULTADOS — nao existe mais .chkbox nem .quickedit-vn pra
              // ler, entao a lista saia vazia e a rodada morria com "0/0 aldeias".
              // Solucao: guardar a lista da 1a rodada e reusar quando a pagina nao tiver mais.
              if (!aldeias.length && window.__ORK_AldeiasBase && window.__ORK_AldeiasBase.length) {
                aldeias.splice(0, aldeias.length);
                for (var _b = 0; _b < window.__ORK_AldeiasBase.length; _b++) {
                  aldeias.push(new Aldeia(window.__ORK_AldeiasBase[_b].coord, window.__ORK_AldeiasBase[_b].id));
                }
                console.log("[AtaqueMass] lista de aldeias restaurada da rodada anterior (" + aldeias.length + ").");
              } else if (aldeias.length) {
                window.__ORK_AldeiasBase = [];
                for (var _g = 0; _g < aldeias.length; _g++) {
                  window.__ORK_AldeiasBase.push({ coord: aldeias[_g].coord, id: aldeias[_g].id });
                }
              }
    
              console.log("[AtaqueMass] aldeias próprias carregadas:", aldeias.length);
              sortCoords();
    
              // Esconde a tabela de origem (a que lista aldeia por aldeia com os ícones
              // de tropa) assim que ela já foi lida. Ela precisa CONTINUAR existindo no
              // DOM — é dela que a gente relê as origens em toda rodada nova — só não
              // precisa mais aparecer na tela depois da primeira leitura. Sem isso, ela
              // ficava visível o tempo todo, deixando a página gigante e cheia de scroll.
              $("#combined_table").hide();
    
              garantirTabelaResultados().empty().append(resultHeaderRow());
              progressStart(aldeias.length);
              roundReturnAtMs = 0; // zera a estimativa de retorno da rodada anterior
              clearInterval(cycleTimer);
              $("#amxCycleStatus").hide();
              firstRequest();
            }
    
            try {
              var rawCoords = $("textarea[name=coords]").val();
              var coordsList = parseCoordsInput(rawCoords);
              console.log("[AtaqueMass] coordsList:", coordsList);
              if (coordsList.length) {
                resolveCoordsToIdString(coordsList, function (idString, naoEncontradas) {
                  try {
                    console.log("[AtaqueMass] idString resolvido:", idString);
                    if (naoEncontradas.length) {
                      var msgIgnoradas =
                        "Atenção: " +
                        naoEncontradas.length +
                        " coordenada(s) não foram encontradas no mapa e serão ignoradas:\n" +
                        naoEncontradas.join(", ");
                      if (window.__ORK_LOOP_SILENCIOSO__) {
                        console.warn("[AtaqueMass] " + msgIgnoradas.replace(/\n/g, " "));
                      } else {
                        alert(msgIgnoradas);
                      }
                    }
                    if (!idString) {
                      if (window.__ORK_LOOP_SILENCIOSO__) {
                        console.warn("[AtaqueMass] Nenhuma das coordenadas foi encontrada no mapa nessa rodada — pulando.");
                      } else {
                        alert("Nenhuma das coordenadas informadas foi encontrada no mapa do mundo. Confira se estão certas.");
                      }
                      return;
                    }
                    setParam("coords", rawCoords); // sempre salva o que você digitou, no formato puro
                    setParam("coordsIds", idString); // versão resolvida (id&coord), só uso interno
                    setParam("coordsRes", "");
                    if (buildingOverride) {
                      setParam("buildingAlvo", buildingOverride);
                      $("#buildingAlvo").val(buildingOverride);
                    }
                    continuarEnvio();
                  } catch (errCb) {
                    console.error("[AtaqueMass] erro no callback de resolução:", errCb);
                    if (window.__ORK_LOOP_SILENCIOSO__) { console.warn("[AtaqueMass] Erro ao processar coordenadas resolvidas: " + errCb.message); }
                    else { alert("Erro ao processar coordenadas resolvidas: " + errCb.message); }
                  }
                });
              } else {
                if (window.__ORK_LOOP_SILENCIOSO__) { console.warn("[AtaqueMass] Nenhuma coordenada válida encontrada na caixa de alvos."); }
                else { alert("Nenhuma coordenada válida encontrada na caixa de alvos. Use o formato 555|551."); }
              }
            } catch (err) {
              console.error("[AtaqueMass] erro ao iniciar envio:", err);
              if (window.__ORK_LOOP_SILENCIOSO__) { console.warn("[AtaqueMass] Erro ao iniciar envio: " + err.message); }
              else { alert("Erro ao iniciar envio: " + err.message); }
            }
          };
    
          $("input[name='send']").click(function (e) {
            e.preventDefault();
            lastRoundType = "normal";
            executarEnvio();
          });
    
          // ----------------------------------------------------------
          // Demolidor: numera visualmente a ordem em que os prédios foram
          // marcados, e dispara uma rodada por vez (esperando cada uma
          // terminar) até acabar a lista escolhida.
          // ----------------------------------------------------------
          demolidorActive = false;
          demolidorQueue = [];
    
          function renumerarDemolidorChips() {
            $(".demolidor-chk:checked").each(function (idx) {
              $(this).closest(".amx-chip").addClass("amx-checked").find(".amx-order-badge").show().text(idx + 1);
            });
            $(".demolidor-chk:not(:checked)").each(function () {
              $(this).closest(".amx-chip").removeClass("amx-checked").find(".amx-order-badge").hide();
            });
          }
    
          $("#amxDemolidorChips").on("change", ".demolidor-chk", renumerarDemolidorChips);
    
          runNextDemolidorRound = function () {
            if (!demolidorQueue.length) {
              demolidorActive = false;
              $("#amxDemolidorStatus").text("");
              if (window.__ORK_LOOP_SILENCIOSO__) {
                console.log("[AtaqueMass] Demolidor concluído (loop ativo, sem alerta bloqueante).");
              } else {
                alert("Demolidor concluído! Todos os prédios da lista já receberam uma leva de ataque.");
              }
              return;
            }
            var building = demolidorQueue.shift();
            var chip = $(".demolidor-chk[value='" + building + "']").closest(".amx-chip");
            var label = chip.find("span").first().text();
            chip.removeClass("amx-done").addClass("amx-sending");
            $("#amxDemolidorStatus").text("Demolidor: enviando leva contra \"" + label + "\" (faltam " + demolidorQueue.length + " prédio(s) depois desse)");
            executarEnvio(building, function () {
              chip.removeClass("amx-sending").addClass("amx-done");
              runNextDemolidorRound();
            });
          };
    
          $("#amxDemolidorStart").click(function (e) {
            e.preventDefault();
            if (demolidorActive) {
              alert("O Demolidor já está rodando. Espera a rodada atual terminar (ou recarrega a página pra cancelar).");
              return;
            }
            var chosen = $(".demolidor-chk:checked")
              .map(function () {
                return $(this).val();
              })
              .get();
            if (!chosen.length) {
              alert("Marca pelo menos um prédio na lista do Demolidor.");
              return;
            }
            var rawCoords = $("textarea[name=coords]").val();
            if (!parseCoordsInput(rawCoords).length) {
              alert("Preenche a caixa de Coordenadas Alvo antes de iniciar o Demolidor.");
              return;
            }
            lastRoundType = "demolidor";
            lastDemolidorList = chosen.slice();
            demolidorQueue = chosen;
            demolidorActive = true;
            $(".amx-chip").removeClass("amx-done amx-sending");
            runNextDemolidorRound();
          });
    
          // "Enviar Novamente" — mesma mecânica pro farm de jogador: você manda a leva,
          // acompanha aqui quando a estimativa diz que as tropas voltaram, e clica de novo.
          // Sempre precisa do seu clique — não reinicia sozinho.
          lastRoundType = "normal";
          lastDemolidorList = [];
          $("#amxRepeatBtn").click(function (e) {
            e.preventDefault();
            if (demolidorActive) {
              alert("Já tem uma rodada rodando.");
              return;
            }
            if (lastRoundType === "demolidor" && lastDemolidorList.length) {
              demolidorQueue = lastDemolidorList.slice();
              demolidorActive = true;
              $(".amx-chip").removeClass("amx-done amx-sending");
              runNextDemolidorRound();
            } else {
              executarEnvio();
            }
          });
    
          var lastChecked = null;
          var $chkboxes = $(".chkbox");
          $chkboxes.click(function (e) {
            if (!lastChecked) {
              lastChecked = this;
              return;
            }
            if (e.shiftKey) {
              var start = $chkboxes.index(this);
              var end = $chkboxes.index(lastChecked);
              $chkboxes.slice(Math.min(start, end), Math.max(start, end) + 1).attr("checked", lastChecked.checked);
            }
            lastChecked = this;
          });
        };
    
        main();
      } else {
        UI.ErrorMessage("Não autorizado!");
      }
    })();
    
  }
  function adicionarLoopAtaque() {
    var botaoRepetir = document.getElementById('amxRepeatBtn');
    if (!botaoRepetir) return;

    var CHAVE_CFG = 'ork_loop_ataque_config';
    function lerConfigLoop() {
      try {
        var bruto = localStorage.getItem(CHAVE_CFG);
        return bruto ? JSON.parse(bruto) : { ativo: false, min: 4, seg: 30 };
      } catch (e) { return { ativo: false, min: 4, seg: 30 }; }
    }
    function gravarConfigLoop(cfg) {
      try { localStorage.setItem(CHAVE_CFG, JSON.stringify(cfg)); } catch (e) {}
    }

    // A caixinha visual só precisa ser criada uma vez; os ganchos (mais abaixo)
    // precisam ser reinstalados TODA vez que essa função roda, mesmo que a caixinha
    // já exista — por isso essa parte fica num "if" separado, não um return antecipado.
    if (!document.getElementById('ork-loop-ataque')) {
      var caixa = document.createElement('div');
      caixa.id = 'ork-loop-ataque';
      caixa.style.cssText = 'margin-top:12px;padding:10px 12px;background:rgba(255,255,255,.03);' +
        'border:1px solid rgba(255,255,255,.08);border-radius:10px;font-family:Segoe UI,Arial,sans-serif';
      caixa.innerHTML =
        '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:11.5px;color:#d8d8d8;user-select:none">' +
          '<input type="checkbox" id="ork-loop-ataque-check" style="width:auto"> ' +
          '🔁 Repetir esta lista sozinho, de tempos em tempos' +
        '</label>' +
        '<div style="display:flex;align-items:center;gap:6px;margin-top:8px;font-size:11px;color:#bbb">' +
          'Repetir a cada ' +
          '<input type="number" id="ork-loop-ataque-min" min="0" style="width:46px;background:#111;border:1px solid #444;color:#eee;border-radius:5px;padding:3px 5px"> min ' +
          '<input type="number" id="ork-loop-ataque-seg" min="0" max="59" style="width:46px;background:#111;border:1px solid #444;color:#eee;border-radius:5px;padding:3px 5px"> s' +
        '</div>' +
        '<div id="ork-loop-ataque-status" style="font-size:10.5px;color:#f0b90b;margin-top:6px;min-height:13px"></div>';
      botaoRepetir.parentNode.insertBefore(caixa, botaoRepetir.nextSibling);

      var check = document.getElementById('ork-loop-ataque-check');
      var inputMin = document.getElementById('ork-loop-ataque-min');
      var inputSeg = document.getElementById('ork-loop-ataque-seg');
      var status = document.getElementById('ork-loop-ataque-status');

      var cfg = lerConfigLoop();
      check.checked = cfg.ativo;
      inputMin.value = cfg.min;
      inputSeg.value = cfg.seg;

      var salvarConfigAtual = function () {
        gravarConfigLoop({
          ativo: check.checked,
          min: parseInt(inputMin.value, 10) || 0,
          seg: parseInt(inputSeg.value, 10) || 0
        });
      };
      check.addEventListener('change', function () {
        salvarConfigAtual();
        if (!check.checked && window.__ORK_LoopAtaqueTimeoutId) {
          clearTimeout(window.__ORK_LoopAtaqueTimeoutId);
          window.__ORK_LoopAtaqueTimeoutId = null;
          status.textContent = '';
        }
      });
      inputMin.addEventListener('change', salvarConfigAtual);
      inputSeg.addEventListener('change', salvarConfigAtual);
    }

    // ------------------------------------------------------------
    // Reaciona a mesma leva (normal ou Demolidor, o que tiver sido usado
    // por último) — é a mesma lógica do clique em "Repetir Mesmos Ataques",
    // só que sem depender do botão (que fica desabilitado até a estimativa
    // de retorno das tropas, e nosso timer não precisa esperar isso).
    // ------------------------------------------------------------
    function acionarRodadaComLoop() {
      if (window.demolidorActive) {
        agendarProximoLoopAtaque(); // já tem uma rodada rodando, tenta de novo no próximo ciclo
        return;
      }
      // Com o loop automático, avisos que normalmente seriam um alert() bloqueante
      // (coordenada sumiu do mapa, Demolidor concluído, etc.) viram só um aviso no
      // Console — senão, sem ninguém pra clicar OK, a rodada inteira ficava travada.
      window.__ORK_LOOP_SILENCIOSO__ = true;
      console.log('[OROCHIKING] Loop: acionando rodada. Aldeias no cache: ' +
        ((window.__ORK_AldeiasBase && window.__ORK_AldeiasBase.length) || 0) +
        ' | alvos salvos: ' + (function () {
          try { var t = document.querySelector('textarea[name=coords]'); return t ? (t.value.match(/d+|d+/g) || []).length : 0; } catch (e) { return '?'; }
        })());
      if (window.lastRoundType === 'demolidor' && window.lastDemolidorList && window.lastDemolidorList.length) {
        window.demolidorQueue = window.lastDemolidorList.slice();
        window.demolidorActive = true;
        try { document.querySelectorAll('.amx-chip').forEach(function (c) { c.classList.remove('amx-done', 'amx-sending'); }); } catch (e) {}
        window.runNextDemolidorRound();
      } else {
        window.executarEnvio();
      }
    }

    function agendarProximoLoopAtaque() {
      var cfgAtual = lerConfigLoop();
      if (!cfgAtual.ativo) return;
      var intervaloBaseMs = Math.max(5000, (cfgAtual.min || 0) * 60000 + (cfgAtual.seg || 0) * 1000);

      // Atraso extra aleatório (10 a 15s) em cima do intervalo configurado, pra não
      // disparar sempre no mesmo timing exato — evita um padrão robótico reconhecível.
      // Dispara sempre nesse intervalo, tenha ou não tropa disponível na origem — o
      // próprio jogo já manda só o que tiver de cada tropa selecionada no modelo.
      var jitterMs = 10000 + Math.random() * 5000;
      var alvo = Date.now() + intervaloBaseMs + jitterMs;

      var intervaloMs = alvo - Date.now();

      function atualizarContagem() {
        var st = document.getElementById('ork-loop-ataque-status');
        if (!st) return;
        var rest = Math.max(0, alvo - Date.now());
        var m = Math.floor(rest / 60000), s = Math.floor((rest % 60000) / 1000);
        st.textContent = '🔁 Próxima leva em ' + m + 'm ' + (s < 10 ? '0' : '') + s + 's';
      }
      atualizarContagem();
      if (window.__ORK_LoopAtaqueIntervaloVisual) { clearInterval(window.__ORK_LoopAtaqueIntervaloVisual); }
      window.__ORK_LoopAtaqueIntervaloVisual = setInterval(atualizarContagem, 1000);
      if (window.__ORK_LoopAtaqueTimeoutId) { clearTimeout(window.__ORK_LoopAtaqueTimeoutId); }
      // Freio ligado: espaça as levas (x2, mínimo 10 min)
      if (window.__ORK_FREIO__) {
        var antesFreio = intervaloMs;
        intervaloMs = Math.max(10 * 60000, intervaloMs * 2);
        if (intervaloMs !== antesFreio) {
          console.log('[OROCHIKING] Freio: próxima leva do Ataque em ' + Math.round(intervaloMs / 60000) + ' min.');
        }
      }
      window.__ORK_LoopAtaqueTimeoutId = setTimeout(function () {
        clearInterval(window.__ORK_LoopAtaqueIntervaloVisual);
        // zera o id ANTES de disparar: senão o vigia acha que ainda existe uma
        // próxima leva agendada e nunca mais agenda nada depois desta.
        window.__ORK_LoopAtaqueTimeoutId = null;
        var stDisp = document.getElementById('ork-loop-ataque-status');
        if (stDisp) { stDisp.textContent = '🚀 Disparando nova leva...'; }
        console.log('[OROCHIKING] Loop: disparando nova leva agora.');
        acionarRodadaComLoop();
      }, intervaloMs);
    }

    // ------------------------------------------------------------
    // VIGIA DA RODADA (mecanismo principal do loop)
    //
    // Antes eu dependia só de "grudar" na função finishRound do script.
    // Isso é frágil: o Ataque Mass recria essas funções toda vez que é
    // reativado, e qualquer recriação depois do nosso gancho o descartava
    // silenciosamente — o loop simplesmente nunca disparava.
    //
    // Agora o loop observa o ESTADO do próprio script (variáveis globais que
    // ele já mantém) e detecta o fim da rodada sozinho, sem depender de gancho
    // nenhum. Os ganchos continuam abaixo como reforço.
    // ------------------------------------------------------------
    if (!window.__ORK_LoopVigiaAtivo) {
      window.__ORK_LoopVigiaAtivo = true;
      window.__ORK_RodadaEmAndamento = false;

      setInterval(function () {
        try {
          // A caixa do loop vive dentro da área que o Ataque Mass redesenha a cada
          // rodada — quando isso acontece ela some da tela. Aqui a gente recoloca
          // sozinho assim que o botão de repetir reaparece.
          if (document.getElementById('amxRepeatBtn') && !document.getElementById('ork-loop-ataque')) {
            try { adicionarLoopAtaque(); } catch (e) {}
          }

          var cfgV = lerConfigLoop();
          if (!cfgV.ativo) { return; }

          var confirmados = typeof window.confirmedForSend === 'number' ? window.confirmedForSend : 0;
          var liquidados = typeof window.sendSettledCount === 'number' ? window.sendSettledCount : 0;
          var confirmacoesFim = window.allConfirmsDone === true;
          // conta as duas filas: a principal e a de retentativa — uma rodada só
          // acabou de verdade quando nenhuma das duas tem comando pendente
          var restantes = ((window.aldeias && window.aldeias.length) ? window.aldeias.length : 0) +
                          ((window.aldeiasAux && window.aldeiasAux.length) ? window.aldeiasAux.length : 0);

          // BUG CORRIGIDO: antes bastava "confirmados > 0" pra considerar que havia
          // uma rodada em andamento. Só que esses contadores NÃO zeram quando a rodada
          // acaba — ficam parados em 85/85, por exemplo. Resultado: logo depois de
          // disparar uma leva nova, o vigia ainda via os números da leva ANTERIOR,
          // achava que já tinha acabado e reagendava por cima, sem nunca esperar a
          // rodada de verdade. Agora só conta como "em andamento" quando dá pra ver
          // o script realmente trabalhando (confirmações abertas ou envios pendentes).
          var emAndamento =
            (window.allConfirmsDone === false) ||
            (confirmados > 0 && liquidados < confirmados) ||
            restantes > 0;

          if (emAndamento && !window.__ORK_RodadaEmAndamento) {
            window.__ORK_RodadaEmAndamento = true;
            var stIni = document.getElementById('ork-loop-ataque-status');
            if (stIni) { stIni.textContent = '⏳ Rodada em andamento...'; }
            console.log('[OROCHIKING] Loop: rodada em andamento detectada.');
          }

          if (!window.__ORK_RodadaEmAndamento) { return; }
          if (window.demolidorActive) { return; }           // Demolidor cuida do próprio ciclo
          if (window.__ORK_LoopAtaqueTimeoutId) { return; } // já tem a próxima agendada

          // Rodada terminou de verdade: confirmações acabaram, todos os envios
          // foram liquidados e não sobrou aldeia pendente de retry.
          if (!emAndamento && confirmacoesFim && liquidados >= confirmados && restantes === 0) {
            window.__ORK_RodadaEmAndamento = false;
            console.log('[OROCHIKING] Loop: rodada concluída (' + liquidados + ' envio(s)) — agendando a próxima.');
            agendarProximoLoopAtaque();
          }
        } catch (e) {
          console.error('[OROCHIKING] vigia do loop:', e);
        }
      }, 1000);
    }

    // Encaixa nos dois pontos de "a rodada terminou de vez" que o script já tem:
    // finishRound (rodada normal, sem callback do Demolidor) e runNextDemolidorRound
    // (quando a fila do Demolidor esvazia).
    //
    // IMPORTANTE: com o loop ligado, a gente NÃO chama o finishRound original —
    // ele termina com um alert() nativo ("Todos os comandos foram enviados!"), e um
    // alert trava a página inteira (inclusive nosso próprio timer) até alguém clicar
    // OK. Isso destrava tudo até você chegar no computador e clicar. Com o loop
    // ligado, reproduzimos a mesma lógica sem esse alerta bloqueante.
    //
    // Reinstala o gancho TODA vez que essa função roda (não só na primeira), porque
    // se o Ataque Mass for reaberto/reativado ele redefine finishRound/runNextDemolidorRound
    // do zero — se a gente só instalasse uma vez, a segunda ativação ficaria sem gancho
    // e o alerta bloqueante voltaria a aparecer.
    (function instalarGanchosLoop() {
      var finishRoundAtual = window.finishRound;
      var finishRoundOriginal = (finishRoundAtual && finishRoundAtual.__orkOriginal) ? finishRoundAtual.__orkOriginal : finishRoundAtual;
      var novoFinishRound = function () {
        var cb = window.onRoundDoneCallback;
        window.onRoundDoneCallback = null;
        var cfgAgora = lerConfigLoop();
        if (cb) {
          cb();
        } else if (cfgAgora.ativo) {
          var st = document.getElementById('ork-loop-ataque-status');
          if (st) st.textContent = '✅ Leva enviada — agendando a próxima...';
          console.log('[OROCHIKING] Ataque: leva enviada (loop ativo, sem alerta bloqueante).');
          agendarProximoLoopAtaque();
        } else {
          finishRoundOriginal();
        }
      };
      novoFinishRound.__orkOriginal = finishRoundOriginal;
      window.finishRound = novoFinishRound;

      var runNextDemolidorRoundAtual = window.runNextDemolidorRound;
      var runNextDemolidorRoundOriginal = (runNextDemolidorRoundAtual && runNextDemolidorRoundAtual.__orkOriginal) ? runNextDemolidorRoundAtual.__orkOriginal : runNextDemolidorRoundAtual;
      var novoRunNextDemolidorRound = function () {
        runNextDemolidorRoundOriginal();
        if (!window.demolidorActive) {
          var cfgAgora = lerConfigLoop();
          if (cfgAgora.ativo) { agendarProximoLoopAtaque(); }
        }
      };
      novoRunNextDemolidorRound.__orkOriginal = runNextDemolidorRoundOriginal;
      window.runNextDemolidorRound = novoRunNextDemolidorRound;
    })();

    // caixa "♾️ 24/7 Farm Player" (salvar este ataque e repetir sozinho)
    try { autoCaixaAtaque(); } catch (e) { console.warn('[OROCHIKING] caixa 24/7 do Ataque:', e); }
  }
  function rodarAtaque() {
    rodarAtaqueOriginal();
    setTimeout(adicionarLoopAtaque, 500);
  }

  function checaRename() {
    return !!(window.game_data && game_data.screen === 'overview_villages' && game_data.mode === 'combined');
  }
  function rodarRename() {
    (function renomeadorHard() {
      if (typeof $ === 'undefined') { alert('jQuery não encontrado nesta página. Abra o script dentro do jogo (game.php).'); return; }
      if (document.getElementById('rh-popup')) { $('#rh-popup').show(); return; }

      var RH_SALVO = 'ork_renomeador_config';

      /* ---------- estilo (padrão do painel: preto + dourado) ---------- */
      $('<style id="rh-style">').text(
        '#rh-popup{position:fixed;top:70px;left:50%;transform:translateX(-50%);width:500px;max-width:calc(100vw - 20px);max-height:calc(100vh - 90px);' +
          'background:linear-gradient(160deg,#1a1a1a,#050505);border:1px solid #3a3a3a;border-radius:12px;' +
          'box-shadow:0 14px 34px rgba(0,0,0,.75),0 0 0 1px rgba(255,196,0,.12);z-index:999999;font-family:"Segoe UI",Arial,Helvetica,sans-serif;' +
          'color:#eee;overflow:hidden;display:flex;flex-direction:column}' +
        '#rh-header{background:linear-gradient(100deg,#FFB800,#FFDD55 55%,#FFB800);color:#141200;padding:8px 10px 8px 14px;display:flex;align-items:center;gap:10px;cursor:move;user-select:none}' +
        '#rh-header .rh-title{font-weight:800;font-size:13px;letter-spacing:1.1px;white-space:nowrap}' +
        '#rh-header .rh-badge{font-size:8.5px;background:#141200;color:#FFC400;padding:1px 6px;border-radius:9px;margin-left:6px;font-weight:700;vertical-align:middle}' +
        '#rh-header .rh-sub{font-size:9px;font-weight:700;color:#5a4700;letter-spacing:.6px;margin-left:8px}' +
        '#rh-status{flex:1;min-width:0;text-align:center;font-size:10px;font-weight:700;color:#3d3000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
        '#rh-close{cursor:pointer;font-weight:bold;font-size:15px;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:50%;color:#141200;background:transparent;border:none;padding:0}' +
        '#rh-close:hover{background:rgba(0,0,0,.18)}' +
        '#rh-body{padding:10px;overflow-y:auto;flex:1}' +
        '#rh-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
        '.rh-card{background:#161616;border:1px solid #2c2c2c;border-radius:8px;padding:8px 10px}' +
        '.rh-card.rh-full{grid-column:1 / -1}' +
        '.rh-label{font-size:9.5px;color:#888;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;display:block}' +
        '#rh-popup input[type=text],#rh-popup input[type=number],#rh-popup select{width:100%;box-sizing:border-box;background:#111;border:1px solid rgba(255,255,255,.12);' +
          'color:#ececec;padding:6px 8px;border-radius:6px;font-size:12px;margin-bottom:6px;font-family:inherit}' +
        '#rh-popup input:focus,#rh-popup select:focus{outline:none;border-color:#e8ac0a}' +
        '.rh-row{display:flex;gap:6px}.rh-row > *{flex:1}' +
        '.rh-check{display:flex;align-items:center;gap:7px;font-size:11.5px;color:#ccc;cursor:pointer;margin-top:2px}' +
        '.rh-check input{width:15px;height:15px;margin:0;accent-color:#e8ac0a}' +
        '.rh-dica{font-size:9.5px;color:#666;margin-top:3px}' +
        '#rh-popup button{cursor:pointer;border:none;border-radius:8px;font-weight:700;font-size:11px;padding:8px 10px;font-family:inherit;transition:.15s}' +
        '#rh-popup button:disabled{opacity:.45;cursor:default}' +
        '.rh-btn-primary{background:linear-gradient(100deg,#FFB800,#FFDD55);color:#141200;box-shadow:0 3px 10px rgba(255,184,0,.3)}' +
        '.rh-btn-secondary{background:#232323;color:#FFC400;border:1px solid #3a3a3a !important}' +
        '.rh-btn-secondary:hover:not(:disabled){background:#2b2b2b}' +
        '.rh-btn-danger{background:#2a1010;color:#ff6b6b;border:1px solid #4a1c1c !important}' +
        '#rh-actions{display:flex;gap:6px;margin-top:8px}#rh-actions button{flex:1}' +
        '#rh-progress-wrap{background:#0a0a0a;border:1px solid #2c2c2c;border-radius:6px;height:8px;margin:8px 0 6px;overflow:hidden}' +
        '#rh-progress-bar{background:linear-gradient(90deg,#FFB800,#FFEB99);height:100%;width:0%;transition:width .2s;box-shadow:0 0 8px rgba(255,196,0,.55)}' +
        '#rh-log{background:#0d0d0d;border:1px solid #2c2c2c;border-radius:8px;height:110px;overflow-y:auto;font-family:Consolas,monospace;font-size:10.5px;padding:6px 8px}' +
        '.rh-log-ok{color:#8fdc7a}.rh-log-err{color:#ff8080}.rh-log-info{color:#9ec9ff}' +
        '.rh-rule-row{display:flex;gap:4px;margin-bottom:5px;align-items:center}.rh-rule-row input{margin-bottom:0 !important}' +
        '.rh-rule-row .rh-rule-min,.rh-rule-row .rh-rule-max{width:70px;flex:none}.rh-rule-row .rh-rule-nome{flex:1}' +
        '#rh-popup .rh-rule-del{flex:none;width:24px;height:24px;padding:0;background:#2a1010;color:#ff6b6b;border-radius:6px}' +
        '#rh-add-rule{width:100%;margin-top:2px}' +
        '.rh-hide{display:none !important}' +
        '@media (max-width:560px){#rh-grid{grid-template-columns:1fr}}'
      ).appendTo('head');

      /* ---------- HTML ---------- */
      $('body').append(
        '<div id="rh-popup"><div id="rh-header">' +
          '<div class="rh-title">RENOMEADOR HARD<span class="rh-badge">4.1</span><span class="rh-sub">BY OROCHIKING</span></div>' +
          '<div id="rh-status">Pronto</div><button id="rh-close" title="Fechar">&times;</button></div>' +
        '<div id="rh-body"><div id="rh-grid">' +
          '<div class="rh-card rh-full"><span class="rh-label">Nome base</span>' +
            '<input type="text" id="rh-nomebase" placeholder="Ex: THE KING!" value="THE KING!">' +
            '<div class="rh-row" style="gap:14px">' +
              '<label class="rh-check"><input type="checkbox" id="rh-pular-iguais" checked> Pular aldeias que já têm o nome final</label>' +
              '<label class="rh-check"><input type="checkbox" id="rh-salvar"> Lembrar nome e opções</label>' +
            '</div>' +
            '<div class="rh-dica">"Lembrar" guarda no navegador: fica salvo até você desmarcar ou limpar os dados/cookies do navegador.</div></div>' +
          '<div class="rh-card"><span class="rh-label">Tipo de renomeação</span>' +
            '<select id="rh-modo"><option value="unico">Nome único para todas</option><option value="continente">Nome + Continente (K55)</option>' +
              '<option value="sequencial">Nome + numeração sequencial</option><option value="lote">Nome + lote (aldeias por bloco)</option>' +
              '<option value="pontos">Regras por pontuação da aldeia</option></select>' +
            '<div id="rh-opts-sequencial" class="rh-hide"><div class="rh-row"><div><span class="rh-label">Início</span><input type="number" id="rh-seq-inicio" value="1" min="0"></div>' +
              '<div><span class="rh-label">Dígitos</span><input type="number" id="rh-seq-digitos" value="3" min="1" max="6"></div></div></div>' +
            '<div id="rh-opts-lote" class="rh-hide"><span class="rh-label">Aldeias por lote</span><input type="number" id="rh-lote-tam" value="20" min="1"></div></div>' +
          '<div class="rh-card"><span class="rh-label">Filtro de aldeias na tela</span>' +
            '<select id="rh-filtro-tipo"><option value="todas">Todas as linhas visíveis</option><option value="barbaras">Só aldeias de bárbaros</option>' +
              '<option value="minhas">Só minhas aldeias</option></select>' +
            '<span class="rh-label">Intervalo entre aldeias (ms)</span><input type="number" id="rh-delay" value="50" min="50" step="10"></div>' +
          '<div id="rh-opts-pontos" class="rh-card rh-full rh-hide"><span class="rh-label">Regras (pontos mín / máx / nome)</span><div id="rh-rules"></div>' +
            '<button id="rh-add-rule" class="rh-btn-secondary" type="button">+ adicionar regra</button>' +
            '<label class="rh-check" style="margin:8px 0 6px"><input type="checkbox" id="rh-pontos-numerar"> Numerar sequencialmente dentro de cada regra</label>' +
            '<span class="rh-label">Nome p/ aldeias fora das regras (vazio = pular)</span><input type="text" id="rh-pontos-fallback" placeholder="opcional"></div>' +
        '</div>' +
        '<div id="rh-actions"><button id="rh-test" class="rh-btn-secondary">Testar 1 aldeia</button><button id="rh-start" class="rh-btn-primary">Iniciar</button>' +
          '<button id="rh-pause" class="rh-btn-secondary" disabled>Pausar</button><button id="rh-stop" class="rh-btn-danger" disabled>Parar</button></div>' +
        '<div id="rh-progress-wrap"><div id="rh-progress-bar"></div></div><div id="rh-log"></div></div></div>'
      );

      /* ---------- arrastar pelo cabeçalho ---------- */
      var popup = document.getElementById('rh-popup'), arrastando = false, dx = 0, dy = 0;
      document.getElementById('rh-header').addEventListener('mousedown', function (ev) {
        if (ev.target.id === 'rh-close') { return; }
        arrastando = true;
        var r = popup.getBoundingClientRect();
        dx = ev.clientX - r.left; dy = ev.clientY - r.top;
        popup.style.transform = 'none'; popup.style.left = r.left + 'px'; popup.style.top = r.top + 'px';
      });
      document.addEventListener('mousemove', function (ev) { if (arrastando) { popup.style.left = (ev.clientX - dx) + 'px'; popup.style.top = (ev.clientY - dy) + 'px'; } });
      document.addEventListener('mouseup', function () { arrastando = false; });

      /* ---------- utilidades de UI ---------- */
      function addRegra(min, max, nome) {
        var linha = $('<div class="rh-rule-row"><input type="number" class="rh-rule-min" placeholder="mín" value="' + (min != null ? min : '') + '">' +
          '<input type="number" class="rh-rule-max" placeholder="máx" value="' + (max != null ? max : '') + '">' +
          '<input type="text" class="rh-rule-nome" placeholder="nome desta faixa"><button type="button" class="rh-rule-del">×</button></div>');
        linha.find('.rh-rule-nome').val(nome || '');
        linha.find('.rh-rule-del').on('click', function () { linha.remove(); salvarSeMarcado(); });
        $('#rh-rules').append(linha);
      }
      function mostrarOpcoesModo() {
        var m = $('#rh-modo').val();
        $('#rh-opts-sequencial, #rh-opts-lote, #rh-opts-pontos').addClass('rh-hide');
        if (m === 'sequencial') { $('#rh-opts-sequencial').removeClass('rh-hide'); }
        if (m === 'lote') { $('#rh-opts-lote').removeClass('rh-hide'); }
        if (m === 'pontos') { $('#rh-opts-pontos').removeClass('rh-hide'); }
      }
      function log(txt, tipo) {
        var el = $('<div class="' + (tipo === 'ok' ? 'rh-log-ok' : tipo === 'err' ? 'rh-log-err' : 'rh-log-info') + '"></div>').text(txt);
        $('#rh-log').append(el); $('#rh-log').scrollTop($('#rh-log')[0].scrollHeight);
      }
      function status(txt) { $('#rh-status').text(txt); }
      function progresso(p) { $('#rh-progress-bar').css('width', Math.max(0, Math.min(100, p)) + '%'); }

      /* ---------- salvar / carregar (só se "Lembrar" estiver marcado) ---------- */
      function coletarCampos() {
        var regras = [];
        $('#rh-rules .rh-rule-row').each(function () {
          regras.push({ min: $(this).find('.rh-rule-min').val(), max: $(this).find('.rh-rule-max').val(), nome: $(this).find('.rh-rule-nome').val() });
        });
        return { nomeBase: $('#rh-nomebase').val(), modo: $('#rh-modo').val(), pularIguais: $('#rh-pular-iguais').is(':checked'),
          seqInicio: $('#rh-seq-inicio').val(), seqDigitos: $('#rh-seq-digitos').val(), loteTam: $('#rh-lote-tam').val(),
          regras: regras, pontosNumerar: $('#rh-pontos-numerar').is(':checked'), pontosFallback: $('#rh-pontos-fallback').val(),
          filtroTipo: $('#rh-filtro-tipo').val(), delay: $('#rh-delay').val() };
      }
      function salvarSeMarcado() {
        try {
          if ($('#rh-salvar').is(':checked')) { localStorage.setItem(RH_SALVO, JSON.stringify(coletarCampos())); }
        } catch (e) {}
      }
      var salvo = null;
      try { salvo = JSON.parse(localStorage.getItem(RH_SALVO) || 'null'); } catch (e) {}
      if (salvo) {
        $('#rh-salvar').prop('checked', true);
        $('#rh-nomebase').val(salvo.nomeBase != null ? salvo.nomeBase : 'THE KING!');
        $('#rh-modo').val(salvo.modo || 'unico');
        $('#rh-pular-iguais').prop('checked', salvo.pularIguais !== false);
        if (salvo.seqInicio != null) { $('#rh-seq-inicio').val(salvo.seqInicio); }
        if (salvo.seqDigitos != null) { $('#rh-seq-digitos').val(salvo.seqDigitos); }
        if (salvo.loteTam != null) { $('#rh-lote-tam').val(salvo.loteTam); }
        $('#rh-pontos-numerar').prop('checked', !!salvo.pontosNumerar);
        $('#rh-pontos-fallback').val(salvo.pontosFallback || '');
        $('#rh-filtro-tipo').val(salvo.filtroTipo || 'todas');
        if (salvo.delay != null) { $('#rh-delay').val(salvo.delay); }
        (salvo.regras && salvo.regras.length ? salvo.regras : []).forEach(function (r) { addRegra(r.min, r.max, r.nome); });
      }
      if (!$('#rh-rules .rh-rule-row').length) { addRegra(0, 999, 'BARBARA PEQUENA'); addRegra(1000, 999999, 'BARBARA GRANDE'); }
      $('#rh-add-rule').on('click', function () { addRegra(); });
      $('#rh-modo').on('change', mostrarOpcoesModo);
      mostrarOpcoesModo();
      $('#rh-popup').on('input change', 'input, select', function () { if (this.id !== 'rh-salvar') { salvarSeMarcado(); } });
      $('#rh-salvar').on('change', function () {
        if (this.checked) { salvarSeMarcado(); log('Nome e opções serão lembrados neste navegador.', 'info'); }
        else { try { localStorage.removeItem(RH_SALVO); } catch (e) {} log('Não vou mais lembrar: da próxima vez abre com o padrão.', 'info'); }
      });

      /* ---------- leitura das aldeias na tabela ---------- */
      function pontosDaLinha(tr) {
        var tabela = tr.closest('table');
        if (!tabela) { return null; }
        if (tabela.__rhPontosIdx === undefined) {
          var ths = tabela.querySelectorAll('thead th');
          if (!ths.length) { ths = tabela.querySelectorAll('tr:first-child th'); }
          var idx = -1;
          ths.forEach(function (th, i) { if (/pontos/i.test(th.textContent)) { idx = i; } });
          tabela.__rhPontosIdx = idx;
        }
        var ix = tabela.__rhPontosIdx;
        if (ix < 0) { return null; }
        var tds = tr.querySelectorAll('td');
        if (!tds[ix]) { return null; }
        var n = tds[ix].textContent.replace(/[^\d]/g, '');
        return n ? parseInt(n, 10) : null;
      }
      function lerAldeias(filtro) {
        var lista = [], vistos = {};
        document.querySelectorAll('a[href*="village="]').forEach(function (a) {
          var tr = a.closest('tr');
          if (!tr || (tr.id && tr.id.indexOf('menu_row') === 0) || !tr.querySelector('.quickedit-vn, .rename-icon')) { return; }
          var mc = tr.textContent.match(/\((\d{1,3})\|(\d{1,3})\)/);
          var mi = (a.getAttribute('href') || '').match(/village=(\d+)/);
          if (!mc || !mi || vistos[mi[1]]) { return; }
          vistos[mi[1]] = true;
          var x = parseInt(mc[1], 10), y = parseInt(mc[2], 10);
          var mk = tr.textContent.match(/K(\d{2,3})\b/);
          var rotulo = tr.querySelector('.quickedit-label');
          var nome = (rotulo ? rotulo.textContent : a.textContent).replace(/\(\d{1,3}\|\d{1,3}\)\s*K?\d{0,3}\s*$/, '').trim();
          var barbara = /árbaro|barbar/i.test(nome);
          if (filtro === 'barbaras' && !barbara) { return; }
          if (filtro === 'minhas' && barbara) { return; }
          lista.push({ id: mi[1], row: tr, x: x, y: y, continente: mk ? mk[1] : String(Math.floor(y / 100)) + String(Math.floor(x / 100)),
            pontos: pontosDaLinha(tr), nomeAtual: nome });
        });
        return lista;
      }
      function lerConfig() {
        var regras = [];
        $('#rh-rules .rh-rule-row').each(function () {
          var min = parseFloat($(this).find('.rh-rule-min').val()), max = parseFloat($(this).find('.rh-rule-max').val());
          var nome = $(this).find('.rh-rule-nome').val().trim();
          if (nome !== '' && !isNaN(min) && !isNaN(max)) { regras.push({ min: min, max: max, nome: nome }); }
        });
        return { nomeBase: $('#rh-nomebase').val().trim() || 'ALDEIA', modo: $('#rh-modo').val(), pularIguais: $('#rh-pular-iguais').is(':checked'),
          seqInicio: parseInt($('#rh-seq-inicio').val(), 10) || 0, seqDigitos: parseInt($('#rh-seq-digitos').val(), 10) || 3,
          loteTam: parseInt($('#rh-lote-tam').val(), 10) || 20, regrasPontos: regras, pontosNumerar: $('#rh-pontos-numerar').is(':checked'),
          pontosFallback: $('#rh-pontos-fallback').val().trim(), filtroTipo: $('#rh-filtro-tipo').val(),
          delay: Math.max(50, parseInt($('#rh-delay').val(), 10) || 50) };
      }
      function pad(n, d) { var s = String(n); while (s.length < d) { s = '0' + s; } return s; }
      function montarFila(cfg, soUma) {
        var aldeias = lerAldeias(cfg.filtroTipo);
        if (!aldeias.length) { log('Nenhuma aldeia encontrada nesta tabela.', 'err'); return []; }
        var contRegra = {};
        var fila = aldeias.map(function (al, i) {
          var novo = cfg.nomeBase;
          if (cfg.modo === 'continente') { novo = cfg.nomeBase + ' K' + al.continente; }
          else if (cfg.modo === 'sequencial') { novo = cfg.nomeBase + ' ' + pad(cfg.seqInicio + i, cfg.seqDigitos); }
          else if (cfg.modo === 'lote') { novo = cfg.nomeBase + ' - Lote ' + (Math.floor(i / cfg.loteTam) + 1); }
          else if (cfg.modo === 'pontos') {
            var regra = null;
            for (var k = 0; k < cfg.regrasPontos.length; k++) {
              var r = cfg.regrasPontos[k];
              if (al.pontos != null && al.pontos >= r.min && al.pontos <= r.max) { regra = r; break; }
            }
            if (!regra) { novo = cfg.pontosFallback || null; }
            else if (cfg.pontosNumerar) { contRegra[regra.nome] = (contRegra[regra.nome] || 0) + 1; novo = regra.nome + ' ' + pad(contRegra[regra.nome], cfg.seqDigitos); }
            else { novo = regra.nome; }
          }
          return { item: al, novoNome: novo };
        });
        return soUma ? fila.slice(0, 1) : fila;
      }

      /* ---------- renomear uma aldeia (edição rápida do próprio jogo) ---------- */
      function campoEdicao(tr) { var eds = tr.querySelectorAll('.quickedit-edit'); return eds.length ? eds[eds.length - 1].querySelector('input[type="text"]') : null; }
      function esperarCampo(tr, tentativas, cb) {
        var c = campoEdicao(tr);
        if (c) { cb(c); } else if (tentativas <= 0) { cb(null); } else { setTimeout(function () { esperarCampo(tr, tentativas - 1, cb); }, 150); }
      }
      function confirmar(campo, nome, cb) {
        campo.value = nome; $(campo).trigger('input').trigger('change');
        var caixa = campo.closest('.quickedit-edit');
        var btn = caixa ? caixa.querySelector('input.btn, input[type="button"]') : null;
        if (!btn) { cb(false, 'botão de confirmar (Renomear) não encontrado'); return; }
        btn.click();
        setTimeout(function () { cb(true, 'renomeada'); }, 150);
      }
      function renomear(item, nome, cb) {
        var campo = campoEdicao(item.row);
        if (campo) { confirmar(campo, nome, cb); return; }
        var icone = item.row.querySelector('a.rename-icon');
        if (!icone) { cb(false, 'ícone de edição não encontrado nesta linha'); return; }
        icone.click();
        esperarCampo(item.row, 12, function (c) { if (c) { confirmar(c, nome, cb); } else { cb(false, 'campo de edição não apareceu'); } });
      }

      /* ---------- execução ---------- */
      var est = { rodando: false, pausado: false, parar: false, fila: [], indice: 0, ok: 0, erro: 0, pulados: 0 }, cfgAtual = null;
      function resumo() { return 'OK: ' + est.ok + ' | Erros: ' + est.erro + ' | Pulados: ' + est.pulados; }
      function proximo() {
        if (est.parar) { finalizar('Parado'); return; }
        if (est.pausado) { setTimeout(proximo, 300); return; }
        if (est.indice >= est.fila.length) { finalizar('Concluído'); return; }
        var f = est.fila[est.indice];
        progresso(est.indice / est.fila.length * 100);
        status((est.indice + 1) + '/' + est.fila.length + ' — ' + resumo());
        if (f.novoNome === null) { est.pulados++; log('— pulada (fora das regras): ' + f.item.nomeAtual, 'info'); est.indice++; setTimeout(proximo, 20); return; }
        if (cfgAtual.pularIguais && f.item.nomeAtual === f.novoNome) { est.pulados++; log('— já está com o nome certo: ' + f.novoNome, 'info'); est.indice++; setTimeout(proximo, 20); return; }
        renomear(f.item, f.novoNome, function (ok, msg) {
          if (ok) { est.ok++; log('OK (' + f.item.x + '|' + f.item.y + '): "' + f.item.nomeAtual + '" -> "' + f.novoNome + '"', 'ok'); }
          else { est.erro++; log('ERRO (' + f.item.x + '|' + f.item.y + '): ' + msg, 'err'); }
          est.indice++;
          // intervalo configurado + 0 a 40ms sorteados (nunca o mesmo tempo)
          setTimeout(proximo, cfgAtual.delay + Math.floor(Math.random() * 41));
        });
      }
      function finalizar(txt) {
        est.rodando = false; progresso(100); status(txt + ' — ' + resumo());
        log(txt + '. ' + resumo(), 'info');
        $('#rh-start').prop('disabled', false); $('#rh-test').prop('disabled', false);
        $('#rh-pause').prop('disabled', true).text('Pausar'); $('#rh-stop').prop('disabled', true);
      }
      $('#rh-test').on('click', function () {
        cfgAtual = lerConfig(); salvarSeMarcado();
        var fila = montarFila(cfgAtual, true);
        if (!fila.length) { return; }
        if (fila[0].novoNome === null) { log('A primeira aldeia está fora das regras (seria pulada).', 'info'); return; }
        log('Testando em 1 aldeia...', 'info');
        renomear(fila[0].item, fila[0].novoNome, function (ok, msg) {
          if (ok) { log('Teste OK: "' + fila[0].item.nomeAtual + '" -> "' + fila[0].novoNome + '"', 'ok'); } else { log('Teste falhou: ' + msg, 'err'); }
        });
      });
      $('#rh-start').on('click', function () {
        cfgAtual = lerConfig(); salvarSeMarcado();
        var fila = montarFila(cfgAtual, false);
        if (!fila.length) { return; }
        est = { rodando: true, pausado: false, parar: false, fila: fila, indice: 0, ok: 0, erro: 0, pulados: 0 };
        $('#rh-log').empty();
        log('Iniciando renomeação de ' + fila.length + ' aldeia(s)...', 'info');
        $('#rh-start').prop('disabled', true); $('#rh-test').prop('disabled', true);
        $('#rh-pause').prop('disabled', false); $('#rh-stop').prop('disabled', false);
        proximo();
      });
      $('#rh-pause').on('click', function () { est.pausado = !est.pausado; $(this).text(est.pausado ? 'Continuar' : 'Pausar'); status(est.pausado ? 'Pausado' : 'Retomando...'); });
      $('#rh-stop').on('click', function () { est.parar = true; });
      $('#rh-close').on('click', function () { est.parar = true; $('#rh-popup').remove(); $('#rh-style').remove(); });
      status('Pronto');
      log('Configure as opções e use "Testar 1 aldeia" antes de rodar em todas.', 'info');
    })();
  }

  function checaCancelar() {
    return document.getElementById('production_table') !== null && window.game_data && window.game_data.mode === 'prod';
  }
  function rodarCancelar() {
    (function() {    'use strict';    var arma = ['barracks', 'stable', 'garage'];    const setDelRecruit = async () => {        var url_, id, xz;        var rows = document.querySelector('#production_table').querySelectorAll('tr').length - 1;        xz = 0;        for (let i = 1; i <= rows; i++) {            if (document.querySelector('#production_table').querySelectorAll('tr')[i].querySelectorAll('td')[9].querySelectorAll('li').length > 0) {                xz = xz + 1;                id = document.querySelector('#production_table').querySelectorAll('tr')[i].querySelector('span').dataset.id;                for (let a = 0; a < arma.length; a++) {                    url_ = `https://${document.domain}/game.php?village=${id}&screen=train&action=cancel_all&mode=train&h=${csrf_token}&building=${arma[a]}&client_time=${Math.round(Timing.getCurrentServerTime()/1e3)}`;                    UI.SuccessMessage(`Aguarde...cancelando ${xz} aldeia(s) ${arma[a]}`, 5000);                    await fetch(url_);                };                partialReload(document.querySelector('#production_table').querySelectorAll('tr')[i].querySelectorAll('td')[9]);            };        };        if (xz == 0) {            UI.ErrorMessage('Nenhuma ordem de recruamento para caneclar!! Noob!!!');        } else {            UI.SuccessMessage(`Ordens de recrutamento de ${xz} aldeia(s) Cancelado! `, 3000);        };    };    if (game_data.mode != 'prod') {        UI.ErrorMessage("Use na Visualização->Produção.", 3000);    } else {        setDelRecruit();    };})()
  }

  function checaDefender() {
    return !!(window.game_data && game_data.screen === 'overview_villages' && game_data.mode === 'incomings');
  }
  function rodarDefender() {
    (function () {
      function coordenadaDoTexto(texto) {
        var m = (texto || '').match(/\d{1,3}\|\d{1,3}/);
        return m ? m[0] : null;
      }
    
      function coordenadasDaLinha(tr) {
        var coords = [];
        tr.querySelectorAll('a').forEach(function (a) {
          var c = coordenadaDoTexto(a.textContent);
          if (c && coords.indexOf(c) === -1) coords.push(c);
        });
        return coords;
      }
    
      function copiarHtmlParaDiagnostico() {
        try {
          var ta = document.createElement('textarea');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          ta.value = document.body.innerHTML.slice(0, 20000);
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        } catch (e) {}
      }
    
      // linha típica dessa tela tem um checkbox de seleção na primeira coluna
      var linhas = Array.prototype.slice.call(document.querySelectorAll('tr'))
        .filter(function (tr) { return tr.querySelector('input[type="checkbox"]') && tr.querySelectorAll('a').length; });
    
      if (!linhas.length) {
        var tabelaClassica = document.getElementById('incomings_table') || document.getElementById('commands_table');
        if (tabelaClassica) {
          linhas = Array.prototype.slice.call(tabelaClassica.querySelectorAll('tbody tr'));
        }
      }
    
      if (!linhas.length) {
        copiarHtmlParaDiagnostico();
        alert('OROCHIKING: não encontrei nenhuma linha de comando nesta tela. Copiei o HTML da página — cole e me envie para eu ajustar.');
        return;
      }
    
      var origem = [], destino = [];
      var vistos = {};
      linhas.forEach(function (tr) {
        var coords = coordenadasDaLinha(tr);
        var o = null, d = null;
        if (coords.length >= 2) {
          d = coords[0];
          o = coords[1];
        } else if (coords.length === 1) {
          o = coords[0];
        }
        var chave = (o || '') + '>>' + (d || '');
        if (chave === '>>' || vistos[chave]) return;
        vistos[chave] = true;
        if (d) destino.push(d);
        if (o) origem.push(o);
      });
    
      if (!origem.length && !destino.length) {
        copiarHtmlParaDiagnostico();
        alert('OROCHIKING: achei as linhas mas não reconheci as coordenadas. Copiei o HTML da página — cole e me envie para eu ajustar.');
        return;
      }
    
      var windowM = window.open('Incomings.html', 'Incomings', 'width=720, height=500, top=100, left=110, scrollbars=yes');
      if (!windowM) {
        alert('OROCHIKING: o navegador bloqueou o popup. Permita popups para este site e clique em Ativar de novo.');
        return;
      }
      var orkCss =
        "<style>*{box-sizing:border-box}" +
        "body{margin:0;padding:22px;background:linear-gradient(165deg,#1a1a1a,#080808);" +
        "font-family:\"Segoe UI\",-apple-system,BlinkMacSystemFont,Roboto,Arial,sans-serif;color:#ececec}" +
        "h1{margin:0 0 14px;font-size:15px;font-weight:800;letter-spacing:1.1px;text-transform:uppercase;" +
        "color:#1a1400;background:linear-gradient(100deg,#e8ac0a,#ffdc63 50%,#e8ac0a);" +
        "padding:11px 16px;border-radius:12px;display:flex;align-items:center;justify-content:space-between}" +
        ".ork-badge{background:#1a1400;color:#ffcf3d;font-size:9.5px;font-weight:800;padding:3px 8px;border-radius:20px}" +
        "h2{font-size:11px;font-weight:700;color:#ffd84d;text-transform:uppercase;letter-spacing:.6px;margin:18px 0 7px}" +
        "textarea{width:100%;min-height:120px;background:#111;border:1px solid rgba(255,255,255,.1);" +
        "border-radius:10px;color:#ececec;padding:10px 12px;font-family:Consolas,monospace;font-size:12px;resize:vertical}" +
        ".ork-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);" +
        "border-radius:12px;padding:12px 14px;margin-bottom:12px}" +
        ".ork-btn{background:linear-gradient(100deg,#e8ac0a,#ffdc63);color:#1a1400;border:none;border-radius:9px;" +
        "font-weight:800;font-size:11.5px;padding:8px 14px;cursor:pointer;margin-top:8px}" +
        ".ork-cont{font-size:10.5px;color:#8a8a8a;margin-top:2px}</style>";
    
      var orkJs =
        "<script>function orkCopiar(el){var t=el.parentNode.querySelector(\"textarea\");" +
        "t.removeAttribute(\"disabled\");t.select();document.execCommand(\"copy\");" +
        "t.setAttribute(\"disabled\",\"disabled\");el.innerText=\"Copiado!\";" +
        "setTimeout(function(){el.innerText=\"Copiar\";},1400);}<\/script>";
    
      windowM.document.write(
        "<html><head><title>OROCHIKING - Coletar Operação</title>" +
        "<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" />" + orkCss + "</head><body>" +
        "<h1>Coletar Operação <span class='ork-badge'>OROCHIKING</span></h1>" +
        "<h2>Origem (de onde saiu)</h2><div class='ork-card'>" +
        "<textarea rows='10' disabled>" + origem.join(",") + "</textarea>" +
        "<div class='ork-cont'>" + origem.length + " coordenada(s)</div>" +
        "<button class='ork-btn' onclick='orkCopiar(this)'>Copiar</button></div>" +
        "<h2>Destino (para onde vai)</h2><div class='ork-card'>" +
        "<textarea rows='10' disabled>" + destino.join(",") + "</textarea>" +
        "<div class='ork-cont'>" + destino.length + " coordenada(s)</div>" +
        "<button class='ork-btn' onclick='orkCopiar(this)'>Copiar</button></div>" +
        orkJs + "</body></html>"
      );
    })();
    
  }

  function checaBarbaras() {
    return window.game_data && window.game_data.screen === 'map';
  }
  function rodarBarbaras() {
    !function(){var n,e="OROCHIKING - Barb Finder",o="orkBarbList",a="screen=map",t="",i=[],r=[],s=["barracks","stable","farm","resources"],l={};function c(){window.localStorage.setItem(`${o}_Settings`,JSON.stringify(n))}function p(){let n=$.grep(Object.values(TWMap.villages),n=>"0"==n.owner&&n.points),[e,o]=[game_data.village.x,game_data.village.y];n.forEach(n=>{n.x=Math.floor(n.xy/1e3),n.y=n.xy%1e3,n.distance=Math.sqrt((n.x-e)**2+(n.y-o)**2)}),n.sort((n,e)=>n.distance-e.distance),u(n)}function d(n){$(`#${o}_textarea`).val("Buscando dados do mapa ao vivo...");let e=Math.ceil(2*n)+2;TWMap.resize(e),setTimeout(()=>{let[e,o]=[game_data.village.x,game_data.village.y],a=$.grep(Object.values(TWMap.villages),n=>"0"==n.owner&&n.points);a.forEach(n=>{n.x=Math.floor(n.xy/1e3),n.y=n.xy%1e3,n.distance=Math.sqrt((n.x-e)**2+(n.y-o)**2)}),a=a.filter(e=>e.distance<=n),a.sort((n,e)=>n.distance-e.distance),u(a)},1200)}function u(n){r=n,_()}function g(n){let e=function(n){let e=n.bonus??n.bonus_id??n.bonusId??null;if(null==e)return null;let o=Array.isArray(e)?e:[e];for(let n of o)if(l[n])return l[n];return null}(n),o=e?s.indexOf(e):-1;return-1===o?s.length:o}function _(){i=function(e){if("spaced"===n.strategy){let o=n.spacing,a=[];return e.forEach(n=>{a.every(e=>Math.sqrt((e.x-n.x)**2+(e.y-n.y)**2)>=o)&&a.push(n)}),a}return e}(r),n.prioritizeBonus&&(i=i.slice().sort((n,e)=>g(n)-g(e))),$(`#${o}_count`).text(i.length),x()}function x(){let e=n.format,a=i.map(n=>"coords_comma"==e?`${n.x}|${n.y},`:"link"==e?`[village]${n.x}|${n.y}[/village]`:`${n.x}|${n.y}`);$(`#${o}_textarea`).val(a.join(" "))}function b(){let n=document.getElementById(`${o}_textarea`);n.select(),n.setSelectionRange(0,999999),navigator.clipboard.writeText(n.value).then(()=>{UI.SuccessMessage(`Copiadas ${i.length} coordenadas para a área de transferência`)}).catch(()=>{document.execCommand("copy"),UI.SuccessMessage(`Copiadas ${i.length} coordenadas para a área de transferência`)})}!function(){if($(`#${o}_popup_container`).length)return void UI.ErrorMessage("Script já foi carregado, recarregue a página antes de chamá-lo novamente");let i=window.location.search.match(/t=\d+/g);if(i&&(t=i),-1==window.location.href.indexOf(`${a}`))return UI.ErrorMessage("Script precisa ser executado no mapa"),void(window.location.href=window.location.pathname+`?${t?t+"&":""}${a}`);!function(){let e=window.localStorage.getItem(`${o}_Settings`);n=e?JSON.parse(e):{mode:"loaded",radius:30,format:"coords",strategy:"cluster",spacing:5,prioritizeBonus:!0}}(),function(){let a=`\n    <div id="${o}_popup_container" class="ork_popup_container">\n        <div>\n            <a class="popup_box_close tooltip-delayed ork_close" id="${o}_popup_cross" href="javascript:void(0)">✕</a>\n            <div id="${o}_popup_content" class="ork_popup_content">\n                <h3 class="ork_centered">${e}</h3>\n\n                <div style="padding:5px;">\n                    <label class="ork_label">Fonte de dados</label>\n                    <select id="${o}_mode" class="ork_select">\n                        <option value="loaded">Mapa carregado atualmente</option>\n                        <option value="radius">Scan ao vivo: dentro do raio</option>\n                    </select>\n\n                    <div id="${o}_radiusRow" class="ork_row" style="display:none;">\n                        <span>Raio (campos): </span>\n                        <input type="text" id="${o}_radius" class="ork_input" value="${n.radius}" size="4">\n                    </div>\n\n                    <br>\n                    <label class="ork_label">Estratégia de nobre</label>\n                    <select id="${o}_strategy" class="ork_select">\n                        <option value="cluster">Cluster (aldeias coladas)</option>\n                        <option value="spaced">Espaçada (com farm ao redor)</option>\n                    </select>\n\n                    <div id="${o}_spacingRow" class="ork_row" style="display:none;">\n                        <span>Espaçamento mínimo (campos): </span>\n                        <input type="text" id="${o}_spacing" class="ork_input" value="${n.spacing}" size="4">\n                    </div>\n\n                    <br>\n                    <label class="ork_label">Preferência de aldeia bônus</label>\n                    <div class="ork_row">\n                        <label class="ork_checkbox_label">\n                            <input type="checkbox" id="${o}_prioritizeBonus" ${n.prioritizeBonus?"checked":""}>\n                            Priorizar aldeias bônus\n                        </label>\n                        <div class="ork_hint">Prioriza: Quartel &gt; Estábulo &gt; Fazenda &gt; Recursos (se não achar, pega outras aldeias normalmente)</div>\n                    </div>\n\n                    <br>\n                    <input type="submit" class="ork_btn" id="${o}_scan" value="Scan">\n                    <br><br>\n                    <span><b id="${o}_count" class="ork_gold">0</b> aldeias bárbaras encontradas</span>\n                    <br><br>\n                    <textarea id="${o}_textarea" rows="8" cols="20" class="ork_textarea" readonly></textarea>\n                    <br><br>\n                    <select id="${o}_format" class="ork_select">\n                        <option value="coords">x|y</option>\n                        <option value="coords_comma">x|y,</option>\n                        <option value="link">BB link</option>\n                    </select>\n                    <input type="submit" class="ork_btn" id="${o}_copy" value="Copiar">\n                </div>\n            </div>\n        </div>\n    </div>\n    <style>\n        .ork_popup_container {\n            border: 1px solid rgba(255,196,0,.16);\n            border-radius: 16px;\n            display: block;\n            position: fixed;\n            top: 8%;\n            left: 65%;\n            z-index: 14000;\n            background: linear-gradient(165deg, rgba(26,26,26,.97), rgba(8,8,8,.98));\n            box-shadow: 0 24px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(0,0,0,.4);\n            font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif;\n        }\n        .ork_popup_content {\n            min-width: 250px;\n            padding: 8px 10px 12px 10px;\n            color: #ffdc63;\n        }\n        .ork_centered {\n            text-align: center;\n            color: #e8ac0a;\n            text-shadow: 0 0 6px rgba(212,175,55,0.5);\n            letter-spacing: 1px;\n            margin: 4px 0 10px 0;\n            padding-right: 26px;\n            box-sizing: border-box;\n            font-size: 14px;\n            white-space: nowrap;\n            border-bottom: 1px solid #e8ac0a;\n            padding-bottom: 6px;\n        }\n        .ork_close {\n            position: absolute;\n            top: 6px;\n            right: 8px;\n            width: 16px;\n            height: 16px;\n            line-height: 16px;\n            text-align: center;\n            color: #e8ac0a;\n            font-weight: bold;\n            font-size: 13px;\n            cursor: pointer;\n            text-decoration: none;\n            z-index: 1;\n        }\n        .ork_label {\n            display: block;\n            font-size: 11px;\n            color: #c9a227;\n            margin-top: 6px;\n            margin-bottom: 2px;\n            text-transform: uppercase;\n        }\n        .ork_select, .ork_input, .ork_textarea {\n            background: #111111;\n            color: #ffdc63;\n            border: 1px solid #e8ac0a;\n            border-radius: 4px;\n            padding: 3px 5px;\n        }\n        .ork_select { width: 100%; }\n        .ork_textarea { width: 100%; box-sizing: border-box; resize: vertical; }\n        .ork_row { margin-top: 4px; }\n        .ork_checkbox_label {\n            display: flex;\n            align-items: center;\n            gap: 6px;\n            font-size: 12px;\n            cursor: pointer;\n        }\n        .ork_hint {\n            font-size: 10px;\n            color: #8a7327;\n            font-style: italic;\n            margin-top: 2px;\n        }\n        .ork_gold { color: #e8ac0a; }\n        .ork_btn {\n            background: #e8ac0a;\n            color: #0c0c0c;\n            font-weight: bold;\n            border: none;\n            border-radius: 4px;\n            padding: 5px 12px;\n            margin-top: 6px;\n            cursor: pointer;\n        }\n        .ork_btn:hover { background: #ffdc63; }\n    </style>`;$("body").append(a),$(`#${o}_popup_container`).draggable(),$(`#${o}_popup_cross`).click(()=>$(`#${o}_popup_container`).remove()),$(`#${o}_mode`).val(n.mode),$(`#${o}_strategy`).val(n.strategy),$(`#${o}_format`).val(n.format),$(`#${o}_radiusRow`).toggle("radius"===n.mode),$(`#${o}_spacingRow`).toggle("spaced"===n.strategy),$(`#${o}_prioritizeBonus`).prop("checked",n.prioritizeBonus),$(`#${o}_mode`).on("change",function(){n.mode=this.value,c(),$(`#${o}_radiusRow`).toggle("radius"===this.value)}),$(`#${o}_strategy`).on("change",function(){n.strategy=this.value,c(),$(`#${o}_spacingRow`).toggle("spaced"===this.value),_()}),$(`#${o}_radius`).click(function(){this.focus(),this.select()}),$(`#${o}_radius`).on("change",function(){n.radius=parseFloat(this.value)||n.radius,c()}),$(`#${o}_spacing`).click(function(){this.focus(),this.select()}),$(`#${o}_spacing`).on("change",function(){n.spacing=parseFloat(this.value)||n.spacing,c(),_()}),$(`#${o}_prioritizeBonus`).on("change",function(){n.prioritizeBonus=this.checked,c(),_()}),$(`#${o}_format`).on("change",function(){n.format=this.value,c(),x()}),$(`#${o}_copy`).click(b),$(`#${o}_scan`).click(function(){"loaded"===n.mode?p():"radius"===n.mode&&d(n.radius)}),"radius"===n.mode?d(n.radius):p()}()}()}()
  }

  function checaPerfil() {
    return document.URL.indexOf('screen=info_player') !== -1;
  }
  function rodarPerfil() {
    if (game_data.player.premium == false) {
      alert("Para utilizar esse script é necessário uma Conta Premium.");
      return;
    }
    if (document.URL.indexOf('screen=info_player') == -1) {
      alert('Você deve executar o script no perfil de algum jogador!');
    } else {
      var orkTds = document.getElementsByTagName("TD");
      var orkPorContinente = {};
      var orkTodas = [];
      for (var orkI = 0; orkI < orkTds.length; orkI++) {
        var orkXy = orkTds[orkI].innerHTML;
        if (/^\d+\|\d+$/.test(orkXy)) {
          orkTodas.push(orkXy);
          var orkP = orkXy.split('|');
          var orkK = Math.floor(parseInt(orkP[0]) / 100) + Math.floor(parseInt(orkP[1]) / 100) * 10;
          if (!orkPorContinente[orkK]) { orkPorContinente[orkK] = []; }
          orkPorContinente[orkK].push(orkXy);
        }
      }
    
      var orkNomeJogador = "";
      try {
        var orkH2 = document.querySelector("#content_value h2, h2");
        if (orkH2) { orkNomeJogador = orkH2.textContent.trim(); }
      } catch (e) {}
    
      var orkCss =
        "<style>" +
        "*{box-sizing:border-box}" +
        "body{margin:0;padding:20px;background:linear-gradient(165deg,#1a1a1a,#080808);" +
        "font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,Arial,sans-serif;color:#ececec}" +
        ".ork-head{background:linear-gradient(100deg,#e8ac0a,#ffdc63 50%,#e8ac0a);color:#1a1400;" +
        "padding:12px 16px;border-radius:13px;display:flex;align-items:center;justify-content:space-between;" +
        "font-weight:800;font-size:14px;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px}" +
        ".ork-badge{background:#1a1400;color:#ffcf3d;font-size:9.5px;font-weight:800;padding:3px 9px;border-radius:20px;letter-spacing:.4px}" +
        ".ork-sub{font-size:11px;color:#8a8a8a;margin-bottom:16px}" +
        ".ork-sub b{color:#ffd84d}" +
        "h2{font-size:10.5px;font-weight:700;color:#ffd84d;text-transform:uppercase;letter-spacing:.7px;margin:20px 0 8px}" +
        ".ork-card{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.075);" +
        "border-radius:13px;padding:13px 15px;margin-bottom:11px}" +
        "textarea{width:100%;min-height:95px;background:#111;border:1px solid rgba(255,255,255,.1);" +
        "border-radius:9px;color:#ececec;padding:10px 12px;font-family:Consolas,monospace;font-size:12px;resize:vertical}" +
        "textarea:focus{outline:none;border-color:#e8ac0a}" +
        ".ork-linha{display:flex;align-items:center;justify-content:space-between;margin-top:9px;gap:9px}" +
        ".ork-cont{font-size:10.5px;color:#8a8a8a}" +
        ".ork-btn{background:linear-gradient(100deg,#e8ac0a,#ffdc63);color:#1a1400;border:none;border-radius:8px;" +
        "font-weight:800;font-size:11px;padding:8px 15px;cursor:pointer;letter-spacing:.3px;white-space:nowrap}" +
        ".ork-btn:hover{filter:brightness(1.08)}" +
        ".ork-btn-sec{background:#232323;color:#ffd84d;border:1px solid #3a3a3a}" +
        ".ork-btn-sec:hover{background:#2c2c2c;filter:none}" +
        "input[type=number]{background:#111;border:1px solid rgba(255,255,255,.12);color:#ececec;" +
        "border-radius:7px;padding:7px 9px;font-size:12px;width:80px}" +
        "input[type=number]:focus{outline:none;border-color:#e8ac0a}" +
        ".ork-div-linha{display:flex;align-items:center;gap:10px;margin-bottom:7px;font-size:12px}" +
        ".ork-div-linha label{color:#bbb;min-width:74px}" +
        ".ork-saldo{font-size:11px;margin-top:9px;color:#8a8a8a}" +
        ".ork-saldo b{color:#ffd84d}" +
        ".ork-erro{color:#ff8a6b}" +
        ".ork-ok{color:#7ed17e}" +
        "</style>";
    
      var orkScript =
        "<script>" +
        "var TODAS = " + JSON.stringify(orkTodas) + ";" +
        "function orkCopiar(btn){" +
        "var t=btn.closest('.ork-card').querySelector('textarea');" +
        "t.select();document.execCommand('copy');" +
        "var o=btn.innerText;btn.innerText='Copiado!';" +
        "setTimeout(function(){btn.innerText=o;},1300);}" +
        "function orkCriarCampos(){" +
        "var n=parseInt(document.getElementById('ork-qtd-partes').value,10)||0;" +
        "if(n<2||n>10){alert('Escolha entre 2 e 10 partes.');return;}" +
        "var alvo=document.getElementById('ork-div-campos');var h='';" +
        "var sugestao=Math.floor(TODAS.length/n);" +
        "for(var i=1;i<=n;i++){" +
        "h+='<div class=\"ork-div-linha\"><label>Parte '+i+':</label>'+" +
        "'<input type=\"number\" min=\"0\" class=\"ork-parte\" value=\"'+sugestao+'\" oninput=\"orkAtualizarSaldo()\"> coordenadas</div>';}" +
        "alvo.innerHTML=h;" +
        "document.getElementById('ork-div-acao').style.display='block';" +
        "orkAtualizarSaldo();}" +
        "function orkAtualizarSaldo(){" +
        "var campos=document.querySelectorAll('.ork-parte');var soma=0;" +
        "for(var i=0;i<campos.length;i++){soma+=parseInt(campos[i].value,10)||0;}" +
        "var resta=TODAS.length-soma;var el=document.getElementById('ork-saldo');" +
        "var classe=resta<0?'ork-erro':(resta===0?'ork-ok':'');" +
        "el.className='ork-saldo '+classe;" +
        "el.innerHTML='Total disponivel: <b>'+TODAS.length+'</b> &nbsp;|&nbsp; Distribuido: <b>'+soma+'</b> &nbsp;|&nbsp; '+" +
        "(resta<0?('Excedeu em <b>'+Math.abs(resta)+'</b>'):('Sobra: <b>'+resta+'</b>'));}" +
        "function orkDividir(){" +
        "var campos=document.querySelectorAll('.ork-parte');var soma=0;var qtds=[];" +
        "for(var i=0;i<campos.length;i++){var v=parseInt(campos[i].value,10)||0;qtds.push(v);soma+=v;}" +
        "if(soma>TODAS.length){alert('A soma ('+soma+') passa do total disponivel ('+TODAS.length+').');return;}" +
        "var pos=0;var h='';" +
        "for(var j=0;j<qtds.length;j++){" +
        "var pedaco=TODAS.slice(pos,pos+qtds[j]);pos+=qtds[j];" +
        "h+='<h2>Parte '+(j+1)+'</h2><div class=\"ork-card\">'+" +
        "'<textarea rows=\"5\">'+pedaco.join(' ')+'</textarea>'+" +
        "'<div class=\"ork-linha\"><span class=\"ork-cont\">'+pedaco.length+' coordenada(s)</span>'+" +
        "'<button class=\"ork-btn\" onclick=\"orkCopiar(this)\">Copiar</button></div></div>';}" +
        "var sobra=TODAS.slice(pos);" +
        "if(sobra.length){h+='<h2>Sobra (nao distribuida)</h2><div class=\"ork-card\">'+" +
        "'<textarea rows=\"4\">'+sobra.join(' ')+'</textarea>'+" +
        "'<div class=\"ork-linha\"><span class=\"ork-cont\">'+sobra.length+' coordenada(s)</span>'+" +
        "'<button class=\"ork-btn\" onclick=\"orkCopiar(this)\">Copiar</button></div></div>';}" +
        "document.getElementById('ork-div-resultado').innerHTML=h;}" +
        "<\/script>";
    
      var orkHtml =
        "<html><head><title>OROCHIKING - Coletor de Perfil</title>" +
        "<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" />" + orkCss + "</head><body>" +
        "<div class=\"ork-head\"><span>Coletor de Perfil</span><span class=\"ork-badge\">OROCHIKING</span></div>" +
        "<div class=\"ork-sub\">" + (orkNomeJogador ? "Jogador: <b>" + orkNomeJogador + "</b> &nbsp;|&nbsp; " : "") +
        "<b>" + orkTodas.length + "</b> coordenada(s) encontrada(s)</div>";
    
      orkHtml +=
        "<h2>Todas as aldeias</h2><div class=\"ork-card\">" +
        "<textarea rows=\"6\">" + orkTodas.join(' ') + "</textarea>" +
        "<div class=\"ork-linha\"><span class=\"ork-cont\">" + orkTodas.length + " coordenada(s)</span>" +
        "<button class=\"ork-btn\" onclick=\"orkCopiar(this)\">Copiar</button></div></div>";
    
      orkHtml +=
        "<h2>Dividir entre jogadores</h2><div class=\"ork-card\">" +
        "<div class=\"ork-linha\" style=\"justify-content:flex-start\">" +
        "<span class=\"ork-cont\">Dividir em</span>" +
        "<input type=\"number\" id=\"ork-qtd-partes\" min=\"2\" max=\"10\" value=\"3\">" +
        "<span class=\"ork-cont\">partes</span>" +
        "<button class=\"ork-btn ork-btn-sec\" onclick=\"orkCriarCampos()\">Criar campos</button></div>" +
        "<div id=\"ork-div-campos\" style=\"margin-top:12px\"></div>" +
        "<div id=\"ork-div-acao\" style=\"display:none\">" +
        "<div id=\"ork-saldo\" class=\"ork-saldo\"></div>" +
        "<div class=\"ork-linha\"><span></span>" +
        "<button class=\"ork-btn\" onclick=\"orkDividir()\">Dividir agora</button></div></div></div>" +
        "<div id=\"ork-div-resultado\"></div>";
    
      var orkChaves = Object.keys(orkPorContinente).sort(function (a, b) { return a - b; });
      for (var orkC = 0; orkC < orkChaves.length; orkC++) {
        var orkKk = orkChaves[orkC];
        var orkLista = orkPorContinente[orkKk];
        orkHtml +=
          "<h2>Continente K" + orkKk + "</h2><div class=\"ork-card\">" +
          "<textarea rows=\"4\">" + orkLista.join(' ') + "</textarea>" +
          "<div class=\"ork-linha\"><span class=\"ork-cont\">" + orkLista.length + " coordenada(s)</span>" +
          "<button class=\"ork-btn\" onclick=\"orkCopiar(this)\">Copiar</button></div></div>";
      }
    
      orkHtml += orkScript + "</body></html>";
    
      var orkPopup = window.open('about:blank', 'twcc', 'width=760,height=640,scrollbars=1');
      if (!orkPopup) {
        alert('OROCHIKING: o navegador bloqueou o popup. Permita popups para este site e clique em Ativar de novo.');
      } else {
        orkPopup.document.open('text/html', 'replace');
        orkPopup.document.write(orkHtml);
        orkPopup.document.close();
      }
    }
    void(0);
    
  }

  function checaOcultar() {
    return document.URL.indexOf('screen=info_player') !== -1;
  }
  function rodarOcultar() {
    (function () {
      function ocultarComandos() {
        var seletores = [
          'table #villages_list tbody tr td span[class="icon command command-attack-ally"]',
          'table #villages_list tbody tr td span[class="icon command command-attack"]',
          'table #villages_list tbody tr td span[class="icon command command-support-ally"]',
          'table #villages_list tbody tr td span[class="icon command command-support"]'
        ];
        var total = 0;
        seletores.forEach(function (sel) {
          document.querySelectorAll(sel).forEach(function (span) {
            var linha = span.closest('tr');
            if (linha) { linha.remove(); total++; }
          });
        });
        return total;
      }
    
      var linkMostrarTodas = null;
      document.querySelectorAll('#villages_list a').forEach(function (a) {
        var t = (a.textContent || '').toLowerCase();
        if (t.indexOf('exibir') !== -1 && t.indexOf('aldeia') !== -1) { linkMostrarTodas = a; }
      });
    
      if (linkMostrarTodas) {
        linkMostrarTodas.click();
        setTimeout(function () { ocultarComandos(); }, 1200);
      } else {
        ocultarComandos();
      }
    })();
    
  }

  function checaColetorFarm() {
    return window.game_data && window.game_data.screen === 'map';
  }
  function rodarColetorFarm() {
    var LA_ids=[];
    var toToggleBack = [];
    var depthMax = 3;
    var loadingLAstuff = false;
    var fmMapLASettings;
    
    //general
    const scriptName = "FM";
    var scriptTag = "fmMapLA";
    var countapikey = "mapFarm";
    var sitter = "";
    var runScreen = "screen=map";
    /******PROGRAM VARS**********/
    
    
    
    function main(){
    hitCountApi();
    if($(`#${scriptTag}_popup_container`).length){
    UI.ErrorMessage("Script has already been loaded, reload the page before calling it again");
    return;
    }
    let sitterQuery = window.location.search.match(/t=\d+/g);
    if(sitterQuery)
    sitter = sitterQuery;
    if(window.location.href.indexOf(`${runScreen}`)==-1)
    {
    UI.ErrorMessage("Script must be run in map");
    window.location.href = window.location.pathname+ `?${sitter?sitter+"&":""}${runScreen}`;
    return;
    }
    
    
    getCache();
    setHTML();
    }
    
    function hitCountApi(){
    $.getJSON(`https://api.countapi.xyz/hit/fmthemasterScripts/${countapikey}`, function(response) {
    console.log(`This script has been run ${response.value} times`);
    });
    }
    
    
    /**************HTML***************/
    
    
    function setHTML(){
    
    let html =`
    <div id="${scriptTag}_popup_container" class="fm_popup_container">
    <div>
    <a class="popup_box_close tooltip-delayed" id="${scriptTag}_popup_cross" href="javascript:void(0)">
    </a>
    <div id="${scriptTag}_popup_content" class="fm_popup_content">
    <div style="padding:5px;">
    <div style="border: 1px solid #804000; padding: 5px;">
    <span>
    </span>
    <div id="${scriptTag}_LAlist">
    <table>
    <thead>
    <tr>
    <th style="min-width:70px;">Village</th>
    <th style="min-width:40px;"><img src="/graphic/rechts.png"></th>
    <th colspan="5">LA</th>
    </tr>
    </thead>
    <tbody id="${scriptTag}_popupTable" class="vis">
    </tbody>
    </table>
    </div>
    <p>
    <input type="text" id="${scriptTag}_mapSize" value ="${TWMap.size[0]}" size="1">
    <input id="${scriptTag}_resizeMap" value ="Resize Map" class="btn" type="submit">
    
    </p>
    <p>
    <input class="btn btn-confirm-yes" id="${scriptTag}_reloadTable" type="submit" value="Reload table">
    </p>
    <input class="btn" id="startAttack" type="submit" onclick="attacknow()" value="Start Attacks">
    <input class="btn btn-confirm-no" id="stopAttack" type="submit" onclick="pararAttack()" value="Parar">
    <br>
    <br>
    <br>
    </div>
    </div>
    </div>
    <script>
    function attacknow(){
    console.log('Start Attack')
    if(window.__ORK_ColetorFarmInterval) clearInterval(window.__ORK_ColetorFarmInterval);
    window.__ORK_ColetorFarmInterval = setInterval(() => {
    document.querySelectorAll('.fmMapLA_td_farm_icon')[2].firstChild.click()
    },280);
    }
    function pararAttack(){
    if(window.__ORK_ColetorFarmInterval){
    clearInterval(window.__ORK_ColetorFarmInterval);
    window.__ORK_ColetorFarmInterval = null;
    console.log('Ataque parado');
    }
    }</script>
    <style>
    /*general css*/
    .fm_popup_container {
    display: block;
    position: fixed;
    top: 8%;
    left: 2%;
    z-index: 1200;
    background: linear-gradient(165deg, rgba(26,26,26,.97), rgba(8,8,8,.98));
    border: 1px solid rgba(255,196,0,.16);
    border-radius: 16px;
    box-shadow: 0 24px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(0,0,0,.4);
    font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif;
    color: #ececec;
    overflow: hidden;
    }
    .fm_popup_content {
    min-width: 260px;
    min-height: 70px;
    height: 100%;
    overflow: hidden;
    background: transparent;
    color: #ececec;
    padding: 6px 4px 10px;
    }
    .fm_popup_container table { color: #ececec; font-size: 11.5px; width: 100%; }
    .fm_popup_container th {
    color: #ffd84d; font-size: 10px; text-transform: uppercase; letter-spacing: .5px;
    border-bottom: 1px solid rgba(255,255,255,.08); padding: 6px 4px; font-weight: 700;
    }
    .fm_popup_container td { padding: 5px 4px; border-bottom: 1px solid rgba(255,255,255,.04); }
    .fm_popup_container tr.row_a { background: rgba(255,255,255,.02); }
    .fm_popup_container tr.row_b { background: transparent; }
    .fm_popup_container tr:hover { background: rgba(255,196,0,.06); }
    .fm_popup_container a { color: #ffd84d; text-decoration: none; }
    .fm_popup_container a:hover { text-decoration: underline; }
    .fm_popup_container input[type=text] {
    background: #111; border: 1px solid rgba(255,255,255,.12); color: #ececec;
    border-radius: 7px; padding: 5px 8px; font-size: 11.5px;
    }
    .fm_popup_container input.btn, .fm_popup_container input[type=submit] {
    background: linear-gradient(100deg,#e8ac0a,#ffdc63); color: #1a1400; border: none;
    border-radius: 8px; font-weight: 800; font-size: 11px; padding: 7px 13px; cursor: pointer;
    margin: 4px 3px; letter-spacing: .3px;
    }
    .fm_popup_container input.btn:hover, .fm_popup_container input[type=submit]:hover { filter: brightness(1.08); }
    .fm_popup_container input#stopAttack, .fm_popup_container .btn-confirm-no {
    background: #7a1f1f !important; color: #fff !important;
    }
    .fm_popup_container .popup_box_close {
    color: #1a1400; font-weight: 800; text-decoration: none; font-size: 15px;
    position: absolute; right: 10px; top: 8px; cursor: pointer; z-index: 2;
    }
    .fm_popup_container .popup_box_close:before { content: "X"; }
    #${scriptTag}_popup_container:before {
    content: "COLETOR PARA FARMAR";
    display: block; background: linear-gradient(100deg,#e8ac0a,#ffdc63 50%,#e8ac0a);
    color: #1a1400; font-weight: 800; font-size: 12px; letter-spacing: 1px;
    padding: 10px 14px; text-transform: uppercase;
    }
    /*specific css*/
    .${scriptTag}_tableHeader{
    height: 35px;
    text-align: text-bottom;
    }
    #${scriptTag}_LAlist {
    overflow-y:auto;
    max-height:30vh;
    }
    #${scriptTag}_LAlist td, ${scriptTag}_LAlist th{
    text-align: center;
    }
    .${scriptTag}_farm_icon{
    transform: scale(1.5);
    width: 24px;
    height: 24px;
    }
    .${scriptTag}_td_farm_icon{
    min-width: 55px;
    height: 30px;
    }
    
    .btn-confirm-yes{
    position: absolute;
    right: 5px;
    }
    </style>`;
    
    $("body").append(html);
    $(`#${scriptTag}_popup_container`).draggable();
    $(`#${scriptTag}_popup_cross`).click(closePopup);
    $(`#${scriptTag}_reloadTable`).click(getFirstFarmPage);
    $(`#${scriptTag}_mapSize`).click(focusSelect);
    $(`#${scriptTag}_resizeMap`).click(function(){
    TWMap.resize(parseInt($(`#${scriptTag}_mapSize`).val()));
    setTimeout(getFirstFarmPage, 0);
    });
    
    setHTMLOptions();
    getHTMLOptions();
    
    $(`.${scriptTag}_checkbox`).on("change",()=>{
    getHTMLOptions();
    setCache();
    });
    
    addAuthor(`#${scriptTag}_popup_content`);
    getFirstFarmPage();
    }
    
    function addLARow(village){
    if( typeof addLARow.counter == 'undefined' ) {
    addLARow.counter = 0;
    }
    if(LA_ids.indexOf(village.id)!=-1)
    return;
    
    addLARow.counter++;
    $("#fmMapLA_popupTable").append(`
    <tr class=${addLARow.counter%2?"row_a":"row_b"}>
    <td><a href="${window.location.pathname}?${sitter?sitter+"&":""}&screen=info_village&id=${village.id}" target="_blank">${parseInt(village.xy/1000)}|${village.xy%1000}</a></td>
    <td>${village.distance}</td>
    <td class="${scriptTag}_td_farm_icon"><a href="javascript:void(0);" class="fm_centered ${scriptTag}_farm_icon ${scriptTag}_sendFarm farm_icon farm_icon_a" data-farmtype="a" data-villagexy="${village.xy}"></a></td>
    <td class="${scriptTag}_td_farm_icon"><a href="javascript:void(0);" class="${scriptTag}_farm_icon ${scriptTag}_sendFarm farm_icon farm_icon_b" data-farmtype="b" data-villagexy="${village.xy}"></a></td>
    </tr>`);
    }
    
    function closePopup(){
    $(`#${scriptTag}_popup_container`).remove();
    }
    
    function focusSelect(){
    this.focus();
    this.select();
    }
    
    function makeLATable(){
    let barbs = $.grep(Object.values(TWMap.villages), (obj)=>obj.owner=="0"&&obj.points);
    barbs.sort(function(a, b){
    let [x0,y0] = [game_data.village.x, game_data.village.y];
    let [xa,ya] = [Math.floor(a.xy/1000), a.xy%1000];
    let [xb,yb] = [Math.floor(b.xy/1000), b.xy%1000];
    a.distance = Math.sqrt((xa-x0)**2 + (ya-y0)**2).toFixed(1);
    b.distance = Math.sqrt((xb-x0)**2 + (yb-y0)**2).toFixed(1);
    return a.distance - b.distance;
    });
    
    $.each(barbs, (key, barb)=> addLARow(barb));
    $(`.${scriptTag}_sendFarm`).off("click");
    $(`.${scriptTag}_sendFarm`).click(function(){
    console.log(this.dataset.villagexy);
    farmVillage(parseInt(this.dataset.villagexy), this.dataset.farmtype);
    $(this).closest("tr").remove();
    });
    }
    
    function addAuthor(cointainerSelector){
    let authorHTML = `
    
    `;
    $(cointainerSelector).append(authorHTML);
    
    }
    
    function startLoader(length)
    {
    let width = $("#contentContainer")[0].clientWidth;
    $("#contentContainer").eq(0).prepend(`
    <div id="progressbar" class="progress-bar">
    <span class="count label">0/${length}</span>
    <div id="progress"><span class="count label" style="width: ${width}px;">0/${length}</span></div>
    </div>`);
    }
    
    function loaded(num, length, action)
    {
    $("#progress").css("width", `${(num + 1) / length * 100}%`);
    $(".count").text(`${action} ${(num + 1)} / ${length}`);
    if(num+1==length)
    endLoader();
    }
    
    function endLoader()
    {
    if($("#progressbar").length > 0)
    $("#progressbar").remove();
    }
    
    
    /*****FROM HIDE BARBS IN MAP******/
    
    function executeQueue(queue, timeout, {loadText="",callback=()=>null}){
    if(queue.length){
    startLoader(queue.length);
    $.each(queue,(key, func)=>{
    setTimeout(()=>{
    loaded(key, queue.length, loadText);
    if(key==queue.length -1){
    setTimeout(callback, timeout);
    endLoader();
    }
    func();
    }, timeout*key);
    });
    }
    else
    setTimeout(callback, timeout);
    }
    
    async function getFirstFarmPage(){
    $(`#${scriptTag}_LAlist`).find("tbody > tr").each(function(){$(this).remove();});
    if(fmMapLASettings.ignoreLA){
    makeLATable();
    return;
    }
    loadingLAstuff = true;
    $.get(`/game.php?${sitter?sitter+"&":""}village=${game_data.village.id}&screen=am_farm&Farm_page=0`, async (data)=> {
    const parser = new DOMParser();
    const doc= await parser.parseFromString(data, "text/html");
    let currentCheckBoxValues = Object.assign({},...$("#plunder_list_filters", doc).find("input[type=checkbox]", doc).map((key,obj)=>{return{[obj.id]:obj};}));
    // console.log(currentCheckBoxValues);
    let postGetQueue = [];
    
    let toggleBox =(key, url, val)=>{
    let data = `extended=1&target_screen=am_farm&${key}=${val}&h=${csrf_token}`;
    console.log(key, url, data);
    TribalWars.post(url,null,{extended:0+true, target_screen:"am_farm", [key]:val});
    };
    let setToggleFunction =(checkboxName, key, url, intendedValue)=>{
    console.log(checkboxName, url, intendedValue);
    if(fmMapLASettings.replaceFilters && currentCheckBoxValues[checkboxName].checked!=intendedValue){
    postGetQueue.push(()=>toggleBox(key, url, Number(intendedValue)));
    toToggleBack.push(()=>toggleBox(key, url, Number(!intendedValue)));
    }
    };
    let LAscript = $("#am_widget_Farm", doc).find("script")[0];
    if(!LAscript){
    UI.ErrorMessage("Loot assistant not activated, or some other error, will include all villages");
    makeLATable();
    }
    
    let urls = $("#am_widget_Farm", doc).find("script")[0].innerHTML.match(/([^']+=toggle_[^']+)/g);
    
    setToggleFunction("all_village_checkbox","all_villages", urls[0], false);
    setToggleFunction("full_losses_checkbox","full_losses", urls[1], true);
    setToggleFunction("partial_losses_checkbox","partial_losses", urls[2], true);
    setToggleFunction("attacked_checkbox","show_attacked", urls[3], true);
    setToggleFunction("full_hauls_checkbox", "only_full_hauls", urls[4], false);
    
    console.log(postGetQueue);
    executeQueue(postGetQueue, 280, {loadText:"toggling LA options", callback:()=>getBarbsInLA(0)});
    }).fail(()=>{UI.ErrorMessage("Couldn't load first LA page, will include all villages"); makeLATable();});
    }
    
    async function getBarbsInLA(page, depth=0, npages=undefined) {
    console.log("getBarbsInLA", page, depth, npages);
    let url = `/game.php?${sitter?sitter+"&":""}village=${game_data.village.id}&screen=am_farm&Farm_page=${page}`;
    $.get(url, async (data)=> {
    console.log("success");
    const parser = new DOMParser();
    const doc= await parser.parseFromString(data, "text/html");
    const pageSelector = $(".paged-nav-item:last", doc);
    const npagesLA = parseInt(pageSelector.length? pageSelector[0].innerText.match(/\d+/g)[0]:0);
    let rows = $("#plunder_list", doc).find("tr[id^=village_]");
    if(rows.length){
    LA_ids = LA_ids.concat($.map(rows, function(obj){
    return obj.id.match(/\d+/g)[0];
    }));
    }
    if(!npages){
    let pageQueue=[];
    for(var i = 1; i < npagesLA; i++){
    const j =i;
    pageQueue.push(()=>getBarbsInLA(j,0,npagesLA));// jshint ignore:line
    }
    executeQueue(pageQueue, 250, {loadText:"loading LA pages",callback:()=>{
    makeLATable();
    executeQueue(toToggleBack, 250, {loadText:"toggling LA options back", callback: ()=>{toToggleBack = [];loadingLAstuff=false;}});
    }});
    
    }
    }).fail(()=>{
    if(depth < depthMax){
    UI.ErrorMessage(`Failed getting page ${page} of LA for the ${depth} time, will try again`);
    console.log(`Failed getting page ${page} of LA for the ${depth} time, will try again`);
    getBarbsInLA(page, depth +1, npages);
    }
    else{
    UI.ErrorMessage(`Failed getting page ${page} of LA for the ${depth} time, will not try again, getting next page`);
    console.log(`Failed getting page ${page} of LA for the ${depth} time, will try again`);
    getBarbsInLA(page +1, depth +1, npages);
    
    }
    });
    }
    
    
    /***********FARM STUFF************/
    
    function farmVillage (xy, type) {
    console.log(xy,type);
    let village = TWMap.villages[xy];
    console.log("Farming Village: ");
    console.log(village);
    let villageid = village.id;
    let s=TWMap.popup._cache[villageid];
    if(void 0===s)
    TWMap.popup.loadVillage(villageid);
    
    let mpFarm = type=="a"?"mp_farm_a":"mp_farm_b";
    
    let url = TWMap.urls.ctx[mpFarm].replace(/__village__/, village.id).replace(/__source__/, game_data.village.id);
    
    setTimeout(function(){TribalWars.get(url);},200);
    }
    
    /**************CACHE**************/
    
    function getCache(){
    console.log("getting cache");
    let cachedSettings = window.localStorage.getItem(`${scriptTag}_Settings`);
    fmMapLASettings = cachedSettings ? JSON.parse(cachedSettings) : {ignoreLA:false, replaceFilters:true};
    }
    
    function setCache(){
    console.log("setting cache");
    window.localStorage.setItem(`${scriptTag}_Settings`, JSON.stringify(fmMapLASettings));
    }
    
    function setHTMLOptions(){
    console.log("setting HTML options");
    $(`#${scriptTag}_ignoreLA`).prop("checked", fmMapLASettings.ignoreLA);
    $(`#${scriptTag}_changeLAFilters`).prop("checked", fmMapLASettings.replaceFilters);
    }
    
    function getHTMLOptions(){
    console.log("getting HTML options");
    fmMapLASettings.ignoreLA = $(`#${scriptTag}_ignoreLA`).prop("checked");
    fmMapLASettings.replaceFilters = $(`#${scriptTag}_changeLAFilters`).prop("checked");
    $(`#${scriptTag}_ignoreLA`).each(function(){
    let isChecked = this.checked;
    let display = isChecked?"none":"block";
    $(`#${scriptTag}_changeLAFilters_p`).css("display", display);
    });
    }
    
    
    /************RUN MAIN*************/
    
    main();
  }

  /* --- Cunhar Moedas Automático --- */
  /* ============================================================
     FREIO — modo de baixo risco

     Serve pra quando você vai dormir com o farm e as cunhagens
     rodando: quanto mais requisição por segundo, maior a chance de
     cair captcha ou derrubar a sessão. Com o freio ligado, tudo passa
     a trabalhar num ritmo bem mais calmo:

       - Farm Hard: força a velocidade mais lenta (0.5x) e ignora
         qualquer velocidade mais rápida que você tenha clicado
       - Cunhagem: intervalo x3, com no mínimo 5 minutos entre ciclos
       - Loop do Ataque: intervalo x2, com no mínimo 10 minutos
       - Coletor BB Padrão: pausa maior entre comandos

     A configuração fica salva, então continua valendo depois de
     recarregar a página.
  ============================================================ */
  var FREIO_CHAVE = 'ork_freio_ativo';

  function freioLigado() {
    try { return localStorage.getItem(FREIO_CHAVE) === '1'; } catch (e) { return false; }
  }
  function gravarFreio(ligado) {
    try { localStorage.setItem(FREIO_CHAVE, ligado ? '1' : '0'); } catch (e) {}
    window.__ORK_FREIO__ = !!ligado;
  }
  // deixa disponível já na carga, pros outros scripts consultarem
  window.__ORK_FREIO__ = freioLigado();

  // Aplica o freio a um intervalo: multiplica e respeita um mínimo.
  function intervaloComFreio(ms, multiplicador, minimoMs) {
    if (!freioLigado()) { return ms; }
    return Math.max(minimoMs, ms * multiplicador);
  }

  var CUNHAR_CHAVE = 'ork_cunhar_config';
  var cunharTimeoutId = null;

  function lerConfigCunhar() {
    try {
      var bruto = localStorage.getItem(CUNHAR_CHAVE);
      return bruto ? JSON.parse(bruto) : { ativo: false, intervaloMs: 180000 };
    } catch (e) { return { ativo: false, intervaloMs: 180000 }; }
  }
  function gravarConfigCunhar(cfg) {
    try { localStorage.setItem(CUNHAR_CHAVE, JSON.stringify(cfg)); } catch (e) {}
  }
  function pararCunharPorSeguranca() {
    try {
      var cfg = lerConfigCunhar();
      if (cfg.ativo) {
        cfg.ativo = false;
        gravarConfigCunhar(cfg);
      }
      if (cunharTimeoutId) { clearTimeout(cunharTimeoutId); cunharTimeoutId = null; }
      var caixa = document.getElementById('ork-cunhar-status');
      if (caixa) caixa.remove();
      var bolinha = document.getElementById('ork-cunhar-bolinha');
      if (bolinha) bolinha.remove();
      var estilo = document.getElementById('ork-cunhar-style');
      if (estilo) estilo.remove();
    } catch (e) {}
  }
  // Exatamente os mesmos cliques do script que você confirmou funcionando:
  // "Selecionar" e depois "Cunhar moedas de ouro". Só funciona estando na
  // tela de Cunhagem — é lá que esses botões existem.
  // No MODO FREIO, a cunhagem e o farm são coordenados pra nunca dispararem
  // requisição ao mesmo tempo (é o pico simultâneo que mais gera captcha).
  // A cunhagem só age quando o farm está EM PAUSA (ou não está rodando).
  // Fora do freio, cunha normalmente sem esperar nada.
  function cunhagemPodeAgir() {
    if (!window.__ORK_FREIO__) { return true; }         // sem freio: sem coordenação
    if (typeof window.__ORK_FARM_EM_PAUSA__ === 'undefined') { return true; } // farm nem ativo
    return window.__ORK_FARM_EM_PAUSA__ === true;        // freio: só na pausa do farm
  }

  function clicarCunhar() {
    // No freio, se o farm está farmando agora, segura — tenta de novo em alguns segundos
    if (!cunhagemPodeAgir()) {
      console.log('[OROCHIKING] Freio: farm rodando, cunhagem aguarda a pausa dele.');
      var st = document.getElementById('ork-cunhar-bolinha');
      if (st) { st.title = 'Cunhagem ativa — esperando o farm pausar (modo freio)'; }
      return false;
    }
    try {
      var selectCoins = document.querySelector('select.select_coins');
      if (selectCoins) {
        var anchor = document.getElementById('select_anchor_top');
        if (anchor) anchor.click();
        var botao = document.querySelector('#coin_overview_table .mint_multi_button');
        if (botao) botao.click();
        return true;
      }
    } catch (e) { console.error('[OROCHIKING] erro ao cunhar', e); }
    return false;
  }

  // Descobre o "from" atual pela URL (0, 1000, 2000...).
  function fromAtualDaUrl() {
    try {
      var m = window.location.href.match(/[?&]from=(\d+)/);
      return m ? parseInt(m[1], 10) : 0;
    } catch (e) { return 0; }
  }

  // Existe uma próxima página de aldeias? (link &from=proximo na paginação)
  function temProximaPaginaCunhar(proximoFrom) {
    try {
      return !!document.querySelector('a[href*="mode=coin"][href*="from=' + proximoFrom + '"]');
    } catch (e) { return false; }
  }

  // Navega pra uma faixa específica de aldeias (from), guardando que estamos
  // no meio de uma varredura de páginas — pra retomar do lugar certo após o reload.
  function irParaPaginaCunhar(from) {
    try { localStorage.setItem('ork_cunhar_from', String(from)); } catch (e) {}
    var base = '/game.php?village=' + game_data.village.id + '&screen=snob&mode=coin&from=' + from;
    window.location.href = base;
  }

  // Lê o total de moedas de ouro a partir do HTML da página de cunhagem.
  // Serve pra CONFERIR se a cunhagem realmente funcionou, em vez de
  // depender do POST "parecer" certo — se o total subiu, funcionou.
  function lerTotalMoedas(doc) {
    try {
      var linhas = doc.querySelectorAll('tr');
      for (var i = 0; i < linhas.length; i++) {
        var txt = (linhas[i].textContent || '').toLowerCase();
        // procura a linha "Total:" dentro do bloco de Moedas de ouro
        if (txt.indexOf('total') !== -1) {
          var cels = linhas[i].querySelectorAll('td');
          for (var c = 0; c < cels.length; c++) {
            var n = String(cels[c].textContent).replace(/[^0-9]/g, '');
            if (n !== '' && n.length >= 2) { return parseInt(n, 10); }
          }
        }
      }
    } catch (e) {}
    return null;
  }

  // ==========================================================
  // CUNHAGEM — DE VOLTA AO MODELO QUE FUNCIONA
  //
  // Tentei duas abordagens "espertas" (reconstruir o POST e usar
  // iframe invisível) e nenhuma funcionou no jogo real. Voltamos ao
  // método comprovado, igual ao script do ThiioM: estar na tela de
  // Cunhagem, clicar em "Selecionar" e em "Cunhar", e recarregar a
  // página no intervalo configurado.
  //
  // Limitação assumida (a mesma do script original): precisa ficar
  // na tela de Cunhagem, e uma aba por cada 1.000 aldeias.
  // ==========================================================

  function agendarProximoCicloCunhar(intervaloMs) {
    if (cunharTimeoutId) clearTimeout(cunharTimeoutId);
    // Com o freio ligado, espaça bem mais os ciclos (x3, mínimo 5 min)
    var intervaloOriginal = intervaloMs;
    intervaloMs = intervaloComFreio(intervaloMs, 3, 5 * 60000);
    if (intervaloMs !== intervaloOriginal) {
      console.log('[OROCHIKING] Freio: cunhagem a cada ' + Math.round(intervaloMs / 60000) +
        ' min (configurado: ' + Math.round(intervaloOriginal / 1000) + 's).');
    }
    // Atraso extra aleatório (10 a 15s) em cima do intervalo configurado, pra não
    // repetir sempre no mesmo timing exato — evita um padrão robótico reconhecível.
    // Delay aleatório entre páginas/ciclos, pra nunca cair no mesmo tempo exato.
    var jitterMs = 8000 + Math.random() * 9000; // 8 a 17s
    cunharTimeoutId = setTimeout(function () {
      var cfgAtual = lerConfigCunhar();
      if (!cfgAtual.ativo) { return; }

      // VARREDURA DE PÁGINAS numa aba só: se tem próxima faixa de 1.000 aldeias,
      // vai pra ela; se não tem, volta pro começo (from=0) e recomeça a volta.
      var from = fromAtualDaUrl();
      var proximo = from + 1000;
      if (temProximaPaginaCunhar(proximo)) {
        console.log('[OROCHIKING] Cunhagem: indo para a próxima página (from=' + proximo + ').');
        irParaPaginaCunhar(proximo);
      } else {
        if (from > 0) {
          console.log('[OROCHIKING] Cunhagem: última página cunhada, recomeçando do início.');
          irParaPaginaCunhar(0);
        } else {
          // uma página só (menos de 1.000 aldeias): recarrega a mesma
          window.location.reload();
        }
      }
    }, intervaloMs + jitterMs);
  }
  function mostrarStatusCunhar(cfg) {
    if (document.getElementById('ork-cunhar-bolinha')) return;

    // Estilo idêntico ao botão flutuante do Coletor Hard Farming —
    // discreta, não atrapalha, clica pra parar ou ver o status.
    var btn = document.createElement('div');
    btn.id = 'ork-cunhar-bolinha';
    btn.title = 'Cunhagem ativa — clique pra parar';
    btn.style.cssText = (
      'position:fixed;left:20px;bottom:20px;width:54px;height:54px;border-radius:50%;' +
      'background:linear-gradient(100deg,#e8ac0a,#ffdc63 50%,#e8ac0a);' +
      'color:#1a1400;border:1px solid rgba(255,196,0,.35);cursor:pointer;' +
      'display:flex;align-items:center;justify-content:center;flex-direction:column;' +
      'box-shadow:0 10px 26px rgba(0,0,0,.5),0 0 0 1px rgba(0,0,0,.35);' +
      'font-family:"Segoe UI",-apple-system,BlinkMacSystemFont,Roboto,Arial,sans-serif;' +
      'z-index:9999996;transition:all .2s;animation:orkCunharPulse 2s infinite;' +
      'font-size:22px;line-height:1;'
    );

    // injeta a keyframe de pulse se ainda não existir
    if (!document.getElementById('ork-cunhar-style')) {
      var st = document.createElement('style');
      st.id = 'ork-cunhar-style';
      st.textContent = '@keyframes orkCunharPulse{0%,100%{box-shadow:0 10px 26px rgba(0,0,0,.5),0 0 0 1px rgba(0,0,0,.35)}50%{box-shadow:0 10px 26px rgba(0,0,0,.5),0 0 0 6px rgba(232,172,10,.35)}}';
      document.head.appendChild(st);
    }

    btn.innerHTML = '<span>🪙</span><span style="font-size:8px;font-weight:800;margin-top:2px;letter-spacing:.3px">ATIVO</span>';

    // tooltip ao passar o mouse
    btn.addEventListener('mouseenter', function () {
      var segs = Math.round(cfg.intervaloMs / 1000);
      btn.title = 'Cunhagem ativa — a cada ' + (segs >= 60 ? Math.round(segs/60) + 'min' : segs + 's') + ' — clique pra parar';
    });
    btn.addEventListener('click', function () {
      if (confirm('Parar a cunhagem automática?')) {
        pararCunharPorSeguranca();
      }
    });
    document.body.appendChild(btn);
  }

  function atualizarStatusCunhar(texto) {
    var btn = document.getElementById('ork-cunhar-bolinha');
    if (btn) { btn.title = texto; }
  }
  function abrirModalCunhar() {
    if (document.getElementById('ork-modal-cunhar')) return;
    var overlay = document.createElement('div');
    overlay.id = 'ork-modal-cunhar';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999998;' +
      'display:flex;align-items:center;justify-content:center;font-family:Verdana,Arial,sans-serif';
    overlay.innerHTML =
      '<div style="background:linear-gradient(165deg,rgba(26,26,26,.97),rgba(8,8,8,.98));border:1px solid #3a3a3a;' +
      'border-radius:16px;padding:20px 22px;width:280px;color:#eee;box-shadow:0 14px 34px rgba(0,0,0,.75)">' +
        '<div style="font-weight:800;color:#ffd84d;margin-bottom:10px">🪙 Cunhar Moedas Automático</div>' +
        '<div style="font-size:11.5px;color:#9a9a9a;margin-bottom:10px">Cunha agora e recarrega a página no intervalo abaixo, repetindo sozinho:</div>' +
        '<div style="display:flex;gap:8px;margin-bottom:12px">' +
          '<input id="ork-cunhar-valor" type="number" min="1" value="3" ' +
            'style="flex:1;box-sizing:border-box;background:#111;border:1px solid #444;color:#eee;padding:8px 9px;border-radius:6px;font-size:12.5px">' +
          '<select id="ork-cunhar-unidade" style="flex:1;background:#111;border:1px solid #444;color:#eee;padding:8px 9px;border-radius:6px;font-size:12.5px">' +
            '<option value="min" selected>minutos</option>' +
            '<option value="seg">segundos</option>' +
          '</select>' +
        '</div>' +
        '<div style="display:flex;gap:8px">' +
          '<button id="ork-cunhar-cancelar" style="flex:1;background:#232323;color:#ccc;border:1px solid #3a3a3a;' +
            'border-radius:7px;padding:8px 0;cursor:pointer;font-weight:700;font-size:11.5px">Cancelar</button>' +
          '<button id="ork-cunhar-iniciar" style="flex:1;background:linear-gradient(100deg,#e8ac0a,#ffdc63);' +
            'color:#141200;border:none;border-radius:7px;padding:8px 0;cursor:pointer;font-weight:800;font-size:11.5px">Iniciar</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    function fechar() { overlay.remove(); }
    document.getElementById('ork-cunhar-cancelar').addEventListener('click', fechar);
    document.getElementById('ork-cunhar-iniciar').addEventListener('click', function () {
      var valor = parseFloat(document.getElementById('ork-cunhar-valor').value) || 3;
      var unidade = document.getElementById('ork-cunhar-unidade').value;
      var intervaloMs = Math.max(5000, unidade === 'seg' ? valor * 1000 : valor * 60000);
      gravarConfigCunhar({ ativo: true, intervaloMs: intervaloMs });
      fechar();
      mostrarStatusCunhar({ intervaloMs: intervaloMs });
      clicarCunhar();
      agendarProximoCicloCunhar(intervaloMs);
    });
  }
  function checaCunhar() {
    return !!(window.game_data && game_data.screen === 'snob' && game_data.mode === 'coin');
  }
  function rodarCunhar() {
    // Sempre abre o modal pra configurar o intervalo — mesmo que já estivesse ativo
    // antes. Isso garante que você sempre escolhe o tempo antes de ativar.
    pararCunharPorSeguranca(); // para qualquer ciclo anterior antes de reconfigurar
    abrirModalCunhar();
  }

  /* ============================================================
     KEYPRESS HARD — 100% VIA AJAX (roda de qualquer tela)

     Não clica mais na página: busca a lista do Assistente de Saque por
     fetch e manda os ataques pelos MESMOS endpoints que já funcionam
     no painel:
       - A / B: ajaxaction=farm (source/target/template_id) — o mesmo
         do Coletor Hard
       - C:     ajaxaction=farm_from_report (report_id) — o mesmo do
         Farm Hard

     Aldeia de origem = a aldeia que estava aberta quando você ativou.

       - "A + B": manda A enquanto tiver tropa pro modelo A e o resto
         vai no B, na mesma passada. "B" ou "C": só aquele.
       - Tropa: lê as tropas em casa + a composição dos modelos A/B da
         própria página e para o modelo quando não dá mais (sem gastar
         requisição à toa). Se a leitura falhar, cai no plano B: 2
         recusas seguidas do servidor = tropa acabou.
       - Percorre todas as páginas do Assistente, 1 ataque por alvo por
         ciclo, e espera o intervalo (+ atraso aleatório) pra repetir.
       - Várias abas abertas: só UMA roda (trava entre abas), as outras
         só mostram a bolinha. Se essa aba fechar, outra assume.
       - Trocou de tela no meio? Retoma de onde parou sem repetir alvo.
       - Para no captcha. FREIO: intervalo x2, mínimo 60s.
  ============================================================ */
  var KP_CHAVE = 'ork_keypress_config';
  var KP_TRAVA = 'ork_keypress_trava';
  var KP_ABA = 'aba' + Math.random().toString(36).slice(2, 10);
  var kpTimeoutId = null;
  var kpContagemId = null;
  var kpTravaId = null;
  var kpRodando = false;
  var KP_UNIDADES = ['spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy', 'ram', 'catapult', 'knight'];

  function kpLerConfig() {
    try {
      var bruto = localStorage.getItem(KP_CHAVE);
      var c = bruto ? JSON.parse(bruto) : null;
      if (c && typeof c === 'object') { return c; }
    } catch (e) {}
    return { ativo: false, modelo: 'a', intervaloMs: 300000, proximoEm: 0, origem: 0, feitos: [] };
  }
  function kpGravarConfig(cfg) {
    try { localStorage.setItem(KP_CHAVE, JSON.stringify(cfg)); } catch (e) {}
  }
  function kpEsperar(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function kpAleatorio(min, max) { return Math.round(min + Math.random() * (max - min)); }

  /* ---------- trava entre abas (só uma aba executa) ---------- */
  function kpPegarTrava() {
    try {
      var t = JSON.parse(localStorage.getItem(KP_TRAVA) || 'null');
      var agora = Date.now();
      if (t && t.aba !== KP_ABA && agora - (t.ts || 0) < 20000) { return false; }
      localStorage.setItem(KP_TRAVA, JSON.stringify({ aba: KP_ABA, ts: agora }));
      // confere se não houve empate com outra aba no mesmo instante
      var conf = JSON.parse(localStorage.getItem(KP_TRAVA) || 'null');
      if (!conf || conf.aba !== KP_ABA) { return false; }
      if (!kpTravaId) {
        kpTravaId = setInterval(function () {
          try {
            var at = JSON.parse(localStorage.getItem(KP_TRAVA) || 'null');
            if (at && at.aba === KP_ABA) { localStorage.setItem(KP_TRAVA, JSON.stringify({ aba: KP_ABA, ts: Date.now() })); }
          } catch (e) {}
        }, 5000);
      }
      return true;
    } catch (e) { return true; }
  }
  function kpSoltarTrava() {
    try {
      if (kpTravaId) { clearInterval(kpTravaId); kpTravaId = null; }
      var t = JSON.parse(localStorage.getItem(KP_TRAVA) || 'null');
      if (t && t.aba === KP_ABA) { localStorage.removeItem(KP_TRAVA); }
    } catch (e) {}
  }
  window.addEventListener('pagehide', kpSoltarTrava);

  /* ---------- leitura da página do Assistente (por fetch) ---------- */
  async function kpBuscarPagina(origem, p) {
    var r = await fetch('/game.php?village=' + origem + '&screen=am_farm&Farm_page=' + p, { credentials: 'include' });
    var html = await r.text();
    return { html: html, doc: new DOMParser().parseFromString(html, 'text/html') };
  }
  function kpTotalPaginas(doc) {
    var total = 1;
    try {
      var sels = doc.querySelectorAll('select');
      for (var i = 0; i < sels.length; i++) {
        var reais = Array.prototype.filter.call(sels[i].options || [], function (o) {
          return /Farm_page=/.test(o.value || '') && !/Farm_page=-1/.test(o.value || '');
        });
        if (reais.length > 0) { return reais.length; }
      }
      var links = doc.querySelectorAll('a[href*="Farm_page="]');
      for (var j = 0; j < links.length; j++) {
        var m = (links[j].getAttribute('href') || '').match(/Farm_page=(\d+)/);
        if (m) { total = Math.max(total, parseInt(m[1], 10) + 1); }
      }
    } catch (e) {}
    return total;
  }
  function kpLerModelos(doc) {
    var modelos = {};
    doc.querySelectorAll('form[action*="action=edit_all"] tr').forEach(function (tr) {
      try {
        var idInput = tr.querySelector('input[type="hidden"][name*="template"][name*="[id]"]');
        if (!idInput) { return; }
        var icone = tr.previousElementSibling && tr.previousElementSibling.querySelector('a.farm_icon_a, a.farm_icon_b');
        if (!icone) { return; }
        var m = (icone.className || '').match(/farm_icon_([ab])\b/);
        if (!m) { return; }
        var tid = parseInt(idInput.value, 10);
        if (!(tid > 0)) { return; }
        var unidades = {};
        tr.querySelectorAll('input[type="text"], input[type="number"]').forEach(function (inp) {
          var chave = (inp.name || '').split('[')[0];
          if (KP_UNIDADES.indexOf(chave) === -1) { return; }
          var q = parseInt(inp.value || '0', 10) || 0;
          if (q > 0) { unidades[chave] = q; }
        });
        modelos[m[1]] = { id: tid, unidades: unidades };
      } catch (e) {}
    });
    return modelos;
  }
  // Tropas em casa: acha cada coluna pelo ícone (unit_spear, unit_light...) — qualquer idioma
  function kpLerTropas(doc) {
    var tropas = {};
    try {
      var tabela = doc.querySelector('#units_home');
      if (!tabela) { return null; }
      var linhas = Array.prototype.slice.call(tabela.querySelectorAll('tr'));
      var colunas = {};
      for (var l = 0; l < linhas.length; l++) {
        var cels = Array.prototype.slice.call(linhas[l].children);
        for (var c = 0; c < cels.length; c++) {
          var img = cels[c].querySelector('img');
          var src = img ? (img.getAttribute('src') || '') : '';
          var m = src.match(/unit_([a-z]+)\./);
          if (m && KP_UNIDADES.indexOf(m[1]) !== -1 && colunas[m[1]] === undefined) { colunas[m[1]] = c; }
        }
        if (Object.keys(colunas).length) { break; }
      }
      if (!Object.keys(colunas).length) { return null; }
      Object.keys(colunas).forEach(function (u) {
        for (var l2 = 0; l2 < linhas.length; l2++) {
          var cel = linhas[l2].children[colunas[u]];
          if (!cel || cel.tagName === 'TH') { continue; }
          var bruto = String(cel.textContent).replace(/[^0-9]/g, '');
          if (bruto !== '') { tropas[u] = parseInt(bruto, 10); break; }
        }
      });
    } catch (e) { return null; }
    return Object.keys(tropas).length ? tropas : null;
  }
  function kpLerAlvos(doc) {
    var alvos = [];
    doc.querySelectorAll('#plunder_list tr[id^="village_"]').forEach(function (tr) {
      var id = parseInt((tr.id || '').split('_')[1], 10);
      if (!(id > 0)) { return; }
      function ativo(l) {
        var b = tr.querySelector('a.farm_icon_' + l);
        return !!b && (b.className || '').indexOf('farm_icon_disabled') === -1;
      }
      var link = tr.querySelector('a[href*="view="]');
      var mr = link ? (link.getAttribute('href') || '').match(/view=(\d+)/) : null;
      alvos.push({ id: id, a: ativo('a'), b: ativo('b'), c: ativo('c'), relatorio: mr ? mr[1] : null });
    });
    return alvos;
  }
  function kpCabe(modelo, tropas) {
    if (!tropas || !modelo) { return true; } // sem leitura: deixa o servidor decidir
    var us = Object.keys(modelo.unidades || {});
    if (!us.length) { return true; }
    for (var i = 0; i < us.length; i++) {
      var u = us[i];
      if (tropas[u] === undefined) { continue; }
      if (tropas[u] < modelo.unidades[u]) { return false; }
    }
    return true;
  }
  function kpDescontar(modelo, tropas) {
    if (!tropas || !modelo) { return; }
    Object.keys(modelo.unidades || {}).forEach(function (u) {
      if (tropas[u] !== undefined) { tropas[u] -= modelo.unidades[u]; }
    });
  }

  /* ---------- envio (mesmos endpoints já usados no painel) ---------- */
  async function kpEnviar(origem, letra, alvo, modelos) {
    var csrf = window.csrf_token || (window.game_data && game_data.csrf) || '';
    var url, corpo;
    if (letra === 'c') {
      url = '/game.php?village=' + origem + '&screen=am_farm&mode=farm&ajaxaction=farm_from_report&json=1&h=' + encodeURIComponent(csrf);
      corpo = 'report_id=' + alvo.relatorio;
    } else {
      url = '/game.php?village=' + origem + '&screen=am_farm&mode=farm&ajaxaction=farm&json=1';
      corpo = 'source=' + origem + '&target=' + alvo.id + '&template_id=' + modelos[letra].id + '&h=' + encodeURIComponent(csrf);
    }
    try {
      var r = await fetch(url, {
        method: 'POST', credentials: 'include',
        headers: {
          'accept': 'application/json, text/javascript, */*; q=0.01',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'tribalwars-ajax': '1', 'x-requested-with': 'XMLHttpRequest'
        },
        body: corpo
      });
      var texto = await r.text();
      var j = null;
      try { j = JSON.parse(texto); } catch (e) {}
      if (!j) { return { ok: false, erro: 'resposta não-JSON (HTTP ' + r.status + ')' }; }
      var erro = j.error || (j.response && j.response.error);
      if (erro) { return { ok: false, erro: Array.isArray(erro) ? erro.join(' ') : String(erro) }; }
      if (r.status !== 200) { return { ok: false, erro: 'HTTP ' + r.status }; }
      return { ok: true };
    } catch (e) {
      return { ok: false, erro: 'rede: ' + ((e && e.message) || 'falhou') };
    }
  }
  function kpEhLimiteSegundo(msg) {
    return /\b5\b/.test(msg) && /segundo|second|seconde|sekund|secondo/i.test(msg);
  }

  /* ---------- ciclo ---------- */
  async function kpRodarCiclo() {
    if (kpRodando) { return; }
    var cfg = kpLerConfig();
    if (!cfg.ativo) { return; }
    if (window.__ORK_CAPTCHA_BLOQUEADO__) { kpPararPorSeguranca('captcha'); return; }
    if (!kpPegarTrava()) { kpAtualizarStatus('KeyPress rodando em outra aba'); setTimeout(kpRetomar, kpAleatorio(15000, 25000)); return; }
    kpRodando = true;
    kpMostrarStatus();
    var origem = cfg.origem || (window.game_data && game_data.village.id);
    var feitos = {};
    (cfg.feitos || []).forEach(function (k) { feitos[k] = 1; });
    var enviados = 0, falhas = 0;
    var parado = false;
    try {
      var p0 = await kpBuscarPagina(origem, 0);
      var modelos = kpLerModelos(p0.doc);
      var tropas = kpLerTropas(p0.doc);
      var paginas = kpTotalPaginas(p0.doc);
      var fila = cfg.modelo === 'a' ? ['a', 'b'] : [cfg.modelo === 'c' ? 'c' : 'b'];
      // modelo A/B sem id lido = não dá pra mandar esse modelo
      fila = fila.filter(function (l) { return l === 'c' || (modelos[l] && modelos[l].id); });
      if (!fila.length) {
        console.warn('[OROCHIKING] KeyPress: não achei os modelos A/B na página do Assistente da aldeia ' + origem + '.');
      }
      console.log('[OROCHIKING] KeyPress: origem ' + origem + ', ' + paginas + ' página(s), modelos ' + fila.join('+').toUpperCase() +
        (tropas ? ', tropas lidas' : ', tropas NÃO lidas (usa recusa do servidor)'));
      var esgotado = {};
      var recusasSeguidas = {};
      for (var p = 0; p < paginas && !parado; p++) {
        var pag = p === 0 ? p0 : await kpBuscarPagina(origem, p);
        var alvos = kpLerAlvos(pag.doc);
        for (var i = 0; i < alvos.length && !parado; i++) {
          var alvo = alvos[i];
          if (feitos[alvo.id]) { continue; }
          var letra = null;
          for (var f = 0; f < fila.length; f++) {
            var l = fila[f];
            if (esgotado[l] || !alvo[l]) { continue; }
            if (l === 'c' && !alvo.relatorio) { continue; }
            if (l !== 'c' && !kpCabe(modelos[l], tropas)) { esgotado[l] = true; continue; }
            letra = l; break;
          }
          if (fila.every(function (x) { return esgotado[x]; })) { break; }
          if (!letra) { continue; }
          // checagens de segurança antes de cada envio
          cfg = kpLerConfig();
          if (!cfg.ativo) { parado = true; break; }
          if (window.__ORK_CAPTCHA_BLOQUEADO__) { kpPararPorSeguranca('captcha'); parado = true; break; }
          var res = await kpEnviar(origem, letra, alvo, modelos);
          var tentativas = 0;
          while (!res.ok && kpEhLimiteSegundo(res.erro) && tentativas < 3) {
            tentativas++;
            await kpEsperar(kpAleatorio(1100, 1800));
            res = await kpEnviar(origem, letra, alvo, modelos);
          }
          if (res.ok) {
            enviados++;
            recusasSeguidas[letra] = 0;
            if (letra !== 'c') { kpDescontar(modelos[letra], tropas); }
            feitos[alvo.id] = 1;
            cfg.feitos = Object.keys(feitos);
            kpGravarConfig(cfg);
            kpAtualizarStatus('KeyPress enviando... ' + enviados + ' (página ' + (p + 1) + '/' + paginas + ')');
          } else {
            falhas++;
            recusasSeguidas[letra] = (recusasSeguidas[letra] || 0) + 1;
            console.log('[OROCHIKING] KeyPress: ' + letra.toUpperCase() + ' -> ' + alvo.id + ' recusado: ' + String(res.erro).slice(0, 100));
            if (recusasSeguidas[letra] >= 2) { esgotado[letra] = true; i--; } // tenta o próximo modelo neste mesmo alvo
          }
          await kpEsperar(kpAleatorio(260, 480));
        }
        if (fila.length && fila.every(function (x) { return esgotado[x]; })) { break; }
        if (p + 1 < paginas) { await kpEsperar(kpAleatorio(700, 1600)); }
      }
    } catch (e) {
      console.error('[OROCHIKING] KeyPress: erro no ciclo', e);
    }
    kpRodando = false;
    if (parado) { return; }
    console.log('[OROCHIKING] KeyPress: ciclo concluído — ' + enviados + ' enviados, ' + falhas + ' recusados.');
    cfg = kpLerConfig();
    if (!cfg.ativo) { return; }
    var espera = cfg.intervaloMs;
    if (window.__ORK_FREIO__) { espera = Math.max(60000, espera * 2); }
    // atraso extra de 2 a 4s, sorteado em milissegundos (nunca repete o mesmo tempo)
    espera += 2000 + Math.floor(Math.random() * 2001);
    cfg.proximoEm = Date.now() + espera;
    cfg.feitos = [];
    kpGravarConfig(cfg);
    kpAgendar();
  }

  function kpAgendar() {
    var cfg = kpLerConfig();
    if (!cfg.ativo) { return; }
    if (kpTimeoutId) { clearTimeout(kpTimeoutId); }
    var falta = Math.max(0, (cfg.proximoEm || 0) - Date.now());
    kpTimeoutId = setTimeout(function () {
      var c = kpLerConfig();
      if (!c.ativo) { return; }
      if (c.proximoEm && c.proximoEm > Date.now() + 1000) { kpAgendar(); return; } // outra aba reagendou
      kpRodarCiclo();
    }, falta);
    kpContagem();
  }

  // decide o que fazer ao carregar uma página (ou quando a outra aba some)
  function kpRetomar() {
    var c = kpLerConfig();
    if (!c.ativo) { return; }
    kpMostrarStatus();
    kpContagem();
    if (c.proximoEm && c.proximoEm > Date.now()) { kpAgendar(); return; }
    kpRodarCiclo();
  }

  function kpContagem() {
    if (kpContagemId) { return; }
    kpContagemId = setInterval(function () {
      var cfg = kpLerConfig();
      if (!cfg.ativo) { kpPararPorSeguranca(); return; }
      var el = document.getElementById('ork-kp-tempo');
      if (kpRodando) { if (el) { el.textContent = 'ENV'; } return; }
      if (!cfg.proximoEm) { if (el) { el.textContent = '...'; } return; }
      var s = Math.max(0, Math.round((cfg.proximoEm - Date.now()) / 1000));
      var txt = Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
      if (el) { el.textContent = txt; }
      kpAtualizarStatus('KeyPress (' + (cfg.modelo === 'a' ? 'A+B' : cfg.modelo.toUpperCase()) + ') — próximo ciclo em ' + txt + ' — clique pra parar');
    }, 1000);
  }

  function kpAtualizarStatus(texto) {
    var b = document.getElementById('ork-kp-bolinha');
    if (b) { b.title = texto; }
  }

  function kpPararPorSeguranca(motivo) {
    try {
      var cfg = kpLerConfig();
      if (cfg.ativo) { cfg.ativo = false; cfg.proximoEm = 0; cfg.feitos = []; kpGravarConfig(cfg); }
      if (kpTimeoutId) { clearTimeout(kpTimeoutId); kpTimeoutId = null; }
      if (kpContagemId) { clearInterval(kpContagemId); kpContagemId = null; }
      kpSoltarTrava();
      var b = document.getElementById('ork-kp-bolinha');
      if (b) { b.remove(); }
      if (motivo) { console.warn('[OROCHIKING] KeyPress parado (' + motivo + ').'); }
    } catch (e) {}
  }
  // parou em outra aba? some a bolinha aqui também
  window.addEventListener('storage', function (ev) {
    if (ev.key !== KP_CHAVE) { return; }
    var c = kpLerConfig();
    if (!c.ativo) { kpPararPorSeguranca(); }
  });

  function kpMostrarStatus() {
    if (document.getElementById('ork-kp-bolinha')) { return; }
    if (!document.getElementById('ork-cunhar-style')) {
      var st = document.createElement('style');
      st.id = 'ork-cunhar-style';
      st.textContent = '@keyframes orkCunharPulse{0%,100%{box-shadow:0 10px 26px rgba(0,0,0,.5),0 0 0 1px rgba(0,0,0,.35)}50%{box-shadow:0 10px 26px rgba(0,0,0,.5),0 0 0 6px rgba(232,172,10,.35)}}';
      document.head.appendChild(st);
    }
    var btn = document.createElement('div');
    btn.id = 'ork-kp-bolinha';
    btn.title = 'KeyPress ativo — clique pra parar';
    btn.style.cssText = (
      'position:fixed;left:84px;bottom:20px;width:54px;height:54px;border-radius:50%;' +
      'background:linear-gradient(100deg,#e8ac0a,#ffdc63 50%,#e8ac0a);' +
      'color:#1a1400;border:1px solid rgba(255,196,0,.35);cursor:pointer;' +
      'display:flex;align-items:center;justify-content:center;flex-direction:column;' +
      'box-shadow:0 10px 26px rgba(0,0,0,.5),0 0 0 1px rgba(0,0,0,.35);' +
      'font-family:"Segoe UI",Arial,sans-serif;z-index:9999996;animation:orkCunharPulse 2s infinite;' +
      'font-size:20px;line-height:1;'
    );
    btn.innerHTML = '<span>⌨️</span><span id="ork-kp-tempo" style="font-size:8.5px;font-weight:800;margin-top:2px">ATIVO</span>';
    btn.addEventListener('click', function () {
      if (confirm('Parar o KeyPress Hard?')) { kpPararPorSeguranca('parado pelo usuário'); }
    });
    document.body.appendChild(btn);
  }

  function kpAbrirModal() {
    if (document.getElementById('ork-modal-kp')) { return; }
    var cfg = kpLerConfig();
    var segs = Math.round((cfg.intervaloMs || 300000) / 1000);
    var emMin = segs >= 60 && segs % 60 === 0;
    var overlay = document.createElement('div');
    overlay.id = 'ork-modal-kp';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999998;' +
      'display:flex;align-items:center;justify-content:center;font-family:"Segoe UI",Arial,sans-serif';
    function opt(v, titulo, sub) {
      return '<button type="button" class="ork-kp-mod" data-m="' + v + '" style="flex:1;background:#1c1c1c;border:1px solid #333;' +
        'border-radius:8px;padding:8px 2px;color:#ddd;cursor:pointer;font-weight:800;font-size:13px;font-family:inherit">' + titulo +
        '<div style="font-size:8.5px;color:#888;font-weight:700;margin-top:2px">' + sub + '</div></button>';
    }
    overlay.innerHTML =
      '<div style="background:linear-gradient(165deg,rgba(26,26,26,.97),rgba(8,8,8,.98));border:1px solid #3a3a3a;' +
      'border-radius:14px;padding:18px 20px;width:300px;color:#eee;box-shadow:0 14px 34px rgba(0,0,0,.75)">' +
        '<div style="font-weight:800;color:#ffd84d;margin-bottom:4px">⌨️ KeyPress Hard</div>' +
        '<div style="font-size:11px;color:#9a9a9a;margin-bottom:10px">Manda os modelos do Assistente de Saque desta aldeia (<b style="color:#ddd">' + ((window.game_data && game_data.village && game_data.village.name) || 'atual') + '</b>) em segundo plano — pode sair do Assistente, roda de qualquer tela.</div>' +
        '<div style="font-size:10px;color:#888;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">Modelo</div>' +
        '<div style="display:flex;gap:6px;margin-bottom:12px">' +
          opt('a', 'A + B', 'A primeiro, sobra no B') + opt('b', 'B', 'só o B') + opt('c', 'C', 'só o C') +
        '</div>' +
        '<div style="font-size:10px;color:#888;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">Repetir a cada</div>' +
        '<div style="display:flex;gap:8px;margin-bottom:6px">' +
          '<input id="ork-kp-valor" type="number" min="1" value="' + (emMin ? segs / 60 : segs) + '" ' +
            'style="flex:1;box-sizing:border-box;background:#111;border:1px solid #444;color:#eee;padding:7px 9px;border-radius:6px;font-size:12.5px">' +
          '<select id="ork-kp-unidade" style="flex:1;background:#111;border:1px solid #444;color:#eee;padding:7px 9px;border-radius:6px;font-size:12.5px">' +
            '<option value="min"' + (emMin ? ' selected' : '') + '>minutos</option>' +
            '<option value="seg"' + (emMin ? '' : ' selected') + '>segundos</option>' +
          '</select>' +
        '</div>' +
        '<div style="font-size:9.5px;color:#666;margin-bottom:12px">Sempre com +2 a 4s aleatórios (em milissegundos), nunca no tempo exato.</div>' +
        '<div style="display:flex;gap:8px">' +
          '<button id="ork-kp-cancelar" style="flex:1;background:#232323;color:#ccc;border:1px solid #3a3a3a;' +
            'border-radius:7px;padding:8px 0;cursor:pointer;font-weight:700;font-size:11.5px">Cancelar</button>' +
          '<button id="ork-kp-iniciar" style="flex:1;background:linear-gradient(100deg,#e8ac0a,#ffdc63);' +
            'color:#141200;border:none;border-radius:7px;padding:8px 0;cursor:pointer;font-weight:800;font-size:11.5px">Iniciar</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var modelo = cfg.modelo || 'a';
    function marcar() {
      var bs = overlay.querySelectorAll('.ork-kp-mod');
      for (var i = 0; i < bs.length; i++) {
        var on = bs[i].getAttribute('data-m') === modelo;
        bs[i].style.borderColor = on ? '#FFC400' : '#333';
        bs[i].style.background = on ? '#241f08' : '#1c1c1c';
        bs[i].style.color = on ? '#fff' : '#ddd';
      }
    }
    marcar();
    overlay.querySelectorAll('.ork-kp-mod').forEach(function (b) {
      b.addEventListener('click', function () { modelo = b.getAttribute('data-m'); marcar(); });
    });
    function fechar() { overlay.remove(); }
    document.getElementById('ork-kp-cancelar').addEventListener('click', fechar);
    document.getElementById('ork-kp-iniciar').addEventListener('click', function () {
      var valor = parseFloat(document.getElementById('ork-kp-valor').value) || 5;
      var unidade = document.getElementById('ork-kp-unidade').value;
      var intervaloMs = Math.max(1000, unidade === 'seg' ? valor * 1000 : valor * 60000);
      kpGravarConfig({ ativo: true, modelo: modelo, intervaloMs: intervaloMs, proximoEm: 0, origem: game_data.village.id, feitos: [] });
      fechar();
      console.log('[OROCHIKING] KeyPress Hard iniciado — modelo ' + modelo.toUpperCase() + (modelo === 'a' ? '+B' : '') + ', a cada ' + Math.round(intervaloMs / 1000) + 's.');
      kpMostrarStatus();
      kpContagem();
      kpRodarCiclo();
    });
  }

  function checaKeyPress() {
    return !!(window.game_data && game_data.village && game_data.village.id);
  }
  function rodarKeyPress() {
    kpPararPorSeguranca(); // para ciclo anterior antes de reconfigurar
    kpAbrirModal();
  }

  /* ============================================================
     AUTOMATIZAÇÃO 24/7  (v50)

     Dois modos, numa aba só. A configuração fica SÓ nesta aba
     (sessionStorage): recarregar, trocar de tela ou relogar mantém;
     fechou a aba, configura de novo.

     A) FARM + CUNHAGEM + BALANCEADOR
        Farm Hard (preset da aba) por X min -> [Cunhagem em todas as
        páginas] -> [Balanceador, no máx. a cada N min] -> Pausa -> repete.
        Cunhagem e Balanceador são opcionais (liga/desliga).

     B) FARM PLAYER (Ataque Mass em loop)
        Usa o ataque salvo no próprio Ataque Mass (tropas, alvos, tipo de
        comando, prédio e aldeias atacantes). A cada X-Y min abre o
        Combinado de novo, reabre o Ataque, restaura tudo e manda a leva.

     Nos dois: relogin automático (queda de sessão, ou a cada N ciclos),
     captcha = tudo espera e continua sozinho, tempos sorteados em ms.
     Aba copiada (abrir um link do jogo em nova aba copia a sessão) é
     detectada e não roda em dobro.
  ============================================================ */
  var AUTO_CHAVE = 'ork_auto247';
  var AUTO_PRESET = 'ork_auto247_preset';
  var AUTO_ATK = 'ork_auto247_atk';
  var autoTimer = null, autoRelogio = null, autoPasso = false, autoDono = false;
  var autoCanal = null, autoCookieTs = 0, autoLevaViva = false;
  // versões antigas guardavam o 24/7 no localStorage (valia pra todas as abas)
  try { localStorage.removeItem(AUTO_CHAVE); } catch (e) {}

  function autoPadrao() {
    return { ativo: false, id: '', modo: 'farm', fase: 'farm', fimFase: 0, ciclos: 0, from: 0,
      farmMin: 2, farmMax: 3, pausaMin: 3, pausaMax: 4,
      cunhar: true, balancear: false, balCadaMin: 30, balUltimo: 0, balFeitos: [],
      atkMin: 4, atkMax: 6, atkInicio: 0, atkNav: 0,
      relogarCada: 0, mundo: '' };
  }
  function autoLer() {
    var p = autoPadrao();
    try {
      var c = JSON.parse(sessionStorage.getItem(AUTO_CHAVE) || 'null');
      if (c && typeof c === 'object') { for (var k in c) { if (Object.prototype.hasOwnProperty.call(c, k)) { p[k] = c[k]; } } }
    } catch (e) {}
    return p;
  }
  function autoGravar(c) { try { sessionStorage.setItem(AUTO_CHAVE, JSON.stringify(c)); } catch (e) {} }
  function autoLerPreset() {
    try {
      var p = JSON.parse(sessionStorage.getItem(AUTO_PRESET) || 'null');
      if (p && p.fator && p.rotacao) { return p; }
    } catch (e) {}
    return { fator: '1.5', rotacao: '1' };
  }
  function autoGravarPreset(p) { try { sessionStorage.setItem(AUTO_PRESET, JSON.stringify(p)); } catch (e) {} }
  function autoLerAtk() {
    try { var a = JSON.parse(sessionStorage.getItem(AUTO_ATK) || 'null'); if (a && a.coords) { return a; } } catch (e) {}
    return null;
  }
  function autoGravarAtk(a) { try { sessionStorage.setItem(AUTO_ATK, JSON.stringify(a)); } catch (e) {} }
  function autoMs(minMin, maxMin) {
    var a = Math.max(0.05, Number(minMin) || 0), b = Math.max(a, Number(maxMin) || a);
    return Math.floor(a * 60000 + Math.random() * ((b - a) * 60000 + 1));
  }
  function autoEntre(minMs, maxMs) { return Math.floor(minMs + Math.random() * (maxMs - minMs + 1)); }
  function autoLog(t) { try { console.log('[OROCHIKING] 24/7: ' + t); } catch (e) {} }
  function autoHora(ts) { try { return new Date(ts).toLocaleTimeString(); } catch (e) { return ''; } }

  /* ---------- cookie compartilhado com a tela de login (www) ---------- */
  function autoDominioBase() {
    var p = window.location.hostname.split('.');
    return p.length > 2 ? p.slice(1).join('.') : window.location.hostname;
  }
  function autoCookie(nome, valor, segundos) {
    try {
      document.cookie = nome + '=' + encodeURIComponent(valor) + '; domain=.' + autoDominioBase() +
        '; path=/; max-age=' + segundos + '; SameSite=Lax';
    } catch (e) {}
  }
  // Só a aba dona da automação mexe no cookie (as outras abas não apagam).
  function autoAtualizarCookie(forcar) {
    if (!autoDono) { return; }
    var c = autoLer();
    if (!c.ativo) { autoCookie('ork_auto247_mundo', '', 0); return; }
    if (!forcar && Date.now() - autoCookieTs < 240000) { return; }
    autoCookieTs = Date.now();
    autoCookie('ork_auto247_mundo', c.mundo || (window.game_data && game_data.world) || '', 1800);
  }

  /* ---------- identidade da aba (evita rodar em dobro em aba copiada) ---------- */
  function autoToken(c) { return 'ork247:' + c.id; }
  function autoCanalAbrir() {
    if (autoCanal || typeof BroadcastChannel === 'undefined') { return autoCanal; }
    try {
      autoCanal = new BroadcastChannel('ork_auto247');
      autoCanal.addEventListener('message', function (ev) {
        var m = ev.data || {};
        var c = autoLer();
        if (!autoDono || !c.ativo) { return; }
        if (m.q === 'quem' && (!m.id || m.id === c.id)) { autoCanal.postMessage({ r: 'eu', id: c.id }); }
        if (m.cmd === 'parar' && m.exceto !== c.id) { autoParar(false); autoLog('parado porque a automação foi iniciada em outra aba.'); }
      });
    } catch (e) { autoCanal = null; }
    return autoCanal;
  }
  // Pergunta se outra aba viva já roda a automação (id = aquela específica, ou qualquer uma)
  function autoPerguntar(id, cb) {
    var canal = autoCanalAbrir();
    if (!canal) { cb(false); return; }
    var achou = false;
    var ouvir = function (ev) { var m = ev.data || {}; if (m.r === 'eu' && (!id || m.id === id)) { achou = true; } };
    canal.addEventListener('message', ouvir);
    canal.postMessage({ q: 'quem', id: id || null });
    setTimeout(function () { canal.removeEventListener('message', ouvir); cb(achou); }, 1500);
  }
  function autoAssumir() {
    var c = autoLer();
    autoDono = true;
    try { window.name = autoToken(c); } catch (e) {}
    autoCanalAbrir();
    autoAtualizarCookie(true);
    autoMostrarBolinha();
    autoPasso2();
  }
  function autoRetomar() {
    var c = autoLer();
    if (!c.ativo) { return; }
    if (window.name === autoToken(c)) { autoAssumir(); return; }
    // Nome da aba não bate: ou é uma cópia (link aberto em nova aba), ou o
    // navegador limpou o nome no relogin. Pergunta se a original está viva.
    autoPerguntar(c.id, function (outraViva) {
      if (outraViva) {
        try { sessionStorage.removeItem(AUTO_CHAVE); } catch (e) {}
        autoLog('esta aba é uma cópia — a automação continua só na aba original.');
        return;
      }
      autoAssumir();
    });
  }

  /* ---------- controle do Farm Hard ---------- */
  function autoFarmAberto() { return !!document.getElementById('fh-iniciar'); }
  function autoIniciarFarm() {
    var p = autoLerPreset();
    try { localStorage.removeItem('ork_retomar_dormindo'); } catch (e) {}
    if (!autoFarmAberto()) { rodarFarmar(); }
    setTimeout(function () {
      try {
        var vel = document.querySelector('.fh-vel[data-fator="' + p.fator + '"]');
        if (vel) { vel.click(); }
        var rot = document.querySelector('.fh-opcao-input[value="' + p.rotacao + '"]');
        if (rot && !rot.checked) {
          rot.checked = true;
          rot.dispatchEvent(new Event('change', { bubbles: true }));
        }
        var ini = document.getElementById('fh-iniciar');
        if (ini) { ini.click(); }
        autoLog('farm iniciado em ' + p.fator + 'x, rotação ' + p.rotacao + '.');
      } catch (e) { console.error('[OROCHIKING] 24/7: erro ao iniciar o Farm Hard', e); }
    }, autoEntre(600, 1100));
  }
  function autoPararFarm() {
    try { var f = document.getElementById('fh-fechar'); if (f) { f.click(); } } catch (e) {}
  }

  /* ---------- navegação ---------- */
  function autoAgendar(ms) {
    if (autoTimer) { clearTimeout(autoTimer); }
    autoTimer = setTimeout(autoPasso2, Math.max(0, ms));
  }
  function autoIrPara(url) {
    setTimeout(function () { window.location.href = url; }, autoEntre(1200, 2500));
  }
  function autoIrCunhagem(from) {
    autoIrPara('/game.php?village=' + game_data.village.id + '&screen=snob&mode=coin&from=' + from);
  }
  function autoNaTelaCunhagem() {
    return !!(window.game_data && game_data.screen === 'snob' && /[?&]mode=coin/.test(window.location.href));
  }
  function autoNoCombinado() {
    return !!(window.game_data && game_data.screen === 'overview_villages' && document.getElementById('combined_table'));
  }

  /* ---------- etapas do modo FARM ---------- */
  function autoBalancearDevido(c) {
    return !!c.balancear && (Date.now() - (c.balUltimo || 0) >= Math.max(1, Number(c.balCadaMin) || 30) * 60000);
  }
  function autoDepoisDoFarm(c) {
    if (c.cunhar) {
      c.fase = 'cunhar'; c.from = 0; autoGravar(c);
      autoLog('farm encerrado, indo cunhar.');
      autoStatus('Indo para a Academia...');
      autoIrCunhagem(0);
      return;
    }
    autoDepoisDaCunhagem(c);
  }
  function autoDepoisDaCunhagem(c) {
    if (autoBalancearDevido(c)) {
      c.fase = 'balancear'; c.balFeitos = []; autoGravar(c);
      autoLog('hora de balancear os recursos.');
      autoAgendar(autoEntre(1500, 3000));
      return;
    }
    if (c.balancear) { autoLog('balanceador: ainda não deu o intervalo mínimo, fica pro próximo ciclo.'); }
    autoIrPausa(c);
  }
  function autoIrPausa(c) {
    c.fase = 'pausa'; c.from = 0; c.ciclos = (c.ciclos || 0) + 1;
    c.fimFase = Date.now() + autoMs(c.pausaMin, c.pausaMax);
    autoGravar(c);
    autoLog('ciclo ' + c.ciclos + ' concluído. Pausa até ' + autoHora(c.fimFase) + '.');
    autoAgendar(c.fimFase - Date.now());
  }
  async function autoRodarBalanceamento() {
    autoStatus('Balanceando recursos...');
    try {
      var calc = await balCalcular(balLer());
      var c = autoLer();
      var feitos = {};
      (c.balFeitos || []).forEach(function (id) { feitos[id] = 1; });
      var env = 0, fal = 0, vol = 0;
      for (var i = 0; i < calc.lista.length; i++) {
        c = autoLer();
        if (!c.ativo || !autoDono) { return; }
        while (window.__ORK_CAPTCHA_BLOQUEADO__) {
          autoStatus('Captcha — esperando resolver');
          await balEsperar(autoEntre(3000, 5000));
          if (!autoLer().ativo) { return; }
        }
        var it = calc.lista[i];
        if (feitos[it.target_id]) { continue; }
        autoStatus('Balanceando ' + (i + 1) + '/' + calc.lista.length);
        var r = await balEnviar(it);
        if (r.ok) { env++; vol += it.total; } else { fal++; autoLog('balanceador: falhou pra ' + it.coord + '.'); }
        feitos[it.target_id] = 1;
        c = autoLer(); c.balFeitos = Object.keys(feitos); autoGravar(c);
        await balEsperar(autoEntre(1000, 3000)); // 1 a 3s, sorteado em ms
      }
      autoLog('balanceamento: ' + env + ' envio(s), ' + vol.toLocaleString('pt-BR') + ' recursos' + (fal ? ', ' + fal + ' falha(s)' : '') + '.');
    } catch (e) {
      console.error('[OROCHIKING] 24/7: erro no balanceamento', e);
    }
  }

  /* ---------- etapas do modo FARM PLAYER (Ataque Mass) ---------- */
  var AUTO_UNIDADES = ['spear', 'sword', 'axe', 'archer', 'spy', 'light', 'heavy', 'marcher', 'ram', 'catapult', 'knight', 'snob'];
  function autoPrepararAtaque(atk, cb) {
    // o loop próprio do Ataque fica desligado: quem comanda as levas agora é o 24/7
    try {
      var lc = JSON.parse(localStorage.getItem('ork_loop_ataque_config') || 'null');
      if (lc && lc.ativo) { lc.ativo = false; localStorage.setItem('ork_loop_ataque_config', JSON.stringify(lc)); }
    } catch (e) {}
    if (!document.querySelector("input[name='send']")) {
      try { rodarAtaque(); } catch (e) { cb(false, 'não consegui abrir o Ataque Mass (' + (e && e.message) + ')'); return; }
    }
    var tentativas = 0;
    (function esperar() {
      tentativas++;
      var pronto = document.querySelector("input[name='send']") && document.querySelector('input.chkbox') &&
        typeof window.executarEnvio === 'function';
      if (!pronto) {
        if (tentativas > 40) { cb(false, 'o Ataque Mass não abriu nesta tela'); return; }
        setTimeout(esperar, 250);
        return;
      }
      // espera o painel instalar os ganchos de fim de rodada (sem alerta bloqueante)
      setTimeout(function () {
        try {
          var chk = document.getElementById('ork-loop-ataque-check');
          if (chk && chk.checked) { chk.checked = false; chk.dispatchEvent(new Event('change')); }
          // tropas: o envio lê do que está salvo, então salva e também mostra na tela
          AUTO_UNIDADES.forEach(function (u) {
            var v = (atk.tropas && atk.tropas[u] != null) ? atk.tropas[u] : 0;
            try { localStorage.setItem(u, String(v)); } catch (e) {}
            var el = document.getElementById(u);
            if (el && el.closest && el.closest('.amx-troop')) { el.value = v; }
          });
          try {
            localStorage.setItem('comando', atk.comando || 'attack');
            localStorage.setItem('buildingAlvo', atk.predio || '');
            localStorage.setItem('coords', atk.coords || '');
            localStorage.setItem('coordsRes', '');
          } catch (e) {}
          var sel = document.getElementById('comando'); if (sel) { sel.value = atk.comando || 'attack'; }
          var pred = document.getElementById('buildingAlvo'); if (pred) { pred.value = atk.predio || ''; }
          var ta = document.querySelector("textarea[name='coords']");
          if (ta) { ta.value = atk.coords || ''; try { ta.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {} }
          var sync = document.getElementById('syncChegada'); if (sync) { sync.checked = false; }
          // aldeias atacantes
          var caixas = document.querySelectorAll('input.chkbox');
          caixas.forEach(function (b) { b.checked = false; });
          if (atk.origens && atk.origens.length) {
            var ids = {};
            atk.origens.forEach(function (o) { ids[String(o.id)] = 1; });
            var marcadas = 0;
            caixas.forEach(function (b) { if (ids[String(b.getAttribute('data-id'))]) { b.checked = true; marcadas++; } });
            if (!marcadas) { cb(false, 'nenhuma das aldeias atacantes salvas aparece nesta lista (o grupo mudou?)'); return; }
            if (marcadas < atk.origens.length) {
              autoLog((atk.origens.length - marcadas) + ' aldeia(s) atacante(s) salva(s) não aparecem nesta lista — seguindo com ' + marcadas + '.');
            }
            try { $('.chkbox').first().trigger('change'); } catch (e) {}
          }
          cb(true);
        } catch (e) { cb(false, (e && e.message) || 'erro ao restaurar o ataque'); }
      }, 900);
    })();
  }
  function autoDispararLeva(atk) {
    window.__ORK_LOOP_SILENCIOSO__ = true; // nada de alert() bloqueante
    window.lastRoundType = 'normal';
    window.__ORK_AldeiasBase = null;
    autoLevaViva = true;
    autoLog('disparando leva: ' + atk.nAlvos + ' alvo(s), ' + (atk.origens && atk.origens.length ? atk.origens.length + ' aldeia(s) atacante(s)' : 'todas as aldeias da lista') + '.');
    try {
      window.executarEnvio(null, function () { autoFimLeva(true); });
    } catch (e) {
      autoLog('erro ao disparar a leva: ' + (e && e.message));
      autoFimLeva(false);
    }
  }
  function autoFimLeva(ok) {
    var c = autoLer();
    autoLevaViva = false;
    if (!c.ativo || (c.fase !== 'atk-rodando' && c.fase !== 'atk-enviar')) { return; }
    c.ciclos = (c.ciclos || 0) + 1;
    c.fase = 'atk-espera';
    c.fimFase = Date.now() + autoMs(c.atkMin, c.atkMax);
    autoGravar(c);
    autoLog('leva ' + c.ciclos + (ok ? ' enviada' : ' encerrada') + '. Próxima às ' + autoHora(c.fimFase) + '.');
    autoAgendar(c.fimFase - Date.now());
  }

  /* ---------- relogin programado + início de ciclo ---------- */
  function autoTentarRelogar(c) {
    if (!((c.relogarCada || 0) > 0 && c.ciclos > 0 && c.ciclos % c.relogarCada === 0)) { return false; }
    var sair = document.querySelector('a[href*="action=logout"]');
    if (!sair) { autoLog('botão Sair não encontrado — pulando o relogin deste ciclo.'); return false; }
    c.fase = 'relogar'; autoGravar(c);
    autoCookie('ork_relogin', c.mundo || game_data.world, 900);
    autoLog('deslogando pra relogar em ' + (c.mundo || game_data.world) + '.');
    setTimeout(function () { window.location.href = sair.href; }, autoEntre(1000, 2500));
    return true;
  }
  function autoComecarCiclo(c) {
    if (c.modo === 'player') {
      c.fase = 'atk-enviar'; c.atkNav = 0; autoGravar(c);
      autoPasso2();
      return;
    }
    c.fase = 'farm'; c.fimFase = Date.now() + autoMs(c.farmMin, c.farmMax); autoGravar(c);
    autoIniciarFarm();
    autoAgendar(autoEntre(4000, 6000));
  }

  /* ---------- máquina de fases ---------- */
  function autoPasso2() {
    var c = autoLer();
    if (!c.ativo) { autoParar(false); return; }
    if (!autoDono) { return; }
    // captcha: não faz nada, confere de novo em 3-5s (continua sozinho quando resolver)
    if (window.__ORK_CAPTCHA_BLOQUEADO__) {
      autoStatus('Captcha — esperando resolver');
      autoAgendar(autoEntre(3000, 5000));
      return;
    }
    var agora = Date.now();

    if (c.fase === 'farm') {
      if (agora < c.fimFase) {
        if (!autoFarmAberto()) { autoIniciarFarm(); } // o captcha fecha o Farm Hard: reabre
        autoAgendar(Math.min(c.fimFase - agora, autoEntre(4000, 6000)));
        return;
      }
      autoPararFarm();
      autoDepoisDoFarm(c);
      return;
    }

    if (c.fase === 'cunhar') {
      var fromUrl = (function () { var m = window.location.href.match(/[?&]from=(\d+)/); return m ? parseInt(m[1], 10) : 0; })();
      if (!autoNaTelaCunhagem() || fromUrl !== (c.from || 0)) { autoIrCunhagem(c.from || 0); return; }
      if (autoPasso) { return; }
      autoPasso = true;
      setTimeout(function () {
        var ok = false;
        try { ok = clicarCunhar(); } catch (e) {}
        autoLog('cunhagem página from=' + (c.from || 0) + (ok ? ' — cunhado.' : ' — nada pra cunhar nesta página.'));
        setTimeout(function () {
          autoPasso = false;
          var c2 = autoLer();
          if (!c2.ativo) { return; }
          if (window.__ORK_CAPTCHA_BLOQUEADO__) { autoAgendar(3000); return; }
          var prox = (c2.from || 0) + 1000;
          if (temProximaPaginaCunhar(prox)) {
            c2.from = prox; autoGravar(c2);
            autoStatus('Cunhando... próxima página');
            autoIrCunhagem(prox);
          } else {
            c2.from = 0;
            autoLog('cunhagem concluída.');
            autoDepoisDaCunhagem(c2);
          }
        }, autoEntre(6000, 12000));
      }, autoEntre(2000, 4000));
      return;
    }

    if (c.fase === 'balancear') {
      if (autoPasso) { return; }
      autoPasso = true;
      autoRodarBalanceamento().then(function () {
        autoPasso = false;
        var c3 = autoLer();
        if (!c3.ativo || c3.fase !== 'balancear') { return; }
        c3.balUltimo = Date.now(); c3.balFeitos = [];
        autoIrPausa(c3);
      });
      return;
    }

    if (c.fase === 'atk-enviar') {
      var atk = autoLerAtk();
      if (!atk) { autoLog('nenhum ataque salvo nesta aba — Farm Player parado.'); autoParar(false); return; }
      if (!autoNoCombinado()) {
        if ((c.atkNav || 0) >= 3) {
          autoLog('não consegui abrir a tela Combinado depois de 3 tentativas (a conta tem Premium?). Farm Player parado.');
          autoParar(false);
          return;
        }
        c.atkNav = (c.atkNav || 0) + 1; autoGravar(c);
        autoStatus('Indo para o Combinado...');
        autoIrPara(atk.url);
        return;
      }
      if (autoPasso) { return; }
      autoPasso = true;
      autoStatus('Preparando o Ataque...');
      autoPrepararAtaque(atk, function (ok, motivo) {
        autoPasso = false;
        var c2 = autoLer();
        if (!c2.ativo || c2.fase !== 'atk-enviar') { return; }
        if (!ok) { autoLog('leva não enviada: ' + motivo + '.'); autoFimLeva(false); return; }
        c2.fase = 'atk-rodando'; c2.atkInicio = Date.now(); c2.atkNav = 0; autoGravar(c2);
        autoDispararLeva(atk);
        autoAgendar(5000);
      });
      return;
    }

    if (c.fase === 'atk-rodando') {
      // vigia: se a página recarregou no meio, ou a leva passou muito do tempo, fecha e agenda a próxima
      var at = autoLerAtk();
      var qtd = (at && at.origens && at.origens.length) ? at.origens.length : ((at && at.totalLista) || 50);
      var limite = Math.max(180000, qtd * 2500 + 120000);
      if (!autoLevaViva || agora - (c.atkInicio || 0) > limite) {
        autoLog(autoLevaViva ? 'a leva passou do tempo limite — encerrando e agendando a próxima.' : 'a página recarregou no meio da leva — agendando a próxima.');
        autoFimLeva(false);
        return;
      }
      autoAgendar(5000);
      return;
    }

    if (c.fase === 'pausa' || c.fase === 'atk-espera') {
      if (agora < c.fimFase) { autoAgendar(c.fimFase - agora); return; }
      if (autoTentarRelogar(c)) { return; }
      autoComecarCiclo(c);
      return;
    }

    if (c.fase === 'relogar') {
      // se estamos aqui com game_data, o relogin deu certo
      autoCookie('ork_relogin', '', 0);
      autoLog('relogado com sucesso, continuando.');
      autoComecarCiclo(c);
      return;
    }

    autoComecarCiclo(c);
  }

  /* ---------- bolinha de status ---------- */
  function autoStatus(txt) {
    var b = document.getElementById('ork-auto-bolinha');
    if (b && txt) { b.title = '24/7: ' + txt + ' — clique pra parar'; }
  }
  function autoMostrarBolinha() {
    if (document.getElementById('ork-auto-bolinha')) { return; }
    var b = document.createElement('div');
    b.id = 'ork-auto-bolinha';
    b.style.cssText = 'position:fixed;left:148px;bottom:20px;width:54px;height:54px;border-radius:50%;' +
      'background:linear-gradient(100deg,#e8ac0a,#ffdc63 50%,#e8ac0a);color:#1a1400;border:1px solid rgba(255,196,0,.35);' +
      'cursor:pointer;display:flex;align-items:center;justify-content:center;flex-direction:column;' +
      'box-shadow:0 10px 26px rgba(0,0,0,.5);font-family:"Segoe UI",Arial,sans-serif;z-index:9999996;line-height:1';
    b.innerHTML = '<span style="font-size:17px">♾️</span><span id="ork-auto-fase" style="font-size:7.5px;font-weight:800;margin-top:2px;white-space:nowrap">24/7</span>';
    b.addEventListener('click', function () {
      if (confirm('Parar a Automatização 24/7?')) { autoParar(true); }
    });
    document.body.appendChild(b);
    if (autoRelogio) { clearInterval(autoRelogio); }
    autoRelogio = setInterval(function () {
      var c = autoLer();
      var el = document.getElementById('ork-auto-fase');
      if (!c.ativo || !el) { return; }
      autoAtualizarCookie(false);
      var nomes = { farm: 'FARM', cunhar: 'CUNHA', balancear: 'BALANC', pausa: 'PAUSA', relogar: 'LOGIN',
        'atk-enviar': 'ATAQUE', 'atk-rodando': 'ATAQUE', 'atk-espera': 'LEVA' };
      var txt = nomes[c.fase] || '24/7';
      if ((c.fase === 'farm' || c.fase === 'pausa' || c.fase === 'atk-espera') && c.fimFase > Date.now()) {
        var s = Math.round((c.fimFase - Date.now()) / 1000);
        txt += ' ' + Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
      }
      if (window.__ORK_CAPTCHA_BLOQUEADO__) { txt = 'CAPTCHA'; }
      el.textContent = txt;
      autoStatus(txt + ' (' + (c.modo === 'player' ? 'Farm Player, leva ' : 'ciclo ') + ((c.ciclos || 0) + 1) + ')');
    }, 1000);
  }

  function autoParar(peloUsuario) {
    var c = autoLer();
    var estavaAtivo = c.ativo;
    c.ativo = false; autoGravar(c);
    if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
    if (autoRelogio) { clearInterval(autoRelogio); autoRelogio = null; }
    if (autoDono) {
      autoCookie('ork_auto247_mundo', '', 0);
      autoCookie('ork_relogin', '', 0);
    }
    autoDono = false;
    try { if (String(window.name).indexOf('ork247:') === 0) { window.name = ''; } } catch (e) {}
    var b = document.getElementById('ork-auto-bolinha'); if (b) { b.remove(); }
    if (peloUsuario && estavaAtivo) {
      if (c.modo !== 'player') { autoPararFarm(); }
      autoLog('parada pelo usuário.');
    }
    try { autoAtualizarCaixaAtaque(); } catch (e) {}
  }

  function autoIniciar(n) {
    n.ativo = true;
    n.id = Math.random().toString(36).slice(2, 10);
    n.ciclos = 0; n.from = 0; n.balFeitos = []; n.atkNav = 0;
    if (n.modo !== 'player') {
      if (n.cunhar) { try { pararCunharPorSeguranca(); } catch (e) {} } // a Cunhagem avulsa não briga com a do 24/7
      if (n.balancear) { try { balParar(); } catch (e) {} }             // nem o Balanceador avulso
      n.fase = 'farm';
      n.fimFase = Date.now() + autoMs(n.farmMin, n.farmMax);
    } else {
      n.fase = 'atk-enviar';
    }
    autoGravar(n);
    autoDono = true;
    try { window.name = autoToken(n); } catch (e) {}
    autoCanalAbrir();
    autoAtualizarCookie(true);
    autoMostrarBolinha();
    if (n.modo === 'player') {
      var atk = autoLerAtk();
      autoLog('Farm Player iniciado — ' + atk.nAlvos + ' alvo(s), leva a cada ' + n.atkMin + '-' + n.atkMax + ' min' +
        (n.relogarCada ? ', relogar a cada ' + n.relogarCada + ' leva(s) em ' + n.mundo : '') + '.');
      n.atkNav = 1; autoGravar(n);
      autoStatus('Indo para o Combinado...');
      autoIrPara(atk.url); // sempre começa com o Combinado recarregado (estado limpo)
      return;
    }
    autoLog('iniciada — farm ' + n.farmMin + '-' + n.farmMax + ' min' +
      (n.cunhar ? ', cunhagem' : '') + (n.balancear ? ', balanceador (mín. ' + n.balCadaMin + ' min)' : '') +
      ', pausa ' + n.pausaMin + '-' + n.pausaMax + ' min' +
      (n.relogarCada ? ', relogar a cada ' + n.relogarCada + ' ciclo(s) em ' + n.mundo : '') + '.');
    autoIniciarFarm();
    autoAgendar(autoEntre(4000, 6000));
  }
  // Confere outra aba rodando antes de iniciar; se tiver, pergunta se assume.
  function autoIniciarComChecagem(n) {
    autoPerguntar(null, function (outra) {
      if (outra) {
        if (!confirm('Já tem uma Automatização 24/7 rodando em outra aba deste mundo.\n\nParar aquela e iniciar aqui?')) { return; }
        try { autoCanalAbrir().postMessage({ cmd: 'parar', exceto: '' }); } catch (e) {}
      }
      autoIniciar(n);
      try { autoAtualizarCaixaAtaque(); } catch (e) {}
    });
  }

  /* ---------- balão de ajuda (passa o mouse no nome do campo) ---------- */
  function autoLigarDicas(raiz) {
    var balao = document.createElement('div');
    balao.style.cssText = 'position:fixed;z-index:2147483646;max-width:270px;background:#141414;border:1px solid #8a6d00;color:#e6e6e6;' +
      'font-size:11px;line-height:1.45;padding:8px 10px;border-radius:8px;box-shadow:0 8px 20px rgba(0,0,0,.6);display:none;pointer-events:none;' +
      'font-family:"Segoe UI",Arial,sans-serif;font-weight:400;text-transform:none;letter-spacing:0';
    document.body.appendChild(balao);
    function mostrar(el) {
      balao.textContent = el.getAttribute('data-dica');
      balao.style.display = 'block';
      var r = el.getBoundingClientRect();
      var top = r.bottom + 6;
      if (top + balao.offsetHeight > window.innerHeight - 8) { top = r.top - balao.offsetHeight - 6; }
      balao.style.top = Math.max(8, top) + 'px';
      balao.style.left = Math.max(8, Math.min(r.left, window.innerWidth - balao.offsetWidth - 8)) + 'px';
    }
    raiz.querySelectorAll('[data-dica]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { mostrar(el); });
      el.addEventListener('mouseleave', function () { balao.style.display = 'none'; });
      el.addEventListener('click', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') { return; }
        if (balao.style.display === 'block') { balao.style.display = 'none'; } else { mostrar(el); }
      });
    });
    return balao;
  }
  function autoInterrogacao() {
    return '<span style="display:inline-flex;align-items:center;justify-content:center;width:13px;height:13px;border-radius:50%;' +
      'border:1px solid #8a6d00;color:#e8ac0a;font-size:8.5px;font-weight:800;margin-left:4px;vertical-align:middle">?</span>';
  }

  /* ---------- modal de configuração ---------- */
  function autoResumoAtk(atk) {
    if (!atk) { return ''; }
    var nomes = { attack: 'Ataque', support: 'Apoio' };
    var tropas = Object.keys(atk.tropas || {}).filter(function (k) { return atk.tropas[k] > 0; })
      .map(function (k) { return k + ' ' + (atk.tropas[k] >= 100000 ? 'máx' : atk.tropas[k]); }).join(', ');
    return atk.nAlvos + ' alvo(s) • ' + (atk.origens && atk.origens.length ? atk.origens.length + ' aldeia(s) atacante(s)' : 'todas as aldeias da lista') +
      ' • ' + (nomes[atk.comando] || atk.comando) + (atk.predio ? ' • prédio: ' + atk.predio : '') + '<br><span style="color:#777">Tropas: ' + tropas + '</span>';
  }
  function autoAbrirModal() {
    if (document.getElementById('ork-modal-auto')) { return; }
    var c = autoLer(), p = autoLerPreset(), atk = autoLerAtk();
    var modo = c.modo === 'player' ? 'player' : 'farm';
    var mundoPadrao = c.mundo || (window.game_data && game_data.world) || '';
    var ov = document.createElement('div');
    ov.id = 'ork-modal-auto';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999998;display:flex;align-items:center;justify-content:center;font-family:"Segoe UI",Arial,sans-serif';
    var inp = 'background:#111;border:1px solid rgba(255,255,255,.12);color:#ececec;padding:6px 8px;border-radius:6px;font-size:12px;box-sizing:border-box;font-family:inherit';
    var card = 'background:#161616;border:1px solid #2c2c2c;border-radius:8px;padding:9px 10px;margin-top:8px';
    var tit = 'font-size:9.5px;color:#888;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;display:block';
    var lin = 'display:flex;align-items:center;gap:8px;margin-bottom:6px';
    var rot = 'flex:1;font-size:11.5px;color:#ccc;cursor:help';
    function opcoes(lista, atual) {
      return lista.map(function (o) { return '<option value="' + o[0] + '"' + (String(o[0]) === String(atual) ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');
    }
    function faixa(idMin, idMax, vMin, vMax, passo) {
      return '<input id="' + idMin + '" type="number" min="0.5" step="' + passo + '" value="' + vMin + '" style="width:58px;' + inp + '">' +
        '<span style="color:#666;font-size:11px">a</span>' +
        '<input id="' + idMax + '" type="number" min="0.5" step="' + passo + '" value="' + vMax + '" style="width:58px;' + inp + '">';
    }
    function chave(id, on) {
      return '<input id="' + id + '" type="checkbox"' + (on ? ' checked' : '') + ' style="width:16px;height:16px;margin:0;accent-color:#e8ac0a;cursor:pointer">';
    }
    ov.innerHTML =
      '<div style="background:linear-gradient(160deg,#1a1a1a,#050505);border:1px solid #3a3a3a;border-radius:12px;width:430px;max-width:calc(100vw - 20px);' +
        'max-height:calc(100vh - 30px);overflow:auto;color:#eee;box-shadow:0 14px 34px rgba(0,0,0,.75),0 0 0 1px rgba(255,196,0,.12)">' +
        '<div style="background:linear-gradient(100deg,#FFB800,#FFDD55 55%,#FFB800);color:#141200;padding:9px 12px;display:flex;align-items:center;gap:8px">' +
          '<span style="font-weight:800;font-size:13px;letter-spacing:1.1px">♾️ AUTOMATIZAÇÃO 24/7</span>' +
          '<span style="flex:1;text-align:center;font-size:10px;font-weight:700;color:#3d3000">' + (c.ativo ? 'RODANDO' : 'PARADA') + '</span>' +
          '<span id="ork-auto-x" style="cursor:pointer;font-weight:bold;font-size:15px">&times;</span></div>' +
        '<div style="padding:10px 12px">' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">' +
            '<button type="button" class="ork-auto-modo" data-modo="farm" style="background:#1c1c1c;border:1px solid #333;border-radius:8px;padding:8px 4px;color:#ddd;cursor:pointer;font-weight:800;font-size:11.5px;font-family:inherit">🌾 Farm + Cunhagem<div style="font-size:9px;color:#888;font-weight:700;margin-top:2px">+ Balanceador</div></button>' +
            '<button type="button" class="ork-auto-modo" data-modo="player" style="background:#1c1c1c;border:1px solid #333;border-radius:8px;padding:8px 4px;color:#ddd;cursor:pointer;font-weight:800;font-size:11.5px;font-family:inherit">⚔️ Farm Player<div style="font-size:9px;color:#888;font-weight:700;margin-top:2px">Ataque Mass em loop</div></button>' +
          '</div>' +

          // ---- modo FARM ----
          '<div id="ork-auto-sec-farm">' +
            '<div style="' + card + '"><span style="' + tit + '">Farm Hard</span>' +
              '<div style="' + lin + '"><span style="' + rot + '" data-dica="Velocidade e rotação que o Farm Hard vai usar dentro do ciclo. Padrão: 1.5x + Normal (1 coluna).">Velocidade / rotação' + autoInterrogacao() + '</span>' +
                '<select id="ork-auto-fator" style="width:74px;' + inp + '">' + opcoes([['0.5', '0.5x'], ['1', '1x'], ['1.25', '1.25x'], ['1.5', '1.5x'], ['2', '2x'], ['2.5', '2.5x']], p.fator) + '</select>' +
                '<select id="ork-auto-rot" style="width:112px;' + inp + '">' + opcoes([['1', 'Normal'], ['2', '2 grupos'], ['3', '3 grupos'], ['4', '4 grupos']], p.rotacao) + '</select></div>' +
              '<div style="' + lin + ';margin-bottom:0"><span style="' + rot + '" data-dica="Quanto tempo o Farm Hard fica ligado em cada ciclo. O tempo exato é sorteado dentro dessa faixa.">Farm roda por (min)' + autoInterrogacao() + '</span>' +
                faixa('ork-auto-fmin', 'ork-auto-fmax', c.farmMin, c.farmMax, '0.5') + '</div>' +
            '</div>' +
            '<div style="' + card + '"><span style="' + tit + '">Depois do farm</span>' +
              '<div style="' + lin + '">' + chave('ork-auto-cunhar', c.cunhar) +
                '<span style="' + rot + '" data-dica="Vai pra Academia e cunha moedas em todas as páginas (1.000 aldeias por página), igual à aba Cunhar.">🪙 Cunhar moedas' + autoInterrogacao() + '</span></div>' +
              '<div style="' + lin + ';margin-bottom:0">' + chave('ork-auto-bal', c.balancear) +
                '<span style="' + rot + '" data-dica="Equilibra os recursos entre as aldeias pelo mercado (1 a 3s entre cada envio), usando os ajustes da aba Balancear. Só balanceia se já passou o tempo mínimo desde o último balanceamento — os mercadores precisam voltar pra casa.">⚖️ Balancear recursos, no mín. a cada' + autoInterrogacao() + '</span>' +
                '<input id="ork-auto-balmin" type="number" min="1" value="' + c.balCadaMin + '" style="width:58px;' + inp + '"><span style="font-size:11px;color:#888">min</span></div>' +
            '</div>' +
            '<div style="' + card + '"><div style="' + lin + ';margin-bottom:0"><span style="' + rot + '" data-dica="Descanso total (nada rodando) no fim de cada ciclo, antes de começar o farm de novo. Sorteado dentro da faixa.">😴 Pausa no fim do ciclo (min)' + autoInterrogacao() + '</span>' +
              faixa('ork-auto-pmin', 'ork-auto-pmax', c.pausaMin, c.pausaMax, '0.5') + '</div></div>' +
          '</div>' +

          // ---- modo FARM PLAYER ----
          '<div id="ork-auto-sec-player">' +
            '<div style="' + card + '"><span style="' + tit + '">Ataque salvo nesta aba</span>' +
              '<div style="font-size:11.5px;color:' + (atk ? '#ddd' : '#ff8a8a') + ';line-height:1.5">' +
                (atk ? autoResumoAtk(atk) :
                  'Nenhum ataque salvo ainda.<br><span style="color:#999">Como salvar: aba <b>Ataque</b> → configure tropas, alvos, tipo de comando e marque as aldeias atacantes → clique em <b>"💾 Salvar no 24/7"</b> (caixa ♾️ no Ataque).</span>') +
              '</div></div>' +
            '<div style="' + card + '"><div style="' + lin + ';margin-bottom:0"><span style="' + rot + '" data-dica="Tempo entre uma leva e a próxima, contado a partir do fim do envio. Sorteado dentro da faixa. Dica: use um tempo em que as tropas já voltaram.">🔁 Nova leva a cada (min)' + autoInterrogacao() + '</span>' +
              faixa('ork-auto-amin', 'ork-auto-amax', c.atkMin, c.atkMax, '0.5') + '</div></div>' +
          '</div>' +

          // ---- comum ----
          '<div style="' + card + '"><span style="' + tit + '">Relogin</span>' +
            '<div style="' + lin + '"><span style="' + rot + '" data-dica="Desloga e entra de novo sozinho a cada N ciclos (ou levas). 0 = só reloga se a sessão cair. Precisa do script OROCHIKING Relogin no Tampermonkey.">Deslogar/relogar a cada' + autoInterrogacao() + '</span>' +
              '<input id="ork-auto-rel" type="number" min="0" step="1" value="' + (c.relogarCada || 0) + '" style="width:58px;' + inp + '"><span id="ork-auto-rel-un" style="font-size:11px;color:#888;width:34px">ciclos</span></div>' +
            '<div style="' + lin + ';margin-bottom:0"><span style="' + rot + '" data-dica="Mundo em que ele entra de novo: normal br + número (br144), clássico brc + número (brc1), speed brs + número (brs1).">Mundo' + autoInterrogacao() + '</span>' +
              '<input id="ork-auto-mundo" type="text" value="' + mundoPadrao + '" placeholder="br144, brc1, brs1" style="width:124px;' + inp + '"></div>' +
          '</div>' +
          '<div style="font-size:9.5px;color:#666;margin-top:8px;line-height:1.4">Fica salvo só nesta aba: recarregar, trocar de tela ou relogar mantém tudo. Fechou a aba, configura de novo.</div>' +
          '<div id="ork-auto-erro" style="font-size:11px;color:#ff8080;margin-top:6px;min-height:0"></div>' +
          '<div style="display:flex;gap:8px;margin-top:10px">' +
            '<button id="ork-auto-cancelar" style="flex:1;background:' + (c.ativo ? '#2a1010;color:#ff6b6b;border:1px solid #4a1c1c' : '#232323;color:#ccc;border:1px solid #3a3a3a') + ';border-radius:8px;padding:9px 0;cursor:pointer;font-weight:700;font-size:11.5px;font-family:inherit">' + (c.ativo ? 'Parar' : 'Cancelar') + '</button>' +
            '<button id="ork-auto-iniciar" style="flex:1.3;background:linear-gradient(100deg,#FFB800,#FFDD55);color:#141200;border:none;border-radius:8px;padding:9px 0;cursor:pointer;font-weight:800;font-size:11.5px;font-family:inherit;box-shadow:0 3px 10px rgba(255,184,0,.3)">' + (c.ativo ? 'Salvar e reiniciar' : 'Iniciar') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
    var balao = autoLigarDicas(ov);
    function mostrarModo() {
      ov.querySelectorAll('.ork-auto-modo').forEach(function (b) {
        var on = b.getAttribute('data-modo') === modo;
        b.style.borderColor = on ? '#FFC400' : '#333';
        b.style.background = on ? '#241f08' : '#1c1c1c';
        b.style.color = on ? '#fff' : '#ddd';
      });
      document.getElementById('ork-auto-sec-farm').style.display = modo === 'farm' ? 'block' : 'none';
      document.getElementById('ork-auto-sec-player').style.display = modo === 'player' ? 'block' : 'none';
      document.getElementById('ork-auto-erro').textContent = '';
      var un = document.getElementById('ork-auto-rel-un'); if (un) { un.textContent = modo === 'player' ? 'levas' : 'ciclos'; }
    }
    ov.querySelectorAll('.ork-auto-modo').forEach(function (b) {
      b.addEventListener('click', function () { modo = b.getAttribute('data-modo'); mostrarModo(); });
    });
    mostrarModo();
    function fechar() { try { balao.remove(); } catch (e) {} ov.remove(); }
    document.getElementById('ork-auto-x').addEventListener('click', fechar);
    document.getElementById('ork-auto-cancelar').addEventListener('click', function () {
      if (autoLer().ativo) { autoParar(true); }
      fechar();
    });
    document.getElementById('ork-auto-iniciar').addEventListener('click', function () {
      function num(id, def) { var v = parseFloat(document.getElementById(id).value); return isNaN(v) ? def : v; }
      var n = autoLer();
      n.modo = modo;
      n.farmMin = Math.max(0.5, num('ork-auto-fmin', 2)); n.farmMax = Math.max(n.farmMin, num('ork-auto-fmax', 3));
      n.pausaMin = Math.max(0, num('ork-auto-pmin', 3)); n.pausaMax = Math.max(n.pausaMin, num('ork-auto-pmax', 4));
      n.cunhar = document.getElementById('ork-auto-cunhar').checked;
      n.balancear = document.getElementById('ork-auto-bal').checked;
      n.balCadaMin = Math.max(1, num('ork-auto-balmin', 30));
      n.atkMin = Math.max(0.5, num('ork-auto-amin', 4)); n.atkMax = Math.max(n.atkMin, num('ork-auto-amax', 6));
      n.relogarCada = Math.max(0, Math.floor(num('ork-auto-rel', 0)));
      n.mundo = (document.getElementById('ork-auto-mundo').value || '').toLowerCase().replace(/[^a-z0-9]/g, '') || game_data.world;
      if (modo === 'player' && !autoLerAtk()) {
        document.getElementById('ork-auto-erro').textContent = 'Salve um ataque primeiro: aba Ataque → caixa ♾️ → "💾 Salvar no 24/7".';
        return;
      }
      autoGravarPreset({ fator: document.getElementById('ork-auto-fator').value, rotacao: document.getElementById('ork-auto-rot').value });
      if (autoLer().ativo) { autoParar(false); }
      fechar();
      autoIniciarComChecagem(n);
    });
  }

  /* ---------- caixa "♾️ 24/7 Farm Player" dentro do Ataque Mass ---------- */
  function autoCapturarAtaque() {
    var tropas = {};
    document.querySelectorAll('.amx-troop input').forEach(function (i) { if (i.id) { tropas[i.id] = parseInt(i.value, 10) || 0; } });
    var ta = document.querySelector("textarea[name='coords']");
    var coords = ta ? ta.value : '';
    var nAlvos = (typeof window.parseCoordsInput === 'function') ? window.parseCoordsInput(coords).length : (coords.match(/\d{1,3}\|\d{1,3}/g) || []).length;
    var comando = (document.getElementById('comando') || {}).value || '';
    var predio = (document.getElementById('buildingAlvo') || {}).value || '';
    var origens = [];
    document.querySelectorAll('input.chkbox:checked').forEach(function (b) { origens.push({ id: b.getAttribute('data-id'), coord: b.getAttribute('data-coord') }); });
    if (!nAlvos) { return { erro: 'Coloque pelo menos uma coordenada alvo (formato 555|551).' }; }
    if (comando !== 'attack' && comando !== 'support') { return { erro: 'Escolha o tipo de comando (Ataque ou Apoio).' }; }
    if (!Object.keys(tropas).some(function (k) { return tropas[k] > 0; })) { return { erro: 'Preencha as tropas (ou clique num modelo de tropas).' }; }
    var grupo = window.location.search.match(/[?&]group=(\d+)/);
    return {
      tropas: tropas, coords: coords, nAlvos: nAlvos, comando: comando, predio: predio, origens: origens,
      totalLista: document.querySelectorAll('input.chkbox').length,
      url: '/game.php?village=' + game_data.village.id + '&screen=overview_villages&mode=combined' + (grupo ? '&group=' + grupo[1] : ''),
      salvoEm: Date.now()
    };
  }
  function autoAtualizarCaixaAtaque() {
    var st = document.getElementById('ork-auto-atk-status');
    if (!st) { return; }
    var atk = autoLerAtk(), c = autoLer();
    var rodando = c.ativo && c.modo === 'player';
    st.innerHTML = rodando ? '<span style="color:#7ed17e">▶ Farm Player rodando nesta aba.</span> ' + autoResumoAtk(atk)
      : (atk ? '✔ Salvo: ' + autoResumoAtk(atk) : '<span style="color:#999">Nada salvo ainda nesta aba.</span>');
    var bi = document.getElementById('ork-auto-atk-iniciar');
    if (bi) { bi.textContent = rodando ? '⏹ Parar 24/7 Farm Player' : '▶ Salvar e iniciar 24/7'; }
  }
  function autoCaixaAtaque() {
    if (document.getElementById('ork-auto-atk')) { autoAtualizarCaixaAtaque(); return; }
    var ancora = document.getElementById('ork-loop-ataque') || document.getElementById('amxRepeatBtn');
    if (!ancora || !ancora.parentNode) { return; }
    var c = autoLer();
    var inp = 'width:46px;background:#111;border:1px solid #444;color:#eee;border-radius:5px;padding:3px 5px';
    var caixa = document.createElement('div');
    caixa.id = 'ork-auto-atk';
    caixa.style.cssText = 'margin-top:10px;padding:10px 12px;background:rgba(255,196,0,.05);border:1px solid rgba(255,196,0,.28);' +
      'border-radius:10px;font-family:"Segoe UI",Arial,sans-serif;color:#ddd';
    caixa.innerHTML =
      '<div style="font-weight:800;color:#ffd84d;font-size:12px;margin-bottom:4px">♾️ 24/7 Farm Player</div>' +
      '<div style="font-size:10.5px;color:#999;margin-bottom:6px">Salva este ataque (tropas, alvos, comando, prédio e as aldeias marcadas na tabela — nenhuma marcada = todas da lista) e repete sozinho, até se a sessão cair. Relogin programado e mais opções: painel → aba 24/7.</div>' +
      '<div id="ork-auto-atk-status" style="font-size:11px;line-height:1.5;margin-bottom:6px"></div>' +
      '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:11px;color:#bbb">Nova leva a cada ' +
        '<input id="ork-auto-atk-min" type="number" min="0.5" step="0.5" value="' + c.atkMin + '" style="' + inp + '"> a ' +
        '<input id="ork-auto-atk-max" type="number" min="0.5" step="0.5" value="' + c.atkMax + '" style="' + inp + '"> min</div>' +
      '<div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">' +
        '<button type="button" id="ork-auto-atk-salvar" style="flex:1;min-width:120px;background:#232323;color:#FFC400;border:1px solid #3a3a3a;border-radius:7px;padding:7px 8px;cursor:pointer;font-weight:700;font-size:11px">💾 Salvar no 24/7</button>' +
        '<button type="button" id="ork-auto-atk-iniciar" style="flex:1;min-width:150px;background:linear-gradient(100deg,#FFB800,#FFDD55);color:#141200;border:none;border-radius:7px;padding:7px 8px;cursor:pointer;font-weight:800;font-size:11px"></button>' +
      '</div>' +
      '<div id="ork-auto-atk-msg" style="font-size:10.5px;margin-top:5px;min-height:12px"></div>';
    var depois = document.getElementById('ork-loop-ataque') || ancora;
    depois.parentNode.insertBefore(caixa, depois.nextSibling);
    autoAtualizarCaixaAtaque();
    function msg(t, cor) { var m = document.getElementById('ork-auto-atk-msg'); if (m) { m.style.color = cor || '#9ec9ff'; m.textContent = t; } }
    function salvarFaixa() {
      var n = autoLer();
      var a = parseFloat(document.getElementById('ork-auto-atk-min').value), b = parseFloat(document.getElementById('ork-auto-atk-max').value);
      n.atkMin = Math.max(0.5, isNaN(a) ? 4 : a); n.atkMax = Math.max(n.atkMin, isNaN(b) ? n.atkMin : b);
      autoGravar(n);
      return n;
    }
    function salvar() {
      var snap = autoCapturarAtaque();
      if (snap.erro) { msg(snap.erro, '#ff8080'); return null; }
      autoGravarAtk(snap);
      salvarFaixa();
      autoAtualizarCaixaAtaque();
      msg('Ataque salvo nesta aba.', '#7ed17e');
      return snap;
    }
    document.getElementById('ork-auto-atk-min').addEventListener('change', salvarFaixa);
    document.getElementById('ork-auto-atk-max').addEventListener('change', salvarFaixa);
    document.getElementById('ork-auto-atk-salvar').addEventListener('click', salvar);
    document.getElementById('ork-auto-atk-iniciar').addEventListener('click', function () {
      var atual = autoLer();
      if (atual.ativo && atual.modo === 'player') {
        if (confirm('Parar o 24/7 Farm Player?')) { autoParar(true); }
        return;
      }
      if (!salvar()) { return; }
      if (atual.ativo && !confirm('A Automatização 24/7 (modo Farm) está rodando nesta aba. Trocar para o Farm Player?')) { return; }
      if (atual.ativo) { autoParar(false); }
      var n = salvarFaixa();
      n.modo = 'player';
      n.mundo = n.mundo || game_data.world;
      msg('Iniciando... a tela vai recarregar e a primeira leva sai em seguida.', '#ffd84d');
      autoIniciarComChecagem(n);
    });
  }

  function checaAuto247() { return !!(window.game_data && game_data.village && game_data.village.id); }
  function rodarAuto247() { autoAbrirModal(); }

  /* ============================================================
     BALANCEADOR HARD
     Mesma lógica do "Resources balancer" (Costache Madalin):
       - média de recursos por aldeia (fator 0-1), com clusters (k-means)
       - recursos extras pra construção do Gerente de Conta (horas)
       - "max construction" automático
       - resto de mercador (bug do xxx699) e mínimo por envio
     Diferenças: interface do painel e ENVIO AUTOMÁTICO por AJAX
     (mercado -> "chamar recursos"), 1 a 3s aleatórios (ms) entre envios,
     repetindo no intervalo configurado. Roda de qualquer tela, uma aba
     só executa (trava entre abas), captcha: espera e continua sozinho.
  ============================================================ */
  var BAL_CHAVE = 'ork_balanceador';
  var BAL_TRAVA = 'ork_balanceador_trava';
  var BAL_ABA = 'aba' + Math.random().toString(36).slice(2, 10);
  var balTimer = null, balRelogio = null, balTravaId = null, balRodando = false;

  function balLer() {
    try { var c = JSON.parse(localStorage.getItem(BAL_CHAVE) || 'null'); if (c && typeof c === 'object') { return c; } } catch (e) {}
    return { ativo: false, reserva: 0, horas: 0, fator: 1, clusters: 1, maxConstrucao: false, capacidade: 1000,
      intervaloMin: 60, proximoEm: 0, ultimo: null, feitos: [] };
  }
  function balGravar(c) { try { localStorage.setItem(BAL_CHAVE, JSON.stringify(c)); } catch (e) {} }
  function balEsperar(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function balEntre(a, b) { return Math.floor(a + Math.random() * (b - a + 1)); }
  function balNum(t) { var n = parseInt(String(t == null ? '' : t).replace(/[^0-9]/g, ''), 10); return isNaN(n) ? 0 : n; }
  function balLog(t) { try { console.log('[OROCHIKING] Balanceador: ' + t); } catch (e) {} }
  function balStatus(t) { var b = document.getElementById('ork-bal-bolinha'); if (b && t) { b.title = 'Balanceador: ' + t + ' — clique pra parar'; } }

  /* ---------- trava entre abas ---------- */
  function balPegarTrava() {
    try {
      var t = JSON.parse(localStorage.getItem(BAL_TRAVA) || 'null');
      if (t && t.aba !== BAL_ABA && Date.now() - (t.ts || 0) < 20000) { return false; }
      localStorage.setItem(BAL_TRAVA, JSON.stringify({ aba: BAL_ABA, ts: Date.now() }));
      var conf = JSON.parse(localStorage.getItem(BAL_TRAVA) || 'null');
      if (!conf || conf.aba !== BAL_ABA) { return false; }
      if (!balTravaId) {
        balTravaId = setInterval(function () {
          try { var a = JSON.parse(localStorage.getItem(BAL_TRAVA) || 'null');
            if (a && a.aba === BAL_ABA) { localStorage.setItem(BAL_TRAVA, JSON.stringify({ aba: BAL_ABA, ts: Date.now() })); } } catch (e) {}
        }, 5000);
      }
      return true;
    } catch (e) { return true; }
  }
  function balSoltarTrava() {
    try { if (balTravaId) { clearInterval(balTravaId); balTravaId = null; }
      var t = JSON.parse(localStorage.getItem(BAL_TRAVA) || 'null');
      if (t && t.aba === BAL_ABA) { localStorage.removeItem(BAL_TRAVA); } } catch (e) {}
  }
  window.addEventListener('pagehide', balSoltarTrava);

  /* ---------- leitura de páginas (fetch, com pausa curta entre páginas) ---------- */
  async function balGetDoc(url) {
    var r = await fetch(url, { credentials: 'include' });
    var html = await r.text();
    return new DOMParser().parseFromString(html, 'text/html');
  }
  // mesma regra de paginação do script original
  function balPaginas(doc, urlBase) {
    var lista = [];
    var sel = doc.querySelector('.paged-nav-item') ? doc.querySelector('.paged-nav-item').parentElement.querySelector('select') : null;
    if (sel) {
      Array.prototype.forEach.call(sel.options, function (o) { lista.push(o.value); });
      lista.pop();
    } else if (doc.getElementsByClassName('paged-nav-item').length > 0) {
      var nr = 0;
      Array.prototype.forEach.call(doc.getElementsByClassName('paged-nav-item'), function (item) {
        var h = item.getAttribute('href') || '';
        lista.push(h.split('page=')[0] + 'page=' + nr); nr++;
      });
    } else { lista.push(urlBase); }
    return lista;
  }
  async function balCarregarTodas(urlBase, porPagina) {
    var primeira = await balGetDoc(urlBase);
    var paginas = balPaginas(primeira, urlBase);
    for (var i = 0; i < paginas.length; i++) {
      var doc = (paginas.length === 1 && paginas[0] === urlBase) ? primeira : await balGetDoc(paginas[i]);
      porPagina(doc);
      balStatus('lendo páginas (' + (i + 1) + '/' + paginas.length + ')');
      await balEsperar(balEntre(250, 600));
    }
  }

  async function balDadosProducao() {
    var lista = [], farm = new Map();
    var desktop = game_data.device === 'desktop';
    await balCarregarTodas(game_data.link_base_pure + 'overview_villages&mode=prod', function (doc) {
      if (desktop) {
        doc.querySelectorAll('.row_a, .row_b').forEach(function (tr) {
          try {
            var vn = tr.getElementsByClassName('quickedit-vn')[0];
            var nome = vn.innerText || vn.textContent;
            var coord = nome.match(/[0-9]{3}\|[0-9]{3}/)[0];
            var merc = (tr.querySelector("a[href*='market']").textContent || '').split('/');
            var pop = (tr.children[6].textContent || '').split('/');
            lista.push({ coord: coord, id: vn.getAttribute('data-id'), name: nome.trim(),
              wood: balNum(tr.getElementsByClassName('wood')[0].textContent),
              stone: balNum(tr.getElementsByClassName('stone')[0].textContent),
              iron: balNum(tr.getElementsByClassName('iron')[0].textContent),
              merchants: balNum(merc[0]), merchants_total: balNum(merc[1]),
              capacity: balNum(tr.children[4].textContent), points: balNum(tr.children[2].textContent) });
            farm.set(coord, balNum(pop[0]) / Math.max(1, balNum(pop[1])));
          } catch (e) {}
        });
      } else {
        doc.querySelectorAll('.overview-container .overview-container-item').forEach(function (it) {
          try {
            var nome = (it.querySelector('.quickedit-label').textContent || '').trim();
            var coord = nome.match(/\d+\|\d+/)[0];
            var pop = (it.getElementsByClassName('population')[0].parentElement.textContent || '').split('/');
            lista.push({ coord: coord, id: it.querySelector('.quickedit-vn').getAttribute('data-id'), name: nome,
              wood: balNum(it.getElementsByClassName('mwood')[0].textContent),
              stone: balNum(it.getElementsByClassName('mstone')[0].textContent),
              iron: balNum(it.getElementsByClassName('miron')[0].textContent),
              merchants: balNum(it.querySelector('.vertical_center').textContent), merchants_total: 500,
              capacity: balNum(it.getElementsByClassName('ressources')[0].parentElement.textContent),
              points: balNum(it.querySelector('.grey').parentElement.textContent) });
            farm.set(coord, balNum(pop[0]) / Math.max(1, balNum(pop[1])));
          } catch (e) {}
        });
      }
    });
    return { list_production: lista, map_farm_usage: farm };
  }

  async function balDadosChegando() {
    var mapa = new Map();
    var desktop = game_data.device === 'desktop';
    await balCarregarTodas(game_data.link_base_pure + 'overview_villages&mode=trader&type=inc', function (doc) {
      doc.querySelectorAll('.row_a, .row_b').forEach(function (tr) {
        try {
          var coord = desktop ? tr.children[4].textContent.match(/[0-9]{3}\|[0-9]{3}/)[0]
                              : tr.children[3].textContent.match(/[0-9]{3}\|[0-9]{3}/g)[1];
          function rec(cl) { var el = tr.querySelector('.' + cl); return el ? balNum(el.parentElement.textContent) : 0; }
          var o = mapa.get(coord) || { wood: 0, stone: 0, iron: 0 };
          o.wood += rec('wood'); o.stone += rec('stone'); o.iron += rec('iron');
          mapa.set(coord, o);
        } catch (e) {}
      });
    });
    return mapa;
  }

  /* ---------- Gerente de Conta (só quando horas > 0 ou max construção) ---------- */
  async function balModelosAM() {
    var vazio = { map_coord_templates: new Map(), map_construction_templates: new Map(), map_priortize_farm: new Map() };
    try { if (!game_data.features || !game_data.features.AccountManager || !game_data.features.AccountManager.active) { return vazio; } } catch (e) { return vazio; }
    var base = game_data.link_base_pure + 'am_village';
    var docMain = await balGetDoc(base);
    var paginas = [];
    var tabela = docMain.querySelector('#village_table');
    var antes = tabela ? tabela.previousElementSibling : null;
    var sel = antes ? antes.querySelector('select') : null;
    if (sel) { Array.prototype.forEach.call(sel.options, function (o) { paginas.push(o.value); }); }
    else if (antes && antes.querySelectorAll('.paged-nav-item').length > 0) {
      var n = antes.querySelectorAll('.paged-nav-item').length;
      for (var i = 0; i <= n - 2; i++) { paginas.push(game_data.link_base_pure + 'am_village&page=' + i); }
    } else { paginas.push(base); }
    for (var p = 0; p < paginas.length; p++) {
      var doc = await balGetDoc(paginas[p]);
      doc.querySelectorAll('.row_a, .row_b').forEach(function (tr) {
        try {
          var coord = tr.children[0].textContent.match(/[0-9]{3}\|[0-9]{3}/)[0];
          var nomeT = (tr.children[1].textContent || '').trim();
          if (nomeT !== '') { vazio.map_coord_templates.set(coord, nomeT); vazio.map_construction_templates.set(nomeT, 0); vazio.map_priortize_farm.set(nomeT, 0); }
        } catch (e) {}
      });
      await balEsperar(balEntre(250, 600));
    }
    var opts = docMain.querySelector('select[name=template]');
    var lista = opts ? Array.prototype.slice.call(opts.options) : [];
    for (var k = 0; k < lista.length; k++) {
      var nome = lista[k].textContent.replace(/[\n\t]/g, '');
      if (k < 3) { nome = nome.replace(/\(\w+\)/, ''); }
      if (!vazio.map_construction_templates.has(nome)) { continue; }
      var d = await balGetDoc(game_data.link_base_pure + 'am_village&mode=queue&template=' + lista[k].value);
      var tpl = [];
      d.querySelectorAll('.sortable_row').forEach(function (it) {
        var abs = (it.querySelector('.level_absolute') || {}).textContent || '';
        var m = abs.match(/\d+/);
        tpl.push({ name: it.getAttribute('data-building'), level_absolute: m ? parseInt(m[0], 10) : 0 });
      });
      vazio.map_construction_templates.set(nome, tpl);
      var cap = 99;
      var tog = d.querySelector('input[name=farm_upgrade_toggle]');
      if (tog && tog.checked) { var ps = d.querySelector('select[name=population_upgrades]'); cap = 100 - parseInt(ps ? ps.value : '1', 10); }
      vazio.map_priortize_farm.set(nome, cap);
      await balEsperar(balEntre(250, 600));
    }
    return vazio;
  }

  function balTempoTermino(txt) {
    try {
      var sd = document.getElementById('serverDate').innerText.split('/');
      var fim = '';
      var hoje = lang['aea2b0aa9ae1534226518faaefffdaad'].replace(' %s', '');
      var amanha = lang['57d28d1b211fddbb7a499ead5bf23079'].replace(' %s', '');
      var em = lang['0cb274c906d622fa8ce524bcfbb7552d'].split(' ')[0];
      if (txt.indexOf(hoje) !== -1) { fim = sd[1] + '/' + sd[0] + '/' + sd[2] + ' ' + txt.match(/\d+:\d+/)[0]; }
      else if (txt.indexOf(amanha) !== -1) {
        var t = new Date(sd[1] + '/' + sd[0] + '/' + sd[2]); t.setDate(t.getDate() + 1);
        fim = ('0' + (t.getMonth() + 1)).slice(-2) + '/' + ('0' + t.getDate()).slice(-2) + '/' + t.getFullYear() + ' ' + txt.match(/\d+:\d+/)[0];
      } else if (txt.indexOf(em) !== -1) {
        var on = txt.match(/\d+.\d+/)[0].split('.');
        fim = on[1] + '/' + on[0] + '/' + sd[2] + ' ' + txt.match(/\d+:\d+/)[0];
      }
      var dFim = new Date(fim);
      var agora = new Date(sd[1] + '/' + sd[0] + '/' + sd[2] + ' ' + document.getElementById('serverTime').innerText);
      var s = parseInt((dFim.getTime() - agora.getTime()) / 1000, 10);
      if (s < 0) { dFim.setDate(dFim.getDate() + 1); s = parseInt((dFim.getTime() - agora.getTime()) / 1000, 10); }
      return isNaN(s) ? 0 : s;
    } catch (e) { return 0; }
  }

  async function balDadosEdificios() {
    var mapa = new Map();
    var desktop = game_data.device === 'desktop';
    await balCarregarTodas(game_data.link_base_pure + 'overview_villages&mode=buildings', function (doc) {
      doc.querySelectorAll('.row_a, .row_b').forEach(function (tr) {
        try {
          var coord = (tr.querySelector('.nowrap').textContent || '').match(/[0-9]{3}\|[0-9]{3}/)[0];
          var filaEl = desktop ? tr : (tr.nextElementSibling ? tr.nextElementSibling.nextElementSibling : null);
          var imgs = filaEl ? Array.prototype.slice.call(filaEl.querySelectorAll(desktop ? '.queue_icon img' : 'img')) : [];
          var ult = imgs.length ? imgs[imgs.length - 1].getAttribute('title') : null;
          mapa.set(coord + '_time_queued', ult ? balTempoTermino(ult.split('-')[1] || '') : 0);
          if (desktop) {
            tr.querySelectorAll('.upgrade_building').forEach(function (b) {
              mapa.set(coord + '_' + b.classList[1].replace('b_', ''), parseInt(b.textContent, 10) || 0);
            });
          } else {
            var tds = tr.nextElementSibling.querySelectorAll('table td'), ths = tr.nextElementSibling.querySelectorAll('table th');
            for (var j = 0; j < tds.length; j++) {
              var nm = ths[j].getElementsByTagName('img')[0].src.split('buildings/')[1].replace('.png', '');
              mapa.set(coord + '_' + nm, parseInt(tds[j].textContent, 10) || 0);
            }
          }
          imgs.forEach(function (im) {
            var m = (im.getAttribute('src') || '').match(/(\w+)\.(webp|png)/);
            if (!m) { return; }
            var k = coord + '_' + m[1];
            mapa.set(k, (mapa.get(k) || 0) + 1);
          });
        } catch (e) {}
      });
    });
    return mapa;
  }

  async function balConstantesEdificios() {
    var chave = game_data.world + 'constantBuildings';
    try { var s = localStorage.getItem(chave); if (s) { return new Map(JSON.parse(s)); } } catch (e) {}
    var r = await fetch('/interface.php?func=get_building_info', { credentials: 'include' });
    var xml = new DOMParser().parseFromString(await r.text(), 'text/xml');
    var mapa = new Map();
    var cfg = xml.getElementsByTagName('config')[0];
    Array.prototype.forEach.call(cfg ? cfg.children : [], function (b) {
      function v(t) { var el = b.getElementsByTagName(t)[0]; return el ? Number(el.textContent) : 0; }
      mapa.set(b.tagName.toLowerCase(), { wood: v('wood'), stone: v('stone'), iron: v('iron'), wood_factor: v('wood_factor'),
        stone_factor: v('stone_factor'), iron_factor: v('iron_factor'), build_time: v('build_time'), build_time_factor: v('build_time_factor') });
    });
    try { localStorage.setItem(chave, JSON.stringify(Array.from(mapa.entries()))); } catch (e) {}
    return mapa;
  }

  function balCustoNivel(hq, level, o) {
    var k = { 1: 1, 2: 1, 3: 0.112292, 4: 0.289555, 5: 0.46113, 6: 0.606372, 7: 0.723059, 8: 0.815935, 9: 0.889947, 10: 0.948408,
      11: 0.994718, 12: 1.031, 13: 1.059231, 14: 1.080939, 15: 1.09729, 16: 1.109156, 17: 1.117308, 18: 1.122392, 19: 1.124817,
      20: 1.124917, 21: 1.123181, 22: 1.119778, 23: 1.114984, 24: 1.109038, 25: 1.102077, 26: 1.0942, 27: 1.085601, 28: 1.076369,
      29: 1.066566, 30: 1.056291 };
    var t = o.build_time * Math.pow(1.2, level - 1) * Math.pow(1.05, -hq) * (k[level] || 1);
    return [Math.round(t), Math.round(o.wood * Math.pow(o.wood_factor, level - 1)),
      Math.round(o.stone * Math.pow(o.stone_factor, level - 1)), Math.round(o.iron * Math.pow(o.iron_factor, level - 1))];
  }

  // lista[h-1] = recursos necessários pra h horas de construção (igual ao original)
  async function balRecursosAM(mapFarm, horasMax) {
    var t = await balModelosAM();
    if (!t.map_coord_templates.size) { var vaz = []; for (var z = 0; z < horasMax; z++) { vaz.push(new Map()); } return vaz; }
    var edificios = await balDadosEdificios();
    var consts = await balConstantesEdificios();
    var lista = [];
    for (var h = 1; h <= horasMax; h++) {
      var mapaAM = new Map();
      var ed = new Map(JSON.parse(JSON.stringify(Array.from(edificios.entries()))));
      Array.from(ed.keys()).forEach(function (key) {
        if (key.indexOf('_time_queued') !== -1) {
          mapaAM.set(key.replace('_time_queued', ''), { total_wood: 0, total_stone: 0, total_iron: 0, time_finished: Math.round(ed.get(key) / 3600) });
        }
      });
      Array.from(t.map_coord_templates.keys()).forEach(function (coord) {
        var tempo = ed.get(coord + '_time_queued') || 0;
        var nomeT = t.map_coord_templates.get(coord);
        var tpl = t.map_construction_templates.get(nomeT) || [];
        var capFarm = (t.map_priortize_farm.get(nomeT) || 99) / 100;
        function somar(res) {
          var o = mapaAM.get(coord) || { total_wood: 0, total_stone: 0, total_iron: 0, time_finished: 0 };
          o.total_wood += res[1]; o.total_stone += res[2]; o.total_iron += res[3]; o.time_finished = tempo / 3600;
          mapaAM.set(coord, o);
        }
        if ((ed.get(coord + '_farm') || 0) < 30 && mapFarm.get(coord) >= capFarm && consts.get('farm')) {
          var r0 = balCustoNivel(ed.get(coord + '_main') || 1, (ed.get(coord + '_farm') || 0) + 1, consts.get('farm'));
          tempo += r0[0]; somar(r0);
        }
        for (var i = 0; i < tpl.length; i++) {
          var chave = coord + '_' + tpl[i].name;
          var atual = ed.get(chave) || 0;
          var alvo = tpl[i].level_absolute;
          var c = consts.get(tpl[i].name);
          if (alvo > atual && c) {
            for (var j = 0; j < alvo - atual; j++) {
              var nv = (ed.get(chave) || 0) + 1;
              var r = balCustoNivel(ed.get(coord + '_main') || 1, nv, c);
              tempo += r[0]; somar(r); ed.set(chave, nv);
              if (tempo > h * 3600) { break; }
            }
          }
          if (tempo > h * 3600) { break; }
        }
      });
      lista.push(mapaAM);
    }
    return lista;
  }

  /* ---------- k-means (igual ao original, 50 tentativas) ---------- */
  function balDist(a, b) { var s = 0; for (var i = 0; i < a.length; i++) { s += Math.pow(a[i] - b[i], 2); } return Math.sqrt(s); }
  function balKmeansUma(dados, k) {
    var clusters = [];
    for (var i = 0; i < k; i++) { clusters.push({ mean: dados[Math.floor(Math.random() * dados.length)], data: [] }); }
    for (var it = 0; it < 100; it++) {
      clusters.forEach(function (c) { c.data = []; });
      dados.forEach(function (v) {
        var melhor = clusters[0], md = Infinity;
        clusters.forEach(function (c) { var d = balDist(c.mean, v); if (d < md) { md = d; melhor = c; } });
        melhor.data.push(v);
      });
      clusters.forEach(function (c) {
        if (!c.data.length) { c.mean = [0, 0]; return; }
        c.mean = [0, 1].map(function (ix) { return c.data.reduce(function (s, v) { return s + v[ix]; }, 0) / c.data.length; });
      });
    }
    var maxD = 0;
    clusters.forEach(function (c) { for (var a = 0; a < c.data.length; a++) { for (var b = a + 1; b < c.data.length; b++) { maxD = Math.max(maxD, balDist(c.data[a], c.data[b])); } } });
    clusters.maxDistance = maxD;
    return clusters;
  }
  function balClusters(dados, k) {
    var melhor = null;
    for (var r = 0; r < 50; r++) { var res = balKmeansUma(dados, k); if (!melhor || res.maxDistance < melhor.maxDistance) { melhor = res; } }
    return melhor;
  }
  function balDistCoord(c1, c2) { var a = c1.split('|'), b = c2.split('|'); return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2)); }

  /* ---------- cálculo dos envios (portado do calculateLaunches original) ---------- */
  function balCalcularEnvios(prodCl, prodCasaCl, mapaAM, clusters, fator, reserva, capMerc) {
    var envios = [], stats = [];
    var tot = { ws: 0, ss: 0, is: 0, wg: 0, sg: 0, ig: 0 };
    for (var i = 0; i < prodCl.length; i++) {
      var lp = prodCl[i], lh = prodCasaCl[i];
      var avg = { w: 0, s: 0, i: 0 }, cl = { w: 0, s: 0, i: 0 };
      lp.forEach(function (v) { avg.w += v.wood / lp.length; avg.s += v.stone / lp.length; avg.i += v.iron / lp.length; cl.w += v.wood; cl.s += v.stone; cl.i += v.iron; });
      var af = { w: avg.w * fator, s: avg.s * fator, i: avg.i * fator };
      var ts = { w: 0, s: 0, i: 0 }, tg = { w: 0, s: 0, i: 0 }, lSend = [], lGet = [];
      for (var j = 0; j < lp.length; j++) {
        var v = lp[j], casa = lh[j];
        var cap = v.capacity * 0.95, capViagem = (v.merchants - reserva) * capMerc;
        var ar = { w: af.w, s: af.s, i: af.i };
        if (mapaAM.has(v.coord)) { var am = mapaAM.get(v.coord); ar.w += am.total_wood; ar.s += am.total_stone; ar.i += am.total_iron; }
        var d = { w: v.wood - Math.round(ar.w), s: v.stone - Math.round(ar.s), i: v.iron - Math.round(ar.i) };
        d.w = d.w < 0 ? d.w : (casa.wood - d.w > 0 ? d.w : casa.wood);
        d.s = d.s < 0 ? d.s : (casa.stone - d.s > 0 ? d.s : casa.stone);
        d.i = d.i < 0 ? d.i : (casa.iron - d.i > 0 ? d.i : casa.iron);
        var disp = (d.w > 0 ? d.w : 0) + (d.s > 0 ? d.s : 0) + (d.i > 0 ? d.i : 0);
        var norm = (capViagem <= disp && disp > 0) ? Math.max(0, capViagem) / disp : 1;
        var sd = { w: d.w > 0 ? parseInt(d.w * norm, 10) : 0, s: d.s > 0 ? parseInt(d.s * norm, 10) : 0, i: d.i > 0 ? parseInt(d.i * norm, 10) : 0 };
        var gt = {
          w: d.w > 0 ? 0 : (v.wood + Math.abs(d.w) < cap ? Math.abs(d.w) : cap - v.wood),
          s: d.s > 0 ? 0 : (v.stone + Math.abs(d.s) < cap ? Math.abs(d.s) : cap - v.stone),
          i: d.i > 0 ? 0 : (v.iron + Math.abs(d.i) < cap ? Math.abs(d.i) : cap - v.iron) };
        ts.w += sd.w; ts.s += sd.s; ts.i += sd.i; tg.w += gt.w; tg.s += gt.s; tg.i += gt.i;
        if (sd.w > 0 || sd.s > 0 || sd.i > 0) { lSend.push({ coord: v.coord, id: v.id, name: v.name, wood: Math.max(0, sd.w), stone: Math.max(0, sd.s), iron: Math.max(0, sd.i) }); }
        var og = { coord: v.coord, id: v.id, name: v.name, wood: gt.w > 0 ? parseInt(gt.w, 10) : 0, stone: gt.s > 0 ? parseInt(gt.s, 10) : 0, iron: gt.i > 0 ? parseInt(gt.i, 10) : 0 };
        if (og.wood > 0 || og.stone > 0 || og.iron > 0) { lGet.push(og); }
      }
      var nw = tg.w > ts.w ? ts.w / tg.w : 1, ns = tg.s > ts.s ? ts.s / tg.s : 1, ni = tg.i > ts.i ? ts.i / tg.i : 1;
      lGet.forEach(function (g) { g.wood = parseInt(g.wood * nw, 10); g.stone = parseInt(g.stone * ns, 10); g.iron = parseInt(g.iron * ni, 10); });
      var minimo = capMerc === 1000 ? 700 : 1200;
      var maxDist = 0;
      for (var g = 0; g < lGet.length; g++) {
        var alvo = lGet[g];
        lSend.forEach(function (s) { s.distance = balDistCoord(alvo.coord, s.coord); });
        lSend.sort(function (a, b) { return a.distance - b.distance; });
        for (var k = 0; k < lSend.length; k++) {
          var s = lSend[k];
          var ew = s.wood > 0 ? Math.min(alvo.wood, s.wood) : 0, es = s.stone > 0 ? Math.min(alvo.stone, s.stone) : 0, ei = s.iron > 0 ? Math.min(alvo.iron, s.iron) : 0;
          alvo.wood -= ew; alvo.stone -= es; alvo.iron -= ei; s.wood -= ew; s.stone -= es; s.iron -= ei;
          var total = ew + es + ei;
          var resto = total % capMerc; // "bug do xxx699": tira a sobra que não enche um mercador
          if (resto < minimo) {
            if (ew > resto) { ew -= resto; total -= resto; } else if (es > resto) { es -= resto; total -= resto; } else if (ei > resto) { ei -= resto; total -= resto; }
          }
          maxDist = Math.max(maxDist, s.distance);
          if (total >= minimo) {
            envios.push({ total_send: total, wood: ew, stone: es, iron: ei, coord_origin: s.coord, id_origin: s.id,
              id_destination: alvo.id, coord_destination: alvo.coord, name_destination: alvo.name, distance: s.distance });
          }
          if (alvo.wood + alvo.stone + alvo.iron < minimo) { break; }
        }
      }
      tot.ws += ts.w; tot.ss += ts.s; tot.is += ts.i; tot.wg += tg.w; tot.sg += tg.s; tot.ig += tg.i;
      stats.push({ total_wood_send: ts.w, total_stone_send: ts.s, total_iron_send: ts.i, total_wood_get: tg.w, total_stone_get: tg.s, total_iron_get: tg.i, max_distance: maxDist, nr_coords: clusters[i].data.length });
    }
    return { envios: envios, stats: stats, tot: tot };
  }

  async function balCalcular(cfg) {
    balStatus('lendo produção');
    var prod = await balDadosProducao();
    var semMercado = prod.list_production.filter(function (v) { return !(v.merchants_total > 0); }).length;
    var lp = prod.list_production.filter(function (v) { return v.merchants_total > 0; });
    if (semMercado) { balLog(semMercado + ' aldeia(s) sem Mercado ficaram fora do balanceamento.'); }
    if (!lp.length) { throw new Error('não consegui ler a visão de produção (ou nenhuma aldeia tem Mercado)'); }
    balStatus('lendo transportes a caminho');
    var chegando = await balDadosChegando();
    var horas = Math.min(50, Math.max(0, Number(cfg.horas) || 0));
    var fator = Math.min(1, Math.max(0, Number(cfg.fator)));
    if (isNaN(fator)) { fator = 1; }
    var usarMax = !!cfg.maxConstrucao && fator <= 0.5;
    var listaAM = [];
    if (horas > 0 || usarMax) { balStatus('lendo Gerente de Conta'); listaAM = await balRecursosAM(prod.map_farm_usage, usarMax ? 100 : horas); }
    var casa = JSON.parse(JSON.stringify(lp));
    lp.forEach(function (v) {
      var inc = chegando.get(v.coord);
      if (inc) { v.wood = Math.min(v.wood + inc.wood, v.capacity); v.stone = Math.min(v.stone + inc.stone, v.capacity); v.iron = Math.min(v.iron + inc.iron, v.capacity); }
    });
    var k = Math.max(1, Math.min(parseInt(cfg.clusters, 10) || 1, lp.length));
    var clusters = balClusters(lp.map(function (v) { return v.coord.split('|').map(Number); }), k);
    var prodCl = [], casaCl = [];
    clusters.forEach(function (c) {
      var a = [], b = [];
      c.data.forEach(function (xy) {
        var coord = xy.join('|');
        for (var i = 0; i < lp.length; i++) { if (lp[i].coord === coord) { a.push(lp[i]); b.push(casa[i]); break; } }
      });
      prodCl.push(a); casaCl.push(b);
    });
    var reserva = Math.max(0, parseInt(cfg.reserva, 10) || 0);
    var capMerc = Math.min(1500, Math.max(1000, parseInt(cfg.capacidade, 10) || 1000));
    var res, horasUsadas = horas;
    if (!usarMax) {
      res = balCalcularEnvios(prodCl, casaCl, horas > 0 ? (listaAM[horas - 1] || new Map()) : new Map(), clusters, fator, reserva, capMerc);
    } else {
      // "max construction": maior nº de horas em que o excedente ainda cobre o déficit
      res = balCalcularEnvios(prodCl, casaCl, listaAM[0] || new Map(), clusters, fator, reserva, capMerc); horasUsadas = 1;
      for (var h = 1; h < listaAM.length; h++) {
        var tent = balCalcularEnvios(prodCl, casaCl, listaAM[h], clusters, fator, reserva, capMerc);
        var falta = tent.stats.some(function (s) { return s.total_iron_get > s.total_iron_send || s.total_stone_get > s.total_stone_send || s.total_wood_get > s.total_wood_send; });
        if (falta) { break; }
        res = tent; horasUsadas = h + 1;
      }
    }
    // agrupa por destino (1 chamada de mercado por aldeia que recebe, como o original)
    var porDestino = new Map();
    res.envios.forEach(function (e) {
      var o = porDestino.get(e.id_destination) || { target_id: e.id_destination, coord: e.coord_destination, nome: e.name_destination,
        data: {}, total: 0, wood: 0, stone: 0, iron: 0, distance: 0 };
      o.data['resource[' + e.id_origin + '][wood]'] = (o.data['resource[' + e.id_origin + '][wood]'] || 0) + e.wood;
      o.data['resource[' + e.id_origin + '][stone]'] = (o.data['resource[' + e.id_origin + '][stone]'] || 0) + e.stone;
      o.data['resource[' + e.id_origin + '][iron]'] = (o.data['resource[' + e.id_origin + '][iron]'] || 0) + e.iron;
      o.total += e.total_send; o.wood += e.wood; o.stone += e.stone; o.iron += e.iron; o.distance = Math.max(o.distance, e.distance);
      porDestino.set(e.id_destination, o);
    });
    var lista = Array.from(porDestino.values()).sort(function (a, b) { return b.total - a.total; });
    var tw = 0, ts = 0, ti = 0;
    lp.forEach(function (v) { tw += v.wood; ts += v.stone; ti += v.iron; });
    return { lista: lista, aldeias: lp.length, semMercado: semMercado, horasUsadas: horasUsadas,
      resumo: { total: [tw, ts, ti], media: [tw / lp.length, ts / lp.length, ti / lp.length].map(Math.round),
        excedente: [res.tot.ws, res.tot.ss, res.tot.is].map(Math.round), deficit: [res.tot.wg, res.tot.sg, res.tot.ig].map(Math.round) } };
  }

  /* ---------- envio (mercado -> chamar recursos, igual ao botão "send") ---------- */
  function balEnviar(item) {
    return new Promise(function (resolve) {
      var feito = false;
      function fim(ok, info) { if (!feito) { feito = true; resolve({ ok: ok, info: info }); } }
      try {
        TribalWars.post('market', { village: item.target_id, ajaxaction: 'call', h: window.csrf_token }, item.data,
          function (r) { fim(true, r && r.success); }, function (e) { fim(false, e); });
        setTimeout(function () { fim(false, 'sem resposta em 20s'); }, 20000);
      } catch (e) { fim(false, e && e.message); }
    });
  }

  /* ---------- ciclo automático ---------- */
  async function balRodarCiclo() {
    if (balRodando) { return; }
    var cfg = balLer();
    if (!cfg.ativo) { return; }
    if (window.__ORK_CAPTCHA_BLOQUEADO__) { balStatus('captcha — esperando'); setTimeout(balRodarCiclo, balEntre(3000, 5000)); return; }
    if (!balPegarTrava()) { balStatus('rodando em outra aba'); setTimeout(balRetomar, balEntre(15000, 25000)); return; }
    balRodando = true;
    balMostrarBolinha();
    var enviados = 0, falhas = 0, volume = 0, calc = null;
    try {
      calc = await balCalcular(cfg);
      balLog(calc.aldeias + ' aldeias, ' + calc.lista.length + ' aldeias pra receber' + (cfg.maxConstrucao ? ' (construção: ' + calc.horasUsadas + 'h)' : '') + '.');
      var feitos = {};
      (cfg.feitos || []).forEach(function (id) { feitos[id] = 1; });
      for (var i = 0; i < calc.lista.length; i++) {
        var c = balLer();
        if (!c.ativo) { break; }
        while (window.__ORK_CAPTCHA_BLOQUEADO__) { balStatus('captcha — esperando'); await balEsperar(balEntre(3000, 5000)); if (!balLer().ativo) { break; } }
        var item = calc.lista[i];
        if (feitos[item.target_id]) { continue; }
        balStatus('enviando ' + (i + 1) + '/' + calc.lista.length);
        var r = await balEnviar(item);
        if (r.ok) { enviados++; volume += item.total; } else { falhas++; balLog('falhou pra ' + item.coord + ': ' + String(r.info && (r.info.message || r.info) || '').slice(0, 100)); }
        feitos[item.target_id] = 1;
        c = balLer(); c.feitos = Object.keys(feitos); balGravar(c);
        await balEsperar(balEntre(1000, 3000)); // 1 a 3s, sorteado em ms
      }
    } catch (e) {
      console.error('[OROCHIKING] Balanceador: erro no ciclo', e);
    }
    balRodando = false;
    var cfg2 = balLer();
    if (!cfg2.ativo) { return; }
    var espera = Math.max(1, Number(cfg2.intervaloMin) || 60) * 60000;
    if (window.__ORK_FREIO__) { espera = Math.max(120000, espera * 2); }
    espera += balEntre(2000, 4000);
    cfg2.proximoEm = Date.now() + espera;
    cfg2.feitos = [];
    cfg2.ultimo = { quando: Date.now(), enviados: enviados, falhas: falhas, volume: volume, resumo: calc ? calc.resumo : null };
    balGravar(cfg2);
    balLog('ciclo concluído — ' + enviados + ' envios (' + volume.toLocaleString('pt-BR') + ' recursos), ' + falhas + ' falhas. Próximo às ' + new Date(cfg2.proximoEm).toLocaleTimeString() + '.');
    balAgendar();
  }
  function balAgendar() {
    var c = balLer();
    if (!c.ativo) { return; }
    if (balTimer) { clearTimeout(balTimer); }
    balTimer = setTimeout(function () {
      var n = balLer();
      if (!n.ativo) { return; }
      if (n.proximoEm > Date.now() + 1000) { balAgendar(); return; }
      balRodarCiclo();
    }, Math.max(0, (c.proximoEm || 0) - Date.now()));
  }
  function balRetomar() {
    var c = balLer();
    if (!c.ativo) { return; }
    balMostrarBolinha();
    if (c.proximoEm && c.proximoEm > Date.now()) { balAgendar(); return; }
    balRodarCiclo();
  }
  function balParar(motivo) {
    var c = balLer(); c.ativo = false; c.proximoEm = 0; c.feitos = []; balGravar(c);
    if (balTimer) { clearTimeout(balTimer); balTimer = null; }
    if (balRelogio) { clearInterval(balRelogio); balRelogio = null; }
    balSoltarTrava();
    var b = document.getElementById('ork-bal-bolinha'); if (b) { b.remove(); }
    if (motivo) { balLog('parado (' + motivo + ').'); }
  }
  window.addEventListener('storage', function (ev) { if (ev.key === BAL_CHAVE && !balLer().ativo) { balParar(); } });

  function balMostrarBolinha() {
    if (document.getElementById('ork-bal-bolinha')) { return; }
    var b = document.createElement('div');
    b.id = 'ork-bal-bolinha';
    b.style.cssText = 'position:fixed;left:212px;bottom:20px;width:54px;height:54px;border-radius:50%;' +
      'background:linear-gradient(100deg,#e8ac0a,#ffdc63 50%,#e8ac0a);color:#1a1400;border:1px solid rgba(255,196,0,.35);' +
      'cursor:pointer;display:flex;align-items:center;justify-content:center;flex-direction:column;' +
      'box-shadow:0 10px 26px rgba(0,0,0,.5);font-family:"Segoe UI",Arial,sans-serif;z-index:9999996;line-height:1';
    b.innerHTML = '<span style="font-size:18px">⚖️</span><span id="ork-bal-tempo" style="font-size:8.5px;font-weight:800;margin-top:2px">BAL</span>';
    b.addEventListener('click', function () { if (confirm('Parar o Balanceador Hard?')) { balParar('parado pelo usuário'); } });
    document.body.appendChild(b);
    if (balRelogio) { clearInterval(balRelogio); }
    balRelogio = setInterval(function () {
      var c = balLer(), el = document.getElementById('ork-bal-tempo');
      if (!c.ativo || !el) { return; }
      if (window.__ORK_CAPTCHA_BLOQUEADO__) { el.textContent = 'CAPTCHA'; return; }
      if (balRodando || !c.proximoEm) { el.textContent = 'ENV'; return; }
      var s = Math.max(0, Math.round((c.proximoEm - Date.now()) / 1000));
      var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
      el.textContent = h > 0 ? h + 'h' + ('0' + m).slice(-2) : m + ':' + ('0' + ss).slice(-2);
      balStatus('próximo balanceamento em ' + el.textContent);
    }, 1000);
  }

  /* ---------- modal (visual do painel) ---------- */
  function balFmt(n) { return Math.round(n || 0).toLocaleString('pt-BR'); }
  function balAbrirModal() {
    if (document.getElementById('ork-modal-bal')) { return; }
    var c = balLer();
    var mostraCap = ['pt_PT', 'de_DE'].indexOf(game_data.locale) !== -1;
    var ov = document.createElement('div');
    ov.id = 'ork-modal-bal';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999998;display:flex;align-items:center;justify-content:center;font-family:"Segoe UI",Arial,sans-serif';
    var inp = 'width:78px;background:#111;border:1px solid #444;color:#eee;padding:5px 7px;border-radius:6px;font-size:12px;box-sizing:border-box';
    function linha(rot, dica, campo) {
      return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' +
        '<span class="ork-bal-rot" data-dica="' + dica.replace(/"/g, '&quot;') + '" style="flex:1;font-size:11.5px;color:#ccc;cursor:help">' + rot +
        ' <span style="display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:50%;border:1px solid #8a6d00;color:#e8ac0a;font-size:9px;font-weight:800;margin-left:3px">?</span></span>' + campo + '</div>';
    }
    var ult = c.ultimo;
    ov.innerHTML =
      '<div style="background:linear-gradient(165deg,rgba(26,26,26,.97),rgba(8,8,8,.98));border:1px solid #3a3a3a;border-radius:14px;padding:16px 18px;width:420px;max-width:calc(100vw - 20px);max-height:calc(100vh - 30px);overflow:auto;color:#eee;box-shadow:0 14px 34px rgba(0,0,0,.75)">' +
        '<div style="display:flex;align-items:center;margin-bottom:4px"><div style="flex:1;font-weight:800;color:#ffd84d">⚖️ Balanceador Hard</div><span id="ork-bal-x" style="cursor:pointer;color:#888;font-size:16px">&times;</span></div>' +
        '<div style="font-size:11px;color:#9a9a9a;margin-bottom:10px">Equilibra os recursos entre suas aldeias pelo mercado, sozinho, e repete no intervalo. 1 a 3s aleatórios entre cada envio.</div>' +
        '<div style="background:#161616;border:1px solid #2c2c2c;border-radius:8px;padding:9px 10px">' +
          linha('Mercadores de reserva', 'Quantos mercadores cada aldeia deixa PARADOS em casa, sem usar no balanceamento. Útil se você quer mercadores livres pra negociar ou mandar recurso na mão. 0 = usa todos.', '<input id="ork-bal-res" type="number" min="0" value="' + c.reserva + '" style="' + inp + '">') +
          linha('Tempo de construção (h)', 'Além de igualar, manda pra cada aldeia recurso suficiente pra construir por X horas o que está no modelo de construção do Gerente de Conta (precisa de conta premium com modelo ativo). Ex: 5 = recurso pra 5h de obras. 0 = ignora construção. Máximo 50.', '<input id="ork-bal-horas" type="number" min="0" max="50" value="' + c.horas + '" style="' + inp + '">') +
          linha('Fator de média (0-1)', 'Quanto da média cada aldeia deve ter. 1 = iguala tudo (no final todas ficam com a mesma quantidade). 0.5 = cada aldeia fica com pelo menos metade da média. 0 = não iguala, só manda o necessário pra construção (campo acima).', '<input id="ork-bal-fator" type="number" min="0" max="1" step="0.1" value="' + c.fator + '" style="' + inp + '">') +
          linha('Nº de clusters', 'Divide suas aldeias em grupos por região e equilibra cada grupo separado. 1 = a conta toda junta (melhor equilíbrio, viagens podem ser longas). 2 ou mais = viagens mais curtas, mas só equilibra dentro de cada região. Aldeias próximas: use 1.', '<input id="ork-bal-cl" type="number" min="1" value="' + c.clusters + '" style="' + inp + '">') +
          (mostraCap ? linha('Capacidade do mercador', 'Quanto cada mercador carrega: 1000 ou 1500 (depende do servidor, ex: PT).', '<input id="ork-bal-cap" type="number" min="1000" max="1500" step="500" value="' + c.capacidade + '" style="' + inp + '">') : '') +
          linha('Max construção', 'Só funciona com Fator de média 0.5 ou menos: calcula sozinho o MAIOR tempo de construção possível sem faltar recurso na conta (ignora o campo Tempo de construção). Com fator acima de 0.5 não faz nada.', '<input id="ork-bal-max" type="checkbox"' + (c.maxConstrucao ? ' checked' : '') + ' style="width:16px;height:16px;accent-color:#e8ac0a">') +
          linha('Balancear a cada (min)', 'Minutos entre um balanceamento e o próximo (+2 a 4s aleatórios). Com o FREIO ligado, dobra. Intervalo curto demais não adianta: a próxima rodada só usa os mercadores que já voltaram pra casa.', '<input id="ork-bal-int" type="number" min="1" value="' + c.intervaloMin + '" style="' + inp + '">') +
        '</div>' +
        (ult ? '<div style="font-size:10.5px;color:#8a8a8a;margin-top:8px">Último: ' + new Date(ult.quando).toLocaleTimeString() + ' — ' + ult.enviados + ' envios, ' + balFmt(ult.volume) + ' recursos' + (ult.falhas ? ', ' + ult.falhas + ' falhas' : '') + '</div>' : '') +
        '<div id="ork-bal-prev" style="margin-top:8px"></div>' +
        '<div style="display:flex;gap:6px;margin-top:12px">' +
          '<button id="ork-bal-calc" style="flex:1;background:#232323;color:#FFC400;border:1px solid #3a3a3a;border-radius:7px;padding:8px 0;cursor:pointer;font-weight:700;font-size:11px">Calcular (sem enviar)</button>' +
          (c.ativo ? '<button id="ork-bal-parar" style="flex:1;background:#2a1010;color:#ff6b6b;border:1px solid #4a1c1c;border-radius:7px;padding:8px 0;cursor:pointer;font-weight:700;font-size:11px">Parar</button>' : '') +
          '<button id="ork-bal-ok" style="flex:1.2;background:linear-gradient(100deg,#e8ac0a,#ffdc63);color:#141200;border:none;border-radius:7px;padding:8px 0;cursor:pointer;font-weight:800;font-size:11px">' + (c.ativo ? 'Salvar e balancear agora' : 'Ativar') + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
    // balão de ajuda: passa o mouse (ou toca) no nome do campo
    var balao = document.createElement('div');
    balao.style.cssText = 'position:fixed;z-index:9999999;max-width:260px;background:#141414;border:1px solid #8a6d00;color:#e6e6e6;' +
      'font-size:11px;line-height:1.45;padding:8px 10px;border-radius:8px;box-shadow:0 8px 20px rgba(0,0,0,.6);display:none;pointer-events:none';
    ov.appendChild(balao);
    function mostrarDica(el) {
      balao.textContent = el.getAttribute('data-dica');
      balao.style.display = 'block';
      var r = el.getBoundingClientRect();
      var top = r.bottom + 6;
      if (top + balao.offsetHeight > window.innerHeight - 8) { top = r.top - balao.offsetHeight - 6; }
      balao.style.top = Math.max(8, top) + 'px';
      balao.style.left = Math.max(8, Math.min(r.left, window.innerWidth - balao.offsetWidth - 8)) + 'px';
    }
    ov.querySelectorAll('.ork-bal-rot').forEach(function (el) {
      el.addEventListener('mouseenter', function () { mostrarDica(el); });
      el.addEventListener('mouseleave', function () { balao.style.display = 'none'; });
      el.addEventListener('click', function (e) { e.stopPropagation(); if (balao.style.display === 'block') { balao.style.display = 'none'; } else { mostrarDica(el); } });
    });
    function fechar() { ov.remove(); }
    function lerCampos() {
      var n = balLer();
      function v(id, def) { var el = document.getElementById(id); if (!el) { return def; } var x = parseFloat(el.value); return isNaN(x) ? def : x; }
      n.reserva = Math.max(0, Math.floor(v('ork-bal-res', 0)));
      n.horas = Math.min(50, Math.max(0, v('ork-bal-horas', 0)));
      n.fator = Math.min(1, Math.max(0, v('ork-bal-fator', 1)));
      n.clusters = Math.max(1, Math.floor(v('ork-bal-cl', 1)));
      n.capacidade = mostraCap ? Math.min(1500, Math.max(1000, v('ork-bal-cap', 1000))) : 1000;
      n.maxConstrucao = document.getElementById('ork-bal-max').checked;
      n.intervaloMin = Math.max(1, v('ork-bal-int', 60));
      return n;
    }
    document.getElementById('ork-bal-x').addEventListener('click', fechar);
    if (document.getElementById('ork-bal-parar')) {
      document.getElementById('ork-bal-parar').addEventListener('click', function () { balParar('parado pelo usuário'); fechar(); });
    }
    document.getElementById('ork-bal-calc').addEventListener('click', async function () {
      var box = document.getElementById('ork-bal-prev');
      var btn = this; btn.disabled = true; btn.textContent = 'Calculando...';
      try {
        var n = lerCampos(); balGravar(n);
        var r = await balCalcular(n);
        var rs = r.resumo;
        function lin(t, a) { return '<tr><td style="padding:3px 6px;color:#999">' + t + '</td>' + a.map(function (x) { return '<td style="padding:3px 6px;text-align:right">' + balFmt(x) + '</td>'; }).join('') + '</tr>'; }
        var h = '<div style="background:#161616;border:1px solid #2c2c2c;border-radius:8px;padding:8px;font-size:11px">' +
          '<table style="width:100%;border-collapse:collapse"><tr style="color:#FFC400;font-weight:800"><td></td><td style="text-align:right">🪵 Madeira</td><td style="text-align:right">🧱 Argila</td><td style="text-align:right">⛓️ Ferro</td></tr>' +
          lin('Total', rs.total) + lin('Média', rs.media) + lin('Excedente', rs.excedente) + lin('Déficit', rs.deficit) + '</table>' +
          (r.semMercado ? '<div style="margin-top:6px;color:#999">' + r.semMercado + ' aldeia(s) sem Mercado ficaram de fora.</div>' : '') +
          '<div style="margin:8px 0 4px;color:#FFC400;font-weight:800">' + r.lista.length + ' aldeias vão receber' + (n.maxConstrucao ? ' (construção calculada: ' + r.horasUsadas + 'h)' : '') + '</div>' +
          '<div style="max-height:180px;overflow:auto"><table style="width:100%;border-collapse:collapse">' +
          r.lista.map(function (x, i) { return '<tr style="border-top:1px solid #222"><td style="padding:3px 4px;color:#666">' + (i + 1) + '</td><td style="padding:3px 4px">' + x.coord + '</td><td style="padding:3px 4px;color:#999">' + x.distance.toFixed(1) + ' campos</td><td style="padding:3px 4px;text-align:right;font-weight:700">' + balFmt(x.total) + '</td></tr>'; }).join('') +
          '</table></div></div>';
        box.innerHTML = h;
      } catch (e) {
        box.innerHTML = '<div style="color:#ff6b6b;font-size:11px">Erro ao calcular: ' + (e && e.message) + '</div>';
      }
      btn.disabled = false; btn.textContent = 'Calcular (sem enviar)';
    });
    document.getElementById('ork-bal-ok').addEventListener('click', function () {
      var n = lerCampos();
      n.ativo = true; n.proximoEm = 0; n.feitos = [];
      balGravar(n);
      fechar();
      balLog('ativado — fator ' + n.fator + ', ' + n.clusters + ' cluster(s), construção ' + (n.maxConstrucao ? 'máx' : n.horas + 'h') + ', a cada ' + n.intervaloMin + ' min.');
      balMostrarBolinha();
      balRodarCiclo();
    });
  }

  function checaBalanceador() { return !!(window.game_data && game_data.village && game_data.village.id); }
  function rodarBalanceador() { balAbrirModal(); }

  var FERRAMENTAS = [
    {
      id: 'farmar',
      nome: 'Farm Hard',
      abrev: 'Farm Hard',
      icone: '🌾',
      dica: 'Ativa direto aqui — abre o popup do Farm Hard para configurar e iniciar.',
      checar: checaFarmar,
      rodar: rodarFarmar,
      destino: null
    },
    {
      id: 'farmdormindo',
      nome: 'Farm Dormindo',
      abrev: 'Dormindo',
      icone: '😴',
      dica: 'Abre o Farm Hard já no modo mais lento (0.5x "Durma em Paz", ~1 ataque a cada 2s) e em 2 grupos — pra reduzir bem o risco de captcha enquanto você não está olhando.',
      checar: checaFarmDormindo,
      rodar: rodarFarmDormindo,
      destino: null
    },
    {
      id: 'ataque',
      nome: 'Ataque Mass',
      abrev: 'Ataque',
      icone: '⚔️',
      dica: 'Ao clicar, leva para a tela Combinado; ao chegar, clique em "Ativar agora" pra abrir o planejador.',
      checar: checaAtaque,
      rodar: rodarAtaque,
      destino: 'ataque'
    },
    {
      id: 'rename',
      nome: 'Renomeador Hard',
      abrev: 'Renomear',
      icone: '✏️',
      dica: 'Ao clicar, leva para a tela Combinado; ao chegar, clique em "Ativar agora" pra abrir o renomeador.',
      checar: checaRename,
      rodar: rodarRename,
      destino: 'rename'
    },
    {
      id: 'cancelar',
      nome: 'Cancelar Recrutamento',
      abrev: 'Cancelar',
      icone: '🚫',
      dica: 'Ao clicar, leva para Visão Geral → Produção; ao chegar, clique em "Ativar agora" pra cancelar.',
      checar: checaCancelar,
      rodar: rodarCancelar,
      destino: 'cancelar'
    },
    {
      id: 'defender',
      nome: 'Coletar Atk e Def',
      abrev: 'Atk/Def',
      icone: '🛡️',
      categoria: 'Coleta',
      dica: 'Ao clicar, leva para Comandos → Ataques Recebidos; ao chegar, clique em "Ativar agora" pra coletar.',
      checar: checaDefender,
      rodar: rodarDefender,
      destino: 'defender'
    },
    {
      id: 'barbaras',
      nome: 'Coletar Barbaras Mapa',
      abrev: 'Bárbaras',
      icone: '🗺️',
      categoria: 'Coleta',
      dica: 'Ao clicar, leva para o Mapa; ao chegar, clique em "Ativar agora" pra abrir o coletor de bárbaras.',
      checar: checaBarbaras,
      rodar: rodarBarbaras,
      destino: 'barbaras'
    },
    {
      id: 'perfil',
      nome: 'Coletar Perfil Player',
      abrev: 'Perfil',
      icone: '👤',
      categoria: 'Coleta',
      dica: 'Digite o nick do jogador — o painel busca no ranking, abre o perfil e exibe todas as aldeias dele. Depois é só clicar em "Ativar agora". Requer Conta Premium.',
      checar: checaPerfil,
      rodar: rodarPerfil,
      destino: null,
      buscaPorNick: true
    },
    {
      id: 'ocultar',
      nome: 'Ocultar Atacadas Perfil',
      abrev: 'Ocultar',
      icone: '🙈',
      dica: 'Digite o nick do jogador — o painel busca no ranking, abre o perfil e exibe todas as aldeias dele. Depois é só clicar em "Ativar agora".',
      checar: checaOcultar,
      rodar: rodarOcultar,
      destino: null,
      buscaPorNick: true
    },
    {
      id: 'coletorfarm',
      nome: 'Coletor BB Padrão Farm/Assistente',
      abrev: 'BB Padrão',
      icone: '🧺',
      dica: 'Ao clicar, leva para o Mapa; ao chegar, clique em "Ativar agora" pra abrir a lista de bárbaros próximos com os ícones de farm.',
      checar: checaColetorFarm,
      rodar: rodarColetorFarm,
      destino: 'barbaras'
    },
    {
      id: 'cunhar',
      nome: 'Cunhar Moedas',
      abrev: 'Cunhar',
      icone: '🪙',
      dica: 'Leva pra tela de Cunhagem; ao chegar, clique em "Ativar agora" e escolha o intervalo. Ele cunha sozinho e, se você tiver mais de 1.000 aldeias, passa pelas páginas todas automaticamente — numa aba só. Deixe a aba de Cunhagem aberta.',
      checar: checaCunhar,
      rodar: rodarCunhar,
      destino: 'cunhar'
    }
,
    {
      id: 'keypress',
      nome: 'KeyPress Hard',
      abrev: 'KeyPress',
      icone: '⌨️',
      dica: 'Escolha o modelo (A+B, B ou C) e o intervalo. Roda em segundo plano (pode sair do Assistente e usar qualquer tela): manda os modelos da aldeia atual em todas as páginas do Assistente enquanto tiver tropa e repete sozinho. Bolinha ⌨️ no canto mostra a contagem — clique nela pra parar.',
      checar: checaKeyPress,
      rodar: rodarKeyPress,
      destino: null
    }
,
    {
      id: 'auto247',
      nome: 'Automatização 24/7',
      abrev: '24/7',
      icone: '♾️',
      dica: 'Dois modos numa aba só. 🌾 Farm: Farm Hard por 2-3 min → cunhagem (opcional) → balanceador (opcional) → pausa → repete. ⚔️ Farm Player: repete sozinho o ataque salvo no Ataque Mass (caixa ♾️ lá dentro). Nos dois: reloga se a sessão cair e continua; captcha: espera e segue. Fica salvo só nesta aba. Bolinha ♾️ no canto — clique pra parar.',
      checar: checaAuto247,
      rodar: rodarAuto247,
      destino: null
    }
,
    {
      id: 'balanceador',
      nome: 'Balanceador Hard',
      abrev: 'Balancear',
      icone: '⚖️',
      dica: 'Equilibra os recursos entre suas aldeias pelo mercado (mesma lógica do Resources Balancer: fator de média, clusters, construção do Gerente de Conta). Envia sozinho por AJAX, 1 a 3s aleatórios entre envios, e repete no intervalo. Use "Calcular" pra ver antes. Bolinha ⚖️ no canto — clique pra parar.',
      checar: checaBalanceador,
      rodar: rodarBalanceador,
      destino: null
    }
  ];

  var FERRAMENTAS_POR_ID = {};
  FERRAMENTAS.forEach(function (f) { FERRAMENTAS_POR_ID[f.id] = f; });

  /* ============================================================
     RETOMAR EXECUÇÃO PENDENTE APÓS NAVEGAR DE TELA
     (roda em QUALQUER tela, mesmo sem o painel aberto; expira sozinho)
  ============================================================ */
  var VALIDADE_PENDENTE_MS = 5 * 60 * 1000;

  function lerPendente() {
    try {
      var bruto = localStorage.getItem('ork_pendente');
      if (!bruto) return null;
      var obj = JSON.parse(bruto);
      if (!obj || (Date.now() - obj.ts) > VALIDADE_PENDENTE_MS) {
        localStorage.removeItem('ork_pendente');
        return null;
      }
      return obj;
    } catch (e) { return null; }
  }

  function gravarPendente(id, nick) {
    try {
      localStorage.setItem('ork_pendente', JSON.stringify({ id: id, nick: nick || null, ts: Date.now() }));
    } catch (e) {}
  }

  function limparPendente() {
    try { localStorage.removeItem('ork_pendente'); } catch (e) {}
  }

  (function tentarExecutarPendente() {
    var pend = lerPendente();
    if (!pend) return;
    var f = FERRAMENTAS_POR_ID[pend.id];
    if (!f) { limparPendente(); return; }

    // Se ainda estivermos na etapa de busca por nick (tela de ranking), tenta buscar.
    if (pend.nick && window.game_data && game_data.screen === 'ranking') {
      tentarBuscarNoRanking(pend.nick);
      return;
    }

    setTimeout(function () {
      try {
        var telaOk = false;
        try { telaOk = f.checar(); } catch (e) {}
        if (!telaOk) { // ainda não chegou na tela certa; não faz nada
          console.log('[OROCHIKING] ' + f.nome + ' pendente, mas esta tela não é a certa (screen=' + (window.game_data && game_data.screen) + ', mode=' + (window.game_data && game_data.mode) + ').');
          return;
        }

        if (pend.nick) {
          // acabou de chegar no perfil via busca por nick: clica "exibir todas as aldeias" antes, se existir
          var linkTodas = acharLinkExibirTodasAldeias();
          if (linkTodas) {
            linkTodas.click();
            setTimeout(function () { mostrarBotaoConfirmar(f); }, 1200);
            return;
          }
        }
        mostrarBotaoConfirmar(f);
      } catch (e) {
        console.error('[OROCHIKING] erro ao preparar', f.nome, e);
      }
    }, 500);
  })();

  function acharLinkExibirTodasAldeias() {
    var alvo = null;
    document.querySelectorAll('a').forEach(function (a) {
      if (alvo) return;
      var t = (a.textContent || '').toLowerCase();
      if (t.indexOf('exibir') !== -1 && t.indexOf('aldeia') !== -1) { alvo = a; }
    });
    return alvo;
  }

  /* ============================================================
     RETOMAR CUNHAGEM AUTOMÁTICA APÓS RECARREGAR A PÁGINA
     (roda sempre que a tela de cunhagem carrega, independente de
     qualquer clique no painel — é assim que ela sobrevive aos
     próprios reloads que ela mesma agenda)
  ============================================================ */
  (function retomarCunhagemAutomatica() {
    // Só retoma na tela de Cunhagem — é lá que os botões existem.
    if (!(window.game_data && game_data.screen === 'snob' && game_data.mode === 'coin')) return;
    var cfg = lerConfigCunhar();
    if (!cfg.ativo) return;
    // Espera um pouco pro JS do jogo montar os dropdowns de quantidade
    // (eles não vêm no HTML cru — só aparecem depois que a página roda).
    // Tenta cunhar; se estiver esperando a pausa do farm (modo freio), fica
    // reconferindo a cada ~20-40s (aleatório) até o farm pausar, sem gastar o ciclo.
    var tentativasEspera = 0;
    function tentarCunhar() {
      mostrarStatusCunhar(cfg);
      var from = fromAtualDaUrl();

      // no freio, se o farm está rodando, espera a janela dele
      if (!cunhagemPodeAgir()) {
        tentativasEspera++;
        if (tentativasEspera <= 40) { // ~até 20 min esperando, com folga
          var reespera = 20000 + Math.random() * 20000; // 20-40s
          console.log('[OROCHIKING] Cunhagem: farm ativo, reconfere em ' + Math.round(reespera/1000) + 's.');
          cunharTimeoutId = setTimeout(tentarCunhar, reespera);
          return;
        }
        // depois de muito tempo esperando, segue mesmo assim (não trava pra sempre)
        console.warn('[OROCHIKING] Cunhagem: esperou demais pela pausa do farm — cunhando mesmo assim.');
      }

      var cunhou = clicarCunhar();
      var totalMoedas = null;
      try { totalMoedas = lerTotalMoedas(document); } catch (e) {}
      console.log('[OROCHIKING] Cunhagem: página from=' + from +
        (cunhou ? ' — cunhado' : ' — nada pra cunhar aqui') +
        (totalMoedas !== null ? ' | total de moedas: ' + totalMoedas : ''));
      agendarProximoCicloCunhar(cfg.intervaloMs);
    }
    setTimeout(tentarCunhar, 1200);
  })();

  /* ============================================================
     RETOMAR O KEYPRESS HARD (em QUALQUER tela do jogo)
  ============================================================ */
  (function retomarKeyPress() {
    if (!(window.game_data && game_data.village)) return;
    if (!kpLerConfig().ativo) return;
    setTimeout(kpRetomar, kpAleatorio(1500, 3000));
  })();

  /* ============================================================
     RETOMAR A AUTOMATIZAÇÃO 24/7 (qualquer tela do jogo)
  ============================================================ */
  (function retomarAuto247() {
    if (!(window.game_data && game_data.village)) return;
    if (!autoLer().ativo) return;
    setTimeout(autoRetomar, autoEntre(1200, 2500));
  })();

  /* ============================================================
     RETOMAR O BALANCEADOR HARD (qualquer tela do jogo)
  ============================================================ */
  (function retomarBalanceador() {
    if (!(window.game_data && game_data.village)) return;
    if (!balLer().ativo) return;
    setTimeout(balRetomar, balEntre(2000, 3500));
  })();

  /* ============================================================
     BOTÃO FLUTUANTE "ATIVAR AGORA" — aparece quando chega na tela
     certa depois de navegar. Só roda o script de fato no clique
     (gesto real do usuário), pra não cair no bloqueio de popup
     do navegador em scripts que abrem janela (Coletar Perfil,
     Ocultar Perfil, Coletar Operação).
  ============================================================ */
  function mostrarBotaoConfirmar(f) {
    if (document.getElementById('ork-confirmar')) return;
    var caixa = document.createElement('div');
    caixa.id = 'ork-confirmar';
    // topo central e acima de tudo: no canto inferior direito ele ficava
    // atrás do ícone flutuante do Coletor Hard (z-index bem maior)
    caixa.style.cssText = 'position:fixed;top:14px;left:50%;transform:translateX(-50%);background:linear-gradient(165deg,rgba(26,26,26,.98),rgba(8,8,8,.99));' +
      'border:1px solid #8a6d00;border-radius:12px;padding:12px 14px;z-index:2147483600;width:250px;' +
      'font-family:"Segoe UI",Arial,sans-serif;color:#eee;box-shadow:0 14px 34px rgba(0,0,0,.75),0 0 0 3px rgba(232,172,10,.18)';
    caixa.innerHTML =
      '<div style="font-weight:800;color:#ffd84d;margin-bottom:8px;font-size:12.5px">' + f.icone + ' ' + f.nome + ' pronto</div>' +
      '<button id="ork-confirmar-btn" style="width:100%;background:linear-gradient(100deg,#e8ac0a,#ffdc63);' +
        'color:#141200;border:none;border-radius:7px;padding:8px 10px;cursor:pointer;font-weight:800;font-size:12px">Ativar agora</button>';
    document.body.appendChild(caixa);
    console.log('[OROCHIKING] "Ativar agora" pronto para: ' + f.nome);
    document.getElementById('ork-confirmar-btn').addEventListener('click', function () {
      caixa.remove();
      limparPendente();
      try {
        f.rodar();
      } catch (e) {
        console.error('[OROCHIKING]', f.nome, e);
        alert('OROCHIKING: erro ao rodar ' + f.nome + ': ' + (e && e.message ? e.message : e));
      }
    });
  }

  /* ============================================================
     BUSCA DE JOGADOR PELO RANKING (Coletar Perfil / Ocultar Perfil)
  ============================================================ */
  function tentarBuscarNoRanking(nick) {
    var tentativas = 0;
    function tentar() {
      tentativas++;
      var campo = document.querySelector('#player_search') ||
        document.querySelector('input[name="id"]') ||
        document.querySelector('input.autocomplete_input') ||
        document.querySelector('input[placeholder*="jogador" i]') ||
        document.querySelector('input[placeholder*="player" i]');

      if (campo && tentativas === 1) {
        campo.focus();
        campo.value = nick;
        campo.dispatchEvent(new Event('input', { bubbles: true }));
        campo.dispatchEvent(new Event('keyup', { bubbles: true }));
      }

      var links = document.querySelectorAll('a[href*="screen=info_player"]');
      var alvo = null;
      links.forEach(function (a) {
        if (alvo) return;
        var texto = (a.textContent || '').trim().toLowerCase();
        if (texto && texto === nick.trim().toLowerCase()) { alvo = a; }
      });
      if (!alvo) {
        links.forEach(function (a) {
          if (alvo) return;
          var texto = (a.textContent || '').trim().toLowerCase();
          if (texto && texto.indexOf(nick.trim().toLowerCase()) !== -1) { alvo = a; }
        });
      }

      if (alvo) {
        window.location.href = alvo.getAttribute('href');
        return;
      }
      if (tentativas < 14) {
        setTimeout(tentar, 500);
      } else {
        console.warn('[OROCHIKING] não encontrei "' + nick + '" automaticamente no ranking. Clique no jogador certo — o script continua sozinho na página do perfil.');
      }
    }
    tentar();
  }

  /* ============================================================
     MODAL PEQUENO PARA DIGITAR O NICK (Coletar Perfil / Ocultar Perfil)
  ============================================================ */
  function abrirModalNick(f) {
    if (document.getElementById('ork-modal-nick')) return;
    var overlay = document.createElement('div');
    overlay.id = 'ork-modal-nick';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999998;' +
      'display:flex;align-items:center;justify-content:center;font-family:Verdana,Arial,sans-serif';
    overlay.innerHTML =
      '<div style="background:linear-gradient(165deg,rgba(26,26,26,.97),rgba(8,8,8,.98));border:1px solid #3a3a3a;' +
      'border-radius:16px;padding:20px 22px;width:280px;color:#eee;box-shadow:0 14px 34px rgba(0,0,0,.75)">' +
        '<div style="font-weight:800;color:#ffd84d;margin-bottom:10px">' + f.icone + ' ' + f.nome + '</div>' +
        '<div style="font-size:11.5px;color:#9a9a9a;margin-bottom:10px">Digite o nick exato do jogador:</div>' +
        '<input id="ork-nick-input" type="text" placeholder="Ex: Orochi.2009" ' +
          'style="width:100%;box-sizing:border-box;background:#111;border:1px solid #444;color:#eee;' +
          'padding:8px 9px;border-radius:6px;font-size:12.5px;margin-bottom:12px">' +
        '<div style="display:flex;gap:8px">' +
          '<button id="ork-nick-cancelar" style="flex:1;background:#232323;color:#ccc;border:1px solid #3a3a3a;' +
            'border-radius:7px;padding:8px 0;cursor:pointer;font-weight:700;font-size:11.5px">Cancelar</button>' +
          '<button id="ork-nick-buscar" style="flex:1;background:linear-gradient(100deg,#e8ac0a,#ffdc63);' +
            'color:#141200;border:none;border-radius:7px;padding:8px 0;cursor:pointer;font-weight:800;font-size:11.5px">Buscar</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var input = document.getElementById('ork-nick-input');
    input.focus();

    function fechar() { overlay.remove(); }
    document.getElementById('ork-nick-cancelar').addEventListener('click', fechar);

    function confirmar() {
      var nick = input.value.trim();
      if (!nick) { input.focus(); return; }
      gravarPendente(f.id, nick);
      fechar();
      window.location.href = urlPara('ranking');
    }
    document.getElementById('ork-nick-buscar').addEventListener('click', confirmar);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') confirmar(); });
  }

  /* ============================================================
     O PAINEL COMPLETO SÓ APARECE NO ASSISTENTE DE SAQUE
  ============================================================ */
  if (!(window.game_data && window.game_data.screen === 'am_farm')) {
    return;
  }

  /* ============================================================
     TRAVA DE INSTÂNCIA ÚNICA, AGORA COM VERSÃO

     Antes era um true/false simples. O efeito colateral: se uma cópia
     ANTIGA do painel já tivesse rodado na página (por exemplo, um
     segundo script do OROCHIKING ainda ativo no Tampermonkey, ou o
     loader antigo apontando pro outro repositório), a cópia NOVA
     desistia em silêncio e você continuava vendo a interface velha —
     parecendo que a atualização no GitHub não tinha pegado.

     Agora, se a cópia que já está na página for mais antiga, ela é
     removida e esta assume. E se houver duas cópias instaladas, o
     aviso abaixo aparece pra você saber que precisa desativar uma.
  ============================================================ */
  var ORK_PAINEL_VERSAO = 23;

  if (window.__OROCHIKING_PAINEL_ATIVO__) {
    var versaoNaPagina = window.__ORK_PAINEL_VERSAO__ || 0;
    if (versaoNaPagina >= ORK_PAINEL_VERSAO) {
      var jaAberto = document.getElementById('ork-painel');
      if (jaAberto) { jaAberto.style.display = 'block'; return; }
    } else {
      console.warn('[OROCHIKING] Painel v' + versaoNaPagina + ' (antigo) já estava na página — substituindo pela v' + ORK_PAINEL_VERSAO + '.');
      try {
        var painelVelho = document.getElementById('ork-painel');
        if (painelVelho) { painelVelho.remove(); }
        var estiloVelho = document.getElementById('ork-style');
        if (estiloVelho) { estiloVelho.remove(); }
      } catch (e) {}
      window.__ORK_DUPLICADO__ = true;
    }
  }
  window.__OROCHIKING_PAINEL_ATIVO__ = true;
  window.__ORK_PAINEL_VERSAO__ = ORK_PAINEL_VERSAO;

  /* ============================================================
     ESTILO
  ============================================================ */
  var css = `
    #ork-painel{position:fixed;top:60px;right:16px;width:368px;
      background:linear-gradient(165deg,rgba(26,26,26,.97),rgba(8,8,8,.98));
      backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
      border:1px solid rgba(255,196,0,.16);border-radius:18px;
      box-shadow:0 24px 60px rgba(0,0,0,.55),0 2px 0 rgba(255,255,255,.03) inset,0 0 0 1px rgba(0,0,0,.4);
      font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,Arial,sans-serif;
      color:#ececec;z-index:999999;overflow:hidden;transition:box-shadow .2s ease}
    #ork-header{background:linear-gradient(100deg,#e8ac0a,#ffdc63 50%,#e8ac0a);color:#1a1400;padding:13px 16px;
      display:flex;justify-content:space-between;align-items:center;cursor:move;user-select:none;
      box-shadow:0 1px 0 rgba(255,255,255,.35) inset}
    #ork-header .ork-title{font-weight:800;font-size:13.5px;letter-spacing:1.1px;display:flex;align-items:center;gap:8px;
      text-transform:uppercase}
    #ork-header .ork-badge{background:#1a1400;color:#ffcf3d;font-size:9.5px;font-weight:800;padding:3px 8px;
      border-radius:20px;letter-spacing:.4px}
    #ork-header .ork-btns{display:flex;gap:5px}
    #ork-header button{cursor:pointer;border:none;background:rgba(0,0,0,.08);color:#1a1400;font-weight:800;font-size:14px;
      width:22px;height:22px;line-height:22px;border-radius:50%;transition:background .15s ease,transform .15s ease}
    #ork-header button:hover{background:rgba(0,0,0,.22);transform:scale(1.08)}
    #ork-tabs{display:flex;flex-wrap:wrap;gap:5px;padding:10px 10px 8px;border-bottom:1px solid rgba(255,255,255,.06);
      background:rgba(0,0,0,.22)}
    .ork-tab{flex:1 1 auto;min-width:76px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.06);
      color:#a8a8a8;font-size:10.5px;font-weight:600;padding:7px 5px;border-radius:9px;cursor:pointer;
      text-align:center;white-space:nowrap;transition:all .16s ease}
    .ork-tab:hover{border-color:rgba(255,196,0,.35);color:#f2f2f2;background:rgba(255,255,255,.06)}
    .ork-tab.ork-tab-ativa{background:linear-gradient(100deg,#e8ac0a,#ffdc63);color:#1a1400;border-color:transparent;
      box-shadow:0 4px 14px rgba(232,172,10,.35);font-weight:800}
    #ork-body{padding:16px}
    #ork-content-titulo{font-size:15px;font-weight:800;color:#ffd84d;margin-bottom:8px;display:flex;align-items:center;gap:8px;
      letter-spacing:.2px}
    .ork-tag-tipo{font-size:9px;font-weight:800;color:#1a1400;background:linear-gradient(100deg,#ffc400,#ffe27a);
      padding:2px 8px;border-radius:9px;letter-spacing:.3px}
    #ork-content-dica{font-size:11.5px;color:#9b9b9b;line-height:1.55;margin-bottom:14px;min-height:34px}
    .ork-btn-grande{width:100%;background:linear-gradient(100deg,#e8ac0a,#ffdc63);color:#1a1400;border:none;
      border-radius:10px;font-weight:800;font-size:13px;padding:11px 12px;cursor:pointer;letter-spacing:.3px;
      box-shadow:0 6px 16px rgba(232,172,10,.25);transition:transform .12s ease,box-shadow .12s ease}
    .ork-btn-grande:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(232,172,10,.4)}
    .ork-btn-grande:active{transform:translateY(0)}
    #ork-status{font-size:10.5px;color:#ff9d5c;margin-top:12px;min-height:14px;line-height:1.4}
    #ork-footer{font-size:9.5px;color:#5c5c5c;text-align:center;padding:9px 0 11px;border-top:1px solid rgba(255,255,255,.05)}
    #ork-freio-box{margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,.07)}
    #ork-freio-linha{display:flex;align-items:center;justify-content:space-between;gap:10px}
    #ork-freio-titulo{font-size:12px;font-weight:800;color:#ececec;letter-spacing:.3px}
    #ork-freio-btn{border:1px solid rgba(255,255,255,.14);background:#1c1c1c;color:#8a8a8a;
      border-radius:20px;padding:6px 16px;font-size:10.5px;font-weight:800;cursor:pointer;
      text-transform:uppercase;letter-spacing:.5px;transition:all .15s;white-space:nowrap}
    #ork-freio-btn:hover{filter:brightness(1.15)}
    #ork-freio-btn.ork-freio-on{background:linear-gradient(100deg,#e8ac0a,#ffdc63);color:#1a1400;border-color:transparent}
    #ork-freio-dica{font-size:9.5px;color:#777;margin-top:7px;line-height:1.5}
  `;
  var styleEl = document.createElement('style');
  styleEl.id = 'ork-style';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ============================================================
     HTML DO PAINEL
  ============================================================ */
  var tabsHtml = FERRAMENTAS.map(function (f) {
    return '<button class="ork-tab" data-id="' + f.id + '">' + f.icone + ' ' + (f.abrev || f.nome.split(' ')[0]) + '</button>';
  }).join('');

  var painel = document.createElement('div');
  painel.id = 'ork-painel';
  painel.innerHTML =
    '<div id="ork-header">' +
      '<div class="ork-title">PAINEL <span class="ork-badge">OROCHIKING</span></div>' +
      '<div class="ork-btns">' +
        '<button id="ork-min" title="Minimizar">–</button>' +
        '<button id="ork-close" title="Fechar">&times;</button>' +
      '</div>' +
    '</div>' +
    '<div id="ork-tabs">' + tabsHtml + '</div>' +
    '<div id="ork-body">' +
      '<div id="ork-content-titulo"></div>' +
      '<div id="ork-content-dica"></div>' +
      '<button id="ork-ativar" class="ork-btn-grande">Ativar</button>' +
      '<div id="ork-status"></div>' +
      '<div id="ork-freio-box">' +
        '<div id="ork-freio-linha">' +
          '<span id="ork-freio-titulo">🛑 Freio</span>' +
          '<button id="ork-freio-btn" type="button">carregando</button>' +
        '</div>' +
        '<div id="ork-freio-dica">Modo de baixo risco pra farm + cunhagem sem tomar captcha. ' +
        'O Farm Hard roda em 1.25x com pausas, e a cunhagem só age NAS PAUSAS do farm — os dois nunca disparam juntos. ' +
        'Ataque e coletor também ficam mais espaçados. Menos requisição simultânea = menos captcha.</div>' +
      '</div>' +
    '</div>' +
    '<div id="ork-footer">' +
      (window.__ORK_DUPLICADO__ ? '<span style="color:#ff9d5c">⚠ Há outra cópia do painel instalada no Tampermonkey — desative a antiga.</span><br>' : '') +
      (textoLicenca() ? '🔑 ' + textoLicenca() + '<br>' : '') +
      'v39 · Escolha a aba e clique em Ativar — o script já abre no lugar certo.' +
    '</div>';
  document.body.appendChild(painel);

  /* mostra o aviso de nova atualização, se houver uma que a pessoa ainda não viu.
     Pequeno atraso pra não competir com a montagem do painel. */
  try {
    var novidadePendente = orkNovidadeNaoVista();
    if (novidadePendente) { setTimeout(function () { orkMostrarNovidade(novidadePendente); }, 600); }
  } catch (e) { console.warn('[OROCHIKING] novidades:', e); }

  var ferramentaSelecionada = FERRAMENTAS[0];

  function selecionarFerramenta(id) {
    var f = FERRAMENTAS_POR_ID[id];
    if (!f) return;
    ferramentaSelecionada = f;
    painel.querySelectorAll('.ork-tab').forEach(function (t) {
      t.classList.toggle('ork-tab-ativa', t.getAttribute('data-id') === id);
    });
    document.getElementById('ork-content-titulo').innerHTML =
      f.icone + ' ' + f.nome + (f.categoria ? ' <span class="ork-tag-tipo">Tipo: ' + f.categoria + '</span>' : '');
    document.getElementById('ork-content-dica').textContent = f.dica;
    document.getElementById('ork-status').textContent = '';
  }

  painel.querySelectorAll('.ork-tab').forEach(function (t) {
    t.addEventListener('click', function () { selecionarFerramenta(t.getAttribute('data-id')); });
  });
  selecionarFerramenta(FERRAMENTAS[0].id);

  /* ============================================================
     ARRASTAR
  ============================================================ */
  (function tornarArrastavel() {
    var header = document.getElementById('ork-header');
    var arrastando = false, offX = 0, offY = 0;
    header.addEventListener('mousedown', function (e) {
      arrastando = true;
      var r = painel.getBoundingClientRect();
      offX = e.clientX - r.left;
      offY = e.clientY - r.top;
      painel.style.right = 'auto';
    });
    document.addEventListener('mousemove', function (e) {
      if (!arrastando) return;
      painel.style.left = (e.clientX - offX) + 'px';
      painel.style.top = (e.clientY - offY) + 'px';
    });
    document.addEventListener('mouseup', function () { arrastando = false; });
  })();

  document.getElementById('ork-close').addEventListener('click', function () {
    painel.remove();
    styleEl.remove();
    window.__OROCHIKING_PAINEL_ATIVO__ = false;
  });

  var minimizado = false;
  document.getElementById('ork-min').addEventListener('click', function () {
    minimizado = !minimizado;
    document.getElementById('ork-tabs').style.display = minimizado ? 'none' : 'flex';
    document.getElementById('ork-body').style.display = minimizado ? 'none' : 'block';
  });

  /* ============================================================
     BOTÃO "ATIVAR"
  ============================================================ */
  function mostrarAviso(msg) {
    var el = document.getElementById('ork-status');
    el.textContent = msg;
    clearTimeout(el.__t);
    el.__t = setTimeout(function () { el.textContent = ''; }, 6000);
  }

  (function ligarBotaoFreio() {
    var btn = document.getElementById('ork-freio-btn');
    if (!btn) { return; }
    function pintar() {
      var on = freioLigado();
      btn.textContent = on ? '✓ Ligado' : 'Desligado';
      btn.classList.toggle('ork-freio-on', on);
      btn.title = on
        ? 'Freio LIGADO — tudo rodando em ritmo lento, pra reduzir o risco de captcha.'
        : 'Freio desligado — as ferramentas rodam na velocidade que você configurou.';
    }
    pintar();
    btn.addEventListener('click', function () {
      var novo = !freioLigado();
      gravarFreio(novo);
      pintar();
      var st = document.getElementById('ork-status');
      if (st) {
        st.textContent = novo
          ? '🛑 Freio ligado. O Farm Hard vai para 0.5x e os ciclos ficam mais espaçados. Se alguma ferramenta já estiver rodando, reative para valer agora.'
          : 'Freio desligado. As ferramentas voltam à velocidade configurada.';
      }
      console.log('[OROCHIKING] Freio ' + (novo ? 'LIGADO' : 'desligado') + '.');
    });
  })();

  document.getElementById('ork-ativar').addEventListener('click', function () {
    var f = ferramentaSelecionada;
    if (!f) return;

    if (f.buscaPorNick) {
      abrirModalNick(f);
      return;
    }

    var telaOk = true;
    try { telaOk = f.checar(); } catch (e) { telaOk = true; }

    if (telaOk) {
      try {
        f.rodar();
      } catch (err) {
        console.error('[OROCHIKING]', f.nome, err);
        mostrarAviso('⚠ Erro ao rodar aqui: ' + (err && err.message ? err.message : err));
      }
      return;
    }

    if (!f.destino) {
      mostrarAviso('⚠ ' + f.dica);
      return;
    }

    gravarPendente(f.id, null);
    window.location.href = urlPara(f.destino);
  });

})();
