import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DispositivoService } from '../services/dispositivo.service';
import { LogsService } from '../services/log-riego.service';
import { Dispositivos } from '../interfaces/dispositivos';
import { Logs } from '../interfaces/logRiegos';
import { AperturaPipe } from '../pipes/apertura.pipe';
import { Location } from '@angular/common';


@Component({
  selector: 'app-logriego',
  templateUrl: './logriego.page.html',
  styleUrls: ['./logriego.page.scss'],
})
export class LogriegoPage implements OnInit {
  public dispositivos!: Dispositivos;
  public logs!: Array<Logs>;
  public dispositivoId!: string;
  public electrovalvulaId!: string;
  public onError!: boolean;

  constructor(private router: ActivatedRoute, private dispService: DispositivoService, private lServ: LogsService, private location: Location) {}

  ngOnInit() {
    this.getLogsData();
  }

  goBack() {
    this.location.back();
  }
  
  async getLogsData() {
    this.electrovalvulaId = this.router.snapshot.paramMap.get('id') || '';
    try {
      let log = await this.lServ.getLogsValvula(this.electrovalvulaId);
      this.logs = log;
      this.onError = false;
    } catch (error) {
      this.onError = true;
    }
  }  
}
