// admin.js - admin specific helpers (used by admin.html)

export function loadAdminProducts() {
  if (window.renderAdminProducts) window.renderAdminProducts();
}

export function openAdminForm(id){ if (window.openProductForm) window.openProductForm(id); }
