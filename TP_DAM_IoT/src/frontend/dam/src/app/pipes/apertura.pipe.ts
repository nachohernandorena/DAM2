import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'apertura'
})
export class AperturaPipe implements PipeTransform {

  transform(value: number): string {
    return value? 'ON':'OFF';
  }

}
