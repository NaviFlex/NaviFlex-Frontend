'use client';

import { useEffect, useRef, useState } from 'react';
import { GoogleMap, Polyline, Marker, useJsApiLoader } from '@react-google-maps/api';
import { InfoWindow } from '@react-google-maps/api';
import { obtainRouteFromDayByDriverId } from '@/services/driver/routesManagement';
import { useUser } from '@/hooks/useUser';
import { mapOptions} from '@/utils/mapsManagements';
import ChatWindow from './ChatWindow';
import { ApiResponse } from '@/types/shared/api_response';
import {SpinnerComponent} from '@/components/ui/spinner';
import { Navigation, BotMessageSquare  } from 'lucide-react';
import { useCallback } from 'react';

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



  const [showChat, setShowChat] = useState(false);
  const [hasRoute, setHasRoute] = useState(true);
  const [loading, setLoading] = useState(true);
  const [animatedPath, setAnimatedPath] = useState<google.maps.LatLngLiteral[]>([]);
  const [orderedCoords, setOrderedCoords] = useState<any[]>([]);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const animationRef = useRef<number | null>(null);


  // Centrar mapa en el usuario
  const centerMapOnUser = () => {
      if (userLocation && mapRef.current) {
        mapRef.current.panTo(userLocation);
        mapRef.current.setZoom(16);
      }
    };

 // Primero, define drawNewRoute con useCallback
  const drawNewRoute = useCallback((coords: any[]) => {
    const waypoints = coords.map((c) => ({
      location: { lat: c.latitude, lng: c.longitude },
      stopover: true,
    }));

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation || centerDefault,
        destination: centerDefault,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === "OK" && result.routes?.length > 0) {
          const fullPath: google.maps.LatLng[] = [];
          result.routes[0].legs.forEach((leg) =>
            leg.steps.forEach((step) =>
              step.path.forEach((latLng) => fullPath.push(latLng))
            )
          );
          animatePath(fullPath);
        }
      }
    );
  }, [userLocation]);

  // Luego el handler también con useCallback
  const handler = useCallback((event: Event) => {
    const customEvent = event as CustomEvent;
    const { coords } = customEvent.detail;
    console.log('Evento recibido para reoptimizar:', customEvent.detail);
    setOrderedCoords(coords);
    drawNewRoute(coords);
  }, [drawNewRoute]);


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

  // Obtener ubicación en tiempo real
  //useEffect(() => {
  //  if (!isLoaded) return;
//
  //  const watchId = navigator.geolocation.watchPosition(
  //    (position) => {
  //      setUserLocation({
  //        lat: position.coords.latitude,
  //        lng: position.coords.longitude,
  //      });
  //      setLoading(false);
  //    },
  //    (err) => {
  //      console.warn('Error obteniendo ubicación:', err);
  //    },
  //    { enableHighAccuracy: true, maximumAge: 0 }
  //  );
//
  //  return () => {
  //    navigator.geolocation.clearWatch(watchId);
  //  };
  //}, [isLoaded]);








  useEffect(() => {
    if (!isLoaded) return;
    
    const fetchRoute = async () => {
      setLoading(true);
      try {
        const res = await obtainRouteFromDayByDriverId(user?.profileId || 0);
        const data = res.data;

        const stopOrder = data.stop_orders;
        const coords = data.coordinates;

        if (!stopOrder || stopOrder.length === 0) {
          setHasRoute(false);
          setLoading(false);
          return;
        }
        
        //de coordinates, estraer el ordeR_id, client_name, order_code y document_number_client
        const orders = coords.map((c: any) => ({
          order_id: c.order_id,
          client_name: c.client_name,
          order_code: c.order_code,
          document_number_client: c.document_number_client,
        }));

        setOrdersData(orders);

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
            if (status === 'OK' && result.routes?.length > 0) {

              const fullPath: google.maps.LatLng[] = [];
              result.routes[0].legs.forEach((leg) =>
                leg.steps.forEach((step) =>
                  step.path.forEach((latLng) => fullPath.push(latLng))
                )
              );


              //let totalDuration = 0;
              //let totalDistance = 0;
            //
              //result.routes[0].legs.forEach((leg) => {
              //  totalDuration += leg.duration?.value || 0; // duración en segundos
              //  totalDistance += leg.distance?.value || 0;  // distancia en metros
            //
              //  leg.steps.forEach((step) =>
              //    step.path.forEach((latLng) => fullPath.push(latLng))
              //  );
              //});
            //
              //const totalMinutes = totalDuration //Math.round(totalDuration / 60);
              //const totalKm =totalDistance //(totalDistance / 1000).toFixed(2); // en kilómetros con 2 decimales
            //
              //console.log(`⏱️ Tiempo estimado total: ${totalMinutes} segundos`);
              //console.log(`🛣️ Distancia estimada total: ${totalKm} m`);

              animatePath(fullPath);
            } else {
              setHasRoute(false);
            }
          } 
        );

        setLoading(false);

      } catch (err: ApiResponse) {
        if (err?.response?.status === 404) {
          setHasRoute(false);
          setLoading(false);
        } else {
          setHasRoute(false);
          setLoading(false);
        }
      }
    };

    fetchRoute();

    window.addEventListener("reoptimizeMap", handler);
    return () => window.removeEventListener("reoptimizeMap", handler);


  }, [user?.profileId, isLoaded]);

 

  return (
    <>
    { loading ? (
        <SpinnerComponent />
      ) : (
      
      <div className="w-full h-full rounded-[20px] bg-white relative">


        {isLoaded && hasRoute ? (

          <div className="relative w-full h-full">

              <button onClick={centerMapOnUser} className="absolute top-4 right-4 z-10 bg-white p-2 rounded shadow">
              <Navigation className="w-6 h-6 text-[#5E52FF]" />
              </button>

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

              <BotMessageSquare 
                onClick={() => setShowChat(true)}
                aria-label="Abrir ChatBot"
                className="absolute bottom-6 right-6 text-[#5E52FF] w-15 h-15 cursor-pointer hover:scale-105 transition-transform"
              />

              {showChat && (
                <ChatWindow
                  onClose={() => setShowChat(false)}
                  orders={ordersData} // le pasas los datos necesarios al Chat
                  driverId={user?.profileId || 0}
                />
              )}
        </div>

        ) : (
          <div className="flex flex-col justify-center items-center h-full text-center text-[#5E52FF] p-6">
            <h2 className="text-xl font-semibold mb-2">Aún no tienes una ruta asignada</h2>
            <p className="text-sm text-gray-600">Tu administrador te asignará una ruta en breve. ¡Gracias por tu paciencia!</p>
          </div>
        )}


          


    </div>
      )
    }
</>
  );
}
