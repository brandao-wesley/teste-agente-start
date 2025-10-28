from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, Session, create_engine, select

# ---------- Models ----------
class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str

class Produto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str
    preco: float
    estoque: int
    categoria_id: Optional[int] = Field(default=None, foreign_key="categoria.id")

# ---------- DB ----------
engine = create_engine("sqlite:///./loja.db", echo=False)

def init_db():
    SQLModel.metadata.create_all(engine)
    # Semeia categorias básicas, se necessário
    with Session(engine) as s:
        has_any = s.exec(select(Categoria)).first()
        if not has_any:
            s.add_all([Categoria(nome="Cozinha"), Categoria(nome="Banho"), Categoria(nome="Limpeza")])
            s.commit()

app = FastAPI(title="Loja CRUD API")

# CORS para permitir o React (Vite) em localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ajuste para domínios específicos em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

# ---------- Categorias ----------
@app.get("/categorias", response_model=List[Categoria])
def list_categorias():
    with Session(engine) as s:
        return s.exec(select(Categoria)).all()

@app.post("/categorias", response_model=Categoria)
def create_categoria(cat: Categoria):
    with Session(engine) as s:
        s.add(cat)
        s.commit()
        s.refresh(cat)
        return cat

# ---------- Produtos ----------
@app.get("/produtos", response_model=List[Produto])
def list_produtos():
    with Session(engine) as s:
        return s.exec(select(Produto)).all()

@app.get("/produtos/{pid}", response_model=Produto)
def get_produto(pid: int):
    with Session(engine) as s:
        obj = s.get(Produto, pid)
        if not obj:
            raise HTTPException(404, "Produto não encontrado")
        return obj

@app.post("/produtos", response_model=Produto)
def create_produto(prod: Produto):
    with Session(engine) as s:
        s.add(prod)
        s.commit()
        s.refresh(prod)
        return prod

@app.put("/produtos/{pid}", response_model=Produto)
def update_produto(pid: int, prod: Produto):
    with Session(engine) as s:
        db_obj = s.get(Produto, pid)
        if not db_obj:
            raise HTTPException(404, "Produto não encontrado")
        db_obj.nome = prod.nome
        db_obj.preco = prod.preco
        db_obj.estoque = prod.estoque
        db_obj.categoria_id = prod.categoria_id
        s.add(db_obj)
        s.commit()
        s.refresh(db_obj)
        return db_obj

@app.delete("/produtos/{pid}")
def delete_produto(pid: int):
    with Session(engine) as s:
        db_obj = s.get(Produto, pid)
        if not db_obj:
            raise HTTPException(404, "Produto não encontrado")
        s.delete(db_obj)
        s.commit()
        return {"ok": True}
