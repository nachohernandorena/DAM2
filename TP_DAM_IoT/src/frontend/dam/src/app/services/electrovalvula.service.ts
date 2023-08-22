import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ElectrovalvulaService {

  constructor(private _http: HttpClient ) {
  }

  async getEstadoValvula(id:string): Promise<number> {
    try {
      const logs: any = await this._http.get('http://localhost:8000'+'/logriego/'+id).toPromise();
      if(logs){
        return logs?.apertura;
      }
      else{
        return 0;
      }
    }
    catch (error)
    {
      console.log(error);
      return 0;
    }
  }
}