/* ==========================================================
   MARÍA · Asistente virtual de Química3D
   Prototipo de interfaz flotante.
   La conexión con IA se añadirá mediante un backend seguro.
========================================================== */

(() => {
  "use strict";

  if (document.getElementById("maria-widget-root")) return;

  const BASE = "/quimica3D/";
  const root = document.createElement("div");
  root.id = "maria-widget-root";
  root.innerHTML = `
    <style>
      #maria-widget-root { font-family: Inter, Arial, sans-serif; }
      #maria-launcher {
        position: fixed; right: 22px; bottom: 20px; z-index: 9998;
        width: 104px; height: 116px; border: 0; padding: 0;
        background: transparent; cursor: pointer;
        display: flex; flex-direction: column; align-items: center;
        filter: drop-shadow(0 5px 12px rgba(20,40,70,.18));
        transition: transform .2s ease;
      }
      #maria-launcher:hover { transform: translateY(-4px); }
      #maria-launcher img { width: 82px; height: 82px; object-fit: contain; }
      #maria-launcher span {
        margin-top: -2px; padding: 4px 13px; border-radius: 20px;
        background: #2E5EAA; color: white; font-size: 13px;
        font-weight: 600; box-shadow: 0 3px 10px rgba(30,60,110,.2);
      }
      #maria-panel {
        position: fixed; right: 22px; bottom: 145px; z-index: 9999;
        width: min(390px, calc(100vw - 28px)); height: min(590px, calc(100vh - 180px));
        display: none; flex-direction: column; overflow: hidden;
        background: #fff; border: 1px solid #e6ebf3; border-radius: 20px;
        box-shadow: 0 18px 55px rgba(20,40,70,.2);
      }
      #maria-panel.maria-open { display: flex; animation: maria-in .18s ease-out; }
      @keyframes maria-in { from { opacity:0; transform:translateY(10px); } to {opacity:1; transform:translateY(0);} }
      .maria-head {
        display:flex; align-items:center; gap:12px; padding:13px 15px;
        background:#f5f8fd; border-bottom:1px solid #e8edf5;
      }
      .maria-head img { width:54px; height:54px; object-fit:contain; }
      .maria-head-copy { flex:1; min-width:0; }
      .maria-head-copy strong { display:block; color:#263b5c; font-size:16px; }
      .maria-head-copy small { color:#6e7d92; font-size:11px; }
      #maria-close {
        border:0; background:transparent; color:#64748b; font-size:25px;
        cursor:pointer; padding:3px 7px; line-height:1;
      }
      .maria-quote {
        padding:10px 16px; color:#52647d; background:#fff;
        font-size:11px; line-height:1.45; border-bottom:1px solid #eef1f6;
      }
      .maria-messages {
        flex:1; overflow-y:auto; padding:15px; background:#fbfcfe;
        display:flex; flex-direction:column; gap:11px;
      }
      .maria-message {
        max-width:91%; padding:11px 13px; border-radius:14px;
        font-size:13px; line-height:1.5; white-space:pre-wrap;
      }
      .maria-message.bot { align-self:flex-start; background:#eef3fb; color:#30435f; border-bottom-left-radius:4px; }
      .maria-message.user { align-self:flex-end; background:#2E5EAA; color:#fff; border-bottom-right-radius:4px; }
      .maria-tools { display:flex; flex-wrap:wrap; gap:6px; padding:10px 12px 4px; background:#fff; }
      .maria-tools button {
        border:1px solid #dce5f2; border-radius:18px; padding:6px 9px;
        color:#315b91; background:#fff; font-size:11px; cursor:pointer;
      }
      .maria-tools button:hover { background:#f1f5fb; }
      .maria-compose { display:flex; gap:8px; padding:10px 12px 13px; background:#fff; border-top:1px solid #edf0f5; }
      #maria-input {
        min-width:0; flex:1; resize:none; height:42px; max-height:90px;
        border:1px solid #dce3ed; border-radius:12px; padding:10px 11px;
        font:13px Inter,Arial,sans-serif; outline:none;
      }
      #maria-input:focus { border-color:#2E5EAA; box-shadow:0 0 0 3px rgba(46,94,170,.1); }
      #maria-send {
        border:0; border-radius:12px; width:43px; color:#fff;
        background:#2E5EAA; font-size:18px; cursor:pointer;
      }
      .maria-foot { padding:0 12px 10px; color:#8994a5; font-size:10px; text-align:center; background:#fff; }
      @media (max-width:480px) {
        #maria-launcher { right:10px; bottom:10px; transform:scale(.88); transform-origin:bottom right; }
        #maria-panel { right:8px; bottom:112px; width:calc(100vw - 16px); height:min(590px, calc(100vh - 130px)); }
      }
    </style>

    <button id="maria-launcher" type="button" aria-label="Abrir el asistente María" aria-expanded="false">
      <img src="${BASE}img/maria.png" alt="María, asistente virtual de Química3D">
      <span>¿Hablamos?</span>
    </button>

    <section id="maria-panel" role="dialog" aria-label="Chat con María" aria-modal="false">
      <header class="maria-head">
        <img src="${BASE}img/maria.png" alt="">
        <div class="maria-head-copy">
          <strong>María</strong>
          <small>Asistente virtual · Química3D</small>
        </div>
        <button id="maria-close" type="button" aria-label="Cerrar">×</button>
      </header>
      <div class="maria-quote">«Nada en la vida debe ser temido, solo debe ser entendido. Ahora es el momento de comprender más, para poder temer menos».</div>
      <div class="maria-messages" id="maria-messages" aria-live="polite">
        <div class="maria-message bot">¡Hola! Soy María, tu ayudante de Química. 🔬\n\nPuedo ayudarte a comprender conceptos, resolver ejercicios paso a paso y preparar la PAU. ¿Qué investigamos hoy?</div>
      </div>
      <div class="maria-tools" aria-label="Accesos rápidos">
        <button type="button" data-prompt="Explícame este concepto paso a paso: ">Explícame</button>
        <button type="button" data-prompt="Dame una pista para resolver este ejercicio sin darme la solución: ">Dame una pista</button>
        <button type="button" data-prompt="Ponme a prueba con una pregunta de Química de Bachillerato.">Ponme a prueba</button>
        <button type="button" data-prompt="Quiero practicar un ejercicio de nivel PAU sobre: ">Modo PAU</button>
      </div>
      <form class="maria-compose" id="maria-form">
        <textarea id="maria-input" placeholder="Escribe tu pregunta..." aria-label="Escribe tu pregunta"></textarea>
        <button id="maria-send" type="submit" aria-label="Enviar">➤</button>
      </form>
      <div class="maria-foot">Prototipo de interfaz · Conexión inteligente pendiente</div>
    </section>
  `;
  document.body.appendChild(root);

  const launcher = root.querySelector("#maria-launcher");
  const panel = root.querySelector("#maria-panel");
  const close = root.querySelector("#maria-close");
  const input = root.querySelector("#maria-input");
  const messages = root.querySelector("#maria-messages");

  function openPanel() {
    panel.classList.add("maria-open");
    launcher.setAttribute("aria-expanded", "true");
    input.focus();
  }
  function closePanel() {
    panel.classList.remove("maria-open");
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  }
  function addMessage(text, type) {
    const item = document.createElement("div");
    item.className = `maria-message ${type}`;
    item.textContent = text;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  }

  launcher.addEventListener("click", () => panel.classList.contains("maria-open") ? closePanel() : openPanel());
  close.addEventListener("click", closePanel);

  root.querySelectorAll("[data-prompt]").forEach(button => {
    button.addEventListener("click", () => {
      input.value = button.dataset.prompt;
      input.focus();
    });
  });

  root.querySelector("#maria-form").addEventListener("submit", event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    addMessage(question, "user");
    input.value = "";
    addMessage("¡Buena pregunta! Mi conexión con la inteligencia artificial todavía está pendiente. En la siguiente fase conectaré con el asistente de Química3D para responderte con explicaciones rigurosas y adaptadas a Bachillerato y PAU.", "bot");
  });
})();
