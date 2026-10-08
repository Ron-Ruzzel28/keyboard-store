const cart = {};
const $ = (id) => document.getElementById(id);

function render() {
  $("products").innerHTML = PRODUCTS.map(p => `
    <article class="card">
      <h3>${p.name}</h3>
      <p>${p.type}</p>
      <strong>$${p.price.toFixed(2)}</strong>
      <button data-id="${p.id}">Add to cart</button>
    </article>`).join("");
  const items = Object.entries(cart);
  $("cart-count").textContent = items.reduce((n, [, q]) => n + q, 0);
  $("cart-items").innerHTML = items.map(([id, q]) => {
    const p = PRODUCTS.find(x => x.id == id);
    return `<li>${p.name} × ${q}</li>`;
  }).join("");
  $("cart-total").textContent = items
    .reduce((s, [id, q]) => s + PRODUCTS.find(x => x.id == id).price * q, 0)
    .toFixed(2);
}

$("products").addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (id) { cart[id] = (cart[id] || 0) + 1; render(); }
});
$("cart-btn").addEventListener("click", () => { $("cart").hidden = !$("cart").hidden; });
$("checkout").addEventListener("click", () => alert("Checkout coming soon!"));
render();
