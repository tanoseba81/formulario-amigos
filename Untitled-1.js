// Crear un servidor con Node.js
const http = require('http');

const server = http.createServer((req, res) => {
  res.end('¡Hola desde Node.js en el servidor!');
});

server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000/');
});


