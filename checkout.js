import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "SUA_KEY",
  authDomain: "SEU_AUTH",
  projectId: "SEU_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===========================
// LOAD CART
// ===========================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("cartPreview");
const totalEl = document.getElementById("totalPrice");

// ===========================
// RENDER CART
// ===========================

function renderCart() {

  if (cart.length === 0) {
    container.innerHTML = "<p>Carrinho vazio</p>";
    return;
  }

  container.innerHTML = "";

  cart.forEach(item => {
    container.innerHTML += `
      <div class="cart-item">
        <p>${item.name}</p>
        <strong>R$ ${Number(item.price).toFixed(2)}</strong>
      </div>
    `;
  });

  const total = cart.reduce((sum, i) => sum + Number(i.price), 0);

  totalEl.innerText = "Total: R$ " + total.toFixed(2);
}

renderCart();

// ===========================
// FINALIZAR PEDIDO
// ===========================

window.finishOrder = async function () {

  if (cart.length === 0) {
    alert("Carrinho vazio");
    return;
  }

  const total = cart.reduce((sum, i) => sum + Number(i.price), 0);

  const order = {
    items: cart,
    total: total,
    status: "pending",
    createdAt: serverTimestamp()
  };

  try {

    await addDoc(collection(db, "orders"), order);

    alert("Pedido criado com sucesso!");

    localStorage.removeItem("cart");

    window.location.href = "index.html";

  } catch (error) {
    console.log(error);
  }
};