const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

// Crear servidor
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conectar a SQLite
const db = new sqlite3.Database('./data/amigos.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
    db.run(`
      CREATE TABLE IF NOT EXISTS amigos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        telefono TEXT NOT NULL,
        cumpleaños DATE NOT NULL
      )
    `);
  }
});

// Ruta para guardar datos
app.post('/api/amigos', (req, res) => {
  const { nombre, apellido, telefono, cumpleaños } = req.body;

  if (!nombre || !apellido || !telefono || !cumpleaños) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  const query = `
    INSERT INTO amigos (nombre, apellido, telefono, cumpleaños)
    VALUES (?, ?, ?, ?)
  `;
  db.run(query, [nombre, apellido, telefono, cumpleaños], function (err) {
    if (err) {
      console.error('Error al insertar datos:', err.message);
      res.status(500).send('Error al guardar los datos');
    } else {
      res.status(200).send('Datos guardados correctamente');
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
app.post('/api/amigos', (req, res) => {
    const { nombre, apellido, telefono, cumpleaños } = req.body;
    console.log(`Datos recibidos: ${JSON.stringify(req.body)}`); // Log para Render
    const query = `
        INSERT INTO amigos (nombre, apellido, telefono, cumpleaños)
        VALUES (?, ?, ?, ?)
    `;
    db.run(query, [nombre, apellido, telefono, cumpleaños], function (err) {
        if (err) {
            console.error('Error al insertar datos:', err.message); // Log de errores
            res.status(500).send('Error al guardar los datos');
        } else {
            res.status(200).send('Datos guardados correctamente');
        }
    });
});
