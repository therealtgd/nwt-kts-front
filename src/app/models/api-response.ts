type HttpStatus = {
  name: string,
  value: number,
}

export interface ApiResponse<T> {
  success: boolean,
  status: HttpStatus,
  message: string,
  body: T | null,
}
