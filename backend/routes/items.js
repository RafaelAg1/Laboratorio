const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/itemController');

// GET /api/items - Obtener todos los items
router.get('/', getAllItems);

// GET /api/items/:id - Obtener un item por ID
router.get('/:id', getItemById);

// POST /api/items - Crear un nuevo item
router.post('/', createItem);

// PUT /api/items/:id - Actualizar un item
router.put('/:id', updateItem);

// DELETE /api/items/:id - Eliminar un item
router.delete('/:id', deleteItem);

module.exports = router;