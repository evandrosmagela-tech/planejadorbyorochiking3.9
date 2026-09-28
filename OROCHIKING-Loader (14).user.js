// ==UserScript==
// @name         OROCHIKING - Painel (Loader + Licença)
// @namespace    orochiking.painel
// @version      26.0
// @description  Valida a licença do jogador (licenses.json no GitHub) e só então carrega o Painel OROCHIKING.
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
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      raw.githubusercontent.com
// @updateURL    https://raw.githubusercontent.com/evandrosmagela-tech/planejadorbyorochiking3.9/refs/heads/main/OROCHIKING-Loader.user.js
// @downloadURL  https://raw.githubusercontent.com/evandrosmagela-tech/planejadorbyorochiking3.9/refs/heads/main/OROCHIKING-Loader.user.js
// ==/UserScript==

(function () {
  'use strict';

  /* ============================================================
     CONFIGURAÇÃO — AJUSTE AQUI
  ============================================================ */
  var CONFIG = {
    // URL "raw" do arquivo de licenças no seu repositório GitHub
    licencasUrl: 'https://raw.githubusercontent.com/evandrosmagela-tech/planejadorbyorochiking3.9/refs/heads/main/licenses.json',
    // URL "raw" do painel (script principal, já editado para checar a licença)
    painelUrl: 'https://raw.githubusercontent.com/evandrosmagela-tech/planejadorbyorochiking3.9/refs/heads/main/planejadororochiking.js'
  };

  /* ============================================================
     UTILIDADES
     Importante: este loader usa GM_xmlhttpRequest, então o
     Tampermonkey roda ele num "sandbox" separado da página. Por
     isso usamos unsafeWindow (a janela REAL do jogo) sempre que
     precisamos ler game_data — o window "normal" aqui dentro pode
     ficar com dados desatualizados/incompletos.
  ============================================================ */
  function nickAtual() {
    try {
      var gd = unsafeWindow.game_data;
      return (gd && gd.player && gd.player.name) ? String(gd.player.name).trim() : '';
    } catch (e) { return ''; }
  }

  function buscarJson(url, callback) {
    var urlComCacheBust = url + (url.indexOf('?') === -1 ? '?' : '&') + 'v=' + Date.now();
    GM_xmlhttpRequest({
      method: 'GET',
      url: urlComCacheBust,
      headers: { 'Cache-Control': 'no-cache' },
      onload: function (res) {
        if (res.status < 200 || res.status >= 300) { callback(null, 'HTTP ' + res.status); return; }
        try {
          callback(JSON.parse(res.responseText), null);
        } catch (e) {
          callback(null, 'JSON inválido: ' + e.message);
        }
      },
      onerror: function () { callback(null, 'Falha de rede ao buscar ' + url); },
      ontimeout: function () { callback(null, 'Timeout ao buscar ' + url); }
    });
  }

  function buscarTexto(url, callback) {
    var urlComCacheBust = url + (url.indexOf('?') === -1 ? '?' : '&') + 'v=' + Date.now();
    GM_xmlhttpRequest({
      method: 'GET',
      url: urlComCacheBust,
      headers: { 'Cache-Control': 'no-cache' },
      onload: function (res) {
        if (res.status < 200 || res.status >= 300) { callback(null, 'HTTP ' + res.status); return; }
        callback(res.responseText, null);
      },
      onerror: function () { callback(null, 'Falha de rede ao buscar ' + url); },
      ontimeout: function () { callback(null, 'Timeout ao buscar ' + url); }
    });
  }

  // Compara "YYYY-MM-DD" com a data de hoje. true = ainda não expirou.
  function dentroDoPrazo(expira) {
    if (!expira) { return true; } // sem data = licença sem validade fixa
    var hoje = new Date();
    var limite = new Date(expira + 'T23:59:59');
    return hoje.getTime() <= limite.getTime();
  }

  /* ============================================================
     VALIDAÇÃO DA LICENÇA
     Formato esperado do licenses.json:
     {
       "nickdojogador": { "status": "ativo", "expira": "2026-12-31", "obs": "opcional" },
       "outronick":     { "status": "bloqueado", "expira": null }
     }
     Chaves de nick são comparadas em minúsculas, sem espaços nas pontas.
  ============================================================ */
  function validarLicenca(callback) {
    var nick = nickAtual();
    if (!nick) { callback({ ok: false, motivo: 'Não foi possível identificar seu nick no jogo (você está logado?).' }); return; }

    buscarJson(CONFIG.licencasUrl, function (licencas, erro) {
      if (erro) {
        callback({ ok: false, motivo: 'Não foi possível checar sua licença agora (' + erro + '). Tente recarregar a página.' });
        return;
      }
      var chave = nick.toLowerCase();
      var entrada = licencas[chave];

      if (!entrada) {
        callback({ ok: false, motivo: 'Nenhuma licença encontrada para o nick "' + nick + '".' });
        return;
      }
      if (String(entrada.status).toLowerCase() !== 'ativo') {
        callback({ ok: false, motivo: 'Sua licença está com status "' + entrada.status + '".' });
        return;
      }
      if (!dentroDoPrazo(entrada.expira)) {
        callback({ ok: false, motivo: 'Sua licença expirou em ' + entrada.expira + '.' });
        return;
      }
      callback({
        ok: true,
        nick: nick,
        expira: entrada.expira || 'sem prazo definido',
        obs: entrada.obs || ''
      });
    });
  }

  /* ============================================================
     AVISO VISUAL DE LICENÇA (bloqueado / expirado / erro)
  ============================================================ */
  function mostrarAvisoLicenca(motivo) {
    if (document.getElementById('ork-licenca-aviso')) return;
    var estilo = document.createElement('style');
    estilo.id = 'ork-licenca-estilo';
    estilo.textContent =
      '#ork-licenca-aviso{position:fixed;bottom:16px;right:16px;max-width:300px;background:linear-gradient(160deg,#181818,#050505);' +
      'border:1px solid #f0b90b;border-radius:12px;box-shadow:0 10px 28px rgba(0,0,0,.7);color:#eee;' +
      'font-family:Verdana,Arial,sans-serif;font-size:12px;padding:14px;z-index:999999;line-height:1.5}' +
      '#ork-licenca-aviso b{color:#ffd84d}' +
      '#ork-licenca-aviso .ork-fechar{float:right;cursor:pointer;color:#888;font-weight:800;margin-left:8px}';
    document.head.appendChild(estilo);
    var box = document.createElement('div');
    box.id = 'ork-licenca-aviso';
    box.innerHTML = '<span class="ork-fechar">&times;</span><b>🔒 OROCHIKING</b><br>' + motivo;
    document.body.appendChild(box);
    box.querySelector('.ork-fechar').addEventListener('click', function () { box.remove(); estilo.remove(); });
  }

  /* ============================================================
     ESPERAR game_data.screen FICAR PRONTO (segurança extra)
  ============================================================ */
  function aguardarScreenPronto(callback, tentativas) {
    tentativas = tentativas || 0;
    try {
      if (unsafeWindow.game_data && unsafeWindow.game_data.screen) { callback(); return; }
    } catch (e) {}
    if (tentativas > 100) { callback(); return; } // ~10s no máximo, segue mesmo assim
    setTimeout(function () { aguardarScreenPronto(callback, tentativas + 1); }, 100);
  }

  /* ============================================================
     INJETAR O PAINEL NA PÁGINA REAL
     Usamos uma tag <script> (em vez de eval) pra o painel rodar no
     contexto de verdade do jogo — com o game_data, o $ (jQuery) e
     tudo mais exatamente como o próprio jogo os vê.
  ============================================================ */
  function injetarPainel(codigo, licencaOk, infoLicenca) {
    unsafeWindow.__ORK_LICENCA_OK__ = !!licencaOk;
    if (licencaOk) {
      unsafeWindow.__ORK_LICENCA_INFO__ = 'Licenciado: ' + infoLicenca.nick + ' — válido até ' + infoLicenca.expira;
      unsafeWindow.__ORK_REVALIDAR_LICENCA__ = function (cb) {
        validarLicenca(function (r) { cb(!!r.ok); });
      };
    }
    try {
      var scriptEl = document.createElement('script');
      scriptEl.id = 'ork-painel-script';
      scriptEl.textContent = codigo;
      document.documentElement.appendChild(scriptEl);
    } catch (e) {
      console.error('[OROCHIKING] Erro ao injetar o painel:', e);
    }
  }

  function carregarEInjetarPainel(licencaOk, infoLicenca) {
    buscarTexto(CONFIG.painelUrl, function (codigo, erro) {
      if (erro) {
        if (licencaOk) { mostrarAvisoLicenca('Licença OK, mas falhou ao carregar o painel (' + erro + ').'); }
        return;
      }
      aguardarScreenPronto(function () {
        injetarPainel(codigo, licencaOk, infoLicenca);
      });
    });
  }

  /* ============================================================
     INÍCIO
     Se ainda não há sessão de jogo (game_data indefinido), a gente
     não sabe o nick — mas injeta o painel mesmo assim, SEM licença
     liberada, porque o próprio painel sabe se recuperar sozinho de
     uma sessão caída (relogin automático) antes de chegar em
     qualquer trava de licença. Assim que estiver logado de novo, a
     página recarrega e o loader roda de novo, validando a licença.
  ============================================================ */
  var gdInicial = null;
  try { gdInicial = unsafeWindow.game_data; } catch (e) {}

  if (!gdInicial) {
    carregarEInjetarPainel(false, null);
    return;
  }

  validarLicenca(function (resultado) {
    if (!resultado.ok) {
      mostrarAvisoLicenca(resultado.motivo);
      // Mesmo sem licença, injeta o painel (ele mesmo vai ficar bloqueado
      // internamente) só pra manter o relogin automático funcionando.
      carregarEInjetarPainel(false, null);
      return;
    }
    carregarEInjetarPainel(true, resultado);
  });

})();
