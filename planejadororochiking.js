(function () {
  if (1) {
    // ==========================================================
    //  OROCHIKING 3.9 — Planejador de Ataque em Massa
    // ==========================================================
    //  Liberado só pra alguns nicks (edite a lista abaixo pra
    //  adicionar/remover quem pode usar).
    // ==========================================================
    var allowedNicks = ["- Orochi.2009", "Juniro1717", "Jordy Alba", "Bleda ."];
    var currentNick = window.game_data && game_data.player ? game_data.player.name : null;
    if (!currentNick || allowedNicks.indexOf(currentNick) === -1) {
      alert(
        "Este script não está liberado para o seu nick" +
          (currentNick ? " (" + currentNick + ")" : "") +
          ". Fala com o OrochiKing pra ser adicionado."
      );
      return;
    }

    // ==========================================================
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
          alert(
            "Não consegui carregar /map/village.txt para resolver as coordenadas (status " +
              xhr.status +
              "). Tente novamente."
          );
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
                    throw error;
                  }
                  aldeia.data = tropas;
                  i++;
                } else {
                  removeVillage(aldeia.id);
                  console.log("First Request: " + data.error);
                }
                if (i == aldeias.length) secondRequest();
              },
              error: function (data) {
                progressTick();
                console.log("Error First Request: " + data.status + " {" + data.error + "}");
                if (data.status == 429 || data.status == 405) {
                  removeVillage(aldeia.id);
                  aldeiasAux.push(aldeia);
                  aldeiasLength--;
                } else {
                  alert("Programa caiu, erro inesperado: {" + data.error + "}");
                  throw error;
                }
                if (i == aldeias.length) secondRequest();
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
            if (data.status == 429 || data.status == 405) {
              removeVillage(aldeia.id);
              removeVillageAux(aldeia.id);
              aldeiasAux.push(aldeia);
              aldeiasLength--;
            } else {
              alert("Programa caiu, erro inesperado: {" + data.error + "}");
              throw error;
            }
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

    checkPassComplete = function () {
      if (!allConfirmsDone) return; // ainda tem confirmação em andamento, espera
      if (sendSettledCount < confirmedForSend) return; // ainda faltam envios terminarem
      startCycleCountdown();
      if (!aldeias.length) {
        finishRound();
      } else {
        aldeias = $.merge(aldeias, aldeiasAux);
        aldeiasAux = [];
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
          alert("Sincronizar chegada está marcado, mas nenhum horário foi definido. Ligando o escalonamento padrão.");
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
                } else {
                  console.log("Second Request: " + data.error + " coord: " + aldeia.coord);
                  removeVillage(aldeia.id);
                  aldeiasLength--;
                }
                if (i == aldeias.length) {
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
                if (data.status == 429 || data.status == 405) {
                  removeVillage(aldeia.id);
                  removeVillageAux(aldeia.id);
                  aldeiasAux.push(aldeia);
                  aldeiasLength--;
                } else {
                  alert("Programa caiu, erro inesperado: {" + data.error + "}");
                  throw error;
                }
                if (i == aldeias.length) {
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

      $("#spear").val(getParam("spear"));
      $("#sword").val(getParam("sword"));
      $("#axe").val(getParam("axe"));
      $("#archer").val(getParam("archer"));
      $("#spy").val(getParam("spy"));
      $("#light").val(getParam("light"));
      $("#heavy").val(getParam("heavy"));
      $("#marcher").val(getParam("marcher"));
      $("#ram").val(getParam("ram"));
      $("#catapult").val(getParam("catapult"));
      $("#knight").val(getParam("knight"));
      $("#snob").val(getParam("snob"));

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
                  alert(
                    "Atenção: " +
                      naoEncontradas.length +
                      " coordenada(s) não foram encontradas no mapa e serão ignoradas:\n" +
                      naoEncontradas.join(", ")
                  );
                }
                if (!idString) {
                  alert("Nenhuma das coordenadas informadas foi encontrada no mapa do mundo. Confira se estão certas.");
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
                alert("Erro ao processar coordenadas resolvidas: " + errCb.message);
              }
            });
          } else {
            alert("Nenhuma coordenada válida encontrada na caixa de alvos. Use o formato 555|551.");
          }
        } catch (err) {
          console.error("[AtaqueMass] erro ao iniciar envio:", err);
          alert("Erro ao iniciar envio: " + err.message);
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
          alert("Demolidor concluído! Todos os prédios da lista já receberam uma leva de ataque.");
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
