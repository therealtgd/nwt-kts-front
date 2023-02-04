import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutes'
})
export class MinutesPipe implements PipeTransform {

  // Converts seconds to mins string
  transform(value: number, ...args: unknown[]): unknown {
    return Math.round(value / 60) + ' mins';
  }

}
