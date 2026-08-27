// api.js - thin wrapper for backend API calls (placeholders)

const API = {
  base: '/api',
  getProducts: async () => { return fetch(`${API.base}/products`).then(r => r.json()).catch(()=>[]); },
  getProduct: async (id) => { return fetch(`${API.base}/products/${id}`).then(r=>r.json()).catch(()=>null); }
};

export default API;