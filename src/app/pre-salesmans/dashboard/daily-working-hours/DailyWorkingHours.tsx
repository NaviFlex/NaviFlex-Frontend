import { UserIcon } from '@heroicons/react/24/solid';

import routes from '../../../../../fakedata/routes.json'
import clients from '../../../../../fakedata/clients.json'
import drivers from '../../../../../fakedata/users.json'



export default function DailyWorkingHours() {
    //sumar un dia a la fecha actual
    const today =  new Date();
    today.setDate(today.getDate() + 1);
    const formattedToday = today.toLocaleDateString();

    const routesData = routes
    /*
     {
        "id": 1,
        "choferId": 15,
        "clientesConfirmados": [10, 2]
    }
    */

    //filtrar los clientesque estan en el array de la ruta
    const assignedClients = clients.filter((client: any) => {
        return routesData.some((route: any) => 
            route.clientesConfirmados.includes(client.id)
        );
    });

    // Obtener el nombre del chofer asignado a la ruta
    const driverData = drivers.find((driver: any) => driver.id === routesData[0].choferId);


    return (
        <div className="w-full h-full rounded-[12px] bg-white p-4">
            <div className="bg-[#7284FB] rounded-t-[12px] p-4 text-center text-white">
                <h1 className="text-lg font-bold">Jornada: {formattedToday}</h1>
            </div>

            <div className="mt-4 text-center">
                <h2 className="text-[#5E52FF] text-lg font-semibold">
                    Los siguientes clientes fueron asignados a: {driverData?.nombre || 'Chofer Desconocido'}
                </h2>
                <hr className="my-2 border-[#5E52FF]" />
            </div>

            <div className="space-y-3">
                {assignedClients.map((client) => (
                    <div
                        key={client.id}
                        className="flex items-center justify-between bg-[#5E52FF] rounded-lg p-2 text-white"
                    >
                        <div className="flex items-center space-x-2">
                            <div className="bg-transparent text-white-600 rounded-full p-1">
                                <UserIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="font-semibold">{client.nombre}</p>
                                <p className="text-sm">N° de Orden: {client.numeroOrden}</p>
                            </div>
                        </div>
                        <span className="bg-white text-[#5E52FF] rounded-full px-3 py-1 text-sm font-medium">
                            Pendiente
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}