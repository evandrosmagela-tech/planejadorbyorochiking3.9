// ==UserScript==
// @name         OROCHIKING Relogin (tela de login)
// @namespace    orochiking
// @version      1.4
// @description  Reentra sozinho no mundo quando a Automatização 24/7 do painel OROCHIKING desloga (ou a sessão cai com ela ativa). Funciona também com a aba minimizada / em segundo plano. Não guarda senha.
// @match        https://www.tribalwars.com.br/*
// @match        https://www.tribalwars.com.pt/*
// @match        https://www.guerretribale.fr/*
// @match        https://www.tribalwars.net/*
// @match        https://www.tribalwars.co.uk/*
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/evandrosmagela-tech/planejadorbyorochiking3.9/main/OROCHIKING_Relogin.user.js
// @downloadURL  https://raw.githubusercontent.com/evandrosmagela-tech/planejadorbyorochiking3.9/main/OROCHIKING_Relogin.user.js
// @grant        none
// ==/UserScript==

/*
  v1.4 — por que não relogava com a aba minimizada / em segundo plano:
  1) Com a aba escondida o Chrome segura os timers (setTimeout) da página e
     PARA de vez as animações (requestAnimationFrame). A tela de login do jogo
     usa animação/transição pra fazer o login e mostrar a lista de mundos, então
     o clique acontecia mas a página "congelava" no meio e nunca entrava.
  2) Não havia plano B: se o clique não levasse a lugar nenhum, ficava parado ali.
  Correções:
  - Timer próprio rodando num Worker (o Chrome não segura timers de Worker como
    segura os da página) + dispara também quando a aba volta a ficar visível.
  - Enquanto a aba está escondida, as animações da tela de login viram timers
    comuns (a página não congela mais no meio do login).
  - Vigia: se 20–30s depois do clique ainda estamos na tela de login, tenta o
    próximo caminho (enviar o formulário direto → /page/play/mundo → /page/join/mundo).
*/
(function () {
  'use strict';

  function lerCookie(n) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + n + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }
  var mundo = (lerCookie('ork_relogin') || lerCookie('ork_auto247_mundo')).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!mundo) { return; } // logout manual sem a 24/7 = não faz nada
  if (window.__ORK_RELOGIN_AGENDADO__) { return; }
  window.__ORK_RELOGIN_AGENDADO__ = true;

  /* ---------- 1) animações não congelam com a aba escondida ---------- */
  try {
    var rafOriginal = window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : null;
    var cafOriginal = window.cancelAnimationFrame ? window.cancelAnimationFrame.bind(window) : null;
    if (rafOriginal) {
      window.requestAnimationFrame = function (cb) {
        if (!document.hidden) { return rafOriginal(cb); }
        return -setTimeout(function () { cb(performance.now()); }, 16); // id negativo = veio do setTimeout
      };
      window.cancelAnimationFrame = function (id) {
        if (id < 0) { clearTimeout(-id); } else if (cafOriginal) { cafOriginal(id); }
      };
    }
  } catch (e) {}

  /* ---------- 2) timer que não é segurado em segundo plano ---------- */
  var worker = null, chamadas = {}, seq = 0;
  try {
    var src = 'onmessage=function(e){setTimeout(function(){postMessage(e.data.id)},e.data.ms)}';
    var url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
    worker = new Worker(url);
    worker.onmessage = function (e) { var f = chamadas[e.data]; delete chamadas[e.data]; if (f) { f(); } };
  } catch (e) { worker = null; } // se o site bloquear Worker, cai no setTimeout normal
  function esperar(ms, fn) {
    var id = ++seq, feito = false;
    function uma() { if (feito) { return; } feito = true; delete chamadas[id]; fn(); }
    chamadas[id] = uma;
    if (worker) { try { worker.postMessage({ id: id, ms: ms }); } catch (e) {} }
    setTimeout(uma, ms); // reserva: o que chegar primeiro vale
    return uma;
  }

  // casa o mundo EXATO: br14 não pode casar com br144, brc1 não casa com brc12
  var reMundo = new RegExp('/page/(join|play)/' + mundo + '(?![a-z0-9])');
  var reMundoSolto = new RegExp('(^|[^a-z0-9])' + mundo + '(?![a-z0-9])');
  var LIMITE = 4; // no máximo 4 tentativas (carregamentos desta tela) a cada 10 minutos nesta aba

  function lerHist() {
    try { return JSON.parse(sessionStorage.getItem('ork_relogin_tentativas') || '[]').filter(function (t) { return Date.now() - t < 600000; }); }
    catch (e) { return []; }
  }
  if (lerHist().length >= LIMITE) { console.warn('[OROCHIKING] Relogin: ' + LIMITE + ' tentativas em 10 min, parei pra não entrar em loop.'); return; }

  function visivel(el) {
    if (!el) { return false; }
    if (el.offsetParent !== null) { return true; }
    try { var cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.position === 'fixed'; } catch (e) { return false; }
  }
  function enviarForm(form, botao) {
    try { if (form.requestSubmit) { form.requestSubmit(botao && botao.form === form && botao.type === 'submit' ? botao : undefined); return; } } catch (e) {}
    try { form.submit(); } catch (e) {}
  }
  function irPara(caminho) {
    console.log('[OROCHIKING] Relogin: abrindo ' + caminho);
    window.location.href = caminho;
  }

  // Cada "passo" é um jeito de entrar. Se um não levar a lugar nenhum,
  // o vigia chama o próximo.
  var passo = 0;
  function tentar() {
    var caminho = window.location.pathname;
    var naPaginaDoMundo = reMundo.test(caminho);
    passo++;

    if (passo === 1) {
      // A) já estamos na página de entrada do mundo (ex: /page/join/brs1): clica em entrar/jogar
      if (naPaginaDoMundo) {
        var cands = document.querySelectorAll('button, input[type="submit"], a.btn, a.button, a[href], .btn');
        for (var k = 0; k < cands.length; k++) {
          var el = cands[k];
          if (!visivel(el)) { continue; }
          var txt = ((el.textContent || '') + ' ' + (el.value || '')).trim().toLowerCase();
          var href = el.getAttribute('href') || '';
          if (href && href.indexOf(caminho) !== -1) { continue; } // link pra própria página
          var botaoEntrar = el.tagName !== 'A' || /btn|button/.test(el.className || '');
          if ((botaoEntrar && /jogar|entrar|login|play|join|participar|iniciar|jouer|connexion/.test(txt)) || (reMundoSolto.test(href) && href.indexOf('game.php') !== -1)) {
            console.log('[OROCHIKING] Relogin: na página do mundo, clicando em "' + txt.slice(0, 30) + '".');
            if (el.tagName === 'A' && href && href.charAt(0) !== '#' && !/^javascript:/i.test(href)) { irPara(href); } else { el.click(); }
            return true;
          }
        }
      } else {
        // B) botão/link do mundo na lista (já logado no site): vai direto pelo endereço do link
        var links = document.querySelectorAll('a[href]');
        for (var i = 0; i < links.length; i++) {
          var h = links[i].getAttribute('href') || '';
          if (reMundo.test(h)) { console.log('[OROCHIKING] Relogin: entrando em ' + mundo + ' pelo botão do mundo.'); irPara(h); return true; }
        }
      }
      // C) formulário de login com senha salva do navegador: clica em Entrar
      var senha = document.querySelector('input[type="password"]');
      var entrar = senha && senha.form ? senha.form.querySelector('[type="submit"], a.btn-login, .btn-login') : null;
      if (senha && entrar) { console.log('[OROCHIKING] Relogin: clicando em Entrar (senha salva do navegador).'); entrar.click(); return true; }
      passo++; // nada pra clicar: pula direto pro endereço do mundo
    }
    if (passo === 2) {
      // plano B: o clique não andou (página travada) → envia o formulário de login direto
      var s2 = document.querySelector('input[type="password"]');
      if (s2 && s2.form && s2.value) {
        console.log('[OROCHIKING] Relogin: o clique não andou, enviando o formulário de login direto.');
        enviarForm(s2.form, s2.form.querySelector('[type="submit"]'));
        return true;
      }
      passo++;
    }
    if (passo === 3) { irPara('/page/play/' + mundo); return true; } // entra direto se o site ainda está logado
    if (passo === 4) { irPara('/page/join/' + mundo); return true; } // formato confirmado no Speed: /page/join/brs1
    console.warn('[OROCHIKING] Relogin: tentei todos os caminhos e continuo em ' + caminho + '. Manda um print desta tela.');
    return false;
  }

  function vigiar() {
    var ondeEstava = window.location.href;
    esperar(20000 + Math.floor(Math.random() * 10001), function () {
      if (window.location.href !== ondeEstava) { return; } // a página já mudou (ou está mudando)
      if (typeof window.game_data !== 'undefined') { return; }
      if (tentar()) { vigiar(); }
    });
  }

  var comecou = false;
  function comecar() {
    if (comecou) { return; }
    if (typeof window.game_data !== 'undefined') { return; } // dentro do jogo não faz nada
    var hist = lerHist();
    if (hist.length >= LIMITE) { return; }
    comecou = true;
    hist.push(Date.now());
    try { sessionStorage.setItem('ork_relogin_tentativas', JSON.stringify(hist)); } catch (e) {}
    if (tentar()) { vigiar(); }
  }

  function agendarInicio() {
    if (typeof window.game_data !== 'undefined') { return; }
    // aba escondida: ninguém está olhando, espera menos; visível: 3–6s como antes
    var ms = document.hidden ? 1500 + Math.floor(Math.random() * 1501) : 3000 + Math.floor(Math.random() * 3001);
    var disparar = esperar(ms, comecar);
    // se a aba voltar a ficar visível antes, não precisa esperar o timer
    document.addEventListener('visibilitychange', function () { if (!document.hidden) { esperar(800, disparar); } });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', agendarInicio, { once: true });
  } else {
    agendarInicio();
  }
})();
