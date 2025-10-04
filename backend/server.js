const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (imágenes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/paginalab', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch((error) => console.error('Error conectando a MongoDB:', error));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Backend de PaginaLab funcionando correctamente!' });
});

// Rutas de la API
app.use('/api/items', require('./routes/items'));
app.use('/api/experimentos', require('./routes/experimentos'));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});