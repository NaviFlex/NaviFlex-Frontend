'use client';

import { useEffect, useRef, useState } from 'react';
import { GoogleMap, Polyline, Marker, useJsApiLoader } from '@react-google-maps/api';
import { InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
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
  
  
  

const centerDefault = {
  lat: -12.062362,
  lng: -77.043603,
};

export default function ViewMapsJordanian() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });


  

  const [animatedPath, setAnimatedPath] = useState<google.maps.LatLngLiteral[]>([]);
  const [orderedCoords, setOrderedCoords] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const animationRef = useRef<number | null>(null);


    // Centrar mapa en el usuario
    const centerMapOnUser = () => {
        if (userLocation && mapRef.current) {
          mapRef.current.panTo(userLocation);
          mapRef.current.setZoom(16);
        }
      };

  // Obtener ubicación en tiempo real
  useEffect(() => {
    if (!isLoaded) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        console.warn('Error obteniendo ubicación:', err);
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchRoute = async () => {
      const res = await fetch('/api/driver/routing/jordanian-today-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driver_id: 1, date: '2025-06-09' }),
      });

      const json = await res.json();
      const data = json.data;

      const depot = { lat: -12.062362, lng: -77.043603 };
      const stopOrder = data.stop_orders;
      const coords = data.coordinates;
      console.log('Coordenadas:', coords);
      const ordered = stopOrder.map((id: number) => coords.find((c: any) => c.order_id === id));

      console.log(ordered);
      setOrderedCoords(ordered);

      const origin = depot;
      const destination = origin;
      const waypoints = ordered.map((c: any) => ({
        location: { lat: c.latitude, lng: c.longitude },
        stopover: true,
      }));

      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin,
          destination,
          waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
          optimizeWaypoints: false,
        },
        (result, status) => {
          if (status === 'OK' && result.routes.length > 0) {
            const fullPath: google.maps.LatLng[] = [];

            result.routes[0].legs.forEach((leg) =>
              leg.steps.forEach((step) =>
                step.path.forEach((latLng) => fullPath.push(latLng))
              )
            );

            animatePath(fullPath);
          } else {
            console.error('Error generando la ruta:', status);
          }
        }
      );
    };

    const animatePath = (fullPath: google.maps.LatLng[]) => {
      let index = 0;
      setAnimatedPath([]);
      if (animationRef.current) clearInterval(animationRef.current);

      animationRef.current = window.setInterval(() => {
        if (index < fullPath.length) {
          const next = fullPath[index].toJSON();
          setAnimatedPath((prev) => [...prev, next]);
          index++;
        } else {
          if (animationRef.current) clearInterval(animationRef.current);
        }
      }, 35); // Puedes reducir este valor para más fluidez
    };

    fetchRoute();
  }, [isLoaded]);

  return (
    <div className="w-full h-full rounded-xl bg-white">
      <h1 className="text-xl font-bold mb-4">Ruta optimizada para hoy</h1> 
     
      <button onClick={centerMapOnUser} className="absolute top-4 right-4 z-10 bg-white p-2 rounded shadow">
        📍 Mi ubicación
        </button>

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={centerDefault}
          zoom={15}
          options={mapOptions}

            onLoad={(map) => {
                mapRef.current = map;

            }}
        >
          <Polyline
            path={animatedPath}
            options={{
              strokeColor: '#5E52FF',
              strokeOpacity: 1.0,
              strokeWeight: 5,
              icons: [
                {
                  icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 3,
                    strokeColor: '#5E52FF',
                  },
                  offset: '100%',
                  repeat: '100px',
                },
              ],
            }}
          />

          <Marker 
            position={centerDefault} 
            label="Empresa" 
            icon={{
                
                url: "/pasador-de-ubicacion.png", // ruta relativa desde `public/`
                scaledSize: new window.google.maps.Size(40, 40), // ajusta el tamaño del ícono
                fillColor: '#FF0000',
                fillOpacity: 1,
                strokeWeight: 2,
            }}
          />
            {orderedCoords.map((coord, i) => (
            <Marker
                key={i}
                position={{ lat: coord.latitude, lng: coord.longitude }}
                onClick={() => setActiveMarker(i)}
                icon={{
                url: "/pasador-de-ubicacion.png",
                scaledSize: new window.google.maps.Size(40, 40),
                }}
                label={{
                text: coord.client_name.split(' ')[0], // Solo primer nombre
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#333',
                }}
            >
                {activeMarker === i && (
                <InfoWindow
                    position={{ lat: coord.latitude, lng: coord.longitude }}
                    onCloseClick={() => setActiveMarker(null)}
                >
                    <div className="text-sm font-medium max-w-[160px] break-words">
                    {coord.client_name}
                    </div>
                </InfoWindow>
                )}
            </Marker>
            ))}


          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 2,
              }}
            />
          )}


        </GoogleMap>
      )}
    </div>
  );
}
