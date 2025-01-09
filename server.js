const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Database = require('better-sqlite3');

// Crear servidor
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
