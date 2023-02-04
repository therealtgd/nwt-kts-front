export interface Vehicle {
    id: number,
    licencePlate: string,
    capacity: number,
    petsAllowed: boolean,
    babiesAllowed: boolean,
    vehicleType: string,
    position: google.maps.LatLngLiteral,
}
