import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Logs } from '../interfaces/logRiegos';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class LogsService {
  logs: Array<Logs> = new Array<Logs>();

    constructor(private _http: HttpClient ) {
   }


  getLogsValvula(id: string): Promise<Logs[]> {
    return this._http.get('http://localhost:8000' + '/logriego/' + id)
      .toPromise()
      .then((logRiegoResponse: Object | undefined) => {
        if (logRiegoResponse) {
          const logs: Logs[] = logRiegoResponse as Logs[];
          return logs;
        } else {
          return [];
        }
      });
  }

  addLog(log: Logs) {
    return this._http.post('http://localhost:8000'+'/logRiego/add',{apertura:log.apertura, fecha:log.fecha.toISOString().slice(0, 19).replace('T', ' '), electrovalvulaId:log.electrovalvulaId}).toPromise().then((result)=>result);
  }
}
