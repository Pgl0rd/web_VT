// products.js - product data helpers for frontend

export function findProductById(id) {
  // in static prototype products are global in app.js
  return window.products?.find(p => p.id === Number(id));
}

export function listProducts() {
  return window.products || [];
}
