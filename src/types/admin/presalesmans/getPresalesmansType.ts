
export interface Presalesman{
    id: number
    email: string
    full_name: string 
    last_names: string
    document_number: string
    type_document: string
    administrator_id: number
}

export interface PresalesmanCreate{
    email: string
    full_name: string
    last_names: string
    document_number: string
    type_document: string
    password: string
    administrator_id: number
    areas_id: number[]
}