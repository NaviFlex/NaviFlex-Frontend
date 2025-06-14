export const mapOptions = {
    styles: [
      // Oculta todos los puntos de interés
      { featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'off' }] },
      { featureType: 'poi.business', elementType: 'all', stylers: [{ visibility: 'off' }] },
      { featureType: 'poi.school', elementType: 'all', stylers: [{ visibility: 'off' }] },
      { featureType: 'poi.medical', elementType: 'all', stylers: [{ visibility: 'off' }] },
  
      // Oculta líneas de transporte y estaciones
      { featureType: 'transit', elementType: 'all', stylers: [{ visibility: 'off' }] },
      { featureType: 'transit.station', elementType: 'all', stylers: [{ visibility: 'off' }] },
  
      // Oculta las flechas de dirección y bordes de calles pequeñas
      { featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{ visibility: 'off' }] },
      { featureType: 'road.local', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  
      // Oculta completamente los nombres de calles vecinales
      { featureType: 'road.local', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
  
      // Arteriales (avenidas): solo texto en gris claro
      {
        featureType: 'road.arterial',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#AAAAAA' }],
      },
  
      // Autopistas: solo texto en gris claro
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#AAAAAA' }],
      },
  
      // Quita el borde de texto para que se vea más limpio
      { featureType: 'road', elementType: 'labels.text.stroke', stylers: [{ visibility: 'off' }] },
  
      // Nombres de distritos/barrios en gris suave
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#888888' }],
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.stroke',
        stylers: [{ visibility: 'off' }],
      },
  
      // Oculta subdivisiones menores (urbanizaciones, bloques)
      { featureType: 'administrative.neighborhood', elementType: 'all', stylers: [{ visibility: 'off' }] },
      { featureType: 'administrative.land_parcel', elementType: 'all', stylers: [{ visibility: 'off' }] },
  
      // Paisaje en gris claro
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{ saturation: -100 }, { lightness: 60 }],
      },
  
      // Agua en color gris suave
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [{ color: '#e0e0e0' }],
      },
    ],
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
  };