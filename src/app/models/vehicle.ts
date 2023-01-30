export interface Vehicle {
    id: number,
    licencePlate: string,
    capacity: number,
    petsAllowed: boolean,
    babiesAllowed: boolean,
    position: google.maps.LatLngLiteral,
}