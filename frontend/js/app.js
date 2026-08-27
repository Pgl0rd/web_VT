/* Main frontend app.js copied from original project */

let products = [
  {
    id: 1,
    name: "Nệm Cao Su Memory Pro 1.6",
    category: "Nệm cao cấp",
    brand: "Nệm Văn Thanh",
    price: 13900000,
    oldPrice: 16900000,
    rating: 4.9,
    reviews: 127,
    size: "1m6",
    material: "Cao su",
    badge: "Bán chạy",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Nệm Lò Xo Kháng Khuẩn Premium",
    category: "Nệm đơn",
    brand: "Nệm Văn Thanh",
    price: 8900000,
    oldPrice: 10400000,
    rating: 4.8,
    reviews: 94,
    size: "1m2",
    material: "Lò xo",
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Nệm Gòn Mềm Sáng Tạo",
    category: "Nệm đôi",
    brand: "Nệm Văn Thanh",
    price: 11900000,
    oldPrice: 14500000,
    rating: 4.7,
    reviews: 72,
    size: "1m8",
    material: "Gòn",
    badge: "Mới",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "Combo Ga Giường + Nệm Cao Cấp",
    category: "Ga giường",
    brand: "Nệm Văn Thanh",
    price: 16800000,
    oldPrice: 19900000,
    rating: 5,
    reviews: 52,
    size: "1m8",
    material: "Cotton",
    badge: "Combo",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 5,
    name: "Gối Hỗ Trợ Cột Sống",
    category: "Gối",
    brand: "Nệm Văn Thanh",
    price: 580000,
    oldPrice: 760000,
    rating: 4.8,
    reviews: 144,
    size: "1 chiếc",
    material: "Polyester",
    badge: "Khuyến mãi",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 6,
    name: "Chăn Cotton 2 Lớp",
    category: "Chăn",
    brand: "Nệm Văn Thanh",
    price: 890000,
    oldPrice: 1090000,
    rating: 4.6,
    reviews: 88,
    size: "1m6",
    material: "Cotton",
    badge: "Mới",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 7,
    name: "Nệm Mousse Comfort Plus",
    category: "Nệm cao cấp",
    brand: "Nệm Văn Thanh",
    price: 15900000,
    oldPrice: 18900000,
    rating: 4.9,
    reviews: 205,
    size: "1m8",
    material: "Mousse",
    badge: "Premium",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 8,
    name: "Ga Giường Cao Cấp Linen",
    category: "Ga giường",
    brand: "Nệm Văn Thanh",
    price: 2400000,
    oldPrice: 3200000,
    rating: 4.7,
    reviews: 67,
    size: "1m8",
    material: "Linen",
    badge: "New",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  }
];

const PRODUCT_STORAGE_KEY = "nvtCart";
const PRODUCT_LIST_KEY = "nvtProducts";
// initialize product list in storage on first load
function initProductsStorage() {
  try {
    const stored = localStorage.getItem(PRODUCT_LIST_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) products = parsed;
    } else {
      localStorage.setItem(PRODUCT_LIST_KEY, JSON.stringify(products));
    }
  } catch (e) {
    console.error('Failed to init products storage', e);
  }
}

function persistProducts() {
  localStorage.setItem(PRODUCT_LIST_KEY, JSON.stringify(products));
}

function getNextProductId() {
  return products.reduce((max, p) => Math.max(max, p.id || 0), 0) + 1;
}
let cart = JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEY) || "[]");

function formatMoney(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(value);
}

function updateCartBadge() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = count;
}

function addToCart(productId, quantity = 1) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += quantity;
  } else {
    cart.push({ id: productId, qty: quantity });
  }
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
  const cartPage = document.getElementById("cartItems");
  if (cartPage) renderCartPage();
  alert("Đã thêm sản phẩm vào giỏ hàng!");
}

function updateQty(productId, delta) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(item => item.id !== productId);
  }
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
  renderCartPage();
}

function renderProductGrid(containerId = "productGrid", options = {}) {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  const search = (options.search ?? document.getElementById("searchInput")?.value || "").toLowerCase();
  const category = options.category ?? document.getElementById("categoryFilter")?.value ?? "all";
  const sort = options.sort ?? document.getElementById("sortSelect")?.value ?? "featured";

  let filtered = products.filter(product => {
    const matchesText =
      product.name.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search) ||
      product.material.toLowerCase().includes(search);
    const matchesCategory = category === "all" || product.category === category;
    return matchesText && matchesCategory;
  });

  if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));

  const resultText = document.getElementById("resultText");
  if (resultText) resultText.textContent = `${filtered.length} sản phẩm`;

  grid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-media">
        <span class="badge">${product.badge}</span>
        <div class="wishlist">♡</div>
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-body">
        <div class="product-meta">
          <span>${product.category}</span>
          <span class="rating">★ ${product.rating}</span>
        </div>
        <h3 class="product-name">${product.name}</h3>
        <div class="price-row">
          <span class="price">${formatMoney(product.price)}</span>
          <span class="old-price">${formatMoney(product.oldPrice)}</span>
        </div>
        <div class="product-actions">
          <button class="btn btn-primary" data-add-cart="${product.id}">Thêm vào giỏ</button>
          <button class="btn-small" data-view-product="${product.id}">Xem</button>
        </div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll("[data-add-cart]").forEach(btn => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.addCart)));
  });

  document.querySelectorAll("[data-view-product]").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.href = `chi-tiet-san-pham.html?id=${btn.dataset.viewProduct}`;
    });
  });
}

function renderCartPage() {
  const cartItems = document.getElementById("cartItems");
  if (!cartItems) return;

  if (!cart.length) {
    cartItems.innerHTML = `
      <div style="padding: 30px 12px; text-align: center; color: var(--muted);">
        Giỏ hàng của bạn đang trống.
      </div>
    `;
    updateOrderSummary(0);
    return;
  }

  const productMap = Object.fromEntries(products.map(product => [product.id, product]));
  let subtotal = 0;

  cartItems.innerHTML = cart.map(item => {
    const product = productMap[item.id];
    const lineTotal = product.price * item.qty;
    subtotal += lineTotal;

    return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h4>${product.name}</h4>
          <div class="cart-meta">${product.category} • ${product.size}</div>
          <div class="cart-price">${formatMoney(lineTotal)}</div>
        </div>
        <div class="cart-qty">
          <button type="button" data-decrease="${product.id}">−</button>
          <span>${item.qty}</span>
          <button type="button" data-increase="${product.id}">+</button>
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll("[data-decrease]").forEach(btn => {
    btn.addEventListener("click", () => updateQty(Number(btn.dataset.decrease), -1));
  });

  document.querySelectorAll("[data-increase]").forEach(btn => {
    btn.addEventListener("click", () => updateQty(Number(btn.dataset.increase), 1));
  });

  updateOrderSummary(subtotal);
}

function updateOrderSummary(subtotal) {
  const shippingFee = subtotal > 0 ? 150000 : 0;
  const discount = subtotal > 14000000 ? 500000 : 0;
  const total = subtotal + shippingFee - discount;

  const subtotalEl = document.getElementById("subtotal");
  const shippingEl = document.getElementById("shippingFee");
  const discountEl = document.getElementById("discount");
  const totalEl = document.getElementById("total");

  if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
  if (shippingEl) shippingEl.textContent = formatMoney(shippingFee);
  if (discountEl) discountEl.textContent = formatMoney(discount);
  if (totalEl) totalEl.textContent = formatMoney(total);
}

function setupAccountTabs() {
  const tabs = document.querySelectorAll(".tab");
  const panels = {
    login: document.getElementById("loginPanel"),
    register: document.getElementById("registerPanel"),
    orders: document.getElementById("ordersPanel")
  };

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(el => el.classList.remove("active"));
      tab.classList.add("active");
      Object.values(panels).forEach(panel => panel && panel.classList.add("hidden"));
      const target = panels[tab.dataset.tab];
      if (target) target.classList.remove("hidden");
    });
  });
}

function renderAdminOrders() {
  const tbody = document.getElementById("adminOrders");
  if (!tbody) return;

  const rows = [
    ["#NVT-2001", "Nguyễn Văn A", "9.800.000₫", "Đã xác nhận", "02/08/2026"],
    ["#NVT-2002", "Trần Thị B", "14.500.000₫", "Đang giao", "03/08/2026"],
    ["#NVT-2003", "Lê Văn C", "7.200.000₫", "Chờ xác nhận", "05/08/2026"],
    ["#NVT-2004", "Phạm Thị D", "18.900.000₫", "Hoàn tất", "08/08/2026"]
  ];

  tbody.innerHTML = rows.map(([code, customer, total, status, date]) => {
    const statusClass = {
      "Chờ xác nhận": "pending",
      "Đã xác nhận": "confirmed",
      "Đang giao": "shipped",
      "Hoàn tất": "confirmed"
    }[status] || "pending";

    return `
      <tr>
        <td>${code}</td>
        <td>${customer}</td>
        <td>${total}</td>
        <td><span class="status ${statusClass}">${status}</span></td>
        <td>${date}</td>
      </tr>
    `;
  }).join("");
}

// --- Admin: product management ---
function renderAdminProducts() {
  const tbody = document.getElementById('adminProducts');
  if (!tbody) return;
  tbody.innerHTML = products.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${formatMoney(p.price)}</td>
      <td>${p.badge || ''}</td>
      <td style="text-align:right;">
        <button class="btn btn-small" data-edit="${p.id}">Sửa</button>
        <button class="btn btn-small" data-delete="${p.id}">Xóa</button>
      </td>
    </tr>
  `).join('');

  // bind actions
  tbody.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => openProductForm(Number(btn.dataset.edit)));
  });
  tbody.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => deleteProduct(Number(btn.dataset.delete)));
  });
}

function openProductForm(id) {
  const form = document.getElementById('productForm');
  if (!form) return;
  form.reset();
  form.dataset.editId = '';
  if (id) {
    const p = products.find(x => x.id === id);
    if (!p) return alert('Sản phẩm không tồn tại');
    form.dataset.editId = id;
    form.querySelector('[name="name"]').value = p.name || '';
    form.querySelector('[name="category"]').value = p.category || '';
    form.querySelector('[name="price"]').value = p.price || '';
    form.querySelector('[name="oldPrice"]').value = p.oldPrice || '';
    form.querySelector('[name="badge"]').value = p.badge || '';
    form.querySelector('[name="image"]').value = p.image || '';
    form.querySelector('[name="material"]').value = p.material || '';
    form.querySelector('[name="size"]').value = p.size || '';
    form.querySelector('[name="description"]').value = p.description || '';
    form.querySelector('[name="brand"]').value = p.brand || '';
  }
  document.getElementById('productFormWrap').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeProductForm() {
  const wrap = document.getElementById('productFormWrap');
  if (wrap) wrap.classList.add('hidden');
}

function saveProductFromForm(e) {
  if (e && e.preventDefault) e.preventDefault();
  const form = document.getElementById('productForm');
  if (!form) return;
  const id = form.dataset.editId ? Number(form.dataset.editId) : null;
  const data = {
    name: form.querySelector('[name="name"]').value.trim(),
    category: form.querySelector('[name="category"]').value.trim(),
    price: Number(form.querySelector('[name="price"]').value) || 0,
    oldPrice: Number(form.querySelector('[name="oldPrice"]').value) || 0,
    badge: form.querySelector('[name="badge"]').value.trim(),
    image: form.querySelector('[name="image"]').value.trim(),
    material: form.querySelector('[name="material"]').value.trim(),
    size: form.querySelector('[name="size"]').value.trim(),
    description: form.querySelector('[name="description"]').value.trim(),
    brand: form.querySelector('[name="brand"]').value.trim() || 'Nệm Văn Thanh'
  };

  if (!data.name) return alert('Tên sản phẩm không được để trống');

  if (id) {
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return alert('Sản phẩm không tồn tại');
    products[idx] = { ...products[idx], ...data };
  } else {
    const newId = getNextProductId();
    products.push({ id: newId, rating: 5, reviews: 0, ...data });
  }

  persistProducts();
  renderAdminProducts();
  renderProductGrid();
  closeProductForm();
}

function deleteProduct(id) {
  if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
  products = products.filter(p => p.id !== id);
  persistProducts();
  renderAdminProducts();
  renderProductGrid();
}

function renderProductDetail() {
  const root = document.getElementById("productDetail");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get("id") || 1);
  const product = products.find(item => item.id === productId) || products[0];

  root.innerHTML = `
    <div class="detail-gallery">
      <img class="detail-main-image" src="${product.image}" alt="${product.name}">
      <div class="thumbs">
        <img src="${product.image}" alt="${product.name}">
        <img src="${product.image}" alt="${product.name}">
        <img src="${product.image}" alt="${product.name}">
        <img src="${product.image}" alt="${product.name}">
      </div>
    </div>
    <div class="detail-box">
      <span class="eyebrow">${product.category}</span>
      <h2>${product.name}</h2>
      <div class="detail-price">
        <span class="price">${formatMoney(product.price)}</span>
        <span class="old-price">${formatMoney(product.oldPrice)}</span>
        <span class="stock">✓ Còn hàng</span>
      </div>
      <p style="color: var(--muted);">Nệm được thiết kế với lớp hỗ trợ cột sống, khả năng thoáng khí và ít gây mỏi cổ, gáy, lưng.</p>

      <div>
        <strong>Kích thước</strong>
        <div class="variant-list">
          <span class="variant active">1m2</span>
          <span class="variant">1m4</span>
          <span class="variant">1m6</span>
          <span class="variant">1m8</span>
        </div>
      </div>

      <div style="margin-top: 12px;">
        <strong>Chất liệu</strong>
        <div class="variant-list">
          <span class="variant active">${product.material}</span>
          <span class="variant">Lò xo</span>
          <span class="variant">Mousse</span>
        </div>
      </div>

      <div class="qty-row">
        <div class="qty-box">
          <button type="button" id="detailMinus">−</button>
          <span id="detailQty">1</span>
          <button type="button" id="detailPlus">+</button>
        </div>
        <button class="btn btn-primary" id="buyNowBtn">Thêm vào giỏ hàng</button>
      </div>

      <div class="detail-actions">
        <button class="btn btn-secondary">Tư vấn miễn phí</button>
        <button class="btn btn-secondary">Yêu thích</button>
      </div>
    </div>
  `;

  const qtyEl = document.getElementById("detailQty");
  const buyBtn = document.getElementById("buyNowBtn");

  document.getElementById("detailMinus")?.addEventListener("click", () => {
    let value = Number(qtyEl.textContent || 1);
    value = Math.max(1, value - 1);
    qtyEl.textContent = value;
  });

  document.getElementById("detailPlus")?.addEventListener("click", () => {
    let value = Number(qtyEl.textContent || 1);
    value += 1;
    qtyEl.textContent = value;
  });

  buyBtn?.addEventListener("click", () => {
    const qty = Number(qtyEl.textContent || 1);
    addToCart(product.id, qty);
  });

  document.querySelectorAll(".variant").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".variant").forEach(el => el.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

function renderHomeProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  renderProductGrid("productGrid");
}

function bindSearchAndFilters() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.addEventListener("input", () => renderProductGrid());

  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) categoryFilter.addEventListener("change", () => renderProductGrid());

  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) sortSelect.addEventListener("change", () => renderProductGrid());
}

function bindCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    alert("Đặt hàng thành công! Chúng tôi sẽ xác nhận qua email/SMS trong thời gian sớm nhất.");
  });
}

function bindCartLinks() {
  const cartLinks = document.querySelectorAll("[data-cart-link]");
  cartLinks.forEach(link => {
    link.addEventListener("click", () => window.location.href = "gio-hang.html");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // initialize products from storage first
  initProductsStorage();
  updateCartBadge();
  bindSearchAndFilters();
  setupAccountTabs();
  renderAdminOrders();
  renderAdminProducts();
  renderProductDetail();
  renderCartPage();
  bindCheckoutForm();
  bindCartLinks();

  if (document.getElementById("productGrid")) {
    renderHomeProducts();
  }

  const homeBtn = document.querySelector("[data-home]");
  if (homeBtn) homeBtn.addEventListener("click", () => window.location.href = "index.html");
});
