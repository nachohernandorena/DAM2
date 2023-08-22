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
  public dispositivos: Dispositivos = new Dispositivos(0, '', '', 0);
  public dispositivoId: string = '1';
  public estadoValvula = false;
  public myChart: any;
  public mediciones!: Mediciones[]; 
  private chartOptions: any;
  private chartValue = 0;
  private chartName = '';
  public onError: boolean = false;
  public onEVError: boolean= false;


  constructor(
    private route: ActivatedRoute,
    private dispService: DispositivoService,
    private medSrv: MedicionesService,
    private lSrv: LogsService,
    private evSrv: ElectrovalvulaService,
  ) {

  }
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

  async ngOnInit() {}

  async getDispositivosData() {
    const dispositivoId = this.route.snapshot.paramMap.get('id');
    
 // Comprobamos si dispositivoId no es null
 if (dispositivoId !== null) {
  try {
    this.onError = false;

    // Obtener información del dispositivo
    const dispositivos = await this.dispService.getDispositivo(dispositivoId);
    this.dispositivos = dispositivos;

    // Obtener mediciones asociadas al dispositivo
    const mediciones = await this.medSrv.getMediciones(dispositivoId);

    if (mediciones) {
      this.mediciones = mediciones;
      this.chartName = String(this.dispositivos.nombre);
      this.updateChart();
    } else {
      this.updateChart();
    }
  } catch (error) {
    this.onError = true;
  }
  // Intentar obtener el estado de la válvula
  try {
    this.onEVError = false;

    // Convertir el estado de la válvula a booleano y asignarlo a estadoValvula
    this.estadoValvula = Boolean(await this.evSrv.getEstadoValvula(this.dispositivos.electrovalvulaId.toString()));
  } catch (error) {
    this.onEVError = true;
  }
}
}

  changeStatusValvula() {
    // Cambiar el estado de la válvula
    this.estadoValvula = !this.estadoValvula;
  
    // Crear un registro de log
    const now = new Date();
    const log: Logs = new Logs(0, Number(this.estadoValvula), now, this.dispositivos.electrovalvulaId);
    this.lSrv.addLog(log);
  
    // Si la válvula se apaga
    if (!this.estadoValvula) {
      // Generar un nuevo valor aleatorio para la medición
      const newMedicion = this.getAleatorio(0, 100);
  
      // Crear una nueva medición
      const med: Mediciones = new Mediciones(0, now, newMedicion, this.dispositivos.dispositivoId);
  
      // Agregar la medición
      this.medSrv.addMediciones(med).then(() => {
        // Actualizar el valor de la gráfica con la nueva medición
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
          name: 'kPA',
          data: [Number(this.chartValue)],
          tooltip: {
            valueSuffix: ' kPA',
          },
        },
      ],
    });
  }

  generateChart() {
    this.chartOptions = {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: '300px',
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