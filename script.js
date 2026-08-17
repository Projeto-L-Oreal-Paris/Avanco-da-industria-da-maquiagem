// ======================================================
// AURENA - INTRO OTIMIZADA
// Pó quebrando + partículas + som
// ======================================================

// ------------------------------------------------------
// ELEMENTOS
// ------------------------------------------------------

const intro = document.getElementById("intro");

const compact = document.getElementById("compact");

const brandReveal = document.getElementById("brandReveal");

const skipIntro = document.getElementById("skipIntro");

const introHint = document.getElementById("introHint");

const canvas = document.getElementById("powderCanvas");

const ctx = canvas.getContext("2d");

// ------------------------------------------------------
// VARIÁVEIS
// ------------------------------------------------------

let particles = [];

let dustClouds = [];

let animationFrame = null;

let hasBroken = false;

let isLeaving = false;

let audioContext = null;

// ------------------------------------------------------
// PALETA
// ------------------------------------------------------

const powderPalette = [
  "#F3E7D8",

  "#DAB18E",

  "#C78F62",

  "#B8844F",

  "#A65F46",

  "#8E5646",

  "#6F3B46",

  "#4D3028",
];

// ======================================================
// CANVAS
// ======================================================

function resizeCanvas() {
  // Antes estava chegando até 2.
  // Diminuir isso já melhora bastante o desempenho.

  const dpr = Math.min(window.devicePixelRatio || 1, 1.4);

  canvas.width = window.innerWidth * dpr;

  canvas.height = window.innerHeight * dpr;

  canvas.style.width = `${window.innerWidth}px`;

  canvas.style.height = `${window.innerHeight}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

// ======================================================
// PARTÍCULA
// ======================================================

class Particle {
  constructor(x, y, angle, power) {
    this.x = x;

    this.y = y;

    const spread = (Math.random() - 0.5) * 0.8;

    const direction = angle + spread;

    const speed = (2.5 + Math.random() * 7) * power;

    this.vx = Math.cos(direction) * speed;

    this.vy = Math.sin(direction) * speed;

    // tamanho da partícula

    this.size = 0.8 + Math.random() * 3.6;

    // formato definido apenas uma vez
    // antes era recalculado todo frame

    this.stretch = 0.4 + Math.random() * 0.5;

    this.alpha = 0.4 + Math.random() * 0.6;

    this.gravity = 0.015 + Math.random() * 0.035;

    this.drag = 0.975 + Math.random() * 0.015;

    this.rotation = Math.random() * Math.PI;

    this.rotationSpeed = (Math.random() - 0.5) * 0.05;

    this.color =
      powderPalette[Math.floor(Math.random() * powderPalette.length)];

    this.life = 0;

    this.maxLife = 65 + Math.random() * 65;
  }

  update() {
    this.vx *= this.drag;

    this.vy *= this.drag;

    this.vy += this.gravity;

    this.x += this.vx;

    this.y += this.vy;

    this.rotation += this.rotationSpeed;

    this.life++;

    const progress = this.life / this.maxLife;

    this.alpha = Math.max(0, 1 - progress);
  }

  draw() {
    ctx.save();

    ctx.globalAlpha = this.alpha;

    ctx.translate(this.x, this.y);

    ctx.rotate(this.rotation);

    ctx.fillStyle = this.color;

    ctx.beginPath();

    ctx.ellipse(
      0,

      0,

      this.size,

      this.size * this.stretch,

      0,

      0,

      Math.PI * 2,
    );

    ctx.fill();

    ctx.restore();
  }
}

// ======================================================
// NUVEM DE PÓ
// ======================================================

class DustCloud {
  constructor(x, y) {
    this.x = x + (Math.random() - 0.5) * 80;

    this.y = y + (Math.random() - 0.5) * 70;

    this.radius = 20 + Math.random() * 30;

    this.growth = 2 + Math.random() * 2;

    this.alpha = 0.08 + Math.random() * 0.08;

    this.life = 0;

    this.maxLife = 35 + Math.random() * 25;

    this.color =
      powderPalette[Math.floor(Math.random() * powderPalette.length)];
  }

  update() {
    this.radius += this.growth;

    this.alpha *= 0.94;

    this.life++;
  }

  draw() {
    const gradient = ctx.createRadialGradient(
      this.x,

      this.y,

      0,

      this.x,

      this.y,

      this.radius,
    );

    gradient.addColorStop(
      0,

      hexToRgba(this.color, this.alpha),
    );

    gradient.addColorStop(
      1,

      hexToRgba(this.color, 0),
    );

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
      this.x,

      this.y,

      this.radius,

      0,

      Math.PI * 2,
    );

    ctx.fill();
  }
}

// ======================================================
// HEX PARA RGBA
// ======================================================

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");

  const bigint = parseInt(clean, 16);

  const r = (bigint >> 16) & 255;

  const g = (bigint >> 8) & 255;

  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ======================================================
// CRIAR EXPLOSÃO
// ======================================================

function createPowderBurst() {
  const centerX = window.innerWidth / 2;

  const centerY = window.innerHeight / 2;

  // Antes:
  // desktop = 720
  //
  // Agora:
  // desktop = 340
  //
  // Continua bonito, mas muito mais leve.

  const particleAmount = window.innerWidth < 700 ? 220 : 340;

  for (let i = 0; i < particleAmount; i++) {
    const angle = Math.random() * Math.PI * 2;

    const power =
      Math.random() < 0.12
        ? 1.3 + Math.random() * 0.45
        : 0.65 + Math.random() * 0.55;

    particles.push(
      new Particle(
        centerX + (Math.random() - 0.5) * 35,

        centerY + (Math.random() - 0.5) * 35,

        angle,

        power,
      ),
    );
  }

  // Antes eram 24 nuvens.
  // Agora usamos apenas 8.

  for (let i = 0; i < 8; i++) {
    dustClouds.push(new DustCloud(centerX, centerY));
  }

  if (!animationFrame) {
    animateParticles();
  }
}

// ======================================================
// LOOP DA ANIMAÇÃO
// ======================================================

function animateParticles() {
  ctx.clearRect(
    0,

    0,

    window.innerWidth,

    window.innerHeight,
  );

  for (let i = dustClouds.length - 1; i >= 0; i--) {
    const cloud = dustClouds[i];

    cloud.update();

    cloud.draw();

    if (cloud.life >= cloud.maxLife || cloud.alpha < 0.002) {
      dustClouds.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];

    particle.update();

    particle.draw();

    if (particle.life >= particle.maxLife || particle.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  if (particles.length > 0 || dustClouds.length > 0) {
    animationFrame = requestAnimationFrame(animateParticles);
  } else {
    animationFrame = null;

    ctx.clearRect(
      0,

      0,

      window.innerWidth,

      window.innerHeight,
    );
  }
}

// ======================================================
// SOM DE MAQUIAGEM QUEBRANDO
// ======================================================

function createMakeupBreakSound() {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const now = audioContext.currentTime;

    // ------------------------------------------------
    // CRACK
    // ------------------------------------------------

    const crackOscillator = audioContext.createOscillator();

    const crackGain = audioContext.createGain();

    crackOscillator.type = "triangle";

    crackOscillator.frequency.setValueAtTime(170, now);

    crackOscillator.frequency.exponentialRampToValueAtTime(60, now + 0.08);

    crackGain.gain.setValueAtTime(0.18, now);

    crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    crackOscillator.connect(crackGain);

    crackGain.connect(audioContext.destination);

    crackOscillator.start(now);

    crackOscillator.stop(now + 0.1);

    // ------------------------------------------------
    // PÓ / PUFF
    // ------------------------------------------------

    const bufferSize = audioContext.sampleRate * 0.45;

    const buffer = audioContext.createBuffer(
      1,

      bufferSize,

      audioContext.sampleRate,
    );

    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();

    noise.buffer = buffer;

    const filter = audioContext.createBiquadFilter();

    filter.type = "lowpass";

    filter.frequency.value = 1000;

    const noiseGain = audioContext.createGain();

    noiseGain.gain.setValueAtTime(0.12, now);

    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noise.connect(filter);

    filter.connect(noiseGain);

    noiseGain.connect(audioContext.destination);

    noise.start(now);

    noise.stop(now + 0.42);
  } catch (error) {
    console.log("Áudio não disponível neste navegador.");
  }
}

// ======================================================
// QUEBRAR MAQUIAGEM
// ======================================================

function breakMakeup(useSound = false) {
  if (hasBroken) {
    return;
  }

  hasBroken = true;

  introHint.style.opacity = "0";

  // --------------------------------------------
  // RACHADURA
  // --------------------------------------------

  compact.classList.add("is-cracking");

  // --------------------------------------------
  // EXPLOSÃO
  // --------------------------------------------

  setTimeout(
    () => {
      if (useSound) {
        createMakeupBreakSound();
      }

      compact.classList.add("is-broken");

      createPowderBurst();
    },

    220,
  );

  // --------------------------------------------
  // MARCA
  // --------------------------------------------

  setTimeout(
    () => {
      brandReveal.classList.add("is-visible");
    },

    480,
  );

  // --------------------------------------------
  // LIBERA A HOME
  // --------------------------------------------

  setTimeout(
    () => {
      leaveIntro();
    },

    2300,
  );
}

// ======================================================
// SAÍDA
// ======================================================

function leaveIntro() {
  if (isLeaving) {
    return;
  }

  isLeaving = true;

  intro.classList.add("is-leaving");

  document.body.classList.remove("intro-lock");

  setTimeout(
    () => {
      intro.setAttribute("aria-hidden", "true");
    },

    900,
  );
}

// ======================================================
// CLIQUE / TOQUE
// ======================================================

// ======================================================
// INÍCIO AUTOMÁTICO DA INTRO
// ======================================================

// Começa automaticamente após 800ms
const autoStart = setTimeout(() => {
  breakMakeup(false);
}, 800);

// ======================================================
// CLIQUE / TOQUE
// ======================================================

// Se a pessoa clicar antes dos 800ms,
// começa imediatamente e com som
intro.addEventListener("pointerdown", (event) => {
  if (event.target === skipIntro) {
    return;
  }

  clearTimeout(autoStart);

  breakMakeup(true);
});

// ======================================================
// PULAR INTRO
// ======================================================

skipIntro.addEventListener("click", (event) => {
  event.stopPropagation();

  clearTimeout(autoStart);

  hasBroken = true;

  leaveIntro();
});

// ======================================================
// PULAR INTRO
// ======================================================

skipIntro.addEventListener("click", (event) => {
  event.stopPropagation();

  hasBroken = true;

  leaveIntro();
});
// ======================================================
// AURENA — SEÇÃO "O PROBLEMA"
// Versão isolada para não interferir na INTRO
// ======================================================

(() => {
  // ------------------------------------------------------
  // REVEAL NO SCROLL
  // ------------------------------------------------------

  const aurenaProblemElements = document.querySelectorAll(".reveal-problem");

  if ("IntersectionObserver" in window) {
    const aurenaProblemObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.15,
      },
    );

    aurenaProblemElements.forEach((element) => {
      aurenaProblemObserver.observe(element);
    });
  } else {
    // fallback para navegadores antigos

    aurenaProblemElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // ------------------------------------------------------
  // CONTADORES
  // ------------------------------------------------------

  const aurenaProblemCounters = document.querySelectorAll(
    ".problem-section .counter",
  );

  if ("IntersectionObserver" in window) {
    const aurenaCounterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const element = entry.target;

          const target = Number(element.dataset.target || 0);

          const decimals = Number(element.dataset.decimals || 0);

          const duration = 1400;

          const start = performance.now();

          function animateCounter(time) {
            const elapsed = time - start;

            const progress = Math.min(elapsed / duration, 1);

            const eased = 1 - Math.pow(1 - progress, 4);

            const current = target * eased;

            element.textContent = current.toLocaleString("pt-BR", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            });

            if (progress < 1) {
              requestAnimationFrame(animateCounter);
            }
          }

          requestAnimationFrame(animateCounter);

          observer.unobserve(element);
        });
      },
      {
        threshold: 0.35,
      },
    );

    aurenaProblemCounters.forEach((counter) => {
      aurenaCounterObserver.observe(counter);
    });
  }

  // ------------------------------------------------------
  // BARRAS DO IBGE
  // ------------------------------------------------------

  const aurenaPopulationBars = document.querySelectorAll(
    ".problem-section .population-fill",
  );

  if ("IntersectionObserver" in window) {
    const aurenaBarObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const bar = entry.target;

          const width = Number(bar.dataset.width || 0);

          bar.style.width = `${width}%`;

          observer.unobserve(bar);
        });
      },
      {
        threshold: 0.25,
      },
    );

    aurenaPopulationBars.forEach((bar) => {
      aurenaBarObserver.observe(bar);
    });
  } else {
    aurenaPopulationBars.forEach((bar) => {
      bar.style.width = `${Number(bar.dataset.width || 0)}%`;
    });
  }
})();

/* =========================================
   ANIMAÇÃO DOS CARDS DA EQUIPE
   ========================================= */

const teamCards = document.querySelectorAll(".team-card");

const teamObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;

        const index = [...teamCards].indexOf(card);

        setTimeout(() => {
          card.classList.add("team-visible");
        }, index * 100);

        teamObserver.unobserve(card);
      }
    });
  },
  {
    threshold: 0.15,
  },
);

teamCards.forEach((card) => {
  teamObserver.observe(card);
});

// ==================================================
// AURENA — STORYTELLING CENSO → MERCADO
// ==================================================

const aurenaStoryElements = document.querySelectorAll(
  ".aurena-story__intro, " +
    ".aurena-story__video-area, " +
    ".aurena-story__impact, " +
    ".aurena-story__data-intro",
);

// Cria o observador
const aurenaStoryObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // Quando o elemento entra na tela
      if (entry.isIntersecting) {
        entry.target.classList.add("aurena-visible");
      }
    });
  },

  {
    threshold: 0.2,
  },
);

// Observa todos os elementos
aurenaStoryElements.forEach((element) => {
  aurenaStoryObserver.observe(element);
});

/* =====================================================
   VÍDEO - PLAY AO ENTRAR / PAUSE AO SAIR
===================================================== */

const videoEvidencia = document.getElementById("videoEvidencia");

const botaoSom = document.getElementById("videoSom");

if (videoEvidencia) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        /*
                    Quando pelo menos 55%
                    do vídeo estiver visível
                    */

        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          const tentativa = videoEvidencia.play();

          if (tentativa !== undefined) {
            tentativa.catch(() => {
              /*
                                Se o navegador
                                bloquear autoplay,
                                simplesmente não
                                quebramos o site.
                                */
            });
          }
        } else {
          videoEvidencia.pause();
        }
      });
    },

    {
      threshold: [0, 0.25, 0.55, 0.75, 1],
    },
  );

  videoObserver.observe(videoEvidencia);
}

/* =====================================================
   AURENA — ATIVAR / DESATIVAR SOM DO VÍDEO
===================================================== */

if (botaoSom && videoEvidencia) {
  botaoSom.addEventListener("click", () => {
    if (videoEvidencia.muted) {
      videoEvidencia.muted = false;
      videoEvidencia.volume = 1;

      botaoSom.textContent = "DESATIVAR SOM";

      videoEvidencia.play().catch((erro) => {
        console.log("Não foi possível reproduzir o vídeo:", erro);
      });
    } else {
      videoEvidencia.muted = true;

      botaoSom.textContent = "ATIVAR SOM";
    }
  });
}

/* =====================================================
   AURENA — 30 TONS · REVELAÇÃO EM 3 ATOS
===================================================== */

const representationEpic = document.getElementById("representationEpic");

const representationCounter = document.getElementById("representationCounter");

if (representationEpic && representationCounter) {
  let representationPlayed = false;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* =========================================
     ALTERAR CONTADOR
  ========================================= */

  function updateRepresentationCounter(value) {
    representationCounter.textContent = value;

    /*
      Reinicia a animação
      de pulso a cada mudança.
    */

    representationCounter.classList.remove("counter-pulse");

    void representationCounter.offsetWidth;

    representationCounter.classList.add("counter-pulse");
  }

  /* =========================================
     EXECUTAR SEQUÊNCIA
  ========================================= */

  function playRepresentationSequence() {
    /* usuário prefere menos movimento */

    if (reducedMotion) {
      representationEpic.classList.add(
        "is-started",
        "show-01",
        "show-02",
        "show-03",
        "is-complete",
        "show-message",
      );

      representationCounter.textContent = "30";

      return;
    }

    /* TÍTULO */

    representationEpic.classList.add("is-started");

    /* GRUPO 01 — 12 */

    setTimeout(() => {
      representationEpic.classList.add("show-01");

      updateRepresentationCounter(12);
    }, 350);

    /* GRUPO 02 — 24 */

    setTimeout(() => {
      representationEpic.classList.add("show-02");

      updateRepresentationCounter(24);
    }, 850);

    /* GRUPO 03 — 30 */

    setTimeout(() => {
      representationEpic.classList.add("show-03");

      updateRepresentationCounter(30);
    }, 1350);

    /* HALO */

    setTimeout(() => {
      representationEpic.classList.add("is-complete");
    }, 1650);

    /* BRILHO ATRAVESSANDO */

    setTimeout(() => {
      representationEpic.classList.add("show-sweep");
    }, 1800);

    /* FRASE FINAL */

    setTimeout(() => {
      representationEpic.classList.add("show-message");
    }, 2250);
  }

  /* =========================================
     INICIAR QUANDO ENTRAR NA TELA
  ========================================= */

  if ("IntersectionObserver" in window) {
    const representationObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || representationPlayed) {
            return;
          }

          representationPlayed = true;

          playRepresentationSequence();

          observer.unobserve(representationEpic);
        });
      },

      {
        threshold: 0.3,
      },
    );

    representationObserver.observe(representationEpic);
  } else {
    playRepresentationSequence();
  }
}

/* =====================================================
   AURENA — MANIFESTO CINEMATOGRÁFICO
===================================================== */

const manifestoFinal = document.getElementById("manifestoFinal");

if (manifestoFinal) {
  let manifestoHasPlayed = false;

  const reducedMotionManifesto = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function playManifestoCinematic() {
    /* ACESSIBILIDADE */

    if (reducedMotionManifesto) {
      manifestoFinal.classList.add(
        "manifesto-open",
        "manifesto-halo-on",
        "manifesto-number-on",
        "show-act-01",
        "show-act-02",
        "show-act-03",
        "show-act-04",
      );

      return;
    }

    /* =========================================
       0. CORTINA ABRE
    ========================================= */

    manifestoFinal.classList.add("manifesto-open");

    /* =========================================
       1. HALO SURGE
    ========================================= */

    setTimeout(() => {
      manifestoFinal.classList.add("manifesto-halo-on");
    }, 300);

    /* =========================================
       2. PERGUNTA
    ========================================= */

    setTimeout(() => {
      manifestoFinal.classList.add("show-act-01");
    }, 850);

    /* =========================================
       3. 30 GIGANTE
    ========================================= */

    setTimeout(() => {
      manifestoFinal.classList.add("manifesto-number-on");
    }, 1450);

    /* =========================================
       4. NÃO ESTÁ EM UM NÚMERO
    ========================================= */

    setTimeout(() => {
      manifestoFinal.classList.add("show-act-02");
    }, 2200);

    /* =========================================
       5. RESPOSTA FINAL
    ========================================= */

    setTimeout(() => {
      manifestoFinal.classList.add("show-act-03");
    }, 3000);

    /* =========================================
       6. FLASH
    ========================================= */

    setTimeout(() => {
      manifestoFinal.classList.add("manifesto-flash");
    }, 3900);

    /* =========================================
       7. AURENA
    ========================================= */

    setTimeout(() => {
      manifestoFinal.classList.add("show-act-04");
    }, 4200);
  }

  /* =========================================
     DISPARAR AO ENTRAR NA TELA
  ========================================= */

  if ("IntersectionObserver" in window) {
    const manifestoObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || manifestoHasPlayed) {
            return;
          }

          manifestoHasPlayed = true;

          playManifestoCinematic();

          observer.unobserve(manifestoFinal);
        });
      },

      {
        threshold: 0.3,
      },
    );

    manifestoObserver.observe(manifestoFinal);
  } else {
    playManifestoCinematic();
  }
}

// ======================================================
// AURENA — VÍDEO 136 CORES
// REPRODUÇÃO AUTOMÁTICA AO ENTRAR NA TELA
// ======================================================

const videoIbge = document.getElementById("videoIbge");

if (videoIbge) {
  let videoIbgeJaReproduzido = false;

  const observerVideoIbge = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Quando pelo menos 55% do vídeo estiver aparecendo
        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.55 &&
          !videoIbgeJaReproduzido
        ) {
          videoIbgeJaReproduzido = true;

          videoIbge.currentTime = 0;

          videoIbge.play().catch((erro) => {
            console.log(
              "Não foi possível iniciar o vídeo automaticamente:",
              erro,
            );
          });
        }

        // Pausa se sair completamente da tela
        if (!entry.isIntersecting) {
          videoIbge.pause();
        }
      });
    },

    {
      threshold: [0, 0.25, 0.55, 0.75, 1],
    },
  );

  observerVideoIbge.observe(videoIbge);
}
