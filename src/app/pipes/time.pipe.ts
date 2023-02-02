import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number, format: string): string {
    switch(format) {
      case 'm':
        return Math.round(value / 60) + ' mins';
      case 'mm:ss':
        let minutes: number | string = Math.floor(value / 60);
        let seconds: number | string = value % 60;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return `${minutes}:${seconds}`
      default:
        return '';
    }
  }
}
