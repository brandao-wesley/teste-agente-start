import React, { useEffect, useState } from 'react'
import { getCategorias, createCategoria, getProdutos, createProduto, updateProduto, deleteProduto } from './api'

export default function App() {
  const [categorias, setCategorias] = useState([])
  const [produtos, setProdutos] = useState([])
  const [form, setForm] = useState({ nome: '', preco: '', estoque: '', categoria_id: '' })
  const [editingId, setEditingId] = useState(null)

  async function loadAll() {
    const [cats, prods] = await Promise.all([getCategorias(), getProdutos()])
    setCategorias(cats)
    setProdutos(prods)
  }
  useEffect(() => { loadAll() }, [])

  async function onSubmit(e) {
    e.preventDefault()
    const payload = {
      nome: form.nome,
      preco: parseFloat(form.preco || 0),
      estoque: parseInt(form.estoque || 0, 10),
      categoria_id: form.categoria_id ? parseInt(form.categoria_id, 10) : null
    }
    if (editingId) {
      await updateProduto(editingId, payload)
      setEditingId(null)
    } else {
      await createProduto(payload)
    }
    setForm({ nome: '', preco: '', estoque: '', categoria_id: '' })
    loadAll()
  }

  async function addCategoriaRapida() {
    const nome = prompt('Nome da nova categoria:')
    if (nome) {
      await createCategoria({ nome })
      loadAll()
    }
  }

  return (
    <div style={{maxWidth: 960, margin: '2rem auto', fontFamily: 'system-ui, sans-serif'}}>
      <h1>Loja CRUD</h1>

      <section style={{marginBottom: '2rem'}}>
        <h2>Produtos</h2>
        <form onSubmit={onSubmit} style={{display:'grid', gap: '8px', gridTemplateColumns: '1fr 1fr 1fr 1fr auto'}}>
          <input placeholder="Nome" value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})} required />
          <input placeholder="Preço" type="number" step="0.01" value={form.preco} onChange={e=>setForm({...form, preco:e.target.value})} required />
          <input placeholder="Estoque" type="number" value={form.estoque} onChange={e=>setForm({...form, estoque:e.target.value})} required />
          <select value={form.categoria_id} onChange={e=>setForm({...form, categoria_id:e.target.value})}>
            <option value="">(sem categoria)</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <button type="submit">{editingId ? 'Salvar' : 'Adicionar'}</button>
        </form>
        <button onClick={addCategoriaRapida} style={{marginTop:'8px'}}>+ Nova Categoria</button>

        <table border="1" cellPadding="6" style={{marginTop:'1rem', width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>{p.preco.toFixed ? p.preco.toFixed(2) : p.preco}</td>
                <td>{p.estoque}</td>
                <td>{categorias.find(c=>c.id===p.categoria_id)?.nome || '-'}</td>
                <td>
                  <button onClick={() => { setForm({nome:p.nome, preco:p.preco, estoque:p.estoque, categoria_id:p.categoria_id||''}); setEditingId(p.id); }}>Editar</button>
                  <button onClick={() => { if (confirm('Excluir?')) deleteProduto(p.id).then(loadAll) }}>Excluir</button>
                </td>
              </tr>
            ))}
            {!produtos.length && <tr><td colSpan="6" style={{textAlign:'center'}}>Nenhum produto</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  )
}
