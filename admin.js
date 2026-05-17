import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// ADICIONAR PRODUTO
window.addProduct = async () => {

await addDoc(collection(db,"products"),{
name: name.value,
price: Number(price.value),
image: image.value,
description: desc.value
});

loadProducts();
};

// LISTAR PRODUTOS
async function loadProducts(){

const snap = await getDocs(collection(db,"products"));

list.innerHTML = "";

snap.forEach(d => {

const p = d.data();

list.innerHTML += `
<div>
<strong>${p.name}</strong>
<p>R$ ${p.price}</p>
<button onclick="deleteProduct('${d.id}')">
Excluir
</button>
</div>
`;

});

}

window.deleteProduct = async (id) => {
await deleteDoc(doc(db,"products",id));
loadProducts();
};

loadProducts();