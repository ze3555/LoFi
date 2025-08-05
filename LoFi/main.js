import { subscribeAuth, login, logout, register, loginAnon } from './js/auth.js';
import { loadFirestoreTapes, getAllTapes, addTape, tapes, deleteTape } from './js/tapes.js';
import { showModal, hideModal } from './js/modal.js';
import { setUserEmail, toggleAdminBadge } from './js/ui.js';

const userEmailSpan        = document.getElementById("user-email");
const logoutBtn            = document.getElementById("logout-btn");
const loginBtn             = document.getElementById("login-btn");
const registerBtn          = document.getElementById("register-btn");
const adminBadge           = document.getElementById("admin-badge");
const tapesContainer       = document.getElementById("tape-row");
const suggestBtn           = document.getElementById("add-tape-btn");
const modal                = document.getElementById("addTapeModal");
const closeModalBtn        = document.getElementById("close-modal");
const submitTape           = document.getElementById("submit-tape");
const tapeTitleInput       = document.getElementById("tapeTitleInput");
const tapeDescriptionInput = document.getElementById("tapeDescriptionInput");
const tapeSpotifyInput     = document.getElementById("tapeSpotifyInput");
const tapeCategorySelect   = document.getElementById("tapeCategorySelect");
const tapeImageSelect      = document.getElementById("tapeImageSelect");
const tapePreview          = document.getElementById("tapePreview");
const cactus               = document.getElementById("pixel-cactus");
const cactusPhrase         = document.getElementById("cactus-phrase");
const cassetteImg          = document.getElementById("cassette-img");
const cassetteDesc         = document.getElementById("cassette-desc");
const cassettePlayer       = document.getElementById("cassette-player");
const filterBtns           = document.querySelectorAll(".filters button");

let selectedTapeIndex = 0;
let currentCategory   = "all";
let currentUser       = null;

// заполняем <select> из статичного массива tapes (14 штук)
function populateTapeSelect() {
  tapeImageSelect.innerHTML = "";
  tapes.forEach((t, idx) => {
    const opt = document.createElement("option");
    opt.value       = idx;
    opt.textContent = t.mini || t.title;
    tapeImageSelect.appendChild(opt);
  });
  tapeImageSelect.value = 0;
  tapePreview.src       = tapes[0].img;
}

// открытие/закрытие модалки
suggestBtn.onclick    = () => showModal(modal);
closeModalBtn.onclick = () => hideModal(modal);

// при выборе опции меняем превью
tapeImageSelect.oninput = () => {
  const i = +tapeImageSelect.value;
  tapePreview.src = tapes[i] ? tapes[i].img : tapes[0].img;
};

// подписка на auth
subscribeAuth(async (user) => {
  currentUser = user;
  if (user) {
    const email = user.email || "(anonymous)";
    setUserEmail(email);
    logoutBtn.classList.remove("hidden");
    loginBtn.classList.add("hidden");
    registerBtn.classList.add("hidden");
    toggleAdminBadge(user.email === "mikheevmikhail18@gmail.com");
  } else {
    setUserEmail("Not logged in");
    logoutBtn.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    registerBtn.classList.remove("hidden");
    toggleAdminBadge(false);
  }

  await loadFirestoreTapes();
  populateTapeSelect();
  renderTapeRow();
});

// ==== ОБНОВЛЁННЫЙ БЛОК LOGIN ====

loginBtn.onclick = () => {
  showModal(document.getElementById("loginModal"));
};

document.getElementById("login-cancel-btn").onclick = () => {
  hideModal(document.getElementById("loginModal"));
};

document.getElementById("google-login-btn").onclick = login;

document.getElementById("anon-login-btn").onclick = loginAnon;

document.getElementById("email-login-btn").onclick = async () => {
  const email = prompt("Email:");
  const pass  = prompt("Password:");
  if (email && pass) {
    try {
      await register(email, pass);
    } catch (e) {
      alert("Login error: " + e.message);
    }
  }
};

logoutBtn.onclick = logout;

registerBtn.onclick = async () => {
  const email = prompt("Enter email to register:");
  const pass  = prompt("Enter password:");
  if (email && pass) {
    try {
      await register(email, pass);
      alert("Registration successful! Now log in.");
    } catch (e) {
      alert("Registration error: " + e.message);
    }
  }
};

// отрисовка ряда мини-кассет
function renderTapeRow() {
  tapesContainer.innerHTML = "";
  const visible = getAllTapes(currentCategory);
  visible.forEach((t, i) => {
    const container = document.createElement("div");
    container.className = "tape-thumb-container";

    const thumb = document.createElement("img");
    thumb.src = t.img;
    thumb.alt = t.title;
    thumb.className = "tape-thumb" + (i === selectedTapeIndex ? " selected" : "");
    thumb.onclick = () => {
      selectedTapeIndex = i;
      renderCassette(visible[i]);
      document.querySelectorAll('.tape-thumb').forEach(el => el.classList.remove('selected'));
      thumb.classList.add('selected');
    };
    container.appendChild(thumb);

    // Новый блок — mini-label под мини-кассетой
    const miniLabel = document.createElement("div");
    miniLabel.className = "mini-label";
    miniLabel.textContent = t.mini || "";
    container.appendChild(miniLabel);

    if (currentUser && currentUser.email === "mikheevmikhail18@gmail.com" && t.id) {
      const delBtn = document.createElement("button");
      delBtn.className = "delete-btn";
      delBtn.innerHTML = "✕";
      delBtn.onclick = async (e) => {
        e.stopPropagation();
        if (confirm("Delete this tape?")) {
          await deleteTape(t.id);
          await loadFirestoreTapes();
          populateTapeSelect();
          renderTapeRow();
        }
      };
      container.appendChild(delBtn);
    }

    tapesContainer.appendChild(container);
  });
  if (visible.length) renderCassette(visible[selectedTapeIndex]);
}

// отрисовка выбранной кассеты
function renderCassette(t) {
  cassetteImg.src           = t.img;
  cassetteImg.alt           = t.title;
  cassetteDesc.textContent  = t.desc;
  cassettePlayer.innerHTML = t.spotify
    ? `<iframe src="${t.spotify}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
    : "";
}

// фильтрация по категориям
filterBtns.forEach(btn => {
  btn.onclick = () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.cat;
    selectedTapeIndex = 0;
    renderTapeRow();
  };
});

// отправка новой кассеты
submitTape.onclick = async () => {
  const title    = tapeTitleInput.value.trim();
  const desc     = tapeDescriptionInput.value.trim();
  let spotify    = tapeSpotifyInput.value.trim();
  const category = tapeCategorySelect.value;
  const idx      = +tapeImageSelect.value;
  const img      = tapes[idx].img;

  // Преобразование ссылки в embed
  if (spotify.includes("open.spotify.com/track/") && !spotify.includes("/embed/")) {
    const match = spotify.match(/track\/([a-zA-Z0-9]+)/);
    if (match) {
      const trackId = match[1];
      spotify = `https://open.spotify.com/embed/track/${trackId}`;
    }
  }

  if (!title || !img) {
    alert("Title and tape are required");
    return;
  }

  await addTape({ title, desc, img, category, spotify });
  hideModal(modal);
  await loadFirestoreTapes();
  populateTapeSelect();
  renderTapeRow();
};

// пиксельный кактус с фразами
const quotes = [
  "You're not alone", "Stay cozy", "Music heals", "Take it easy"
];
cactus.onclick = () => {
  const msg = quotes[Math.floor(Math.random() * quotes.length)];
  cactusPhrase.textContent = msg;
  cactusPhrase.style.opacity = 1;
  cactus.classList.add("shake");
  setTimeout(() => { cactusPhrase.style.opacity = 0; }, 2600);
  setTimeout(() => { cactus.classList.remove("shake"); }, 700);
};