// ============================
// ELEMENTOS
// ============================

const cartContainer =
  document.getElementById(
    "cartContainer"
  );

const cartTotal =
  document.getElementById(
    "cartTotal"
  );

// ============================
// PEGAR CARRINHO
// ============================

let cart =
  JSON.parse(
    localStorage.getItem("cart")
  ) || [];

// ============================
// RENDER CARRINHO
// ============================

function renderCart() {

  if (!cartContainer) return;

  // carrinho vazio
  if (cart.length === 0) {

    cartContainer.innerHTML = `

      <div class="empty-cart">

        <h2>
          Seu carrinho está vazio
        </h2>

        <p>
          Explore nossa coleção premium.
        </p>

        <a
          href="produtos.html"
          class="primary-btn"
        >
          Ver produtos
        </a>

      </div>
    `;

    cartTotal.innerText =
      "R$ 0,00";

    return;
  }

  // render produtos
  cartContainer.innerHTML =
    cart
      .map(
        (item, index) => `

      <div class="cart-card">

        <img
          src="${item.image}"
          alt="${item.name}"
        />

        <div class="cart-info">

          <h3>
            ${item.name}
          </h3>

          <p>
            ${item.description}
          </p>

          <span>
            R$ ${item.price
              .toFixed(2)
              .replace(".", ",")}
          </span>

        </div>

        <button
          class="remove-btn"
          onclick="removeItem(${index})"
        >
          Remover
        </button>

      </div>
    `
      )
      .join("");

  updateTotal();
}

// ============================
// TOTAL
// ============================

function updateTotal() {

  const total =
    cart.reduce(
      (acc, item) =>
        acc + item.price,
      0
    );

  cartTotal.innerText =
    `R$ ${total
      .toFixed(2)
      .replace(".", ",")}`;
}

// ============================
// REMOVER ITEM
// ============================

function removeItem(index) {

  cart.splice(index, 1);

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  renderCart();
}

// ============================
// FINALIZAR WHATSAPP
// ============================

function generateWhatsMessage() {

  if (cart.length === 0) {
    return "";
  }

  let message =
    "Olá! Quero fazer um pedido:%0A%0A";

  cart.forEach((item) => {

    message +=
      `• ${item.name} - R$ ${item.price
        .toFixed(2)
        .replace(".", ",")}%0A`;
  });

  const total =
    cart.reduce(
      (acc, item) =>
        acc + item.price,
      0
    );

  message +=
    `%0A*Total:* R$ ${total
      .toFixed(2)
      .replace(".", ",")}`;

  return message;
}

// ============================
// BOTÃO WHATSAPP
// ============================

const checkoutBtn =
  document.querySelector(
    ".checkout-btn"
  );

if (checkoutBtn) {

  checkoutBtn.addEventListener(
    "click",
    (e) => {

      e.preventDefault();

      const message =
        generateWhatsMessage();

      if (!message) return;

      window.open(
        `https://wa.me/5547976028986?text=${message}`,
        "_blank"
      );
    }
  );
}

// ============================
// MENU MOBILE
// ============================

const menuToggle =
  document.getElementById(
    "menuToggle"
  );

const navLinks =
  document.getElementById(
    "navLinks"
  );

if (menuToggle) {

  menuToggle.addEventListener(
    "click",
    () => {

      navLinks.classList.toggle(
        "active"
      );
    }
  );
}

// ============================
// INIT
// ============================

renderCart();