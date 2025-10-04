
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import config from '../config/config.js';

function Inicio() {
  const [experimentos, setExperimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categorias = {
    fisica: { label: 'Física', color: 'orange', emoji: '⚛️' },
    quimica: { label: 'Química', color: 'purple', emoji: '🧪' },
    biologia: { label: 'Biología', color: 'green', emoji: '🧬' },
    matematicas: { label: 'Matemáticas', color: 'blue', emoji: '📊' },
    tecnologia: { label: 'Tecnología', color: 'indigo', emoji: '💻' },
    otros: { label: 'Otros', color: 'gray', emoji: '🔬' }
  };

  useEffect(() => {
    fetchUltimosExperimentos();
  }, []);

  const fetchUltimosExperimentos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/api/experimentos`);
      if (!response.ok) {
        throw new Error('Error al cargar experimentos');
      }
      const data = await response.json();
      setExperimentos(data.slice(0, 3));
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudieron cargar los experimentos');
      setExperimentos([]);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long'
    });
  };

  const truncarTexto = (texto, limite = 80) => {
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bienvenid@ a Innovae Bioscience
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Descubre experimentos fascinantes, investigaciones innovadoras y el día a día en el laboratorio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/experimentos" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
            >
              Ver Experimentos
            </Link>
            <Link 
              to="/experimentos/añadir" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
            >
              Añadir Experimento
            </Link>
          </div>
        </div>
      </section>

      {/* Últimos Experimentos */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Últimos Experimentos
            </h2>
            <p className="text-lg text-gray-600">
              Los descubrimientos más recientes del laboratorio
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, index) => (
                <div key={index} className="bg-gray-50 rounded-xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="h-5 bg-gray-300 rounded-full w-16"></div>
                      <div className="h-4 bg-gray-300 rounded w-20 ml-3"></div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🔬</div>
                <p className="text-gray-500 text-lg mb-4">{error}</p>
                <p className="text-gray-400">Inicia el servidor backend para ver los experimentos</p>
              </div>
            ) : experimentos.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🧪</div>
                <p className="text-gray-500 text-lg mb-4">Aún no hay experimentos publicados</p>
                <Link 
                  to="/experimentos/añadir" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Añadir el Primer Experimento
                </Link>
              </div>
            ) : (
              experimentos.map((experimento) => {
                const categoria = categorias[experimento.categoria] || categorias.otros;
                return (
                  <div key={experimento._id} className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    {experimento.imagen ? (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={`${config.API_BASE_URL}/uploads/experimentos/${experimento.imagen}`}
                          alt={experimento.titulo}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className={`h-48 bg-gradient-to-br from-${categoria.color}-400 to-${categoria.color}-600 flex items-center justify-center`}>
                        <div className="text-6xl">{categoria.emoji}</div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className={`bg-${categoria.color}-100 text-${categoria.color}-800 text-xs px-2 py-1 rounded-full`}>
                          {categoria.emoji} {categoria.label}
                        </span>
                        <span className="text-gray-500 text-sm ml-3">
                          {formatearFecha(experimento.fechaCreacion)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {experimento.titulo}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {truncarTexto(experimento.descripcion)}
                      </p>
                      <button 
                        onClick={() => window.open(`/experimentos/${experimento._id}`, '_blank')}
                        className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                      >
                        Leer más →
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Sobre el laboratorio */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Sobre Nuestro Laboratorio
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                En nuestro laboratorio nos dedicamos a la investigación de vanguardia en múltiples disciplinas científicas. 
                Cada día trabajamos con pasión para descubrir nuevos conocimientos y desarrollar innovaciones que puedan 
                mejorar nuestro mundo.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Investigación en biología molecular</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Desarrollo de nuevos materiales</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Tecnologías sostenibles</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-80 rounded-2xl flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🧪</div>
                <p className="text-xl font-semibold">Ciencia en Acción</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold mb-4">Innovae Bioscience 🔬</div>
              <p className="text-gray-400">
                Compartiendo el fascinante mundo de la ciencia, un experimento a la vez.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Navegación</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Inicio</Link></li>
                <li><Link to="/experimentos" className="text-gray-700 hover:text-blue-600 transition-colors">Experimentos</Link></li>
                <li><Link to="/investigacioens" className="text-gray-700 hover:text-blue-600 transition-colors">Investigaciones</Link></li>
                <li><Link to="/sobre-nosotros" className="text-gray-700 hover:text-blue-600 transition-colors">Sobre mí</Link></li>
                <li><Link to="/contacto" className="text-gray-700 hover:text-blue-600 transition-colors">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Categorías</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Biología</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Química</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Física</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tecnología</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://www.instagram.com/innovaebiosciencelab">@innovaebiosciencelab</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Inicio;