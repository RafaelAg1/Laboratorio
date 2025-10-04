import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ListaExperimentos.css';

const ListaExperimentos = () => {
  const [experimentos, setExperimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');

  const categorias = [
    { value: 'todos', label: 'Todas las categorías' },
    { value: 'fisica', label: 'Física' },
    { value: 'quimica', label: 'Química' },
    { value: 'biologia', label: 'Biología' },
    { value: 'matematicas', label: 'Matemáticas' },
    { value: 'tecnologia', label: 'Tecnología' },
    { value: 'otros', label: 'Otros' }
  ];

  const fetchExperimentos = async () => {
    try {
      setLoading(true);
      const url = filtroCategoria === 'todos' 
        ? 'http://localhost:5000/api/experimentos'
        : `http://localhost:5000/api/experimentos/categoria/${filtroCategoria}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al cargar experimentos');
      }
      
      const data = await response.json();
      setExperimentos(data);
      setError('');
    } catch (error) {
      setError('Error de conexión. Verifica que el servidor esté corriendo.');
      setExperimentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperimentos();
  }, [filtroCategoria]);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
      <div className="lista-experimentos-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando experimentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lista-experimentos-container">
      <div className="header-section">
        <h1 className="main-title">🧪 Laboratorio de Experimentos</h1>
        <p className="subtitle">Explora y descubre todos nuestros experimentos científicos</p>
        
        <Link to="/experimentos/añadir" className="add-experimento-btn">
          ➕ Añadir Nuevo Experimento
        </Link>
        
        <div className="filtro-section">
          <label htmlFor="categoria-filtro">🏷️ Filtrar por categoría:</label>
          <select
            id="categoria-filtro"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="filtro-select"
          >
            {categorias.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {experimentos.length === 0 && !error ? (
        <div className="no-experimentos">
          <div className="no-experimentos-icon">🔬</div>
          <h3>No hay experimentos disponibles</h3>
          <p>
            {filtroCategoria === 'todos' 
              ? 'Aún no se han añadido experimentos. ¡Sé el primero en agregar uno!'
              : `No hay experimentos en la categoría "${categorias.find(c => c.value === filtroCategoria)?.label}"`
            }
          </p>
        </div>
      ) : (
        <div className="experimentos-grid">
          {experimentos.map((experimento) => (
            <div key={experimento._id} className="experimento-card">
              <div className="card-header">
                <span className="categoria-badge">
                  {getCategoriaEmoji(experimento.categoria)} {categorias.find(c => c.value === experimento.categoria)?.label}
                </span>
                <span className="fecha">
                  📅 {formatearFecha(experimento.fechaCreacion)}
                </span>
              </div>
              
              {experimento.imagen && (
                <div className="card-image">
                  <img 
                    src={`http://localhost:5000/uploads/experimentos/${experimento.imagen}`}
                    alt={experimento.titulo}
                    className="experimento-imagen"
                  />
                </div>
              )}
              
              <div className="card-content">
                <h3 className="experimento-titulo">{experimento.titulo}</h3>
                <h4 className="experimento-subtitulo">{experimento.subtitulo}</h4>
                <p className="experimento-descripcion">
                  {experimento.descripcion.length > 150 
                    ? `${experimento.descripcion.substring(0, 150)}...`
                    : experimento.descripcion
                  }
                </p>
              </div>
              
              <div className="card-footer">
                <button 
                  className="ver-mas-btn"
                  onClick={() => window.open(`/experimentos/${experimento._id}`, '_blank')}
                >
                  👁️ Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="stats-section">
        <div className="stat-item">
          <span className="stat-number">{experimentos.length}</span>
          <span className="stat-label">
            {filtroCategoria === 'todos' ? 'Total de experimentos' : 'Experimentos en esta categoría'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListaExperimentos;