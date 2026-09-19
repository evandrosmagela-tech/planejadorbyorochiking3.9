// ==UserScript==
// @name         OROCHIKING - Painel Unificado
// @namespace    orochiking.painel
// @version      29.0
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
     MARCADOR DE VERSÃO
     Serve pra você conferir, em 2 segundos, qual versão está realmente
     rodando — sem depender de adivinhar se o GitHub já propagou.
     No Console (F12) digite:  __ORK_VERSAO__
  ============================================================ */
  window.__ORK_VERSAO__ = 29;
  console.log('%c[OROCHIKING] Painel v29 carregado', 'background:#e8ac0a;color:#1a1400;font-weight:bold;padding:2px 6px;border-radius:3px');

  /* ============================================================
     FORA DO JOGO (a sessão caiu e fomos parar na tela de
     login/seleção de mundo): tenta relogar sozinho e para por
     aqui — nada do resto do painel roda sem game_data.
  ============================================================ */
  if (typeof game_data === 'undefined') {
    (function tentarRelogarSozinho() {
      var dominioAtual = window.location.hostname.replace(/^www./, '');
      var mundo = null;
      try { mundo = localStorage.getItem('ork_mundo_' + dominioAtual); } catch (e) {}
      if (!mundo) {
        console.warn('[OROCHIKING] sem mundo salvo para ' + dominioAtual + ' — faça login manual uma vez neste mundo para o relogin automático aprender.');
        return;
      }

      var urlEntrar = 'https://www.' + dominioAtual + '/page/join/' + mundo;

      var jaTentou = null;
      try { jaTentou = sessionStorage.getItem('ork_tentando_relogar'); } catch (e) {}
      if (jaTentou === urlEntrar) return; // já tentamos essa mesma URL nesta aba, evita loop

      try { sessionStorage.setItem('ork_tentando_relogar', urlEntrar); } catch (e) {}

      console.log('[OROCHIKING] tentando relogar em', urlEntrar);
      setTimeout(function () {
        window.location.href = urlEntrar;
      }, 600);
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
     MONITOR DE SESSÃO — detecta se a sessão caiu (deslogado) e
     recarrega a página sozinho pra cair na tela de relogar.
  ============================================================ */
  (function monitorSessao() {
    setInterval(function () {
      try {
        fetch(window.location.href, { credentials: 'include' })
          .then(function (r) { return r.text(); })
          .then(function (html) {
            var t = html.toLowerCase();
            var pareceDeslogado = t.indexOf('var game_data') === -1 &&
              (t.indexOf('login_form') !== -1 || t.indexOf('page/join') !== -1 || t.indexOf('mundos actuais') !== -1 || t.indexOf('mundos atuais') !== -1);
            if (pareceDeslogado) {
              console.warn('[OROCHIKING] Sessão parece ter caído — recarregando.');
              window.location.reload();
            }
          })
          .catch(function (e) { console.warn('[OROCHIKING] monitor de sessão: falha ao checar', e && e.message); });
      } catch (e) {}
    }, 90000);
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
        window.fetch = function (input, init) {
          if (window.__ORK_CAPTCHA_BLOQUEADO__ && ehRequisicaoDeAutomacao(input)) {
            return Promise.reject(new Error('OROCHIKING: envio automático bloqueado (captcha ativo)'));
          }
          return fetchOriginal.call(window, input, init).then(function (resposta) {
            try {
              resposta.clone().text().then(function (texto) {
                if (textoIndicaCaptcha(texto)) { conferirCaptchaNoDom(); }
              }).catch(function () {});
            } catch (e) {}
            return resposta;
          });
        };
      }
    } catch (e) {}

    try {
      var xhrOpenOriginal = XMLHttpRequest.prototype.open;
      var xhrSendOriginal = XMLHttpRequest.prototype.send;

      XMLHttpRequest.prototype.open = function (metodo, url) {
        try { this.__orkUrl = url; } catch (e) {}
        return xhrOpenOriginal.apply(this, arguments);
      };

      XMLHttpRequest.prototype.send = function () {
        if (window.__ORK_CAPTCHA_BLOQUEADO__ && ehRequisicaoDeAutomacao(this.__orkUrl)) { return; }
        var xhr = this;
        try {
          xhr.addEventListener('load', function () {
            try { if (textoIndicaCaptcha(xhr.responseText)) { conferirCaptchaNoDom(); } } catch (e) {}
          });
        } catch (e) {}
        return xhrSendOriginal.apply(xhr, arguments);
      };
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
    (function(){ var FH_VERSAO = 40; /* Trava de instancia unica COM versao. Antes era so um true/false: se uma copia    ANTIGA do painel ja tivesse rodado na pagina, a nova desistia e reabria o popup    velho, dando a impressao de que a atualizacao nao pegou. Agora, se a copia que    ja esta na pagina for mais antiga, ela e descartada e esta assume. */ if (window.__FarmHardAtivo) { var versaoAtual = window.__FarmHardVersao || 0; if (versaoAtual >= FH_VERSAO) { if (typeof window.__FarmHardMostrar === "function") { window.__FarmHardMostrar(); } return; } console.warn("[OROCHIKING] Farm Hard v" + versaoAtual + " antigo detectado na pagina — substituindo pela v" + FH_VERSAO + "."); try { var velho = document.getElementById("farmhard-popup"); if (velho) { velho.remove(); } } catch (e) {} try { if (typeof window.__FarmHardParar === "function") { window.__FarmHardParar(); } } catch (e) {} } window.__FarmHardAtivo = true; window.__FarmHardVersao = FH_VERSAO; function _FarmarAS() { /* Script Escrito por ThiioM :) - Ajustado - Farm Hard 1.0 */ /* Lockr Script */ !function(t,e){t.Lockr=function(t,e){"use strict";return e.prefix="",e._getPrefixedKey=function(t,e){return e=e||{},e.noPrefix?t:this.prefix+t},e.set=function(t,e,r){var a=this._getPrefixedKey(t,r);try{localStorage.setItem(a,JSON.stringify({data:e}))}catch(t){}},e.get=function(t,e,r){var a,i=this._getPrefixedKey(t,r);try{a=JSON.parse(localStorage.getItem(i))}catch(t){a=localStorage[i]?{data:localStorage.getItem(i)}:null}return null===a?e:"object"==typeof a&&void 0!==a.data?a.data:e},e}(t,{})}(this); let CLMinimo = 0; let UltimaCLLida = null; let AldeiasPuladasCL = 0;
    const LerCLMinimo = () => { const el = document.getElementById('fh-clmin'); CLMinimo = el ? (parseInt(el.value, 10) || 0) : 0; return CLMinimo; };
    const AtualizarStatusCL = () => { const el = document.getElementById('fh-clmin-status'); if (!el) { return; } if (CLMinimo <= 0) { el.style.color = '#8a8a8a'; el.innerText = 'desligado'; return; } if (UltimaCLLida === null) { el.style.color = '#ffb347'; el.innerText = 'lendo...'; return; } if (UltimaCLLida === -1) { el.style.color = '#ff8a6b'; el.innerText = 'CL nao lida'; return; } el.style.color = '#7ed17e'; el.innerText = 'CL: ' + UltimaCLLida + ' | puladas: ' + AldeiasPuladasCL; };
    /* Le a cavalaria leve disponivel NA ALDEIA a partir da tabela
       "Disponibilidade / Desta aldeia" da pagina am_farm (que o script ja busca).
    
       A versao anterior errava a coluna: procurava classes que nao existem nessa
       tabela e acabava caindo num indice fixo, lendo o machado em vez da cavalaria.
       Agora o indice da coluna e descoberto pelo cabecalho: acha a celula cuja
       imagem e unit_light (independente de idioma) e le a MESMA posicao na linha
       de numeros. */
    const LerCavalariaDisponivel = (data) => {
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
            if (/unit_light\./i.test(src) || /cavalaria leve|light cavalry|leichte kavallerie/i.test(titulo)) {
              coluna = c;
              break;
            }
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
    let TemArqueiro = $.inArray('archer', game_data.units) > -1; let TemPaladino = $.inArray('knight', game_data.units) > -1; let Ids = []; let Grupos = []; let Ponteiros = []; let GrupoAtual = 0; let NumGrupos = 1; let Rodando = false; let Pausado = false; let Iniciado = false; let AtaquesEnviados = 0, AtaquesFalhados = 0, AtaquesPendentes = 0; let fhRankIntervalo = null; let fhTentativasIds = 0; let VelocidadeFator = 1; const NUM_FILAS = 5; const apenasnumeros = string => parseInt(string.replace(/[^0-9]/g, '')); const aleatorio = (inferior, superior) => Math.round(parseInt(inferior) + (Math.random() * (superior - inferior))); /* Quantas filas ficam ativas de acordo com a velocidade - quanto mais devagar, menos filas simultaneas (menos parece robo) */ const FilasParaVelocidade = (fator) => { if (fator <= 0.5) { return 1; } if (fator <= 1) { return 2; } if (fator <= 1.25) { return 3; } if (fator <= 1.5) { return 4; } return 5; }; const MontarGrupos = (n) => { Grupos = []; Ponteiros = []; let total = Ids.length; const elTot = document.getElementById("fh-total-aldeias"); if (elTot) { elTot.innerText = "(" + total + " aldeias)"; } if (total === 0 || n < 1) { return; } let base = Math.floor(total / n); let resto = total % n; let idx = 0; for (let g = 0; g < n; g++) { let tamanho = base + (g < resto ? 1 : 0); if (tamanho > 0) { Grupos.push(Ids.slice(idx, idx + tamanho)); Ponteiros.push(0); } idx += tamanho; } GrupoAtual = 0; }; const ProximaAldeia = () => { if (Grupos.length === 0) { return null; } let tentativas = 0; while (tentativas < Grupos.length) { let grupo = Grupos[GrupoAtual]; if (!grupo || grupo.length === 0) { GrupoAtual = (GrupoAtual + 1) % Grupos.length; tentativas++; continue; } let id_ = grupo[Ponteiros[GrupoAtual]]; Ponteiros[GrupoAtual]++; if (Ponteiros[GrupoAtual] >= grupo.length) { Ponteiros[GrupoAtual] = 0; } GrupoAtual = (GrupoAtual + 1) % Grupos.length; return id_; } return null; }; /* ===== POPUP Farm Hard 1.0 ===== */ const fhEstilo = document.createElement("style"); fhEstilo.innerHTML = `#farmhard-popup{position:fixed;top:80px;right:20px;width:315px;background:linear-gradient(160deg,#1a1a1a,#050505);border:1px solid #3a3a3a;border-radius:14px;box-shadow:0 14px 34px rgba(0,0,0,0.75),0 0 0 1px rgba(255,196,0,0.12);font-family:"Segoe UI",Arial,Helvetica,sans-serif;color:#eee;z-index:999999;overflow:hidden}#farmhard-header{background:linear-gradient(100deg,#FFB800,#FFDD55 55%,#FFB800);color:#141200;padding:13px 14px;display:flex;justify-content:space-between;align-items:center;cursor:move;box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15)}#fh-title-main{font-size:15px;font-weight:800;letter-spacing:1.2px;text-shadow:0 1px 0 rgba(255,255,255,0.25)}#fh-title-version{font-size:9px;background:#141200;color:#FFC400;padding:2px 7px;border-radius:9px;margin-left:7px;font-weight:700;vertical-align:middle;letter-spacing:0.4px}#farmhard-header span.fh-close{cursor:pointer;font-weight:bold;font-size:16px;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:0.15s;color:#141200}#farmhard-header span.fh-close:hover{background:rgba(0,0,0,0.18)}#farmhard-body{padding:14px}#farmhard-rank{background:#161616;border:1px solid #2c2c2c;border-radius:10px;padding:10px 12px;margin-bottom:12px}#farmhard-rank-label{font-size:10.5px;color:#FFC400;font-weight:700;letter-spacing:0.6px;margin-bottom:7px;text-transform:uppercase}#farmhard-rank-track{width:100%;height:11px;background:#0a0a0a;border:1px solid #2c2c2c;border-radius:6px;overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,0.6)}#farmhard-rank-fill{height:100%;width:0%;background:linear-gradient(90deg,#FFB800,#FFEB99);box-shadow:0 0 8px rgba(255,196,0,0.55);transition:width 0.5s ease}#farmhard-rank-texto{font-size:10.5px;color:#aaa;margin-top:7px;text-align:center;letter-spacing:0.2px}#farmhard-speed-box{background:#161616;border:1px solid #2c2c2c;border-radius:10px;padding:10px 12px;margin-bottom:12px}#farmhard-speed-titulo{font-size:10.5px;color:#888;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;margin-bottom:8px}#farmhard-speed-opcoes{display:grid;grid-template-columns:repeat(5,1fr);gap:5px}.fh-vel{background:#1c1c1c;border:1px solid #333;border-radius:8px;padding:6px 1px;color:#ddd;font-weight:800;font-size:10.5px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;transition:0.15s}.fh-vel:hover{border-color:#665400}.fh-vel.ativa{border-color:#FFC400;background:#241f08;color:#fff}.fh-vel-tag{font-size:6.6px;font-weight:700;letter-spacing:0.1px;text-align:center;line-height:1.15;white-space:normal}#farmhard-opcoes-label{font-size:10.5px;color:#888;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;margin:2px 0 7px 2px}.fh-opcao{display:flex;align-items:center;gap:9px;background:#161616;border:1px solid #2c2c2c;border-radius:9px;padding:8px 10px;margin-bottom:6px;font-size:11.5px;color:#ccc;cursor:pointer;transition:0.15s}.fh-opcao:hover{border-color:#665400;background:#1c1a10}.fh-opcao.ativa{border-color:#FFC400;background:#241f08;color:#fff}.fh-badge{width:20px;height:20px;flex-shrink:0;border-radius:50%;background:#2c2c2c;color:#999;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;transition:0.15s}.fh-opcao.ativa .fh-badge{background:#FFC400;color:#141200}.fh-opcao input{position:absolute;opacity:0;width:0;height:0}#farmhard-contador{display:flex;align-items:center;justify-content:space-between;background:#161616;border:1px solid #2c2c2c;border-radius:10px;padding:10px 12px;margin:12px 0;font-size:11.5px;color:#bbb}#farmhard-contador b{color:#FFC400;font-size:18px}#fh-clmin-box{margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.07)}#fh-clmin-linha{display:flex;align-items:center;gap:8px}#fh-clmin-label{font-size:11px;color:#bbb;flex:1}#fh-clmin{width:78px;background:#111;border:1px solid rgba(255,255,255,.12);color:#ececec;border-radius:7px;padding:5px 8px;font-size:12px}#fh-clmin:focus{outline:none;border-color:#e8ac0a}#fh-clmin-status{font-size:10px;color:#8a8a8a;min-width:74px;text-align:right}#fh-clmin-dica{font-size:9.5px;color:#777;margin-top:5px;line-height:1.45}.fh-cont-item{display:flex;flex-direction:column;align-items:center;gap:2px;flex:1}.fh-cont-item span{font-size:9.5px;color:#888;text-transform:uppercase;letter-spacing:.4px}#farmhard-botoes{display:flex;gap:7px}#farmhard-botoes button{flex:1;padding:10px 0;border:none;border-radius:9px;font-weight:700;cursor:pointer;font-size:11.5px;letter-spacing:0.3px;transition:0.15s}#fh-iniciar{background:linear-gradient(100deg,#FFB800,#FFDD55);color:#141200;box-shadow:0 3px 10px rgba(255,184,0,0.35)}#fh-iniciar:hover{filter:brightness(1.08)}#fh-pausar{background:#232323;color:#FFC400;border:1px solid #3a3a3a}#fh-pausar:hover{background:#2b2b2b}#fh-fechar{background:#2a1010;color:#ff6b6b;border:1px solid #4a1c1c}#fh-fechar:hover{background:#341313}#farmhard-status{text-align:center;font-size:10.5px;margin-top:10px;color:#777;font-style:italic}`; document.head.appendChild(fhEstilo); const fhHtml = `<div id="farmhard-popup"><div id="farmhard-header"><div><span id="fh-title-main">FARM HARD</span><span id="fh-title-version">4.0</span></div><span class="fh-close" id="fh-x">&times;</span></div><div id="farmhard-body"><div id="farmhard-rank"><div id="farmhard-rank-label">Progresso vs Top 1 Mundial</div><div id="farmhard-rank-track"><div id="farmhard-rank-fill"></div></div><div id="farmhard-rank-texto">Carregando...</div></div><div id="farmhard-speed-box"><div id="farmhard-speed-titulo">Velocidade de envio</div><div id="farmhard-speed-opcoes"><button class="fh-vel" data-fator="0.5">0.5x<span class="fh-vel-tag" style="color:#7ec8ff">Durma em Paz</span></button><button class="fh-vel ativa" data-fator="1">1x<span class="fh-vel-tag" style="color:#8a8a8a">Normal</span></button><button class="fh-vel" data-fator="1.25">1.25x<span class="fh-vel-tag" style="color:#7ed17e">Baixo risco</span></button><button class="fh-vel" data-fator="1.5">1.5x<span class="fh-vel-tag" style="color:#ffb347">Risco moderado</span></button><button class="fh-vel" data-fator="2">2x<span class="fh-vel-tag" style="color:#ff5f5f">Arriscado</span></button><button class="fh-vel" data-fator="2.5">2.5x<span class="fh-vel-tag" style="color:#ff2d2d">Muito arriscado</span></button></div><div id="fh-clmin-box"><div id="fh-clmin-linha"><span id="fh-clmin-label">CL mín. por aldeia</span><input type="number" id="fh-clmin" min="0" step="10" value="0"><span id="fh-clmin-status">desligado</span></div><div id="fh-clmin-dica">Pula a aldeia se ela tiver menos cavalaria leve que isso. 0 = envia de todas.</div></div></div><div id="farmhard-opcoes-label">Modo de rotação <span id="fh-total-aldeias" style="color:#FFC400;font-weight:800">(carregando aldeias...)</span></div><label class="fh-opcao ativa"><span class="fh-badge">1</span><span>Normal — fila unica (ex: 1 a 100)</span><input type="radio" name="fh-opcao" class="fh-opcao-input" value="1" checked></label><label class="fh-opcao"><span class="fh-badge">2</span><span>2 grupos (ex: 1-50 / 51-100)</span><input type="radio" name="fh-opcao" class="fh-opcao-input" value="2"></label><label class="fh-opcao"><span class="fh-badge">3</span><span>3 grupos (ex: 1-30 / 31-60 / 61-100)</span><input type="radio" name="fh-opcao" class="fh-opcao-input" value="3"></label><label class="fh-opcao"><span class="fh-badge">4</span><span>4 grupos (ex: 1-25 / 26-50 / 51-75 / 76-100)</span><input type="radio" name="fh-opcao" class="fh-opcao-input" value="4"></label><div id="farmhard-contador"><div class="fh-cont-item"><span>Enviados</span><b id="farmhard-contador-valor">0</b></div><div class="fh-cont-item"><span>Falhados</span><b id="farmhard-contador-falhas" style="color:#ff6b6b">0</b></div><div class="fh-cont-item"><span>Pendentes</span><b id="farmhard-contador-pend" style="color:#7ec8ff">0</b></div></div><div id="farmhard-botoes"><button id="fh-iniciar">Iniciar</button><button id="fh-pausar">Pausar</button><button id="fh-fechar">Fechar</button></div><div id="farmhard-status">Parado</div></div></div>`; const fhWrap = document.createElement("div"); fhWrap.innerHTML = fhHtml; document.body.appendChild(fhWrap.firstChild); const AtualizarStatus = (texto) => { const el = document.getElementById("farmhard-status"); if (el) { el.innerText = texto; } }; const AtualizarContador = () => { const el = document.getElementById("farmhard-contador-valor"); if (el) { el.innerText = AtaquesEnviados; } const elF = document.getElementById("farmhard-contador-falhas"); if (elF) { elF.innerText = AtaquesFalhados; } const elP = document.getElementById("farmhard-contador-pend"); if (elP) { elP.innerText = AtaquesPendentes; } }; const AtualizarBarraRanking = (meu, top) => { let pct = Math.min(100, (meu / top) * 100); const fill = document.getElementById("farmhard-rank-fill"); const texto = document.getElementById("farmhard-rank-texto"); if (fill) { fill.style.width = pct.toFixed(4) + "%"; } if (texto) { texto.innerText = meu.toLocaleString("pt-BR") + " / " + top.toLocaleString("pt-BR") + " (" + pct.toFixed(4) + "%)"; } }; const BuscarRanking = () => { $.ajax({ url: "/game.php?village=" + game_data.village.id + "&screen=info_player&mode=awards&group=0", type: "GET", headers: { "Upgrade-Insecure-Requests": 1 }, success: (data) => { let labelAlvo = null; let $doc = $(data); $doc.find("*").each( function() { if (labelAlvo !== null) { return false; } let txt = $(this).text(); if (txt) { txt = txt.replace(/\s+/g, " ").trim(); } if (txt && ["saqueador de recursos do dia","saqueador de recursos do dia!","looter of the day","resource looter of the day","pluenderer des tages","plunderer of the day","saqueador del dia","pilleur du jour","saccheggiatore del giorno","plunderaar van de dag","lupiezca dnia","jefe saqueador"].indexOf(txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) !== -1) { let escopo = this.parentElement; for (let up = 0; up < 5 && escopo; up++) { let pb = $(escopo).find(".progress-bar .label").first(); if (pb.length) { labelAlvo = pb; return false; } escopo = escopo.parentElement; } } }); if (labelAlvo) { let texto = labelAlvo.text().replace(/\s+/g, ""); let partes = texto.split("/"); if (partes.length === 2) { let meu = parseInt(partes[0].replace(/[^0-9]/g, '')); let top = parseInt(partes[1].replace(/[^0-9]/g, '')); if (!isNaN(meu) && !isNaN(top) && top > 0) { Lockr.set('FarmHard_Meu', meu); Lockr.set('FarmHard_Top', top); AtualizarBarraRanking(meu, top); } } } else { const texto = document.getElementById("farmhard-rank-texto"); if (texto) { texto.innerText = "Conquista nao encontrada"; } } }, error: () => { const texto = document.getElementById("farmhard-rank-texto"); if (texto) { texto.innerText = "Erro ao buscar ranking"; } } }); }; let fhMeuCache = Lockr.get('FarmHard_Meu'); let fhTopCache = Lockr.get('FarmHard_Top'); if (fhMeuCache && fhTopCache) { AtualizarBarraRanking(fhMeuCache, fhTopCache); } BuscarRanking(); fhRankIntervalo = setInterval(BuscarRanking, 60000); window.__FarmHardMostrar = () => { const p = document.getElementById("farmhard-popup"); if (p) { p.style.display = "block"; } }; const fhHeader = document.getElementById("farmhard-header"); let fhArrastando = false, fhOffX = 0, fhOffY = 0; fhHeader.addEventListener("mousedown", (e) => { fhArrastando = true; const rect = document.getElementById("farmhard-popup").getBoundingClientRect(); fhOffX = e.clientX - rect.left; fhOffY = e.clientY - rect.top; }); document.addEventListener("mousemove", (e) => { if (!fhArrastando) { return; } const p = document.getElementById("farmhard-popup"); if (!p) { return; } p.style.left = (e.clientX - fhOffX) + "px"; p.style.top = (e.clientY - fhOffY) + "px"; p.style.right = "auto"; }); document.addEventListener("mouseup", () => { fhArrastando = false; }); document.querySelectorAll(".fh-vel").forEach((btn) => { btn.addEventListener("click", () => { VelocidadeFator = parseFloat(btn.getAttribute("data-fator")); document.querySelectorAll(".fh-vel").forEach((b) => { b.classList.remove("ativa"); }); btn.classList.add("ativa"); }); }); /* Filtro de CL minima: salva a preferencia e atualiza o status ao digitar */ (() => { const elCl = document.getElementById("fh-clmin"); if (!elCl) { return; } try { const salvo = localStorage.getItem("fh_cl_minimo"); if (salvo !== null) { elCl.value = salvo; } } catch (e) {} LerCLMinimo(); AtualizarStatusCL(); elCl.addEventListener("input", () => { LerCLMinimo(); try { localStorage.setItem("fh_cl_minimo", String(CLMinimo)); } catch (e) {} if (CLMinimo <= 0) { UltimaCLLida = null; AldeiasPuladasCL = 0; } AtualizarStatusCL(); }); })(); /* Pegar ID das Aldeias */ $.ajax({ url: "/game.php?village=" + game_data.village.id + "&screen=info_player&id=" + game_data.player.id, data: {}, type: "GET", headers: { "Upgrade-Insecure-Requests": 1 }, success: (data) => { let _ids = data.match(/(data-id="(\d+)")+/g); if (_ids) { for (let x of _ids) { x = x.replace(/[^0-9]/g, ''); Ids.push(x); } } if (data.match(/Player\.getAllVillages/)) { $.ajax({ url: "/game.php?village=" + game_data.village.id + "&screen=info_player&ajax=fetch_villages&player_id=" + game_data.player.id, data: {}, type: "GET", dataType: "json", success: (data) => { let _ids_ = data.villages ? data.villages.match(/(data-id="(\d+)")+/g) : null; if (_ids_) { for (let r of _ids_) { r = r.replace(/[^0-9]/g, ''); Ids.push(r); } } MontarGrupos(NumGrupos); }, error: () => { MontarGrupos(NumGrupos); } }); } else { MontarGrupos(NumGrupos); } }, error: () => { AtualizarStatus("Erro ao buscar aldeias"); } }); /* Função Enviar Atk Botão C - AS */ const EnviarAtaque_ = (Relatorio_id_, id_) => { AtaquesPendentes++; AtualizarContador(); $.ajax({ url: "/game.php?village=" + id_ + "&screen=am_farm&mode=farm&ajaxaction=farm_from_report&json=1&&h=" + csrf_token + "&client_time=" + Math.round(Timing.getCurrentServerTime() / 1e3), data: { report_id: Relatorio_id_ }, type: "POST", dataType: "json", headers: { "TribalWars-Ajax": 1 }, success: (resp, textStatus, xhr) => { AtaquesPendentes--; if (xhr && xhr.status === 200 && resp && !resp.error) { AtaquesEnviados++; } else { AtaquesFalhados++; } AtualizarContador(); }, error: () => { AtaquesPendentes--; AtaquesFalhados++; AtualizarContador(); } }); }; class Alvo { constructor(Relatorio_id_, Madeira, Argila, Ferro) { this.Relatorio_id_ = Relatorio_id_; this.Madeira = Madeira; this.Argila = Argila; this.Ferro = Ferro; } get Recursos() { return this.Madeira + this.Argila + this.Ferro; } } /* Cada fila tem um indice fixo - se a velocidade atual pede menos filas do que o indice desta, ela so espera (nao farma) ate a velocidade subir de novo */ const Trabalhador = (indiceFila) => { if (!Rodando) { return; } if (Pausado) { setTimeout(() => Trabalhador(indiceFila), 300); return; } let filasAtivas = FilasParaVelocidade(VelocidadeFator); if (indiceFila >= filasAtivas) { setTimeout(() => Trabalhador(indiceFila), 1000); return; } if (Grupos.length === 0) { MontarGrupos(NumGrupos); } if (Grupos.length === 0) { setTimeout(() => Trabalhador(indiceFila), 300); return; } let inicio = Date.now(); let id_ = ProximaAldeia(); if (!id_) { setTimeout(() => Trabalhador(indiceFila), 300); return; } $.ajax({ url: "/game.php?village=" + id_ + "&screen=am_farm", type: "GET", headers: { "Upgrade-Insecure-Requests": 1 }, success: (data) => { LerCLMinimo(); if (CLMinimo > 0) { const clDisponivel = LerCavalariaDisponivel(data); UltimaCLLida = clDisponivel; AtualizarStatusCL(); /* -1 = nao consegui ler o markup; nesse caso nao bloqueia nada, so avisa no status */ if (clDisponivel !== -1 && clDisponivel < CLMinimo) { AldeiasPuladasCL++; AtualizarStatusCL(); let gastoPulo = Date.now() - inicio; let alvoIntervaloPulo = Math.round(1000 / VelocidadeFator); let minimoPulo = Math.max(75, Math.round(150 / VelocidadeFator)); let basePulo = Math.max(minimoPulo, alvoIntervaloPulo - gastoPulo); let esperaPulo = aleatorio(Math.round(basePulo * 0.85), Math.round(basePulo * 1.15)); setTimeout(() => Trabalhador(indiceFila), esperaPulo); return; } } let Alvos = []; if (!Lockr.get('Alvos_Muralha')) { Lockr.set('Alvos_Muralha', []); } let array = Lockr.get('Alvos_Muralha'); $(data).find('tr[id^=village_]').each( function(e) { let id = $(this).attr('id').match(/village_(\d+)/)[1]; let coord = $(this).find('td').eq(3).text().match(/(\d+)\|(\d+)/g); let Relatorio_id_ = $(this).find('td').eq(3).find('a').attr('href').match(/view=(\d+)/)[1]; let Madeira = apenasnumeros($(this).find('td').eq(5).find('span.nowrap').eq(0).text()); let Argila = apenasnumeros($(this).find('td').eq(5).find('span.nowrap').eq(1).text()); let Ferro = apenasnumeros($(this).find('td').eq(5).find('span.nowrap').eq(2).text()); let Muralha = apenasnumeros($(this).find('td').eq(6).text()); if( $(this).find('td').eq(5).find('span').eq(0).text() !== "?" ) { if ($(this).find('a.farm_icon.farm_icon_c').attr('class').match(/farm_icon_disabled/) === null) { if (Muralha > 0) { let aux = [ id, "&", coord, "&", Muralha ]; if(array.indexOf(aux.join('')) === -1 ) { array.push(aux.join('')); } } Alvos.push(new Alvo(Relatorio_id_, Madeira, Argila, Ferro)); } } }); Lockr.set('Alvos_Muralha', array); if (Alvos.length !== 0) { let Enviou = 0; for (let t = 0; t < Alvos.length; t++) { if (Alvos[t].Madeira >= 50000 && Alvos[t].Argila >= 50000 && Alvos[t].Ferro >= 50000 && Enviou === 0) { Enviou++; EnviarAtaque_(Alvos[t].Relatorio_id_, id_); } } } let gasto = Date.now() - inicio; let alvoIntervalo = Math.round(1000 / VelocidadeFator); let minimo = Math.max(75, Math.round(150 / VelocidadeFator)); let base = Math.max(minimo, alvoIntervalo - gasto); let espera = aleatorio(Math.round(base * 0.85), Math.round(base * 1.15)); setTimeout(() => Trabalhador(indiceFila), espera); }, error: () => { let gasto = Date.now() - inicio; let alvoIntervalo = Math.round(1000 / VelocidadeFator); let minimo = Math.max(75, Math.round(150 / VelocidadeFator)); let base = Math.max(minimo, alvoIntervalo - gasto); let espera = aleatorio(Math.round(base * 0.85), Math.round(base * 1.15)); setTimeout(() => Trabalhador(indiceFila), espera); } }); }; const IniciarFilas = () => { AtualizarStatus("Rodando (" + Ids.length + " aldeias, " + Grupos.length + " grupos)"); for (let l = 0; l < NUM_FILAS; l++) { setTimeout(() => Trabalhador(l), l * 150); } }; const __ids = () => { if (Ids[0] !== undefined) { if (Grupos.length === 0) { MontarGrupos(NumGrupos); } IniciarFilas(); } else { fhTentativasIds++; if (fhTentativasIds > 20) { AtualizarStatus("Erro: aldeias nao carregaram. Feche e abra novamente."); return; } setTimeout(__ids, 1000); } }; document.getElementById("fh-iniciar").onclick = () => { Rodando = true; Pausado = false; document.getElementById("fh-pausar").innerText = "Pausar"; AtualizarStatus("Iniciando..."); if (!Iniciado) { Iniciado = true; fhTentativasIds = 0; setTimeout(__ids, 500); } else { AtualizarStatus("Rodando..."); } }; document.getElementById("fh-pausar").onclick = () => { if (!Rodando) { return; } Pausado = !Pausado; document.getElementById("fh-pausar").innerText = Pausado ? "Continuar" : "Pausar"; AtualizarStatus(Pausado ? "Pausado" : "Rodando..."); }; const FecharTudo = () => { Rodando = false; if (fhRankIntervalo) { clearInterval(fhRankIntervalo); } const p = document.getElementById("farmhard-popup"); if (p) { p.remove(); } window.__FarmHardAtivo = false; }; document.getElementById("fh-fechar").onclick = FecharTudo; document.getElementById("fh-x").onclick = FecharTudo; document.querySelectorAll(".fh-opcao-input").forEach((el) => { el.addEventListener("change", (ev) => { NumGrupos = parseInt(ev.target.value); MontarGrupos(NumGrupos); document.querySelectorAll(".fh-opcao").forEach((o) => { o.classList.remove("ativa"); }); ev.target.closest(".fh-opcao").classList.add("ativa"); }); }); } _FarmarAS(); })();
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
            return $("#combined_table tbody tr:eq(" + rowIndex + ") td:eq(3)");
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
                  $("#combined_table tbody tr:eq(" + aldeia.rowIndex + ") td:eq(3)")
                    .text("ENVIADO!")
                    .css("text-align", "center")
                    .css("color", "#0d1117")
                    .css("font-weight", "700")
                    .css("background-color", "#4ade80");
                  removeVillage(aldeia.id);
                } else if (data.error != _("9a07c3a91c3f2b7a6a8bc675d1bcb913")) {
                  $("#combined_table tbody tr:eq(" + aldeia.rowIndex + ") td:eq(3)")
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
                  $("#combined_table tbody tr:eq(" + aldeia.rowIndex + ") td:eq(3)")
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
            $("#combined_table tbody tr").remove();
            $("#combined_table tbody").append(resultHeaderRow());
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
                      $("#combined_table tbody").append(
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
                      aldeia.rowIndex = $("#combined_table tbody tr").length - 1;
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
            // Farmar Player: só cavalaria leve
            farm: { light: 100000 },
            // Full + NT: mesmas tropas do ataque full + 4 nobres
            fullnt: { axe: 100000, light: 100000, marcher: 100000, spy: 100000, ram: 100000, catapult: 100000, knight: 100000, snob: 4 },
            // Full + Nobre: mesma coisa, só 1 nobre
            fullnobre: { axe: 100000, light: 100000, marcher: 100000, spy: 100000, ram: 100000, catapult: 100000, knight: 100000, snob: 1 },
            // Noblar Bárbara: 25 cavalaria leve + 1 nobre (número fixo, não "máximo")
            noblarbarbara: { light: 25, snob: 1 },
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
              $("#combined_table tbody tr").remove();
              $("#combined_table tbody").append(resultHeaderRow());
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
  }
  function rodarAtaque() {
    rodarAtaqueOriginal();
    setTimeout(adicionarLoopAtaque, 500);
  }

  function checaRename() {
    return !!(window.game_data && game_data.screen === 'overview_villages' && game_data.mode === 'combined');
  }
  function rodarRename() {
    !function(){if("undefined"!=typeof $)if(document.getElementById("rh-popup"))$("#rh-popup").show();else{$('<style id="rh-style">').text("#rh-popup{position:fixed;top:80px;left:50%;transform:translateX(-50%);width:460px;max-height:82vh;background:#181818;border:1px solid rgba(255,196,0,.16);border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,.6);z-index:999999;font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,Arial,sans-serif;color:#eee;overflow:hidden;display:flex;flex-direction:column;}#rh-header{background:linear-gradient(100deg,#e8ac0a,#ffdc63 50%,#e8ac0a);color:#111;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;cursor:move;user-select:none;}#rh-header .rh-title{font-weight:bold;font-size:15px;letter-spacing:.5px;display:flex;align-items:center;gap:8px;}#rh-header .rh-badge{background:#111;color:#ffd84d;font-size:11px;font-weight:bold;padding:2px 7px;border-radius:16px;}#rh-header .rh-sub{display:block;font-size:10px;font-weight:normal;opacity:.75;}#rh-close{cursor:pointer;font-weight:bold;font-size:16px;color:#111;background:transparent;border:none;}#rh-body{padding:12px 14px;overflow-y:auto;flex:1;}.rh-section{margin-bottom:12px;border:1px solid #333;border-radius:6px;padding:9px 10px;background:#1f1f1f;}.rh-label{font-size:11px;color:#ffd84d;font-weight:bold;text-transform:uppercase;margin-bottom:5px;display:block;}#rh-popup input[type=text],#rh-popup input[type=number],#rh-popup select{width:100%;box-sizing:border-box;background:#111;border:1px solid #444;color:#eee;padding:6px 7px;border-radius:4px;font-size:12px;margin-bottom:6px;}#rh-popup input:focus,#rh-popup select:focus{outline:none;border-color:#ffd84d;}.rh-row{display:flex;gap:6px;}.rh-row > *{flex:1;}.rh-check{display:flex;align-items:center;gap:6px;font-size:12px;margin-bottom:6px;}.rh-check input{width:auto;margin:0;}#rh-popup button{cursor:pointer;border:none;border-radius:5px;font-weight:bold;font-size:12px;padding:8px 10px;}.rh-btn-primary{background:#ffd84d;color:#111;}.rh-btn-primary:hover{background:#ffd84d;}.rh-btn-secondary{background:#2a2a2a;color:#ffd84d;border:1px solid #ffd84d !important;}.rh-btn-secondary:hover{background:#333;}.rh-btn-danger{background:#7a1f1f;color:#fff;}.rh-btn-danger:hover{background:#992525;}.rh-btn-mini{padding:4px 7px;font-size:11px;}#rh-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;}#rh-actions button{flex:1;min-width:80px;}#rh-progress-wrap{background:#111;border-radius:4px;height:14px;margin:8px 0 4px;overflow:hidden;border:1px solid #333;}#rh-progress-bar{background:linear-gradient(90deg,#f0b90b,#ffd84d);height:100%;width:0%;transition:width .2s;}#rh-status{font-size:11px;color:#ccc;margin-bottom:4px;}#rh-log{background:#0d0d0d;border:1px solid #333;border-radius:5px;height:120px;overflow-y:auto;font-family:Consolas,monospace;font-size:11px;padding:6px;}.rh-log-ok{color:#8fdc7a;}.rh-log-err{color:#ff8080;}.rh-log-info{color:#9ec9ff;}.rh-rule-row{display:flex;gap:4px;margin-bottom:5px;align-items:center;}.rh-rule-row input{margin-bottom:0;}.rh-rule-row .rh-rule-min,.rh-rule-row .rh-rule-max{width:70px;flex:none;}.rh-rule-row .rh-rule-nome{flex:1;}.rh-rule-row .rh-rule-del{flex:none;width:24px;height:24px;padding:0;background:#7a1f1f;color:#fff;border-radius:4px;}#rh-add-rule{width:100%;margin-top:2px;}.rh-hide{display:none !important;}").appendTo("head");var e,o,r,a,t;$("body").append('<div id="rh-popup"><div id="rh-header"><div class="rh-title">RENOMEADOR HARD <span class="rh-badge">1.0</span><span class="rh-sub">BY OROCHIKING</span></div><button id="rh-close">&times;</button></div><div id="rh-body"><div class="rh-section"><span class="rh-label">Nome base</span><input type="text" id="rh-nomebase" placeholder="Ex: THE KING!" value="THE KING!"><label class="rh-check"><input type="checkbox" id="rh-pular-iguais" checked> Pular aldeias que já têm o nome final</label></div><div class="rh-section"><span class="rh-label">Tipo de renomeação</span><select id="rh-modo"><option value="unico">Nome único para todas</option><option value="continente">Nome + Continente (K55)</option><option value="sequencial">Nome + numeração sequencial</option><option value="lote">Nome + lote (quantidade de aldeias por bloco)</option><option value="pontos">Regras por pontuação da aldeia</option></select><div id="rh-opts-sequencial" class="rh-hide"><div class="rh-row"><div><span class="rh-label">Início</span><input type="number" id="rh-seq-inicio" value="1" min="0"></div><div><span class="rh-label">Dígitos</span><input type="number" id="rh-seq-digitos" value="3" min="1" max="6"></div></div></div><div id="rh-opts-lote" class="rh-hide"><span class="rh-label">Aldeias por lote</span><input type="number" id="rh-lote-tam" value="20" min="1"></div><div id="rh-opts-pontos" class="rh-hide"><span class="rh-label">Regras (pontos mín / máx / nome)</span><div id="rh-rules"></div><button id="rh-add-rule" class="rh-btn-secondary rh-btn-mini" type="button">+ adicionar regra</button><label class="rh-check" style="margin-top:6px;"><input type="checkbox" id="rh-pontos-numerar"> Numerar sequencialmente dentro de cada regra</label><span class="rh-label">Nome p/ aldeias fora das regras (deixe vazio p/ pular)</span><input type="text" id="rh-pontos-fallback" placeholder="opcional"></div></div><div class="rh-section"><span class="rh-label">Filtro de aldeias na tela</span><select id="rh-filtro-tipo"><option value="todas">Todas as linhas visíveis nesta aba</option><option value="barbaras">Só aldeias de bárbaros</option><option value="minhas">Só minhas aldeias (com nome de jogador)</option></select><span class="rh-label">Intervalo entre aldeias (ms)</span><input type="number" id="rh-delay" value="800" min="150" step="50"></div><div id="rh-actions"><button id="rh-diag" class="rh-btn-secondary">Diagnosticar</button><button id="rh-diag2" class="rh-btn-secondary">Diagnosticar clique</button><button id="rh-test" class="rh-btn-secondary">Testar 1 aldeia</button><button id="rh-start" class="rh-btn-primary">Iniciar</button><button id="rh-pause" class="rh-btn-secondary" disabled>Pausar</button><button id="rh-stop" class="rh-btn-danger" disabled>Parar</button></div><div id="rh-progress-wrap"><div id="rh-progress-bar"></div></div><div id="rh-status">Pronto.</div><textarea id="rh-diag-area" class="rh-hide" rows="6" readonly style="width:100%;box-sizing:border-box;background:#0d0d0d;color:#8fdc7a;font-family:Consolas,monospace;font-size:10px;border:1px solid #333;border-radius:5px;margin-bottom:6px;padding:5px;"></textarea><div id="rh-log"></div></div></div>'),e=document.getElementById("rh-popup"),o=document.getElementById("rh-header"),r=!1,a=0,t=0,o.addEventListener("mousedown",function(o){r=!0;var n=e.getBoundingClientRect();a=o.clientX-n.left,t=o.clientY-n.top,e.style.transform="none",e.style.left=n.left+"px",e.style.top=n.top+"px"}),document.addEventListener("mousemove",function(o){r&&(e.style.left=o.clientX-a+"px",e.style.top=o.clientY-t+"px")}),document.addEventListener("mouseup",function(){r=!1}),l(0,999,"BARBARA PEQUENA"),l(1e3,999999,"BARBARA GRANDE"),$("#rh-add-rule").on("click",function(){l()}),$("#rh-modo").on("change",s),s();var n={rodando:!1,pausado:!1,parar:!1,fila:[],indice:0,ok:0,erro:0,pulados:0},i=null;$("#rh-diag").on("click",function(){var e=h("todas");if(e.length){for(var o=Math.min(2,e.length),r=[],a=0;a<o;a++)r.push("----- LINHA "+(a+1)+" -----\n"+e[a].row.outerHTML);var t=r.join("\n\n");$("#rh-diag-area").removeClass("rh-hide").val(t),$("#rh-diag-area")[0].select();try{document.execCommand("copy"),d("HTML copiado para a área de transferência (e visível na caixa acima). Cole e me envie.","ok")}catch(e){d("Não deu pra copiar automático. Selecione o texto da caixa acima e copie manualmente (Ctrl+C).","info")}}else d("Nenhuma aldeia encontrada para diagnóstico.","err")}),$("#rh-diag2").on("click",function(){var e=h("todas");if(e.length){var o=e[0].row,r=f(o);r?(r.click(),setTimeout(function(){var e="----- LINHA APÓS CLICAR NO ÍCONE -----\n"+o.outerHTML;$("#rh-diag-area").removeClass("rh-hide").val(e),$("#rh-diag-area")[0].select();try{document.execCommand("copy"),d("HTML pós-clique copiado. Cole e me envie.","ok")}catch(e){d("Selecione o texto da caixa acima e copie manualmente (Ctrl+C).","info")}},600)):d("Ícone de edição não encontrado nesta linha.","err")}else d("Nenhuma aldeia encontrada para diagnóstico.","err")}),$("#rh-test").on("click",function(){var e=w(i=m(),!0);e.length&&(d("Testando em 1 aldeia...","info"),v(e[0].item,e[0].novoNome,function(o,r){o?d('Teste OK: "'+e[0].item.nomeAtual+'" -> "'+e[0].novoNome+'"',"ok"):d("Teste falhou: "+r,"err")}))}),$("#rh-start").on("click",function(){var e=w(i=m(),!1);e.length&&(n={rodando:!0,pausado:!1,parar:!1,fila:e,indice:0,ok:0,erro:0,pulados:0},$("#rh-log").empty(),d("Iniciando renomeação de "+e.length+" aldeia(s)...","info"),$("#rh-start").prop("disabled",!0),$("#rh-pause").prop("disabled",!1),$("#rh-stop").prop("disabled",!1),y())}),$("#rh-pause").on("click",function(){n.pausado=!n.pausado,$(this).text(n.pausado?"Continuar":"Pausar"),p(n.pausado?"Pausado.":"Retomando...")}),$("#rh-stop").on("click",function(){n.parar=!0}),$("#rh-close").on("click",function(){$("#rh-popup").remove(),$("#rh-style").remove()}),p('Configure as opções e clique em "Testar 1 aldeia" antes de rodar em todas.')}else alert("jQuery não encontrado nesta página. Abra o script estando dentro do jogo (game.php).");function l(e,o,r){var a="r"+Math.random().toString(36).slice(2,8),t=$('<div class="rh-rule-row" data-id="'+a+'"><input type="number" class="rh-rule-min" placeholder="mín" value="'+(null!=e?e:"")+'"><input type="number" class="rh-rule-max" placeholder="máx" value="'+(null!=o?o:"")+'"><input type="text" class="rh-rule-nome" placeholder="nome desta faixa" value="'+(r||"")+'"><button type="button" class="rh-rule-del">×</button></div>');t.find(".rh-rule-del").on("click",function(){t.remove()}),$("#rh-rules").append(t)}function s(){var e=$("#rh-modo").val();$("#rh-opts-sequencial, #rh-opts-lote, #rh-opts-pontos").addClass("rh-hide"),"sequencial"===e&&$("#rh-opts-sequencial").removeClass("rh-hide"),"lote"===e&&$("#rh-opts-lote").removeClass("rh-hide"),"pontos"===e&&$("#rh-opts-pontos").removeClass("rh-hide")}function d(e,o){var r=$('<div class="'+("ok"===o?"rh-log-ok":"err"===o?"rh-log-err":"rh-log-info")+'"></div>').text(e);$("#rh-log").append(r),$("#rh-log").scrollTop($("#rh-log")[0].scrollHeight)}function p(e){$("#rh-status").text(e)}function c(e){$("#rh-progress-bar").css("width",Math.max(0,Math.min(100,e))+"%")}function u(e){var o=e.closest("table");if(!o)return null;if(void 0===o.__rhPontosIdx){var r=o.querySelectorAll("thead th");r.length||(r=o.querySelectorAll("tr:first-child th"));var a=-1;r.forEach(function(e,o){/pontos/i.test(e.textContent)&&(a=o)}),o.__rhPontosIdx=a}if((a=o.__rhPontosIdx)<0)return null;var t=e.querySelectorAll("td");if(!t[a])return null;var n=t[a].textContent.replace(/\./g,"").replace(/[^\d]/g,"");return n?parseInt(n,10):null}function h(e){var o=[],r={};return document.querySelectorAll('a[href*="village="]').forEach(function(a){var t=a.closest("tr");if(t&&(!t.id||0!==t.id.indexOf("menu_row"))&&t.querySelector(".quickedit-vn, .rename-icon")){var n=t.textContent.match(/\((\d{1,3})\|(\d{1,3})\)/);if(n){var i=a.getAttribute("href").match(/village=(\d+)/);if(i){var l=i[1];if(!r[l]){r[l]=!0;var s,d=parseInt(n[1],10),p=parseInt(n[2],10),c=t.textContent.match(/K(\d{2,3})\b/),h=c?c[1]:String(Math.floor(p/100))+String(Math.floor(d/100)),m=t.querySelector(".quickedit-label");s=m?m.textContent.replace(/\(\d{1,3}\|\d{1,3}\)\s*K?\d{0,3}\s*$/,"").trim():a.textContent.replace(/\(\d{1,3}\|\d{1,3}\)\s*K?\d{0,3}\s*$/,"").trim();var f=/árbaro|barbar/i.test(s);("barbaras"!==e||f)&&("minhas"===e&&f||o.push({id:l,row:t,link:a,x:d,y:p,continente:h,pontos:u(t),nomeAtual:s}))}}}}}),o}function m(){var e=[];return $("#rh-rules .rh-rule-row").each(function(){var o=$(this),r=parseFloat(o.find(".rh-rule-min").val()),a=parseFloat(o.find(".rh-rule-max").val()),t=o.find(".rh-rule-nome").val().trim();""===t||isNaN(r)||isNaN(a)||e.push({min:r,max:a,nome:t})}),{nomeBase:$("#rh-nomebase").val().trim()||"ALDEIA",modo:$("#rh-modo").val(),pularIguais:$("#rh-pular-iguais").is(":checked"),seqInicio:parseInt($("#rh-seq-inicio").val(),10)||0,seqDigitos:parseInt($("#rh-seq-digitos").val(),10)||3,loteTam:parseInt($("#rh-lote-tam").val(),10)||20,regrasPontos:e,pontosNumerar:$("#rh-pontos-numerar").is(":checked"),pontosFallback:$("#rh-pontos-fallback").val().trim(),filtroTipo:$("#rh-filtro-tipo").val(),delay:Math.max(150,parseInt($("#rh-delay").val(),10)||800)}}function f(e){return e.querySelector("a.rename-icon")}function b(e){var o=e.querySelectorAll(".quickedit-edit");return o.length?o[o.length-1].querySelector('input[type="text"]'):null}function g(e,o,r){var a=b(e);a?r(a):o<=0?r(null):setTimeout(function(){g(e,o-1,r)},150)}function v(e,o,r){var a=e.row,t=b(a);if(!t){var n=f(a);return n?(n.click(),void g(a,12,function(e){e?x(e,o,r):r(!1,"campo de edição não apareceu após clicar no ícone")})):void r(!1,"ícone de edição não encontrado nesta linha")}x(t,o,r)}function x(e,o,r){e.value=o,$(e).trigger("input").trigger("change");var a=e.closest(".quickedit-edit"),t=a?a.querySelector('input.btn, input[type="button"]'):null;t?(t.click(),setTimeout(function(){r(!0,"renomeada")},150)):r(!1,"botão de confirmar (Renomear) não encontrado")}function y(){if(n.parar)k("Parado pelo usuário.");else if(n.pausado)setTimeout(y,300);else{if(!(n.indice>=n.fila.length)){var e=n.fila[n.indice];return c(n.indice/n.fila.length*100),p("Processando "+(n.indice+1)+"/"+n.fila.length+"  (OK: "+n.ok+" | Erros: "+n.erro+" | Pulados: "+n.pulados+")"),null===e.novoNome?(n.pulados++,d("— pulada (fora das regras): "+e.item.nomeAtual,"info"),n.indice++,void setTimeout(y,40)):i.pularIguais&&e.item.nomeAtual===e.novoNome?(n.pulados++,d("— já está com o nome certo: "+e.novoNome,"info"),n.indice++,void setTimeout(y,40)):void v(e.item,e.novoNome,function(o,r){o?(n.ok++,d("OK ("+e.item.x+"|"+e.item.y+'): "'+e.item.nomeAtual+'" -> "'+e.novoNome+'"',"ok")):(n.erro++,d("ERRO ("+e.item.x+"|"+e.item.y+"): "+r,"err")),n.indice++,setTimeout(y,i.delay)})}k("Concluído.")}}function k(e){n.rodando=!1,c(100),p(e+"  (OK: "+n.ok+" | Erros: "+n.erro+" | Pulados: "+n.pulados+")"),$("#rh-start").prop("disabled",!1).text("Iniciar"),$("#rh-pause").prop("disabled",!0).text("Pausar"),$("#rh-stop").prop("disabled",!0)}function w(e,o){var r=h(e.filtroTipo);if(!r.length)return d("Nenhuma aldeia encontrada nesta tabela.","err"),[];var a={},t=[];return r.forEach(function(o,r){var n=function(e,o,r,a){switch(r.modo){case"unico":return r.nomeBase;case"continente":return r.nomeBase+" K"+e.continente;case"sequencial":for(var t=r.seqInicio+o,n=String(t);n.length<r.seqDigitos;)n="0"+n;return r.nomeBase+" "+n;case"lote":var i=Math.floor(o/r.loteTam)+1;return r.nomeBase+" - Lote "+i;case"pontos":for(var l=null,s=0;s<r.regrasPontos.length;s++){var d=r.regrasPontos[s];if(null!=e.pontos&&e.pontos>=d.min&&e.pontos<=d.max){l=d;break}}if(!l)return r.pontosFallback||null;if(r.pontosNumerar){a[l.nome]=(a[l.nome]||0)+1;for(var p=String(a[l.nome]);p.length<r.seqDigitos;)p="0"+p;return l.nome+" "+p}return l.nome}return r.nomeBase}(o,r,e,a);t.push({item:o,novoNome:n})}),o&&(t=t.slice(0,1)),t}}();
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
    } catch (e) {}
  }
  function clicarCunhar() {
    try {
      var selectCoins = document.querySelector('select.select_coins');
      if (selectCoins) {
        var anchor = document.getElementById('select_anchor_top');
        if (anchor) anchor.click();
        var botao = document.querySelector('#coin_overview_table .mint_multi_button');
        if (botao) botao.click();
      }
    } catch (e) { console.error('[OROCHIKING] erro ao cunhar', e); }
  }
  function agendarProximoCicloCunhar(intervaloMs) {
    if (cunharTimeoutId) clearTimeout(cunharTimeoutId);
    // Atraso extra aleatório (10 a 15s) em cima do intervalo configurado, pra não
    // recarregar sempre no mesmo timing exato — evita um padrão robótico reconhecível.
    var jitterMs = 10000 + Math.random() * 5000;
    cunharTimeoutId = setTimeout(function () {
      var cfgAtual = lerConfigCunhar();
      if (cfgAtual.ativo) { window.location.reload(); }
    }, intervaloMs + jitterMs);
  }
  function mostrarStatusCunhar(cfg) {
    if (document.getElementById('ork-cunhar-status')) return;
    var caixa = document.createElement('div');
    caixa.id = 'ork-cunhar-status';
    caixa.style.cssText = 'position:fixed;bottom:20px;left:20px;background:linear-gradient(165deg,rgba(26,26,26,.97),rgba(8,8,8,.98));' +
      'border:1px solid #3a3a3a;border-radius:14px;padding:12px 16px;z-index:9999996;width:210px;' +
      'font-family:Verdana,Arial,sans-serif;color:#eee;box-shadow:0 14px 34px rgba(0,0,0,.75);font-size:11.5px';
    caixa.innerHTML =
      '<div style="font-weight:800;color:#ffd84d;margin-bottom:6px">🪙 Cunhagem automática ativa</div>' +
      '<div style="color:#9a9a9a;margin-bottom:8px">Atualiza e cunha a cada ' + Math.round(cfg.intervaloMs / 1000) + 's</div>' +
      '<button id="ork-cunhar-parar" style="width:100%;background:#7a1f1f;color:#fff;border:none;border-radius:7px;' +
        'padding:6px 8px;cursor:pointer;font-weight:800;font-size:11px">Parar</button>';
    document.body.appendChild(caixa);
    document.getElementById('ork-cunhar-parar').addEventListener('click', function () {
      pararCunharPorSeguranca();
    });
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
      clicarCunhar();
      mostrarStatusCunhar({ intervaloMs: intervaloMs });
      agendarProximoCicloCunhar(intervaloMs);
    });
  }
  function checaCunhar() {
    return !!(window.game_data && game_data.screen === 'snob' && game_data.mode === 'coin');
  }
  function rodarCunhar() {
    var cfg = lerConfigCunhar();
    if (cfg.ativo) {
      clicarCunhar();
      mostrarStatusCunhar(cfg);
      agendarProximoCicloCunhar(cfg.intervaloMs);
    } else {
      abrirModalCunhar();
    }
  }

  var FERRAMENTAS = [
    {
      id: 'farmar',
      nome: 'Farm Hard',
      icone: '🌾',
      dica: 'Ativa direto aqui — abre o popup do Farm Hard para configurar e iniciar.',
      checar: checaFarmar,
      rodar: rodarFarmar,
      destino: null
    },
    {
      id: 'farmdormindo',
      nome: 'Farm Dormindo',
      icone: '😴',
      dica: 'Abre o Farm Hard já no modo mais lento (0.5x "Durma em Paz", ~1 ataque a cada 2s) e em 2 grupos — pra reduzir bem o risco de captcha enquanto você não está olhando.',
      checar: checaFarmDormindo,
      rodar: rodarFarmDormindo,
      destino: null
    },
    {
      id: 'ataque',
      nome: 'Ataque Mass',
      icone: '⚔️',
      dica: 'Ao clicar, leva para a tela Combinado; ao chegar, clique em "Ativar agora" pra abrir o planejador.',
      checar: checaAtaque,
      rodar: rodarAtaque,
      destino: 'ataque'
    },
    {
      id: 'rename',
      nome: 'Renomeador Hard',
      icone: '✏️',
      dica: 'Ao clicar, leva para a tela Combinado; ao chegar, clique em "Ativar agora" pra abrir o renomeador.',
      checar: checaRename,
      rodar: rodarRename,
      destino: 'rename'
    },
    {
      id: 'cancelar',
      nome: 'Cancelar Recrutamento',
      icone: '🚫',
      dica: 'Ao clicar, leva para Visão Geral → Produção; ao chegar, clique em "Ativar agora" pra cancelar.',
      checar: checaCancelar,
      rodar: rodarCancelar,
      destino: 'cancelar'
    },
    {
      id: 'defender',
      nome: 'Coletar Operação',
      icone: '🛡️',
      categoria: 'Coleta',
      dica: 'Ao clicar, leva para Comandos → Ataques Recebidos; ao chegar, clique em "Ativar agora" pra coletar.',
      checar: checaDefender,
      rodar: rodarDefender,
      destino: 'defender'
    },
    {
      id: 'barbaras',
      nome: 'Coletar Mapa',
      icone: '🗺️',
      categoria: 'Coleta',
      dica: 'Ao clicar, leva para o Mapa; ao chegar, clique em "Ativar agora" pra abrir o coletor de bárbaras.',
      checar: checaBarbaras,
      rodar: rodarBarbaras,
      destino: 'barbaras'
    },
    {
      id: 'perfil',
      nome: 'Coletar Perfil',
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
      nome: 'Ocultar Perfil',
      icone: '🙈',
      dica: 'Digite o nick do jogador — o painel busca no ranking, abre o perfil e exibe todas as aldeias dele. Depois é só clicar em "Ativar agora".',
      checar: checaOcultar,
      rodar: rodarOcultar,
      destino: null,
      buscaPorNick: true
    },
    {
      id: 'coletorfarm',
      nome: 'Coletor para Farmar',
      icone: '🧺',
      dica: 'Ao clicar, leva para o Mapa; ao chegar, clique em "Ativar agora" pra abrir a lista de bárbaros próximos com os ícones de farm.',
      checar: checaColetorFarm,
      rodar: rodarColetorFarm,
      destino: 'barbaras'
    },
    {
      id: 'cunhar',
      nome: 'Cunhar Moedas',
      icone: '🪙',
      dica: 'Ao clicar, leva pra tela de Cunhagem; ao chegar, clique em "Ativar agora" pra escolher o intervalo e cunhar sozinho, recarregando a página automaticamente.',
      checar: checaCunhar,
      rodar: rodarCunhar,
      destino: 'cunhar'
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
        if (!telaOk) return; // ainda não chegou na tela certa; não faz nada

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
    if (!(window.game_data && game_data.screen === 'snob' && game_data.mode === 'coin')) return;
    var cfg = lerConfigCunhar();
    if (!cfg.ativo) return;
    setTimeout(function () {
      clicarCunhar();
      mostrarStatusCunhar(cfg);
      agendarProximoCicloCunhar(cfg.intervaloMs);
    }, 800);
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
    caixa.style.cssText = 'position:fixed;bottom:20px;right:20px;background:linear-gradient(165deg,rgba(26,26,26,.97),rgba(8,8,8,.98));' +
      'border:1px solid #3a3a3a;border-radius:12px;padding:12px 14px;z-index:9999997;width:220px;' +
      'font-family:Verdana,Arial,sans-serif;color:#eee;box-shadow:0 14px 34px rgba(0,0,0,.75)';
    caixa.innerHTML =
      '<div style="font-weight:800;color:#ffd84d;margin-bottom:8px;font-size:12.5px">' + f.icone + ' ' + f.nome + ' pronto</div>' +
      '<button id="ork-confirmar-btn" style="width:100%;background:linear-gradient(100deg,#e8ac0a,#ffdc63);' +
        'color:#141200;border:none;border-radius:7px;padding:8px 10px;cursor:pointer;font-weight:800;font-size:12px">Ativar agora</button>';
    document.body.appendChild(caixa);
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
  `;
  var styleEl = document.createElement('style');
  styleEl.id = 'ork-style';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ============================================================
     HTML DO PAINEL
  ============================================================ */
  var tabsHtml = FERRAMENTAS.map(function (f) {
    return '<button class="ork-tab" data-id="' + f.id + '">' + f.icone + ' ' + f.nome.split(' ')[0] + '</button>';
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
    '</div>' +
    '<div id="ork-footer">' +
      (window.__ORK_DUPLICADO__ ? '<span style="color:#ff9d5c">⚠ Há outra cópia do painel instalada no Tampermonkey — desative a antiga.</span><br>' : '') +
      (textoLicenca() ? '🔑 ' + textoLicenca() + '<br>' : '') +
      'v29 · Escolha a aba e clique em Ativar — o script já abre no lugar certo.' +
    '</div>';
  document.body.appendChild(painel);

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
