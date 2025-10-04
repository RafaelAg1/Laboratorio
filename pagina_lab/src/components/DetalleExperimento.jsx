import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './DetalleExperimento.css';

const DetalleExperimento = () => {
  const { id } = useParams();
  const [experimento, setExperimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [imagen, setImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const categorias = [
    { value: 'fisica', label: 'Física' },
    { value: 'quimica', label: 'Química' },
    { value: 'biologia', label: 'Biología' },
    { value: 'matematicas', label: 'Matemáticas' },
    { value: 'tecnologia', label: 'Tecnología' },
    { value: 'otros', label: 'Otros' }
  ];

  useEffect(() => {
    fetchExperimento();
  }, [id]);

  const fetchExperimento = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/experimentos/${id}`);
      
      if (!response.ok) {
        throw new Error('Experimento no encontrado');
      }
      
      const data = await response.json();
      setExperimento(data);
      setEditData(data);
      setError('');
    } catch (error) {
      setError('Error al cargar el experimento. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
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

  const removeNewImage = () => {
    setImagen(null);
    setPreviewImagen(null);
    const fileInput = document.getElementById('imagen-edit');
    if (fileInput) fileInput.value = '';
  };

  const handleSave = async () => {
    setSaving(true);
    setMensaje('');

    try {
      const formData = new FormData();
      formData.append('titulo', editData.titulo);
      formData.append('subtitulo', editData.subtitulo);
      formData.append('descripcion', editData.descripcion);
      formData.append('categoria', editData.categoria);
      
      if (imagen) {
        formData.append('imagen', imagen);
      }

      const response = await fetch(`http://localhost:5000/api/experimentos/${id}`, {
        method: 'PUT',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('¡Experimento actualizado exitosamente!');
        setExperimento(data.experimento);
        setEditData(data.experimento);
        setEditMode(false);
        removeNewImage();
      } else {
        setMensaje(`Error: ${data.message}`);
      }
    } catch (error) {
      setMensaje('Error de conexión. Verifica que el servidor esté corriendo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este experimento? Esta acción no se puede deshacer.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/experimentos/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setMensaje('Experimento eliminado exitosamente');
          setTimeout(() => {
            window.close(); // Cerrar la ventana actual
          }, 2000);
        } else {
          const data = await response.json();
          setMensaje(`Error: ${data.message}`);
        }
      } catch (error) {
        setMensaje('Error de conexión. Verifica que el servidor esté corriendo.');
      }
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoriaEmoji = (categoria) => {
    const emojis = {
      fisica: '⚛️',
      quimica: '🧪',
      biologia: '🧬',
      matematicas: '📊',
      tecnologia: '💻',
      otros: '🔬'
    };
    return emojis[categoria] || '🔬';
  };

  if (loading) {
    return (
      <div className="detalle-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando experimento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detalle-container">
        <div className="error-message">
          ❌ {error}
          <Link to="/experimentos" className="back-link">
            ← Volver a Experimentos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detalle-container">
      <div className="detalle-card">
        <div className="header-section">
          <div className="header-actions">
            <Link to="/experimentos" className="back-btn">
              ← Volver a Experimentos
            </Link>
            <div className="action-buttons">
              {!editMode ? (
                <>
                  <button 
                    onClick={() => setEditMode(true)} 
                    className="edit-btn"
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={handleDelete} 
                    className="delete-btn"
                  >
                    🗑️ Eliminar
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleSave} 
                    className="save-btn"
                    disabled={saving}
                  >
                    {saving ? '⏳ Guardando...' : '💾 Guardar'}
                  </button>
                  <button 
                    onClick={() => {
                      setEditMode(false);
                      setEditData(experimento);
                      removeNewImage();
                      setMensaje('');
                    }} 
                    className="cancel-btn"
                  >
                    ❌ Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
          
          {mensaje && (
            <div className={`mensaje ${mensaje.includes('Error') ? 'error' : 'success'}`}>
              {mensaje}
            </div>
          )}
        </div>

        <div className="content-section">
          <div className="image-section">
            {editMode ? (
              <div className="image-edit-section">
                <div className="current-image">
                  <h4>Imagen actual:</h4>
                  {experimento.imagen ? (
                    <img 
                      src={`http://localhost:5000/uploads/experimentos/${experimento.imagen}`}
                      alt={experimento.titulo}
                      className="current-img"
                    />
                  ) : (
                    <div className="no-image">Sin imagen</div>
                  )}
                </div>
                
                <div className="new-image-section">
                  <label htmlFor="imagen-edit">📷 Cambiar imagen:</label>
                  <input
                    type="file"
                    id="imagen-edit"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  
                  {previewImagen && (
                    <div className="image-preview">
                      <h4>Nueva imagen:</h4>
                      <img src={previewImagen} alt="Preview" className="preview-img" />
                      <button type="button" onClick={removeNewImage} className="remove-img-btn">
                        ❌ Quitar nueva imagen
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              experimento.imagen && (
                <img 
                  src={`http://localhost:5000/uploads/experimentos/${experimento.imagen}`}
                  alt={experimento.titulo}
                  className="experimento-imagen"
                />
              )
            )}
          </div>

          <div className="info-section">
            <div className="categoria-fecha">
              <span className="categoria-badge">
                {getCategoriaEmoji(experimento.categoria)} {categorias.find(c => c.value === experimento.categoria)?.label}
              </span>
              <span className="fecha">
                📅 Creado: {formatearFecha(experimento.fechaCreacion)}
              </span>
              {experimento.fechaActualizacion !== experimento.fechaCreacion && (
                <span className="fecha">
                  🔄 Actualizado: {formatearFecha(experimento.fechaActualizacion)}
                </span>
              )}
            </div>

            {editMode ? (
              <div className="edit-form">
                <div className="form-group">
                  <label htmlFor="titulo-edit">Título:</label>
                  <input
                    type="text"
                    id="titulo-edit"
                    name="titulo"
                    value={editData.titulo}
                    onChange={handleEditChange}
                    maxLength="100"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subtitulo-edit">Subtítulo:</label>
                  <input
                    type="text"
                    id="subtitulo-edit"
                    name="subtitulo"
                    value={editData.subtitulo}
                    onChange={handleEditChange}
                    maxLength="150"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="categoria-edit">Categoría:</label>
                  <select
                    id="categoria-edit"
                    name="categoria"
                    value={editData.categoria}
                    onChange={handleEditChange}
                  >
                    {categorias.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="descripcion-edit">Descripción:</label>
                  <textarea
                    id="descripcion-edit"
                    name="descripcion"
                    value={editData.descripcion}
                    onChange={handleEditChange}
                    rows="10"
                    required
                    minLength="10"
                  />
                  <small className="char-count">
                    {editData.descripcion?.length || 0} caracteres
                  </small>
                </div>
              </div>
            ) : (
              <div className="display-info">
                <h1 className="titulo">{experimento.titulo}</h1>
                <h2 className="subtitulo">{experimento.subtitulo}</h2>
                <div className="descripcion">
                  {experimento.descripcion.split('\n').map((parrafo, index) => (
                    <p key={index}>{parrafo}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleExperimento;