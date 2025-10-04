const mongoose = require('mongoose');

const experimentoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  subtitulo: {
    type: String,
    required: [true, 'El subtítulo es requerido'],
    trim: true,
    maxlength: [150, 'El subtítulo no puede exceder 150 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    minlength: [10, 'La descripción debe tener al menos 10 caracteres']
  },
  imagen: {
    type: String,
    default: null,
    trim: true
  },
  categoria: {
    type: String,
    enum: ['fisica', 'quimica', 'biologia', 'matematicas', 'tecnologia', 'otros'],
    default: 'otros'
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  }
});

// Middleware para actualizar fechaActualizacion antes de guardar
experimentoSchema.pre('save', function(next) {
  this.fechaActualizacion = Date.now();
  next();
});

module.exports = mongoose.model('Experimento', experimentoSchema);