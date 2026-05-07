import { useState, useEffect } from 'react'

function App() {
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [nuevoProd, setNuevoProd] = useState({
    nombre: '', precio: '', cantidad: '', marca: '', id_categoria: 1
  });

  const cargarProductos = async () => {
    const res = await fetch('http://localhost:3000/productos');
    const data = await res.json();
    setProductos(data);
  };

  useEffect(() => { cargarProductos(); }, []);

  const guardarProducto = async (e) => {
    e.preventDefault();
    const metodo = editando ? 'PUT' : 'POST';
    const url = editando 
      ? `http://localhost:3000/productos/${nuevoProd.id_producto}` 
      : 'http://localhost:3000/productos';

    const res = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProd)
    });

    if (res.ok) {
      setNuevoProd({ nombre: '', precio: '', cantidad: '', marca: '', id_categoria: 1 });
      setEditando(false);
      cargarProductos();
    }
  };

  const prepararEdicion = (prod) => {
    setEditando(true);
    setNuevoProd(prod);
  };

  const borrarProducto = async (id) => {
    if (window.confirm("¿Deseas retirar este producto de la estantería?")) {
      await fetch(`http://localhost:3000/productos/${id}`, { method: 'DELETE' });
      cargarProductos();
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] p-4 md:p-10 font-serif text-[#4a3f35]">
      <header className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-light italic mb-2 text-[#5d4037]">Almacén Natural</h1>
        <div className="h-1 w-24 bg-[#a1887f] mx-auto opacity-50"></div>
        <p className="mt-4 text-stone-500 tracking-widest uppercase text-xs">Gestión Artesanal de Inventario</p>
      </header>

      <main className="max-w-5xl mx-auto">
        {/* FORMULARIO RÚSTICO */}
        <section className="bg-white p-8 rounded-sm shadow-sm border-t-4 border-[#8d6e63] mb-12">
          <h2 className="text-xl mb-6 text-[#5d4037]">{editando ? 'Editar Artículo' : 'Nuevo Ingreso'}</h2>
          <form onSubmit={guardarProducto} className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <input 
              className="bg-transparent border-b border-stone-300 py-2 outline-none focus:border-[#8d6e63] transition-colors"
              type="text" placeholder="Nombre" value={nuevoProd.nombre} 
              onChange={e => setNuevoProd({...nuevoProd, nombre: e.target.value})} required 
            />
            <input 
              className="bg-transparent border-b border-stone-300 py-2 outline-none focus:border-[#8d6e63] transition-colors"
              type="text" placeholder="Marca" value={nuevoProd.marca} 
              onChange={e => setNuevoProd({...nuevoProd, marca: e.target.value})} 
            />
            <input 
              className="bg-transparent border-b border-stone-300 py-2 outline-none focus:border-[#8d6e63] transition-colors"
              type="number" placeholder="Precio" value={nuevoProd.precio} 
              onChange={e => setNuevoProd({...nuevoProd, precio: e.target.value})} required 
            />
            <input 
              className="bg-transparent border-b border-stone-300 py-2 outline-none focus:border-[#8d6e63] transition-colors"
              type="number" placeholder="Stock" value={nuevoProd.cantidad} 
              onChange={e => setNuevoProd({...nuevoProd, cantidad: e.target.value})} 
            />
            <button className="bg-[#5d4037] text-stone-100 py-2 px-6 rounded-sm hover:bg-[#4e342e] transition-all shadow-md uppercase text-sm tracking-wider">
              {editando ? 'Actualizar' : 'Registrar'}
            </button>
          </form>
          {editando && (
            <button onClick={() => {setEditando(false); setNuevoProd({nombre:'', precio:'', cantidad:'', marca:'', id_categoria:1})}} 
                    className="mt-4 text-xs text-stone-400 hover:text-stone-600 underline">Cancelar edición</button>
          )}
        </section>

        {/* LISTA ESTILO CATÁLOGO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map(p => (
            <div key={p.id_producto} className="bg-white p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-[#5d4037]">{p.nombre}</h3>
                  <p className="text-xs text-stone-400 uppercase tracking-tighter">{p.marca || 'Artesanal'}</p>
                </div>
                <span className="text-xl font-light text-[#8d6e63]">${p.precio}</span>
              </div>
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-50">
                <span className={`text-[10px] uppercase font-bold ${p.cantidad < 5 ? 'text-orange-700' : 'text-stone-400'}`}>
                  Disponibles: {p.cantidad}
                </span>
                <div className="flex gap-4">
                  <button onClick={() => prepararEdicion(p)} className="text-stone-400 hover:text-stone-700 text-xs uppercase tracking-widest">Editar</button>
                  <button onClick={() => borrarProducto(p.id_producto)} className="text-stone-300 hover:text-red-800 text-xs uppercase tracking-widest">Quitar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App