

export interface OrderType{
    id: number
    code: string
    status: string
    created_at: Date
    delivery_date: Date
    clients_id: number
    presalesmans_id: number
    routes_id: number | null
}