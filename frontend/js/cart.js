// cart.js - cart helpers

export function addToCartLocal(productId, qty=1) {
  // wrapper
  if (window.addToCart) window.addToCart(productId, qty);
}

export function getCart() {
  return JSON.parse(localStorage.getItem('nvtCart') || '[]');
}
