import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {

  // Converts distance from number in meteres to km string
  transform(value: number, ...args: unknown[]): unknown {
    return (value / 1000).toFixed(1) + ' km';
  }

}
