//Lo primero es importar las librerias
const express = require('express');
const {Pool} = require('pg');
const cors = require('cors');

//Inicializar la app
const app=express();

// middleware para poder usar JSON
app.use(express.json());

// middleware para poder aceptar solicitudes externas
app.use(cors());

//Vamos a hacer la conexión a la base de datos
const pool= new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Tienda_inventario',
    password: '12345678',
    port: 5432
});

app.get('/productos', async(req,res) => {
    try{
        const result= await pool.query('select * from productos');
        res.json(result.rows); 
    }catch(error){
        res.status(500).json({ error: error.message});
    }
});


app.get('/categorias', async(req,res) => {
    try{
        const result= await pool.query('select * from categorias');
        res.json(result.rows); 
    }catch(error){
        res.status(500).json({ error: error.message});
    }
});


app.get('/proveedores', async(req,res) => {
    try{
        const result= await pool.query('select * from proveedores');
        res.json(result.rows); 
    }catch(error){
        res.status(500).json({ error: error.message});
    }
});

app.get('/compras', async(req,res) => {
    try{
        const result= await pool.query('select * from compras');
        res.json(result.rows); 
    }catch(error){
        res.status(500).json({ error: error.message});
    }
});

//Aviso de funcionamiento correcto del API
app.get('/', async(req,res) => {
    try{
        res.json({mensaje: 'Api funcionando correctamente'}); 
    }catch(error){
        res.status(500).json({ error: error.message});
    }
});

app.get('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'select * from productos where id_producto = $1',
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/productos', async (req, res) => {
  try {
    const { nombre, precio, cantidad, marca, id_categoria } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const result = await pool.query(
      `insert into productos (nombre, precio, cantidad, marca, id_categoria)
       values ($1, $2, $3, $4, $5) returning *`,
      [nombre, precio, cantidad, marca, id_categoria]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'delete from productos where id_producto = $1',
      [id]
    );

    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// Vamos a arrancar el servidor
app.listen(3000, () => {
    console.log("Servidor corriendo en la ruta http://localhost:3000");
});

