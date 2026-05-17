import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===========================
// FIREBASE CONFIG
// ===========================

const firebaseConfig = {
  apiKey: "AIzaSyCUpAu_ZUa7SNT46JmcLM5XRWdGhkkztAg",
  authDomain: "cheetah-puffs.firebaseapp.com",
  projectId: "cheetah-puffs",
  storageBucket: "cheetah-puffs.firebasestorage.app",
  messagingSenderId: "960441239411",
  appId: "1:960441239411:web:fedf1d5f7356072890e706",
  measurementId: "G-XLB2SEDV87"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===========================
// STATE
// ===========================

let products = [];

// ===========================
// LOADER (SEGURADO)
// ===========================

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  if (!loader) return;

  setTimeout(() => {
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 500);

  }, 800);
});

// ===========================
// AGE GATE
// ===========================

window.enterSite = function () {
  localStorage.setItem("ageVerified", "true");

  const gate = document.getElementById("ageGate");
  if (!gate) return;

  gate.style.opacity = "0";

  setTimeout(() => {
    gate.style.display = "none";
  }, 400);
};

window.leaveSite = function () {
  window.location.href = "https://google.com";
};

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("ageVerified") === "true") {
    const gate = document.getElementById("ageGate");
    if (gate) gate.style.display = "none";
  }
});

// ===========================
// MENU MOBILE
// ===========================

window.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
});

// ===========================
// FIREBASE LOAD PRODUCTS
// ===========================

async function loadProducts() {
  try {
    const snap = await getDocs(collection(db, "products"));

    products = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    renderProducts();

  } catch (err) {
    console.log("Erro Firebase:", err);
  }
}

loadProducts();

// ===========================
// RENDER PRODUCTS
// ===========================

function renderProducts() {
  const container = document.getElementById("productsGrid");
  if (!container) return;

  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="product-card fade-up">

        <img src="${p.image || ''}" alt="${p.name || ''}" />

        <div class="product-content">

          <h3>${p.name || ''}</h3>

          <p>${p.description || ''}</p>

          <div class="product-prices">

            <span class="old-price">
  R$ ${(Number(p.oldprice ?? 0)).toFixed(2).replace('.', ',')}
</span>

            <span class="product-price">
              R$ ${(Number(p.price || 0)).toFixed(2).replace('.', ',')}
            </span>

          </div>

          <button class="primary-btn" onclick="addToCart('${p.id}')">
            Adicionar
          </button>

        </div>

      </div>
    `;
  });
}

// ===========================
// CART
// ===========================

window.addToCart = function (id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length >= 10) {
    alert("Limite de 10 produtos");
    return;
  }

  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));

  showToast(product);
};

// ===========================
// TOAST SIMPLES E ESTÁVEL
// ===========================

function showToast(product) {
  let container = document.querySelector(".toast-container");

  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";

  toast.innerHTML = `
    <div class="toast-icon">🛒</div>
    <div class="toast-content">
      <strong>Adicionado</strong>
      <p>${product.name}</p>
    </div>
    <button class="toast-close">✕</button>
  `;

  container.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 50);

  toast.querySelector(".toast-close").onclick = () => toast.remove();

  setTimeout(() => {
    if (toast) toast.remove();
  }, 4000);
}

// ===========================
// CHECKOUT (FIREBASE ORDERS)
// ===========================

window.checkout = async function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Carrinho vazio");
    return;
  }

  const total = cart.reduce((acc, item) => acc + Number(item.price || 0), 0);

  const order = {
    items: cart,
    total: total,
    status: "pending",
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(collection(db, "orders"), order);

    alert("Pedido enviado com sucesso!");

    localStorage.removeItem("cart");

  } catch (err) {
    console.log("Erro checkout:", err);
  }
};