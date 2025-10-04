// Configuración de URLs para desarrollo y producción
const config = {
  // URL del backend - usa la de producción por defecto
  API_BASE_URL: import.meta.env.VITE_API_URL || 'https://paginalab-backend.onrender.com',
  
  // Configuraciones adicionales
  APP_NAME: 'Innovae Bioscience',
  VERSION: '1.0.0'
};

export default config;