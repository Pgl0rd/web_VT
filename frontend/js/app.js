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
const AUTH_TOKEN_KEY = 'nvtAuthToken';
const ADMIN_AUTH_TOKEN_KEY = 'nvtAdminAuthToken';
const CUSTOMER_AUTH_TOKEN_KEY = 'nvtCustomerAuthToken';
const ADMIN_SESSION_STARTED_KEY = 'nvtAdminSessionStarted';
const CUSTOMER_SESSION_STARTED_KEY = 'nvtCustomerSessionStarted';
const pageUrl = page => (location.pathname === '/' || location.pathname.endsWith('/index.html') ? `pages/${page}` : page);
function readValidToken(key) {
  const token = localStorage.getItem(key);
  if (!token) return null;
  try {
    const sessionKey = key === ADMIN_AUTH_TOKEN_KEY ? ADMIN_SESSION_STARTED_KEY : CUSTOMER_SESSION_STARTED_KEY;
    const startedAt = Number(localStorage.getItem(sessionKey));
    if (!startedAt || Date.now() - startedAt > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(key);
      localStorage.removeItem(sessionKey);
      return null;
    }
    const encodedPayload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=')));
    if (!payload.exp || payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem(key);
      return null;
    }
    return token;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}
function getAuthToken() {
  const key = document.getElementById('adminProducts') ? ADMIN_AUTH_TOKEN_KEY : CUSTOMER_AUTH_TOKEN_KEY;
  return readValidToken(key);
}
const authHeaders = () => getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {};
let selectedProductImages = [];
let productImagesChanged = false;
let categories = [];
let productAttributes = [];
let productVariants = [];
let removedVariantNames = new Set();
function normalizeProduct(product) {
  return {
    ...product,
    id: product.id || product._id,
    name: product.name || 'Sản phẩm chưa đặt tên',
    brand: product.brand || '',
    material: product.material || '',
    category: product.category || 'Khác',
    images: product.images && product.images.length ? product.images : (product.image ? [product.image] : [])
  };
}

async function initProductsStorage() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const response = await fetch('/api/products', { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) throw new Error('Products API unavailable');
    const remoteProducts = await response.json();
    if (!Array.isArray(remoteProducts)) throw new Error('Invalid products response');
    if (remoteProducts.length) {
      products = remoteProducts.map(normalizeProduct);
      return;
    }
    products = [];
  } catch (e) {
    console.error('Failed to init products storage', e);
    products = [];
  }
}

async function initCategories() {
  try {
    const response = await fetch('/api/categories');
    if (!response.ok) throw new Error('Categories API unavailable');
    categories = await response.json();
    const options = categories.map(category => `<option value="${category.name}">${category.name}</option>`).join('');
    const productCategory = document.getElementById('productCategory');
    if (productCategory) productCategory.innerHTML = `<option value="">Chọn danh mục</option>${options}`;
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      const selected = new URLSearchParams(window.location.search).get('category') || categoryFilter.value;
      categoryFilter.innerHTML = `<option value="all">Tất cả danh mục</option>${options}`;
      categoryFilter.value = categories.some(category => category.name === selected) ? selected : 'all';
    }
    renderFeaturedCategories();
    renderCategoryNavigation();
    renderAdminCategories();
  } catch (error) {
    console.error('Failed to init categories', error);
  }
}

const catalogLanguages = { vi: 'Tiếng Việt', en: 'English', zh: '中文' };

async function loadCatalogs() {
  const response = await fetch('/api/catalogs');
  if (!response.ok) throw new Error('Không thể tải catalog');
  return response.json();
}

function renderAdminCatalogs(catalogs) {
  const container = document.getElementById('adminCatalogs');
  if (!container) return;
  container.innerHTML = Object.entries(catalogLanguages).map(([language, label]) => {
    const catalog = catalogs.find(item => item.language === language);
    return `<form class="catalog-admin-card" data-catalog-language="${language}"><div><strong>${label}</strong><small>${catalog ? catalog.fileName : 'Chưa có file'}</small></div><input name="title" value="${catalog?.title || `Catalog ${label}`}" required><input name="file" type="file" accept="application/pdf" required><button class="btn btn-primary" type="submit">${catalog ? 'Thay catalog' : 'Tải catalog'}</button>${catalog ? `<button class="btn-small" type="button" data-delete-catalog="${catalog._id}">Xóa</button>` : ''}</form>`;
  }).join('');
  container.querySelectorAll('[data-catalog-language]').forEach(form => form.addEventListener('submit', async event => {
    event.preventDefault();
    const file = form.file.files[0];
    if (!file || file.type !== 'application/pdf') return showAdminToast('Vui lòng chọn file PDF.', 'error');
    if (file.size > 40 * 1024 * 1024) return showAdminToast('PDF không được vượt quá 40MB.', 'error');
    const reader = new FileReader();
    reader.onload = async () => {
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      const response = await fetch(`/api/catalogs/${form.dataset.catalogLanguage}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ title: form.title.value, language: form.dataset.catalogLanguage, fileName: file.name, data: reader.result }) });
      const result = await response.json();
      button.disabled = false;
      if (!response.ok) return showAdminToast(result.error || 'Không thể lưu catalog.', 'error');
      showAdminToast('Đã lưu catalog.');
      renderAdminCatalogs(await loadCatalogs());
    };
    reader.readAsDataURL(file);
  }));
  container.querySelectorAll('[data-delete-catalog]').forEach(button => button.addEventListener('click', async () => {
    if (!confirm('Xóa catalog này?')) return;
    const response = await fetch(`/api/catalogs/${button.dataset.deleteCatalog}`, { method: 'DELETE', headers: authHeaders() });
    if (!response.ok) return showAdminToast('Không thể xóa catalog.', 'error');
    renderAdminCatalogs(await loadCatalogs());
  }));
}

async function initCatalogPage() {
  const tabs = document.getElementById('catalogTabs');
  if (!tabs) return;
  const catalogs = await loadCatalogs();
  tabs.innerHTML = catalogs.map(catalog => `<button class="catalog-tab" type="button" data-catalog-id="${catalog._id}">${catalogLanguages[catalog.language] || catalog.language}<small>${catalog.title}</small></button>`).join('');
  const empty = document.getElementById('catalogEmpty');
  if (!catalogs.length) return;
  empty.classList.add('hidden');
  tabs.querySelectorAll('[data-catalog-id]').forEach(button => button.addEventListener('click', () => openCatalog(button.dataset.catalogId, button)));
  tabs.querySelector('[data-catalog-id]')?.click();
}

async function openCatalog(id, activeButton) {
  if (!window.pdfjsLib) return alert('Không thể tải trình đọc PDF.');
  document.querySelectorAll('.catalog-tab').forEach(button => button.classList.toggle('active', button === activeButton));
  const response = await fetch(`/api/catalogs/${id}`);
  if (!response.ok) return alert('Không thể mở catalog.');
  const catalog = await response.json();
  const binary = atob(catalog.data.split(',')[1]);
  const pdfBytes = Uint8Array.from(binary, character => character.charCodeAt(0));
  const pdf = await window.pdfjsLib.getDocument({ data: pdfBytes }).promise;
  const shell = document.getElementById('flipbookShell');
  const leftCanvas = document.getElementById('catalogCanvasLeft');
  const rightCanvas = document.getElementById('catalogCanvasRight');
  let pageNumber = 1;
  const renderPage = async (direction = '') => {
    const pageNumbers = pageNumber === 1 ? [1] : (pageNumber < pdf.numPages ? [pageNumber, pageNumber + 1] : [pageNumber]);
    const pages = await Promise.all(pageNumbers.map(number => pdf.getPage(number)));
    const baseViewport = pages[0].getViewport({ scale: 1 });
    const spreadWidth = pageNumbers.length === 1 ? 760 : 1120;
    const scale = Math.min(1.35, spreadWidth / (baseViewport.width * pageNumbers.length));
    const renderCanvas = async (page, canvas) => {
      const viewport = page.getViewport({ scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.classList.remove('is-hidden');
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    };
    await renderCanvas(pages[0], leftCanvas);
    if (pages[1]) await renderCanvas(pages[1], rightCanvas);
    else { rightCanvas.width = 1; rightCanvas.height = 1; rightCanvas.classList.add('is-hidden'); }
    const flipbook = document.getElementById('flipbook');
    flipbook.classList.remove('flip-forward', 'flip-back');
    if (direction) requestAnimationFrame(() => flipbook.classList.add(direction));
    document.getElementById('catalogPageNumber').textContent = pageNumbers.length === 1 ? `1 / ${pdf.numPages}` : `${pageNumbers[0]}-${pageNumbers[1]} / ${pdf.numPages}`;
    document.getElementById('catalogPrev').disabled = pageNumber === 1;
    document.getElementById('catalogNext').disabled = pageNumber === 1 ? pdf.numPages < 2 : pageNumber + 1 >= pdf.numPages;
  };
  document.getElementById('catalogPrev').onclick = () => { if (pageNumber === 2) { pageNumber = 1; renderPage('flip-back'); } else if (pageNumber > 2) { pageNumber -= 2; renderPage('flip-back'); } };
  document.getElementById('catalogNext').onclick = () => { if (pageNumber === 1) { pageNumber = 2; renderPage('flip-forward'); } else if (pageNumber + 1 < pdf.numPages) { pageNumber += 2; renderPage('flip-forward'); } };
  document.querySelectorAll('[data-close-catalog]').forEach(button => button.onclick = () => document.getElementById('flipbookShell').classList.add('hidden'));
  shell.classList.remove('hidden');
  await renderPage();
}

function categoryLink(categoryName) {
  return `${pageUrl('san-pham.html')}?category=${encodeURIComponent(categoryName)}`;
}

function renderFeaturedCategories() {
  const container = document.getElementById('featuredCategories');
  if (!container) return;
  container.innerHTML = categories.map(category => `<a class="category-card" href="${categoryLink(category.name)}"${category.image ? ` style="--category-image: url('${category.image}')"` : ''}><span class="category-card-shade"></span>${category.image ? `<img src="${category.image}" alt="${category.name}">` : ''}<span class="category-card-content"><h3>${category.name}</h3><span>${category.productCount || 0} sản phẩm</span></span></a>`).join('');
}

function renderCategoryNavigation() {
  const productLink = document.querySelector('.main-nav a[href$="san-pham.html"]');
  if (!productLink) return;
  const existingWrapper = productLink.closest('.nav-category-menu');
  if (existingWrapper) {
    existingWrapper.querySelector('.nav-category-dropdown').innerHTML = categories.map(category => `<a href="${categoryLink(category.name)}">${category.name}<small>${category.productCount || 0}</small></a>`).join('');
    return;
  }
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-category-menu';
  productLink.parentNode.insertBefore(wrapper, productLink);
  wrapper.appendChild(productLink);
  const menu = document.createElement('div');
  menu.className = 'nav-category-dropdown';
  menu.innerHTML = categories.map(category => `<a href="${categoryLink(category.name)}">${category.name}<small>${category.productCount || 0}</small></a>`).join('');
  wrapper.appendChild(menu);
}

function renderAdminCategories() {
  const container = document.getElementById('adminCategories');
  if (!container) return;
  container.innerHTML = categories.length ? categories.map(category => {
    const assigned = new Set(products.filter(product => product.category === category.name).map(product => String(product.id)));
    const productOptions = products.length ? products.map(product => `<label class="category-product-option"><input type="checkbox" value="${product.id}" ${assigned.has(String(product.id)) ? 'checked' : ''}><span>${product.name}</span></label>`).join('') : '<small>Chưa có sản phẩm.</small>';
    return `<div class="category-manager-item category-manager-item-expanded" draggable="true" data-category-id="${category._id}" data-category-name="${category.name}"><div class="category-manager-heading"><span><span class="category-drag-handle" title="Kéo để sắp xếp">::</span><strong>${category.name}</strong><small>${category.productCount || 0} sản phẩm</small></span><div>${`<button class="btn-small" type="button" data-delete-category="${category._id}">Xóa</button>`}</div></div><div class="category-image-editor"><img src="${category.image || ''}" alt="" class="category-image-preview ${category.image ? '' : 'hidden'}"><input type="file" accept="image/*" data-category-image><button class="btn-small" type="button" data-save-category-image="${category.name}">Lưu ảnh đại diện</button></div><div class="category-product-picker"><div class="category-product-list">${productOptions}</div><button class="btn btn-secondary" type="button" data-save-category="${category.name}">Lưu sản phẩm cho danh mục</button></div></div>`;
  }).join('') : '<p class="empty-state">Chưa có danh mục.</p>';
  let draggedCategory = null;
  container.querySelectorAll('[data-category-id]').forEach(item => {
    item.addEventListener('dragstart', () => { draggedCategory = item; item.classList.add('is-dragging'); });
    item.addEventListener('dragend', async () => {
      item.classList.remove('is-dragging');
      const ids = [...container.querySelectorAll('[data-category-id]')].map(category => category.dataset.categoryId);
      const response = await fetch('/api/categories/reorder', { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ ids }) });
      if (!response.ok) showAdminToast('Không thể lưu thứ tự danh mục.', 'error');
      draggedCategory = null;
    });
    item.addEventListener('dragover', event => {
      event.preventDefault();
      if (draggedCategory && draggedCategory !== item) {
        const box = item.getBoundingClientRect();
        item.parentNode.insertBefore(draggedCategory, event.clientY < box.top + box.height / 2 ? item : item.nextSibling);
      }
    });
  });
  container.querySelectorAll('[data-save-category]').forEach(button => button.addEventListener('click', async () => {
    const item = button.closest('[data-category-name]');
    const productIds = [...item.querySelectorAll('input[type="checkbox"]:checked')].map(input => input.value);
    button.disabled = true;
    const response = await fetch(`/api/categories/by-name/${encodeURIComponent(button.dataset.saveCategory)}/products`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ productIds }) });
    const result = await response.json();
    button.disabled = false;
    if (!response.ok) return showAdminToast(result.error || 'Không thể gán sản phẩm.', 'error');
    await initProductsStorage();
    await initCategories();
    renderAdminProducts();
    renderProductGrid();
    showAdminToast('Đã cập nhật sản phẩm cho danh mục.');
  }));
  container.querySelectorAll('[data-save-category-image]').forEach(button => button.addEventListener('click', async () => {
    const item = button.closest('[data-category-name]');
    const input = item.querySelector('[data-category-image]');
    if (!input.files[0]) return showAdminToast('Hãy chọn ảnh đại diện.', 'error');
    button.disabled = true;
    const response = await fetch(`/api/categories/by-name/${encodeURIComponent(button.dataset.saveCategoryImage)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ image: await compressImage(input.files[0]) }) });
    const result = await response.json();
    button.disabled = false;
    if (!response.ok) return showAdminToast(result.error || 'Không thể lưu ảnh danh mục.', 'error');
    await initCategories();
    showAdminToast('Đã cập nhật ảnh đại diện danh mục.');
  }));
  container.querySelectorAll('[data-delete-category]').forEach(button => button.addEventListener('click', async () => {
    if (!confirm('Xóa danh mục này?')) return;
    const response = await fetch(`/api/categories/${button.dataset.deleteCategory}`, { method: 'DELETE', headers: authHeaders() });
    const result = await response.json();
    if (!response.ok) return showAdminToast(result.error || 'Không thể xóa danh mục.', 'error');
    await initCategories();
    showAdminToast('Đã xóa danh mục.');
  }));
}

function bindCategoryForm() {
  document.getElementById('categoryForm')?.addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const image = form.image.files[0] ? await compressImage(form.image.files[0]) : '';
    const response = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ name: form.name.value, image }) });
    const result = await response.json();
    if (!response.ok) return showAdminToast(result.error || 'Không thể thêm danh mục.', 'error');
    form.reset();
    await initCategories();
    showAdminToast('Đã thêm danh mục.');
  });
}

function persistProducts() {
  try {
    localStorage.setItem(PRODUCT_LIST_KEY, JSON.stringify(products));
  } catch (storageError) {
    console.warn('Product cache unavailable; product was still saved remotely', storageError);
  }
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
  const normalizedId = String(productId);
  const existing = cart.find(item => String(item.id) === normalizedId);
  if (existing) {
    existing.qty += quantity;
  } else {
    cart.push({ id: normalizedId, qty: quantity });
  }
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
  const cartPage = document.getElementById("cartItems");
  if (cartPage) renderCartPage();
  alert("Đã thêm sản phẩm vào giỏ hàng!");
}

function updateQty(productId, delta) {
  const normalizedId = String(productId);
  const item = cart.find(item => String(item.id) === normalizedId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(item => String(item.id) !== normalizedId);
  }
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
  renderCartPage();
}

function renderProductGrid(containerId = "productGrid", options = {}) {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  const search = (options.search ?? document.getElementById("searchInput")?.value ?? "").toLowerCase();
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
        <span class="badge">${product.badge || 'Mới'}</span>
        <button class="wishlist" type="button">Yêu thích</button>
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-body">
        <div class="product-meta">
          <span>${product.category}</span>
          <span class="rating">Đánh giá ${product.rating || 5}</span>
        </div>
        <h3 class="product-name">${product.name}</h3>
        <div class="price-row">
          <span class="price">${formatMoney(product.price)}</span>
          <span class="old-price">${product.oldPrice ? formatMoney(product.oldPrice) : ''}</span>
        </div>
        <div class="product-actions">
          <button class="btn btn-primary" data-add-cart="${product.id}">Thêm vào giỏ</button>
          <button class="btn-small" data-view-product="${product.id}">Xem</button>
        </div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll("[data-add-cart]").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.addCart));
  });

  document.querySelectorAll("[data-view-product]").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.href = `${pageUrl('chi-tiet-san-pham.html')}?id=${btn.dataset.viewProduct}`;
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

  const productMap = new Map(products.map(product => [String(product.id), product]));
  let subtotal = 0;

  const validCart = cart.filter(item => productMap.has(String(item.id)) && Number(item.qty) > 0);
  const missingCount = cart.length - validCart.length;
  if (missingCount) {
    cart = validCart;
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(cart));
  }
  if (!validCart.length) {
    cartItems.innerHTML = `<div style="padding: 30px 12px; text-align: center; color: var(--muted);">Giỏ hàng của bạn đang trống hoặc sản phẩm đã không còn tồn tại.</div>`;
    updateOrderSummary(0);
    updateCartBadge();
    return;
  }

  cartItems.innerHTML = validCart.map(item => {
    const product = productMap.get(String(item.id));
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
    orders: document.getElementById("ordersPanel"),
    profile: document.getElementById("profilePanel")
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

function renderAuthState() {
  const user = JSON.parse(localStorage.getItem('nvtUser') || 'null');
  document.querySelectorAll('.nav-actions a[href$="tai-khoan.html"]').forEach(link => {
    if (user && user.role === 'customer') {
      link.textContent = user.name || 'Tài khoản';
      link.classList.add('account-link');
      link.href = '#';
      link.setAttribute('aria-haspopup', 'true');
      const wrapper = document.createElement('div');
      wrapper.className = 'account-menu-wrap';
      link.parentNode.insertBefore(wrapper, link);
      wrapper.appendChild(link);
      const menu = document.createElement('div');
      menu.className = 'account-menu hidden';
      menu.innerHTML = `<a href="${pageUrl('tai-khoan.html')}#profile">Thông tin tài khoản</a><a href="${pageUrl('tai-khoan.html')}#orders">Đơn hàng</a><button type="button" data-account-logout>Đăng xuất</button>`;
      wrapper.appendChild(menu);
      link.addEventListener('click', event => {
        event.preventDefault();
        menu.classList.toggle('hidden');
      });
      menu.querySelector('[data-account-logout]').addEventListener('click', () => {
        localStorage.removeItem(CUSTOMER_AUTH_TOKEN_KEY);
        localStorage.removeItem(CUSTOMER_SESSION_STARTED_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem('nvtUser');
        window.location.href = pageUrl('index.html');
      });
    }
  });
}

async function setupCustomerAccount() {
  const profile = document.getElementById('profilePanel');
  if (!profile) return;
  const token = readValidToken(CUSTOMER_AUTH_TOKEN_KEY);
  if (!token) return;
  const response = await fetch('/api/users/me', { headers: authHeaders() });
  if (!response.ok) return;
  const user = await response.json();
  localStorage.setItem('nvtUser', JSON.stringify({ id: user._id, name: user.name, email: user.email, role: user.role }));
  profile.querySelector('[name="name"]').value = user.name || '';
  profile.querySelector('[name="email"]').value = user.email || '';
  profile.querySelector('[name="phone"]').value = user.phone || '';
  profile.querySelector('[name="address"]').value = user.address || '';
  document.getElementById('loginPanel')?.classList.add('hidden');
  document.getElementById('registerPanel')?.classList.add('hidden');
  profile.classList.remove('hidden');
  profile.closest('.account-panel')?.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('active', tab.dataset.tab === 'profile'));
  if (location.hash === '#orders') profile.closest('.account-panel')?.querySelector('[data-tab="orders"]')?.click();
  profile.addEventListener('submit', async event => {
    event.preventDefault();
    const update = await fetch('/api/users/me', { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(Object.fromEntries(new FormData(profile))) });
    const result = await update.json();
    const message = document.getElementById('profileMessage');
    message.textContent = update.ok ? 'Đã cập nhật thông tin.' : (result.error || 'Không thể cập nhật thông tin.');
    if (update.ok) {
      localStorage.setItem('nvtUser', JSON.stringify({ id: result._id, name: result.name, email: result.email, role: result.role }));
      renderAuthState();
    }
  });
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem(CUSTOMER_AUTH_TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_SESSION_STARTED_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem('nvtUser');
    window.location.href = pageUrl('index.html');
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
    btn.addEventListener('click', () => openProductForm(btn.dataset.edit));
  });
  tbody.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => deleteProduct(btn.dataset.delete));
  });
}

function showAdminToast(message, type = 'success') {
  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `admin-toast ${type}`;
  clearTimeout(showAdminToast.timer);
  showAdminToast.timer = setTimeout(() => toast.classList.remove('visible'), 3200);
  requestAnimationFrame(() => toast.classList.add('visible'));
}

async function openProductForm(id) {
  const form = document.getElementById('productForm');
  if (!form) return;
  form.reset();
  form.dataset.editId = '';
  selectedProductImages = [];
  productImagesChanged = false;
  form.querySelector('#productCategory').innerHTML = `<option value="">Chọn danh mục</option>${categories.map(category => `<option value="${category.name}">${category.name}</option>`).join('')}`;
  productAttributes = [];
  productVariants = [];
  removedVariantNames = new Set();
  form.querySelector('#productDescription').innerHTML = '';
  form.querySelector('#productTechnicalSpecs').innerHTML = '';
  renderImagePreviews();
  renderVariantModule();
  if (id) {
    let p = products.find(x => String(x.id) === String(id));
    if (!p) return alert('Sản phẩm không tồn tại');
    if (!p.images?.length) {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (response.ok) p = normalizeProduct(await response.json());
      } catch (error) {
        return alert('Không thể tải đầy đủ thông tin sản phẩm');
      }
    }
    form.dataset.editId = id;
    form.querySelector('[name="name"]').value = p.name || '';
    form.querySelector('[name="category"]').value = p.category || '';
    form.querySelector('[name="price"]').value = p.price || '';
    form.querySelector('[name="oldPrice"]').value = p.oldPrice || '';
    form.querySelector('[name="badge"]').value = p.badge || '';
    form.querySelector('[name="image"]').value = p.image || '';
    form.querySelector('[name="material"]').value = p.material || '';
    form.querySelector('[name="size"]').value = p.size || '';
    form.querySelector('#productDescription').innerHTML = p.description || '';
    form.querySelector('[name="shortDescription"]').value = p.shortDescription || '';
    form.querySelector('#productTechnicalSpecs').innerHTML = p.technicalSpecs || '';
    form.querySelector('[name="brand"]').value = p.brand || '';
    selectedProductImages = p.images && p.images.length ? [...p.images] : (p.image ? [p.image] : []);
    productAttributes = Array.isArray(p.attributes) ? p.attributes.map(attribute => ({ name: attribute.name || '', values: [...(attribute.values || [])] })) : [];
    productVariants = Array.isArray(p.variants) ? p.variants.map(variant => ({ ...variant, values: [...(variant.values || [])] })) : [];
    if (!productAttributes.length && productVariants.length) {
      const attributeValues = new Map();
      productVariants.forEach(variant => (variant.values || []).forEach((value, index) => {
        if (!attributeValues.has(index)) attributeValues.set(index, new Set());
        attributeValues.get(index).add(value);
      }));
      productAttributes = [...attributeValues.values()].map((values, index) => ({ name: `Thuộc tính ${index + 1}`, values: [...values] }));
    }
    if (productAttributes.length && productVariants.length) {
      const savedVariantNames = new Set(productVariants.map(variant => variant.name));
      const generatedNames = generateVariants(productAttributes, []).map(variant => variant.name);
      removedVariantNames = new Set(generatedNames.filter(name => !savedVariantNames.has(name)));
    }
    renderImagePreviews();
    renderVariantModule();
  }
  const title = document.getElementById('productFormTitle');
  if (title) title.textContent = id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới';
  document.getElementById('productFormWrap').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeProductForm() {
  const wrap = document.getElementById('productFormWrap');
  if (wrap) wrap.classList.add('hidden');
}

function renderImagePreviews() {
  const preview = document.getElementById('imagePreview');
  if (!preview) return;
  preview.innerHTML = selectedProductImages.map((image, index) => `
    <div class="image-preview-item">
      <img src="${image}" alt="Ảnh sản phẩm ${index + 1}">
      <button type="button" data-remove-image="${index}">Xóa</button>
    </div>
  `).join('');
  preview.querySelectorAll('[data-remove-image]').forEach(button => {
    button.addEventListener('click', () => {
      selectedProductImages.splice(Number(button.dataset.removeImage), 1);
      productImagesChanged = true;
      renderImagePreviews();
    });
  });
}

function removeEdgeBlackBackground(context, width, height) {
  const imageData = context.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  const visited = new Uint8Array(width * height);
  const queue = [];
  const isBackground = index => {
    const alpha = pixels[index + 3];
    return alpha > 0 && pixels[index] < 55 && pixels[index + 1] < 55 && pixels[index + 2] < 55;
  };
  const add = (x, y) => {
    const position = y * width + x;
    if (visited[position]) return;
    const index = position * 4;
    if (!isBackground(index)) return;
    visited[position] = 1;
    queue.push(position);
  };
  for (let x = 0; x < width; x += 1) { add(x, 0); add(x, height - 1); }
  for (let y = 1; y < height - 1; y += 1) { add(0, y); add(width - 1, y); }
  while (queue.length) {
    const position = queue.pop();
    const x = position % width;
    const y = Math.floor(position / width);
    pixels[position * 4 + 3] = 0;
    if (x > 0) add(x - 1, y);
    if (x < width - 1) add(x + 1, y);
    if (y > 0) add(x, y - 1);
    if (y < height - 1) add(x, y + 1);
  }
  context.putImageData(imageData, 0, 0);
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSize = 1600;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const cornerPixels = [
          context.getImageData(0, 0, 1, 1).data,
          context.getImageData(canvas.width - 1, 0, 1, 1).data,
          context.getImageData(0, canvas.height - 1, 1, 1).data,
          context.getImageData(canvas.width - 1, canvas.height - 1, 1, 1).data
        ];
        const hasBlackCorners = cornerPixels.every(pixel => pixel[3] > 0 && pixel[0] < 55 && pixel[1] < 55 && pixel[2] < 55);
        if (hasBlackCorners) removeEdgeBlackBackground(context, canvas.width, canvas.height);
        const hasTransparency = file.type === 'image/png' || file.type === 'image/webp' || hasBlackCorners;
        resolve(hasTransparency ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.78));
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function readImageFiles(files) {
  return Promise.all([...files].map(compressImage));
}

function generateVariants(attributes, previousVariants = []) {
  const usable = attributes.filter(attribute => attribute.name.trim() && attribute.values.length);
  if (!usable.length) return [];
  const combinations = usable.reduce((result, attribute) => result.flatMap(prefix => attribute.values.map(value => [...prefix, value])), [[]]);
  const previousByName = new Map(previousVariants.map(variant => [variant.name, variant]));
  return combinations.map(values => {
    const selections = values.map((value, index) => ({ name: usable[index].name, value }));
    const name = selections.map(selection => `${selection.name}: ${selection.value}`).join(' - ');
    const previous = previousByName.get(name);
    return { name, values, selections, price: previous?.price || 0, oldPrice: previous?.oldPrice || 0, active: previous?.active !== false };
  }).filter(variant => !removedVariantNames.has(variant.name));
}

function renderVariantModule() {
  const builder = document.getElementById('attributeBuilder');
  if (!builder) return;
  builder.innerHTML = AttributeBuilder(productAttributes);
  bindAttributeBuilder();
  productVariants = generateVariants(productAttributes, productVariants);
  const table = document.getElementById('variantTable');
  if (table) {
    table.innerHTML = `${VariantTable(productVariants)}${CustomVariantBuilder(productAttributes)}`;
    bindVariantTable();
    bindCustomVariantBuilder();
  }
}

function AttributeBuilder(attributes) {
  return attributes.map((attribute, index) => `<div class="attribute-card" data-attribute-index="${index}">
    <div class="attribute-card-head"><input data-attribute-name value="${attribute.name}" placeholder="Tên thuộc tính, ví dụ: Độ dày"><button class="btn-small" type="button" data-remove-attribute="${index}">Xóa nhóm</button></div>
    <div class="attribute-tags">${attribute.values.map((value, valueIndex) => `<span class="attribute-tag">${value}<button type="button" data-remove-value="${valueIndex}">x</button></span>`).join('')}</div>
    <input data-add-value placeholder="Nhập giá trị rồi nhấn Enter">
  </div>`).join('');
}

function VariantTable(variants) {
  if (!variants.length) return '<div class="variant-empty">Thêm thuộc tính và giá trị để tự động tạo biến thể.</div>';
  return `<div class="bulk-toolbar"><span>Cập nhật nhanh</span><input id="bulkPrice" type="number" min="0" placeholder="Giá bán chung"><input id="bulkOldPrice" type="number" min="0" placeholder="Giá giảm chung"><button class="btn btn-secondary" id="applyBulkPrice" type="button">Áp dụng tất cả</button></div><div class="variant-table-scroll"><table><thead><tr><th>Tên biến thể</th><th>Giá bán</th><th>Giá giảm</th><th>Trạng thái</th><th></th></tr></thead><tbody>${variants.map((variant, index) => `<tr data-variant-index="${index}"><td>${variant.name}</td><td><input data-variant-field="price" type="number" min="0" value="${variant.price || ''}"></td><td><input data-variant-field="oldPrice" type="number" min="0" value="${variant.oldPrice || ''}"></td><td><button class="variant-status ${variant.active !== false ? 'active' : ''}" type="button" data-toggle-variant>${variant.active !== false ? 'Đang bán' : 'Tạm ẩn'}</button></td><td><button class="variant-remove" type="button" data-remove-generated-variant aria-label="Xóa biến thể">x</button></td></tr>`).join('')}</tbody></table></div>`;
}

function CustomVariantBuilder(attributes) {
  const usable = attributes.filter(attribute => attribute.name.trim() && attribute.values.length);
  if (!usable.length) return '';
  return `<div class="custom-variant-builder"><div><strong>Tạo biến thể tùy chọn</strong><small>Chọn một giá trị ở mỗi thuộc tính để thêm lựa chọn riêng.</small></div><div class="custom-variant-fields">${usable.map((attribute, index) => `<label>${attribute.name}<select data-custom-attribute="${index}"><option value="">Chọn giá trị</option>${attribute.values.map(value => `<option value="${value}">${value}</option>`).join('')}</select></label>`).join('')}</div><button class="btn btn-secondary" id="createCustomVariant" type="button">Thêm biến thể đã chọn</button></div>`;
}

function bindCustomVariantBuilder() {
  document.getElementById('createCustomVariant')?.addEventListener('click', () => {
    const fields = [...document.querySelectorAll('[data-custom-attribute]')];
    if (fields.some(field => !field.value)) return showAdminToast('Hãy chọn đủ giá trị cho các thuộc tính.', 'error');
    const selections = fields.map(field => ({ name: productAttributes[Number(field.dataset.customAttribute)].name, value: field.value }));
    const name = selections.map(selection => `${selection.name}: ${selection.value}`).join(' - ');
    if (productVariants.some(variant => variant.name === name)) return showAdminToast('Biến thể này đã tồn tại.', 'error');
    productVariants.push({ name, values: selections.map(selection => selection.value), selections, price: 0, oldPrice: 0, active: true });
    renderVariantModule();
    showAdminToast('Đã thêm biến thể tùy chọn.');
  });
}

function bindAttributeBuilder() {
  document.querySelectorAll('[data-attribute-name]').forEach(input => input.addEventListener('input', event => {
    const index = Number(event.target.closest('[data-attribute-index]').dataset.attributeIndex);
    productAttributes[index].name = event.target.value;
    productVariants = generateVariants(productAttributes, productVariants);
    const table = document.getElementById('variantTable');
    if (table) {
      table.innerHTML = VariantTable(productVariants);
      bindVariantTable();
    }
  }));
  const addValues = input => {
    const values = input.value.split('|').map(value => value.trim()).filter(Boolean);
    const index = Number(input.closest('[data-attribute-index]').dataset.attributeIndex);
    values.forEach(value => {
      if (!productAttributes[index].values.includes(value)) productAttributes[index].values.push(value);
    });
    input.value = '';
    renderVariantModule();
  };
  document.querySelectorAll('[data-add-value]').forEach(input => input.addEventListener('input', event => {
    if (event.target.value.includes('|')) addValues(event.target);
  }));
  document.querySelectorAll('[data-add-value]').forEach(input => input.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (event.target.value.trim()) addValues(event.target);
  }));
  document.querySelectorAll('[data-add-value]').forEach(input => input.addEventListener('blur', event => {
    if (event.target.value.trim()) addValues(event.target);
  }));
  document.querySelectorAll('[data-remove-value]').forEach(button => button.addEventListener('click', event => {
    const card = event.target.closest('[data-attribute-index]');
    productAttributes[Number(card.dataset.attributeIndex)].values.splice(Number(button.dataset.removeValue), 1);
    renderVariantModule();
  }));
  document.querySelectorAll('[data-remove-attribute]').forEach(button => button.addEventListener('click', () => {
    productAttributes.splice(Number(button.dataset.removeAttribute), 1);
    renderVariantModule();
  }));
}

function bindVariantTable() {
  document.querySelectorAll('[data-variant-field]').forEach(input => input.addEventListener('input', event => {
    const index = Number(event.target.closest('[data-variant-index]').dataset.variantIndex);
    productVariants[index][event.target.dataset.variantField] = Number(event.target.value) || 0;
  }));
  document.querySelectorAll('[data-toggle-variant]').forEach(button => button.addEventListener('click', event => {
    const index = Number(event.target.closest('[data-variant-index]').dataset.variantIndex);
    productVariants[index].active = productVariants[index].active === false;
    event.target.classList.toggle('active', productVariants[index].active);
    event.target.textContent = productVariants[index].active ? 'Đang bán' : 'Tạm ẩn';
  }));
  document.querySelectorAll('[data-remove-generated-variant]').forEach(button => button.addEventListener('click', event => {
    const row = event.target.closest('[data-variant-index]');
    const index = Number(row.dataset.variantIndex);
    const variant = productVariants[index];
    if (!variant) return;
    removedVariantNames.add(variant.name);
    productVariants.splice(index, 1);
    renderVariantModule();
    showAdminToast('Đã xóa biến thể khỏi danh sách.');
  }));
  document.getElementById('applyBulkPrice')?.addEventListener('click', () => {
    const price = Number(document.getElementById('bulkPrice').value);
    const oldPrice = Number(document.getElementById('bulkOldPrice').value);
    productVariants = productVariants.map(variant => ({ ...variant, price: price || variant.price, oldPrice: oldPrice || variant.oldPrice }));
    renderVariantModule();
  });
}

function bindAdminProductForm() {
  const form = document.getElementById('productForm');
  if (!form) return;
  document.querySelectorAll('.rich-editor').forEach(editor => editor.addEventListener('paste', async event => {
    const imageFiles = [...(event.clipboardData?.files || [])].filter(file => file.type.startsWith('image/'));
    if (!imageFiles.length) return;
    event.preventDefault();
    const images = await Promise.all(imageFiles.map(compressImage));
    images.forEach(image => document.execCommand('insertHTML', false, `<img src="${image}" alt="Ảnh sản phẩm">`));
  }));
  const imageInput = document.getElementById('productImages');
  if (imageInput) imageInput.addEventListener('change', async event => {
    try {
      selectedProductImages = await readImageFiles(event.target.files);
      productImagesChanged = true;
      renderImagePreviews();
    } catch (error) {
      alert('Không thể đọc ảnh đã chọn');
    }
  });
  document.querySelectorAll('[data-close-product-form]').forEach(button => {
    button.addEventListener('click', closeProductForm);
  });
  const openButton = document.getElementById('openProductFormBtn');
  if (openButton) openButton.addEventListener('click', () => openProductForm());
  const refreshButton = document.getElementById('refreshProductsBtn');
  if (refreshButton) refreshButton.addEventListener('click', renderAdminProducts);
  const addAttributeButton = document.getElementById('addAttributeBtn');
  if (addAttributeButton) addAttributeButton.addEventListener('click', () => {
    productAttributes.push({ name: '', values: [] });
    renderVariantModule();
  });
  form.addEventListener('submit', saveProductFromForm);
}

async function saveProductFromForm(e) {
  if (e && e.preventDefault) e.preventDefault();
  const form = document.getElementById('productForm');
  if (!form) return;
  if (form.dataset.saving === 'true') return;
  const id = form.dataset.editId || null;
  const submitButton = form.querySelector('button[type="submit"]');
  const data = {
    name: form.querySelector('[name="name"]').value.trim(),
    category: form.querySelector('[name="category"]').value.trim(),
    price: Number(form.querySelector('[name="price"]').value) || productVariants.find(variant => variant.active !== false)?.price || 0,
    oldPrice: Number(form.querySelector('[name="oldPrice"]').value) || productVariants.find(variant => variant.active !== false)?.oldPrice || 0,
    badge: form.querySelector('[name="badge"]').value.trim(),
    image: form.querySelector('[name="image"]').value.trim(),
    ...(productImagesChanged || !id ? { images: selectedProductImages.length ? [...selectedProductImages] : [] } : {}),
    material: form.querySelector('[name="material"]').value.trim(),
    size: form.querySelector('[name="size"]').value.trim(),
    description: form.querySelector('#productDescription').innerHTML.trim(),
    shortDescription: form.querySelector('[name="shortDescription"]').value.trim(),
    technicalSpecs: form.querySelector('#productTechnicalSpecs').innerHTML.trim(),
    brand: form.querySelector('[name="brand"]').value.trim() || 'Nệm Văn Thanh'
    ,attributes: productAttributes.filter(attribute => attribute.name && attribute.values.length)
    ,variants: productVariants
  };

  if (!data.name) return alert('Tên sản phẩm không được để trống');
  if (!data.image && data.images.length) data.image = data.images[0];
  form.dataset.saving = 'true';
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = id ? 'Đang cập nhật...' : 'Đang lưu...';
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);
    const response = await fetch(id ? `/api/products/${id}` : '/api/products', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || 'Không thể lưu sản phẩm');
    }
    const savedProduct = normalizeProduct(await response.json());
    if (id) {
      const idx = products.findIndex(p => String(p.id) === String(id));
      if (idx === -1) return alert('Sản phẩm không tồn tại');
      products[idx] = { ...products[idx], ...savedProduct };
    } else {
      products.push(savedProduct);
    }
  } catch (error) {
    const message = error.name === 'AbortError' ? 'Lưu quá lâu và đã bị hủy. Hãy thử lại.' : `Lưu sản phẩm thất bại: ${error.message}`;
    showAdminToast(message, 'error');
    form.dataset.saving = 'false';
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = id ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm';
    }
    return;
  }

  persistProducts();
  renderAdminProducts();
  renderProductGrid();
  closeProductForm();
  form.dataset.saving = 'false';
  showAdminToast(id ? 'Đã cập nhật sản phẩm trong MongoDB.' : 'Đã thêm sản phẩm vào MongoDB.');
}

async function deleteProduct(id) {
  if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
  const row = document.querySelector(`[data-delete="${id}"]`)?.closest('tr');
  if (row?.dataset.deleting === 'true') return;
  if (row) {
    row.dataset.deleting = 'true';
    row.querySelectorAll('button').forEach(button => {
      button.disabled = true;
      if (button.dataset.delete === String(id)) button.textContent = 'Đang xóa...';
    });
  }
  try {
    const response = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!response.ok) throw new Error('Không thể xóa sản phẩm');
    products = products.filter(p => String(p.id) !== String(id));
  } catch (error) {
    if (row) {
      row.dataset.deleting = 'false';
      row.querySelectorAll('button').forEach(button => button.disabled = false);
    }
    showAdminToast('Xóa sản phẩm thất bại. Hãy kiểm tra server.', 'error');
    return;
  }
  persistProducts();
  renderAdminProducts();
  renderProductGrid();
  showAdminToast('Đã xóa sản phẩm khỏi MongoDB.');
}

async function renderProductDetail() {
  const root = document.getElementById("productDetail");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id") || "1";
  let product = products.find(item => String(item.id) === String(productId)) || products[0];
  if (!product) return;
  if (!product.images?.length || product.images.length < 2) {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) product = normalizeProduct(await response.json());
    } catch (error) {
      console.warn('Could not load product gallery', error);
    }
  }
  const productImages = product.images && product.images.length ? product.images : [product.image];
  const discountAmount = Math.max(0, (product.oldPrice || 0) - product.price);
  const discountPercent = product.oldPrice ? Math.round((discountAmount / product.oldPrice) * 100) : 0;
  const variants = Array.isArray(product.variants) && product.variants.length ? product.variants : [{ name: 'Tiêu chuẩn', thickness: '', width: product.size || '', material: product.material || '', price: product.price, oldPrice: product.oldPrice }];
  const firstVariant = variants[0];
  const firstValues = firstVariant.values || [firstVariant.width, firstVariant.thickness, firstVariant.material].filter(Boolean);
  const variantAttributes = product.attributes?.length ? product.attributes : (firstVariant.selections?.length ? firstVariant.selections.map(selection => ({ name: selection.name, values: [...new Set(variants.map(variant => variant.selections?.find(item => item.name === selection.name)?.value).filter(Boolean))] })) : []);
  const relatedProducts = products
    .filter(item => String(item.id) !== String(product.id) && (item.category === product.category || item.brand === product.brand))
    .slice(0, 4);

  root.innerHTML = `
    <div class="detail-top">
      <div class="detail-gallery">
        <div class="detail-main-frame">
          <span class="detail-badge">${product.badge || 'Được yêu thích'}</span>
          <img class="detail-main-image" id="detailMainImage" src="${productImages[0]}" alt="${product.name}">
          <button class="gallery-control gallery-prev" type="button" id="galleryPrev">Trước</button>
          <button class="gallery-control gallery-next" type="button" id="galleryNext">Sau</button>
        </div>
        <div class="thumbs" role="tablist">${productImages.map((image, index) => `<button class="thumb ${index === 0 ? 'active' : ''}" type="button" data-image-index="${index}" role="tab"><img src="${image}" alt="${product.name}, ảnh ${index + 1}"></button>`).join('')}</div>
        <p class="gallery-count"><span id="galleryCurrent">1</span> / ${productImages.length} ảnh</p>
      </div>
      <div class="detail-box">
        <span class="eyebrow">${product.category}</span>
        <h1>${product.name}</h1>
        <div class="detail-summary">${product.shortDescription || 'Thiết kế êm ái, nâng đỡ cơ thể và mang lại cảm giác thư giãn trọn vẹn cho giấc ngủ mỗi ngày.'}</div>
        <div class="detail-rating">Đánh giá ${product.rating || 5} <span>•</span> ${product.reviews || 0} nhận xét</div>
        <div class="detail-price">
          <span class="price" id="detailPrice">${formatMoney(firstVariant.price)}</span>
          <span class="old-price" id="detailOldPrice">${firstVariant.oldPrice ? formatMoney(firstVariant.oldPrice) : ''}</span>
          <span class="discount-label" id="detailDiscount">${firstVariant.oldPrice > firstVariant.price ? `-${Math.round(((firstVariant.oldPrice - firstVariant.price) / firstVariant.oldPrice) * 100)}%` : ''}</span>
        </div>
        <p class="saving-note" id="detailSaving">${firstVariant.oldPrice > firstVariant.price ? `Tiết kiệm ${formatMoney(firstVariant.oldPrice - firstVariant.price)}` : ''}</p>
        <div class="detail-option">
          <strong>Chọn thông số</strong>
          <div class="detail-selects">${variantAttributes.map((attribute, index) => `<label class="detail-select-field"><span>${attribute.name}</span><select data-detail-attribute="${index}">${attribute.values.map(value => `<option value="${value}" ${firstVariant.selections?.find(selection => selection.name === attribute.name)?.value === value ? 'selected' : ''}>${value}</option>`).join('')}</select></label>`).join('')}</div>
          <p class="selected-spec" id="selectedSpec">${firstValues.join(' / ')}</p>
        </div>
        <div class="purchase-row">
          <div class="qty-box"><button type="button" id="detailMinus">-</button><span id="detailQty">1</span><button type="button" id="detailPlus">+</button></div>
          <button class="btn btn-secondary" id="addDetailCart" type="button">Thêm vào giỏ</button>
        </div>
        <button class="btn btn-primary checkout-button" id="buyNowBtn" type="button">Mua ngay</button>
        <div class="detail-promises"><span>Giao hàng nhanh</span><span>Bảo hành rõ ràng</span><span>Đổi trả linh hoạt</span></div>
      </div>
    </div>
    <section class="detail-information">
      <div class="detail-description">
        <span class="eyebrow">Thông tin sản phẩm</span>
        <h2>Thoải mái hơn trong từng chuyển động</h2>
        <div class="rich-content">${product.description || 'Sản phẩm được hoàn thiện từ vật liệu chọn lọc, cân bằng giữa độ êm và khả năng nâng đỡ. Bề mặt thoáng khí giúp duy trì cảm giác dễ chịu trong suốt thời gian nghỉ ngơi.'}</div>
      </div>
      <div class="detail-specs">
        <div><span>Thương hiệu</span><strong>${product.brand || 'Nệm Văn Thanh'}</strong></div>
        <div><span>Chất liệu</span><strong>${product.material || 'Đang cập nhật'}</strong></div>
        <div><span>Kích thước</span><strong>${product.size || 'Đang cập nhật'}</strong></div>
        <div><span>Tình trạng</span><strong>Còn hàng</strong></div>
        <div class="technical-specs"><span>Thông số kỹ thuật</span><div class="rich-content">${product.technicalSpecs || 'Đang cập nhật'}</div></div>
      </div>
    </section>
    <section class="related-products">
      <div class="related-heading"><div><span class="eyebrow">Có thể bạn sẽ thích</span><h2>Sản phẩm liên quan</h2></div><a href="san-pham.html">Xem tất cả</a></div>
      <div class="product-grid related-grid">${relatedProducts.map(item => `<article class="product-card"><div class="product-media"><img src="${item.image}" alt="${item.name}"></div><div class="product-body"><div class="product-meta"><span>${item.category}</span><span>Đánh giá ${item.rating || 5}</span></div><h3 class="product-name">${item.name}</h3><div class="price-row"><span class="price">${formatMoney(item.price)}</span><span class="old-price">${item.oldPrice ? formatMoney(item.oldPrice) : ''}</span></div><div class="product-actions"><button class="btn btn-primary" type="button" data-related-add="${item.id}">Thêm vào giỏ</button><button class="btn-small" type="button" data-related-view="${item.id}">Xem</button></div></div></article>`).join('')}</div>
    </section>
  `;

  const qtyEl = document.getElementById("detailQty");
  let currentImage = 0;
  const mainImage = document.getElementById('detailMainImage');
  const updateGallery = index => {
    currentImage = (index + productImages.length) % productImages.length;
    mainImage.src = productImages[currentImage];
    document.getElementById('galleryCurrent').textContent = currentImage + 1;
    document.querySelectorAll('.thumb').forEach((thumb, thumbIndex) => thumb.classList.toggle('active', thumbIndex === currentImage));
  };
  document.getElementById('galleryPrev')?.addEventListener('click', () => updateGallery(currentImage - 1));
  document.getElementById('galleryNext')?.addEventListener('click', () => updateGallery(currentImage + 1));
  document.querySelectorAll('.thumb').forEach(thumb => thumb.addEventListener('click', () => updateGallery(Number(thumb.dataset.imageIndex))));

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

  const addSelectedProduct = () => {
    const qty = Number(qtyEl.textContent || 1);
    addToCart(product.id, qty);
  };
  document.getElementById("addDetailCart")?.addEventListener("click", addSelectedProduct);
  document.getElementById("buyNowBtn")?.addEventListener("click", () => {
    addSelectedProduct();
    window.location.href = pageUrl('thanh-toan.html');
  });

  const updateSelectedVariant = () => {
      const selections = [...document.querySelectorAll('[data-detail-attribute]')].map(select => ({ name: variantAttributes[Number(select.dataset.detailAttribute)].name, value: select.value }));
      const selected = variants.find(variant => selections.every(selection => variant.selections?.some(item => item.name === selection.name && item.value === selection.value)));
      if (!selected) {
        document.getElementById('selectedSpec').textContent = 'Thông số này hiện chưa có sẵn';
        return;
      }
      document.getElementById('detailPrice').textContent = formatMoney(selected.price);
      document.getElementById('detailOldPrice').textContent = selected.oldPrice ? formatMoney(selected.oldPrice) : '';
      document.getElementById('detailDiscount').textContent = selected.oldPrice > selected.price ? `-${Math.round(((selected.oldPrice - selected.price) / selected.oldPrice) * 100)}%` : '';
      document.getElementById('detailSaving').textContent = selected.oldPrice > selected.price ? `Tiết kiệm ${formatMoney(selected.oldPrice - selected.price)}` : '';
      document.getElementById('selectedSpec').textContent = (selected.values || [selected.width, selected.thickness, selected.material].filter(Boolean)).join(' / ');
  };
  document.querySelectorAll('[data-detail-attribute]').forEach(select => select.addEventListener('change', updateSelectedVariant));
  document.querySelectorAll('[data-related-add]').forEach(btn => btn.addEventListener('click', () => addToCart(btn.dataset.relatedAdd)));
  document.querySelectorAll('[data-related-view]').forEach(btn => btn.addEventListener('click', () => {
    window.location.href = `${pageUrl('chi-tiet-san-pham.html')}?id=${btn.dataset.relatedView}`;
  }));
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
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    const items = cart.map(item => {
      const product = products.find(product => String(product.id) === String(item.id));
      return { productId: product?._id || product?.id, qty: item.qty, price: product?.price || 0 };
    }).filter(item => item.productId);
    if (!items.length) return alert('Giỏ hàng đang trống.');
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    try {
      const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ customer: { name: values.name, phone: values.phone, email: values.email, address: values.address, city: values.city }, items, total, paymentMethod: values.paymentMethod, note: values.note, userId: JSON.parse(localStorage.getItem('nvtUser') || 'null')?.id }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Không thể tạo đơn');
      localStorage.setItem('nvtLastOrder', JSON.stringify(result.order));
      if (result.token) {
        localStorage.setItem(CUSTOMER_AUTH_TOKEN_KEY, result.token);
        localStorage.setItem(CUSTOMER_SESSION_STARTED_KEY, String(Date.now()));
        localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
        localStorage.removeItem(ADMIN_SESSION_STARTED_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.setItem('nvtUser', JSON.stringify({ id: result.order.userId, name: values.name, email: values.email, role: 'customer' }));
      }
      cart = [];
      localStorage.setItem(PRODUCT_STORAGE_KEY, '[]');
      updateCartBadge();
      alert(result.accountCreated ? 'Đặt hàng thành công. Tài khoản khách hàng đã được tạo, chờ xác nhận đơn.' : 'Đặt hàng thành công. Đơn hàng đang chờ xác nhận.');
      window.location.href = pageUrl('tai-khoan.html');
    } catch (error) { alert(`Không thể đặt hàng: ${error.message}`); }
  });
}

function bindAccountForms() {
  const login = document.getElementById('loginPanel');
  const register = document.getElementById('registerPanel');
  login?.addEventListener('submit', async event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(login));
    const response = await fetch('/api/users/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) return alert(result.error || 'Đăng nhập thất bại');
    const isAdmin = ['admin', 'manager'].includes(result.user.role);
    const tokenKey = isAdmin ? ADMIN_AUTH_TOKEN_KEY : CUSTOMER_AUTH_TOKEN_KEY;
    const sessionKey = isAdmin ? ADMIN_SESSION_STARTED_KEY : CUSTOMER_SESSION_STARTED_KEY;
    localStorage.removeItem(isAdmin ? CUSTOMER_AUTH_TOKEN_KEY : ADMIN_AUTH_TOKEN_KEY);
    localStorage.removeItem(isAdmin ? CUSTOMER_SESSION_STARTED_KEY : ADMIN_SESSION_STARTED_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.setItem(tokenKey, result.token); localStorage.setItem(sessionKey, String(Date.now())); localStorage.setItem('nvtUser', JSON.stringify(result.user));
    window.location.href = result.user.role === 'admin' || result.user.role === 'manager' ? pageUrl('admin.html') : pageUrl('index.html');
  });
  register?.addEventListener('submit', async event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(register));
    const response = await fetch('/api/users/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) return alert(result.error || 'Đăng ký thất bại');
    localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
    localStorage.removeItem(ADMIN_SESSION_STARTED_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.setItem(CUSTOMER_AUTH_TOKEN_KEY, result.token); localStorage.setItem('nvtUser', JSON.stringify(result.user));
    window.location.href = pageUrl('index.html');
  });
  const ordersPanel = document.getElementById('ordersPanel');
  if (ordersPanel && getAuthToken()) {
    fetch('/api/orders', { headers: authHeaders() }).then(response => response.ok ? response.json() : []).then(orders => {
      ordersPanel.innerHTML = orders.length ? orders.map(order => `<div class="order-item"><div><strong>${order._id}</strong><br><small>${new Date(order.createdAt).toLocaleDateString('vi-VN')}</small></div><div class="status pending">${order.status}</div><strong>${formatMoney(order.total || 0)}</strong></div>`).join('') : '<p>Chưa có đơn hàng.</p>';
    });
  }
}

async function guardAdminPage() {
  if (!document.getElementById('adminProducts')) return true;
  const token = readValidToken(ADMIN_AUTH_TOKEN_KEY);
  if (!token) {
    window.location.href = pageUrl('tai-khoan.html');
    return false;
  }
  const response = await fetch('/api/users/me', { headers: authHeaders() });
  if (!response.ok) {
    localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_AUTH_TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_SESSION_STARTED_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    window.location.href = pageUrl('tai-khoan.html');
    return false;
  }
  const user = await response.json();
  if (!['admin', 'manager'].includes(user.role)) { alert('Bạn không có quyền truy cập khu vực quản trị.'); window.location.href = pageUrl('index.html'); return false; }
  await renderAdminOrdersFromApi();
  await renderAdminUsers();
  return true;
}

async function renderAdminOrdersFromApi() {
  const tbody = document.getElementById('adminOrders');
  if (!tbody) return;
  const response = await fetch('/api/orders', { headers: authHeaders() });
  if (!response.ok) return;
  const orders = await response.json();
  tbody.innerHTML = orders.map(order => `<tr><td>${order._id}</td><td>${order.customer?.name || ''}<br>${order.customer?.phone || ''}</td><td>${formatMoney(order.total || 0)}</td><td><select data-order-status="${order._id}">${['pending', 'confirmed', 'shipping', 'completed', 'cancelled'].map(status => `<option value="${status}" ${status === order.status ? 'selected' : ''}>${status}</option>`).join('')}</select></td><td>${new Date(order.createdAt).toLocaleDateString('vi-VN')}</td></tr>`).join('');
  tbody.querySelectorAll('[data-order-status]').forEach(select => select.addEventListener('change', async event => {
    const response = await fetch(`/api/orders/${event.target.dataset.orderStatus}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ status: event.target.value }) });
    showAdminToast(response.ok ? 'Đã cập nhật trạng thái đơn.' : 'Không thể cập nhật đơn.', response.ok ? 'success' : 'error');
  }));
}

async function renderAdminUsers() {
  const tbody = document.getElementById('adminUsers');
  if (!tbody) return;
  const response = await fetch('/api/users', { headers: authHeaders() });
  if (!response.ok) return;
  const users = await response.json();
  tbody.innerHTML = users.map(user => `<tr><td>${user.name}</td><td>${user.email}</td><td>${user.role}</td><td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : ''}</td><td>${user.role === 'customer' ? `<button class="btn-small" data-promote-user="${user._id}">Bổ nhiệm quản lý</button>` : ''}</td></tr>`).join('');
  tbody.querySelectorAll('[data-promote-user]').forEach(button => button.addEventListener('click', async () => {
    const response = await fetch(`/api/users/${button.dataset.promoteUser}/role`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ role: 'manager' }) });
    if (response.ok) { showAdminToast('Đã bổ nhiệm quản lý.'); renderAdminUsers(); } else showAdminToast('Không thể bổ nhiệm quản lý.', 'error');
  }));
}

function bindCartLinks() {
  const cartLinks = document.querySelectorAll("[data-cart-link]");
  cartLinks.forEach(link => {
    link.addEventListener("click", () => window.location.href = pageUrl('gio-hang.html'));
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const canViewPage = await guardAdminPage();
  if (!canViewPage) return;
  renderAuthState();
  bindAccountForms();
  bindCategoryForm();
  const isCatalogPage = Boolean(document.getElementById('catalogTabs'));
  if (!isCatalogPage) {
    await initCategories();
    await initProductsStorage();
  }
  if (document.getElementById('adminCatalogs')) {
    renderAdminCatalogs(await loadCatalogs());
  }
  await initCatalogPage();
  renderAdminCategories();
  updateCartBadge();
  bindSearchAndFilters();
  setupAccountTabs();
  renderAdminOrders();
  renderAdminProducts();
  await renderProductDetail();
  renderCartPage();
  bindCheckoutForm();
  bindCartLinks();
  bindAdminProductForm();
  await setupCustomerAccount();

  if (document.getElementById("productGrid")) {
    renderHomeProducts();
  }

  const homeBtn = document.querySelector("[data-home]");
  if (homeBtn) homeBtn.addEventListener("click", () => window.location.href = pageUrl('index.html'));
});
