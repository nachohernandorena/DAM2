import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DispositivoService } from '../services/dispositivo.service';
import { MedicionesService } from '../services/mediciones.service';
import { ElectrovalvulaService } from '../services/electrovalvula.service';
import { LogsService } from '../services/log-riego.service';
import { Dispositivos } from '../interfaces/dispositivos';
import { Mediciones } from '../interfaces/mediciones';
import { Logs } from '../interfaces/logRiegos';
import * as Highcharts from 'highcharts';

declare let require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);

@Component({
  selector: 'app-dispositivos',
  templateUrl: './dispositivos.page.html',
  styleUrls: ['./dispositivos.page.scss'],
})

export class DispositivosPage implements OnInit {
  public dispositivoId: string = '';
  public dispositivos: Dispositivos = new Dispositivos(0, '', '', 0);
  public myChart: any;
  public mediciones!: Mediciones[];
  public statusValvula = false;
  private chartOptions: any;
  private chartValue = 0;
  private chartName = '';
  public onError: boolean = false;
  public onErrorEV: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private dispService: DispositivoService,
    private medSer: MedicionesService,
    private EVServ: ElectrovalvulaService,
    private logServ: LogsService
  ) {}

  ionViewWillEnter() {
    this.generateChart();
    this.getDispositivosData();
  }

  ionViewOnLeave() {
    this.myChart.destroy();
    this.chartOptions = null;
    this.chartValue = 0;
    this.chartName = '';
  }

  ngOnInit() {}

  async getDispositivosData() {
    const dispositivoId = this.route.snapshot.paramMap.get('id');

    if (dispositivoId !== null) {
      try {
        this.onError = false;

          const [dispositivos, mediciones] = await Promise.all([
          this.dispService.getDispositivo(dispositivoId),
          this.medSer.getMediciones(dispositivoId)
        ]);

        this.dispositivos = dispositivos;

        if (mediciones) {
          this.mediciones = mediciones;
          const lastMedicionIndex = mediciones.length - 1;
          this.chartName = String(dispositivos.nombre);
          this.chartValue = mediciones[lastMedicionIndex].valor;
          this.updateChart();
        } else {
          this.updateChart();
        }
      } catch (error) {
        this.onError = true;
      }

      try {
        this.onErrorEV = false;
       
        this.statusValvula = Boolean(
          await this.EVServ.getstatusValvula(
            this.dispositivos.electrovalvulaId.toString()
          )
        );
      } catch (error) {
        this.onErrorEV = true;
      }
    }
  }

  changeStatusValvula() {
    this.statusValvula = !this.statusValvula;

    const now = new Date();
    const log: Logs = new Logs(0,Number(this.statusValvula),now,this.dispositivos.electrovalvulaId);
    this.logServ.addLog(log);

    if (!this.statusValvula) {
      const newMedicion = this.getAleatorio(0, 100);

      const med: Mediciones = new Mediciones(0,now,newMedicion,this.dispositivos.dispositivoId);

      this.medSer.addMediciones(med).then(() => {
        this.chartValue = Number(newMedicion);
        this.updateChart();
      });
    }
  }

  getAleatorio(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  updateChart() {
    this.myChart.update({
      title: {
        text: [this.chartName],
      },
      series: [
        {
          name: 'Medicion',
          data: [Number(this.chartValue)],
          tooltip: {
            valueSuffix: ' kPA',
          },
        },
      ],
    });
  }
// Generacion de Gauge
  generateChart() {
    this.chartOptions = {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
      },
      title: {
        text: [this.chartName],
      },
      credits: { enabled: false },
      pane: {
        startAngle: -150,
        endAngle: 150,

        center: ['50%', '50%'],
        size: '100%',
      },
      // the value axis
      yAxis: {
        min: 0,
        max: 100,

        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',

        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
          step: 2,
          rotation: 'auto',
        },
        title: {
          text: 'Centibar',
        },
        plotBands: [
          {
            from: 0,
            to: 10,
            color: '#000000', // black
          },
          {
            from: 10,
            to: 30,
            color: '#55BF3B', // green
          },
          {
            from: 30,
            to: 60,
            color: '#DDDF0D', // yellow
          },
          {
            from: 60,
            to: 100,
            color: '#DF5353', // red
          },
        ],
      },
      series: [
        {
          name: 'Cb',
          data: [Number(this.chartValue || 0)],
          tooltip: {
            valueSuffix: ' kPa',
          },
        },
      ],
    };
  this.myChart = Highcharts.chart('highcharts', this.chartOptions, async (t) => {
     await this.getDispositivosData();
     this.updateChart();
    }); 
  }
}