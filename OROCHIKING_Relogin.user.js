// ==UserScript==
// @name         OROCHIKING Relogin (tela de login)
// @namespace    orochiking
// @version      1.3
// @description  Reentra sozinho no mundo quando a Automatização 24/7 do painel OROCHIKING desloga (ou a sessão cai com ela ativa). Não guarda senha.
// @match        https://www.tribalwars.com.br/*
// @match        https://www.tribalwars.com.pt/*
// @match        https://www.guerretribale.fr/*
// @match        https://www.tribalwars.net/*
// @match        https://www.tribalwars.co.uk/*
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/evandrosmagela-tech/planejadorbyorochiking3.9/main/OROCHIKING_Relogin.user.js
// @downloadURL  https://raw.githubusercontent.com/evandrosmagela-tech/planejadorbyorochiking3.9/main/OROCHIKING_Relogin.user.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  if (typeof window.game_data !== 'undefined') { return; } // dentro do jogo não faz nada
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
})();
