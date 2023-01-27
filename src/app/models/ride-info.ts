type TextValue = {
  text: string,
  value: number,
}

export interface RideInfo {
  distance: TextValue,
  duration: TextValue,
  startAddress: string,
  endAddress: string,
}
