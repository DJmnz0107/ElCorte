// Este archivo simulará una API de noticias
// En un entorno real, aquí harías las llamadas fetch a tu backend

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Datos simulados de la API
const newsData = {
  carnivoraNews: [
    {
      id: 1,
      title: 'El Profesor Will Es El Mejor Profesor De Todo El ITR Según Harvard',
      image: '/images/professor1.jpg',
      category: 'Educación',
      date: '2025-04-30',
      excerpt: 'Reconocimiento internacional al destacado método de enseñanza...'
    },
    {
      id: 2,
      title: 'El profesor Will es el mejor profesor de todo el ITR según Harvard',
      image: '/images/professor2.jpg',
      category: 'ENGI 2020',
      date: '2025-04-29',
      excerpt: 'Segunda vez consecutiva en recibir este prestigioso reconocimiento...'
    },
    {
      id: 3,
      title: 'El profesor Will es el mejor profesor de todo el ITR según Harvard',
      image: '/images/meat1.jpg',
      category: 'Educación',
      date: '2025-04-28',
      excerpt: 'La metodología revolucionaria que ha cambiado el paradigma...'
    },
    {
      id: 4,
      title: 'El profesor Will es el mejor profesor de todo el ITR según Harvard',
      image: '/images/meat2.jpg',
      category: 'Educación',
      date: '2025-04-27',
      excerpt: 'Estudiantes comparten sus experiencias con el reconocido profesor...'
    }
  ],
  
  topNews: [
    {
      id: 5,
      title: 'El Profesor Will Es El Mejor Profesor De Todo El ITR Según Harvard',
      image: '/images/meatcut1.jpg',
      category: 'Top',
      date: '2025-05-01',
      excerpt: 'La noticia más destacada del mes en el ámbito educativo...'
    },
    {
      id: 6,
      title: 'El Profesor Will Es El Mejor Profesor De Todo El ITR Según Harvard',
      image: '/images/meatcut2.jpg',
      category: 'Top',
      date: '2025-04-30',
      excerpt: 'Entrevista exclusiva con el galardonado profesor...'
    },
    {
      id: 7,
      title: 'El Profesor Will Es El Mejor Profesor De Todo El ITR Según Harvard',
      image: '/images/meatcut3.jpg',
      category: 'Top',
      date: '2025-04-29',
      excerpt: 'Las claves del éxito del método de enseñanza revolucionario...'
    },
    {
      id: 8,
      title: 'El Profesor Will Es El Mejor Profesor De Todo El ITR Según Harvard',
      image: '/images/meatcut4.jpg',
      category: 'Top',
      date: '2025-04-28',
      excerpt: 'Los proyectos futuros del reconocido académico...'
    }
  ],
  
  carouselSlides: [
    {
      id: 9,
      title: 'El Profesor Will Es El Mejor Profesor De Todo El ITR Según Harvard',
      image: '/images/education1.jpg',
      category: 'Educación Carnívora',
      date: '2025-05-01',
      duration: '6:15'
    },
    {
      id: 10,
      title: 'El Profesor Will Es El Mejor Profesor De Todo El ITR Según Harvard',
      image: '/images/education2.jpg',
      category: 'Educación Carnívora',
      date: '2025-04-30',
      duration: '4:30'
    }
  ]
};

// Funciones simuladas de API
export const fetchCarnivoraNews = async () => {
  // Simulamos un retraso de red
  await delay(500);
  return newsData.carnivoraNews;
};

export const fetchTopNews = async () => {
  await delay(700);
  return newsData.topNews;
};

export const fetchCarouselSlides = async () => {
  await delay(600);
  return newsData.carouselSlides;
};

// Si deseas implementar una API real, podrías usar este formato:
/*
export const fetchCarnivoraNews = async () => {
  try {
    const response = await fetch('https://api.tu-servicio.com/carnivora-news');
    if (!response.ok) {
      throw new Error('Error en la carga de noticias carnívoras');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching carnivora news:', error);
    throw error;
  }
};
*/