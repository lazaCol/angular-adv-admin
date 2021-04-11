import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'images',
})
export class ImagesPipe implements PipeTransform {
  transform(img: string, tipo: 'usuarios' | 'medicos' | 'hospitales'): string {
    if (!img) {
      return `${base_url}/upload/${tipo}/no-image`;
    }

    if (img?.includes('https')) {
      return img;
    }

    if (img) {
      return `${base_url}/upload/${tipo}/${img}`;
    } else {
      return `${base_url}/upload/${tipo}/no-image`;
    }
  }
}
