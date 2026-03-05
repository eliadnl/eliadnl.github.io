// script.js

// ----- PANIER -----
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartCount = document.getElementById('cartCount');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');

// Met à jour le nombre dans le panier
function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = `Panier : ${total}`;
}

// Sauvegarde le panier dans le localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Ajoute un produit au panier
function addToCart(name, price, imgSrc) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name, price, imgSrc, quantity: 1 });
  }
  saveCart();
  renderCart();
}

// Supprime un produit du panier
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart();
  renderCart();
}

// Modifie la quantité
function changeQuantity(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity < 1) removeFromCart(name);
  else saveCart();
  renderCart();
}

// Affiche les produits dans le panier
function renderCart() {
  cartItems.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.marginBottom = '10px';
    div.innerHTML = `
      <img src="${item.imgSrc}" alt="${item.name}" style="width:45px; border-radius:5px; margin-right:10px;">
      <div style="flex:1; font-size:14px;">
        ${item.name} - ${item.price}€
      </div>
      <div style="display:flex; align-items:center; gap:5px;">
        <button onclick="changeQuantity('${item.name}', -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity('${item.name}', 1)">+</button>
        <span style="cursor:pointer; font-weight:bold;" onclick="removeFromCart('${item.name}')">×</span>
      </div>
    `;
    cartItems.appendChild(div);
  });
}

// Affiche / cache le panier
function toggleCart() {
  cartOverlay.style.display = cartOverlay.style.display === 'block' ? 'none' : 'block';
}

// Bouton finaliser la commande
function finalizeOrder() {
  window.location.href = 'commande.html';
}

// ----- FILTRE DÉROULANT -----
const filterContent = document.getElementById('filterContent');

// Affiche / cache le filtre
function toggleDropdown() {
  filterContent.style.display = filterContent.style.display === 'block' ? 'none' : 'block';
}

// Applique le filtre
function applyFilter() {
  const selectedColors = Array.from(document.querySelectorAll('.filter-color:checked')).map(cb => cb.value);
  const selectedTypes = Array.from(document.querySelectorAll('.filter-type:checked')).map(cb => cb.value);
  const selectedFormats = Array.from(document.querySelectorAll('.filter-format:checked')).map(cb => cb.value);

  document.querySelectorAll('.products-grid .product').forEach(prod => {
    const color = prod.dataset.color;
    const type = prod.dataset.type;
    const format = prod.dataset.format;

    const matchColor = selectedColors.length === 0 || selectedColors.includes(color);
    const matchType = selectedTypes.length === 0 || selectedTypes.includes(type);
    const matchFormat = selectedFormats.length === 0 || selectedFormats.includes(format);

    prod.style.display = (matchColor && matchType && matchFormat) ? 'block' : 'none';
  });
}

// Réinitialise tous les filtres
function resetFilters() {
  document.querySelectorAll('.filter-color, .filter-type, .filter-format').forEach(cb => cb.checked = false);
  applyFilter();
}

// Événements pour appliquer le filtre à chaque changement
document.querySelectorAll('.filter-color, .filter-type, .filter-format').forEach(cb => cb.addEventListener('change', applyFilter));

// ----- INIT -----
updateCartCount();
renderCart();

// Bouton finaliser la commande
const payBtn = document.getElementById('payButton');
if (payBtn) payBtn.addEventListener('click', finalizeOrder);
