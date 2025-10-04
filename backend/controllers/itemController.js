const Item = require('../models/Item');

// Obtener todos los items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find({ activo: true }).sort({ fechaCreacion: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener items', 
      error: error.message 
    });
  }
};

// Obtener un item por ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item || !item.activo) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener el item', 
      error: error.message 
    });
  }
};

// Crear un nuevo item
exports.createItem = async (req, res) => {
  try {
    const { titulo, descripcion, categoria } = req.body;
    
    const nuevoItem = new Item({
      titulo,
      descripcion,
      categoria
    });
    
    const itemGuardado = await nuevoItem.save();
    res.status(201).json(itemGuardado);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error al crear el item', 
      error: error.message 
    });
  }
};

// Actualizar un item
exports.updateItem = async (req, res) => {
  try {
    const { titulo, descripcion, categoria, activo } = req.body;
    
    const itemActualizado = await Item.findByIdAndUpdate(
      req.params.id,
      { 
        titulo, 
        descripcion, 
        categoria, 
        activo,
        fechaActualizacion: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!itemActualizado) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }
    
    res.json(itemActualizado);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error al actualizar el item', 
      error: error.message 
    });
  }
};

// Eliminar un item (soft delete)
exports.deleteItem = async (req, res) => {
  try {
    const itemEliminado = await Item.findByIdAndUpdate(
      req.params.id,
      { 
        activo: false,
        fechaActualizacion: Date.now()
      },
      { new: true }
    );
    
    if (!itemEliminado) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }
    
    res.json({ message: 'Item eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al eliminar el item', 
      error: error.message 
    });
  }
};