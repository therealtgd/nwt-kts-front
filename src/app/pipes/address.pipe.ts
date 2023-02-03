import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'address'
})
export class AddressPipe implements PipeTransform {

  transform(value: string, format?: string): string {
    value = value.split(',')[0]
    if (format === 's' && value.length > 15) {
      const words = value.split(" ");
      const shortenedWords = [];
      for (const word of words) {
        if (word.length > 3) {
          shortenedWords.push(word.slice(0, 3) + ".");
        } else {
          shortenedWords.push(word);
        }
      }
      return shortenedWords.join(" ");
    }
    return value;
  }

}
