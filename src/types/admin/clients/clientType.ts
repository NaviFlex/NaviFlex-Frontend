export interface ClientType {
    id: number
    full_name: string
    address: string
    type_document: string
    document_number: string
    latitude: string
    longitude: string
    areas_id: number
    order_confirmed: boolean | null
}


export interface CreateClientType {
    full_name: string
    address: string
    document_type: string
    document_number: string
    latitude: string
    longitude: string
    area_description_name: string
    administrator_id: number
}


export interface ClientByAreaType {
    [areaName: string]: ClientType[];
}
