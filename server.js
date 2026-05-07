const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = "mi_secreto_rustico_123";

// 1. CONFIGURACIÓN DE MIDDLEWARES 
app.use(cors());
app.use(express.json());

// 2. CONEXIÓN A LA BASE DE DATOS 
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Tienda_BD',
    password: '12345678',
    port: 5432
});

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Obtiene el token del header "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. No hay token." });
    }

    try {
        const verificado = jwt.verify(token, JWT_SECRET); // Verifica que el token sea auténtico
        req.user = verificado;
        next(); // Si todo está bien, permite que la ruta continúe
    } catch (error) {
        res.status(401).json({ error: "Token no válido" });
    }
};


// RUTA DE REGISTRO 
app.post('/auth/registro', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Intentando registrar a:", email);

        const saltRounds = 10;
        // Aquí generamos el hash de forma segura
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = 'INSERT INTO api_users (email, password) VALUES ($1, $2) RETURNING id, email';
        const result = await pool.query(query, [email, hashedPassword]);

        console.log("Usuario guardado con éxito");
        
        // Enviamos la respuesta y CERRAMOS la función correctamente
        res.status(201).json({
            mensaje: "Usuario registrado con éxito",
            usuario: result.rows[0]
        });

    } catch (error) {
        console.error("ERROR EN REGISTRO:", error.message);
        res.status(500).json({ error: error.message });
    }
}); 

// LOGIN
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Intento de login para:", email); // Chivato 3

        const result = await pool.query('SELECT * FROM api_users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            console.log("Usuario no encontrado en la BD");
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        const usuario = result.rows[0];
        
        // Comparamos usando la columna 'password' que creamos arriba
        const validPassword = await bcrypt.compare(password, usuario.password);
        
        if (!validPassword) {
            console.log("Clave incorrecta para:", email);
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '2h' });

        console.log("¡Token generado con éxito!");
        res.json({ token });
    } catch (error) {
        console.error("ERROR EN LOGIN:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// 4. RUTAS DE PRODUCTOS 
app.get('/productos', async (req, res) => {
    try {
        const result = await pool.query('select * from productos order by id_producto asc');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/categorias', async (req, res) => {
    try {
        const result = await pool.query('select * from categorias');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/proveedores', async (req, res) => {
    try {
        const result = await pool.query('select * from proveedores');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/compras', async (req, res) => {
    try {
        const result = await pool.query('select * from compras');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

// --- RUTA DE CREACIÓN (POST) ---

app.post('/productos', verificarToken, async (req, res) => { 
    try {
        const { nombre, precio, cantidad, marca, id_categoria } = req.body;
        if (!nombre || !precio) {
            return res.status(400).json({ error: 'Faltan datos' });
        }
        const result = await pool.query(
            `insert into productos (nombre, precio, cantidad, marca, id_categoria)
             values ($1, $2, $3, $4, $5) returning *`,
            [nombre, precio, cantidad, marca, id_categoria || 1]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.put('/productos/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, cantidad, marca, id_categoria } = req.body;

        const result = await pool.query(
            `UPDATE productos 
             SET nombre = $1, precio = $2, cantidad = $3, marca = $4, id_categoria = $5 
             WHERE id_producto = $6 RETURNING *`,
            [nombre, precio, cantidad, marca, id_categoria || 1, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- RUTA DE ELIMINACIÓN (DELETE) ---

// RUTA PARA ELIMINAR UN USUARIO (Protegida)
app.delete('/auth/usuarios/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Ejecutamos la eliminación en la tabla api_users
        const result = await pool.query('DELETE FROM api_users WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.json({ mensaje: `Usuario con ID ${id} eliminado correctamente` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
});

app.delete('/productos/:id', verificarToken, async (req, res) => {
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


const obtenerProductos = async (req, res) => {
    try {
        const query = `
            SELECT p.id_producto, p.nombre, c.descripcion AS categoria 
            FROM productos p 
            INNER JOIN categorias c ON p.id_categoria = c.id_categoria
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error en el servidor");
    }
};

// Mensaje de API funcionando
app.get('/', (req, res) => {
    res.json({ mensaje: 'Api funcionando correctamente' });
});

// Arrancar el servidor
app.listen(3000, () => {
    console.log("Servidor corriendo en la ruta http://localhost:3000");
});