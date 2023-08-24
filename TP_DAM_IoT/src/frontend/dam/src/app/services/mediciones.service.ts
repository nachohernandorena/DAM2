import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Mediciones } from '../interfaces/mediciones';

@Injectable({
  providedIn: 'root'
})
export class MedicionesService {
  constructor(private _http: HttpClient) { }

 addMediciones(mediciones: Mediciones){
    return this._http.post('http://localhost:8000/mediciones/add',{fecha:mediciones.fecha.toISOString().slice(0, 19).replace('T', ' '),valor:mediciones.valor,dispositivoId:mediciones.dispositivoId}).toPromise().then((result)=>result);
   };

  getMediciones(id: string): Promise<Mediciones[]> {
    return this._http.get<Mediciones[]>('http://localhost:8000/mediciones/' + id + '/all')
      .toPromise()
      .then((mediciones: Mediciones[] | undefined) => {
        if (mediciones === undefined) {
          throw new Error('No se pudieron obtener las mediciones');
        }
        return mediciones;
      });
  }

}