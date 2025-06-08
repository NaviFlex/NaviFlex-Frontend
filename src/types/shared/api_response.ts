export interface ApiResponse<T> {
    status_code: number;
    message: string;
    data?: T; // Changed from Optional[T] = None to data?: T
}