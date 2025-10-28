const BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function getCategorias() {
  const r = await fetch(`${BASE}/categorias`);
  return r.json();
}
export async function createCategoria(data) {
  const r = await fetch(`${BASE}/categorias`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
  return r.json();
}
export async function getProdutos() {
  const r = await fetch(`${BASE}/produtos`);
  return r.json();
}
export async function createProduto(data) {
  const r = await fetch(`${BASE}/produtos`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
  return r.json();
}
export async function updateProduto(id, data) {
  const r = await fetch(`${BASE}/produtos/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
  return r.json();
}
export async function deleteProduto(id) {
  const r = await fetch(`${BASE}/produtos/${id}`, {method:'DELETE'});
  return r.json();
}
