const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

// Crear servidor
const app = express();
const PORT = process.env.PORT || 3000; // Usa el puerto de Render o el puerto local

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Habilitar CORS para todas las solicitudes

// Conectar a SQLite usando better-sqlite3
const db = new Database('./data/amigos.db', { verbose: console.log });

// Crear tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS amigos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    telefono TEXT NOT NULL,
    cumpleaños DATE NOT NULL
  )
`);

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(path.join(__dirname)));

// Ruta para servir el archivo index.html desde la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para guardar datos
app.post('/api/amigos', (req, res) => {
  const { nombre, apellido, telefono, cumpleaños } = req.body;

  if (!nombre || !apellido || !telefono || !cumpleaños) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO amigos (nombre, apellido, telefono, cumpleaños)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(nombre, apellido, telefono, cumpleaños);
    console.log(`Datos recibidos: ${JSON.stringify(req.body)}`); // Log de los datos recibidos
    res.status(200).send('Datos guardados correctamente');
  } catch (err) {
    console.error('Error al insertar datos:', err.message); // Log de errores
    res.status(500).send('Error al guardar los datos');
  }
});

// Ruta para obtener los datos (opcional, útil para pruebas)
app.get('/api/amigos', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM amigos').all();
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener los datos:', err.message); // Log de errores
    res.status(500).send('Error al obtener los datos');
  }
});

// Ruta para manejar errores 404
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
