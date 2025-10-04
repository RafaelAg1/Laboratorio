const Experimento = require('../models/Experimento');

// Obtener todos los experimentos
exports.getAllExperimentos = async (req, res) => {
  try {
    const experimentos = await Experimento.find({ activo: true }).sort({ fechaCreacion: -1 });
    res.json(experimentos);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener experimentos', 
      error: error.message 
    });
  }
};

// Obtener un experimento por ID
exports.getExperimentoById = async (req, res) => {
  try {
    const experimento = await Experimento.findById(req.params.id);
    
    if (!experimento || !experimento.activo) {
      return res.status(404).json({ message: 'Experimento no encontrado' });
    }
    
    res.json(experimento);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener el experimento', 
      error: error.message 
    });
  }
};

// Crear un nuevo experimento
exports.createExperimento = async (req, res) => {
  try {
    const { titulo, subtitulo, descripcion, categoria } = req.body;
    
    // Si se subió una imagen, obtener la ruta
    const imagen = req.file ? req.file.filename : null;
    
    const nuevoExperimento = new Experimento({
      titulo,
      subtitulo,
      descripcion,
      categoria,
      imagen
    });
    
    const experimentoGuardado = await nuevoExperimento.save();
    res.status(201).json({
      message: 'Experimento creado exitosamente',
      experimento: experimentoGuardado
    });
  } catch (error) {
    // Si hay error y se subió una imagen, eliminarla
    if (req.file) {
      const fs = require('fs');
      const path = require('path');
      const imagePath = path.join('uploads/experimentos', req.file.filename);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error al eliminar imagen:', err);
      });
    }
    
    res.status(400).json({ 
      message: 'Error al crear el experimento', 
      error: error.message 
    });
  }
};

// Actualizar un experimento
exports.updateExperimento = async (req, res) => {
  try {
    const { titulo, subtitulo, descripcion, categoria, activo } = req.body;
    
    // Preparar datos de actualización
    const updateData = { 
      titulo, 
      subtitulo, 
      descripcion, 
      categoria, 
      activo,
      fechaActualizacion: Date.now()
    };
    
    // Si se subió una nueva imagen, agregarla a los datos de actualización
    if (req.file) {
      // Obtener el experimento actual para eliminar la imagen anterior
      const experimentoActual = await Experimento.findById(req.params.id);
      
      if (experimentoActual && experimentoActual.imagen) {
        const fs = require('fs');
        const path = require('path');
        const imagenAnterior = path.join('uploads/experimentos', experimentoActual.imagen);
        fs.unlink(imagenAnterior, (err) => {
          if (err) console.error('Error al eliminar imagen anterior:', err);
        });
      }
      
      updateData.imagen = req.file.filename;
    }
    
    const experimentoActualizado = await Experimento.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!experimentoActualizado) {
      return res.status(404).json({ message: 'Experimento no encontrado' });
    }
    
    res.json({
      message: 'Experimento actualizado exitosamente',
      experimento: experimentoActualizado
    });
  } catch (error) {
    // Si hay error y se subió una nueva imagen, eliminarla
    if (req.file) {
      const fs = require('fs');
      const path = require('path');
      const imagePath = path.join('uploads/experimentos', req.file.filename);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error al eliminar imagen:', err);
      });
    }
    
    res.status(400).json({ 
      message: 'Error al actualizar el experimento', 
      error: error.message 
    });
  }
};

// Eliminar un experimento (soft delete)
exports.deleteExperimento = async (req, res) => {
  try {
    const experimentoEliminado = await Experimento.findByIdAndUpdate(
      req.params.id,
      { 
        activo: false,
        fechaActualizacion: Date.now()
      },
      { new: true }
    );
    
    if (!experimentoEliminado) {
      return res.status(404).json({ message: 'Experimento no encontrado' });
    }
    
    res.json({ message: 'Experimento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al eliminar el experimento', 
      error: error.message 
    });
  }
};

// Obtener experimentos por categoría
exports.getExperimentosPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    const experimentos = await Experimento.find({ 
      categoria: categoria, 
      activo: true 
    }).sort({ fechaCreacion: -1 });
    
    res.json(experimentos);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener experimentos por categoría', 
      error: error.message 
    });
  }
};