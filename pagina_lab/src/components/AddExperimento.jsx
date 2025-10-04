import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AddExperimento.css';

const AddExperimento = () => {
  const [experimento, setExperimento] = useState({
    titulo: '',
    subtitulo: '',
    descripcion: '',
    categoria: 'otros'
  });

  const [imagen, setImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const categorias = [
    { value: 'fisica', label: 'Física' },
    { value: 'quimica', label: 'Química' },
    { value: 'biologia', label: 'Biología' },
    { value: 'matematicas', label: 'Matemáticas' },
    { value: 'tecnologia', label: 'Tecnología' },
    { value: 'otros', label: 'Otros' }
  ];

  const handleChange = (e) => {
    setExperimento({
      ...experimento,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setMensaje('Error: Solo se permiten archivos de imagen (JPEG, JPG, PNG, GIF, WEBP)');
        return;
      }
      
      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMensaje('Error: El archivo es muy grande. Máximo 5MB permitido.');
        return;
      }
      
      setImagen(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImagen(e.target.result);
      reader.readAsDataURL(file);
      setMensaje('');
    }
  };

  const removeImage = () => {
    setImagen(null);
    setPreviewImagen(null);
    // Reset input file
    const fileInput = document.getElementById('imagen');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      // Crear FormData para enviar archivos
      const formData = new FormData();
      formData.append('titulo', experimento.titulo);
      formData.append('subtitulo', experimento.subtitulo);
      formData.append('descripcion', experimento.descripcion);
      formData.append('categoria', experimento.categoria);
      
      if (imagen) {
        formData.append('imagen', imagen);
      }

      const response = await fetch('http://localhost:5000/api/experimentos', {
        method: 'POST',
        body: formData // No incluir Content-Type header, el navegador lo hará automáticamente
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('¡Experimento añadido exitosamente!');
        setExperimento({
          titulo: '',
          subtitulo: '',
          descripcion: '',
          categoria: 'otros'
        });
        removeImage();
      } else {
        setMensaje(`Error: ${data.message}`);
      }
    } catch (error) {
      setMensaje('Error de conexión. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-experimento-container">
      <div className="add-experimento-card">
        <div className="header-with-back">
          <Link to="/experimentos" className="back-btn">
            ← Volver a Experimentos
          </Link>
          <h2 className="title">➕ Añadir Nuevo Experimento</h2>
        </div>
        
        {mensaje && (
          <div className={`mensaje ${mensaje.includes('Error') ? 'error' : 'success'}`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="experimento-form">
          <div className="form-group">
            <label htmlFor="titulo">📋 Título del Experimento:</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={experimento.titulo}
              onChange={handleChange}
              placeholder="Ej: Experimento de densidad del agua"
              required
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subtitulo">📝 Subtítulo:</label>
            <input
              type="text"
              id="subtitulo"
              name="subtitulo"
              value={experimento.subtitulo}
              onChange={handleChange}
              placeholder="Ej: Comparación de densidades en diferentes líquidos"
              required
              maxLength="150"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">🏷️ Categoría:</label>
            <select
              id="categoria"
              name="categoria"
              value={experimento.categoria}
              onChange={handleChange}
            >
              {categorias.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="imagen">📷 Imagen del Experimento (Opcional):</label>
            <input
              type="file"
              id="imagen"
              name="imagen"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <small className="file-info">
              Formatos permitidos: JPEG, JPG, PNG, GIF, WEBP. Tamaño máximo: 5MB
            </small>
            
            {previewImagen && (
              <div className="image-preview">
                <img src={previewImagen} alt="Preview" className="preview-img" />
                <button type="button" onClick={removeImage} className="remove-img-btn">
                  ❌ Eliminar imagen
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">📄 Descripción del Experimento:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={experimento.descripcion}
              onChange={handleChange}
              placeholder="Describe detalladamente el experimento, los materiales necesarios, el procedimiento y los resultados esperados..."
              required
              minLength="10"
              rows="8"
            />
            <small className="char-count">
              {experimento.descripcion.length} caracteres
            </small>
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? '⏳ Guardando...' : '🧪 Añadir Experimento'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExperimento;