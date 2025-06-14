'use client';

import { useEffect, useRef, useState } from 'react';
import { GoogleMap, Polyline, Marker, useJsApiLoader } from '@react-google-maps/api';
import { InfoWindow } from '@react-google-maps/api';
import { obtainRouteFromDayByDriverId } from '@/services/driver/routesManagement';
import { useUser } from '@/hooks/useUser';
import { mapOptions} from '@/utils/mapsManagements';

const containerStyle = {
  width: '100%',
  height: '100%',
};


  
const centerDefault = {
  lat: -8.056098,
  lng: -79.062921,
};

const googleMapsLibraries: (
  "places" | "drawing" | "geometry" | "localContext" | "visualization"
)[] = ['places'];


export default function ViewMapsJordanian() {

  const user = useUser();
  
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: googleMapsLibraries,
  });


  
  const [hasRoute, setHasRoute] = useState(true);
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
      try {
        const res = await obtainRouteFromDayByDriverId(user?.profileId || 0);
        const data = res.data;

        const stopOrder = data.stop_orders;
        const coords = data.coordinates;

        if (!stopOrder || stopOrder.length === 0) {
          setHasRoute(false);
          return;
        }

        const ordered = stopOrder.map((id: number) =>
          coords.find((c: any) => c.order_id === id)
        );
        setOrderedCoords(ordered);

        const waypoints = ordered.map((c: any) => ({
          location: { lat: c.latitude, lng: c.longitude },
          stopover: true,
        }));

        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
          {
            origin: centerDefault,
            destination: centerDefault,
            waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: false,
          },
          (result, status) => {
            if (status === 'OK' && result.routes.length > 0) {



              const legs = result.routes[0].legs;

              let totalDistance = 0; // en metros
              let totalDuration = 0; // en segundos
            
              legs.forEach((leg) => {
                totalDistance += leg.distance?.value || 0; // distancia en metros
                totalDuration += leg.duration?.value || 0; // duración en segundos
              });
            
              console.log("🛣️ Distancia total (m):", totalDistance);
              console.log("⏱️ Duración total (segundos):", totalDuration);



              const fullPath: google.maps.LatLng[] = [];
              result.routes[0].legs.forEach((leg) =>
                leg.steps.forEach((step) =>
                  step.path.forEach((latLng) => fullPath.push(latLng))
                )
              );
              animatePath(fullPath);
            } else {
              console.error('Error generando la ruta:', status);
              setHasRoute(false);
            }
          }
        );
      } catch (err: any) {
        if (err?.response?.status === 404) {
          console.log('No hay ruta asignada');
          setHasRoute(false);
        } else {
          console.error('Error inesperado:', err);
        }
      }
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
      }, 35);
    };

    fetchRoute();
  }, [user?.profileId, isLoaded]);

  return (
    <div className="w-full h-full rounded-xl bg-white relative">

      <button onClick={centerMapOnUser} className="absolute top-4 right-4 z-10 bg-white p-2 rounded shadow">
        📍 Mi ubicación
      </button>

      {isLoaded && hasRoute ? (
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
              url: "/pasador-de-ubicacion.png",
              scaledSize: new window.google.maps.Size(40, 40),
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
                text: coord.client_name.split(' ')[0],
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
      ) : (
        <div className="flex flex-col justify-center items-center h-full text-center text-[#5E52FF] p-6">
          <h2 className="text-xl font-semibold mb-2">Aún no tienes una ruta asignada</h2>
          <p className="text-sm text-gray-600">Tu administrador te asignará una ruta en breve. ¡Gracias por tu paciencia!</p>
        </div>
      )}
    </div>
  );
}
