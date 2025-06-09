export interface Driver{
    id: number
    email: string
    full_name: string
    last_names: string
    document_number: string
    type_document: string
    badge_number: string
    administrator_id: number
}

export interface DriverCreate{
    email: string
    full_name: string
    last_names: string
    document_number: string
    type_document: string
    password: string
    badge_number: string
    administrator_id: number
}