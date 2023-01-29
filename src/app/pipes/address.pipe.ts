import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'address'
})
export class AddressPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value.split(',')[0]
  }

}
