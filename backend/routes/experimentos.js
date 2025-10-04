const express = require('express');
const router = express.Router();
const {
  getAllExperimentos,
  getExperimentoById,
  createExperimento,
  updateExperimento,
  deleteExperimento,
  getExperimentosPorCategoria
} = require('../controllers/experimentoController');
const { upload, handleUploadErrors } = require('../middleware/uploadMiddleware');

// GET /api/experimentos - Obtener todos los experimentos
router.get('/', getAllExperimentos);

// GET /api/experimentos/categoria/:categoria - Obtener experimentos por categoría
router.get('/categoria/:categoria', getExperimentosPorCategoria);

// GET /api/experimentos/:id - Obtener un experimento por ID
router.get('/:id', getExperimentoById);

// POST /api/experimentos - Crear un nuevo experimento
router.post('/', upload.single('imagen'), handleUploadErrors, createExperimento);

// PUT /api/experimentos/:id - Actualizar un experimento
router.put('/:id', upload.single('imagen'), handleUploadErrors, updateExperimento);

// DELETE /api/experimentos/:id - Eliminar un experimento
router.delete('/:id', deleteExperimento);

module.exports = router;