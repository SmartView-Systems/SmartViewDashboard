import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Router } from '@angular/router';
import * as moment from 'moment';
import zoomPlugin from 'chartjs-plugin-zoom';

import 'chartjs-adapter-moment';
Chart.register(...registerables, zoomPlugin);

@Component({
  selector: 'app-graph-modal',
  templateUrl: './graph-modal.component.html',
  styleUrls: ['./graph-modal.component.css']
})
export class GraphModalComponent implements OnInit {
  @Input() selectedSensor: any;
  @Input() labApi: any;
  @Input() sendData: any;
  @Output() closeModalEvent = new EventEmitter<void>;

  @ViewChild('temperatureHumidityCanvas') temperatureHumidityCanvas!: ElementRef;
  @ViewChild('otherDataCanvas') otherDataCanvas!: ElementRef;
  chartData: any[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    console.log("SENDDATA: ", this.sendData)
    // Fetching historical data for the device
    this.apiService.getGraphData(this.labApi, this.selectedSensor.DeviceID).subscribe(
      (response) => {
        if (response.success) {
          this.chartData = response.data;
          console.log('Fetched Data:', this.chartData);
          
          // Now that data is available, create the chart
          this.createChart();
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  createChart(): void {
    const temperatureHumidityCanvas = this.temperatureHumidityCanvas?.nativeElement as HTMLCanvasElement | null;
    const otherDataCanvas = this.otherDataCanvas?.nativeElement as HTMLCanvasElement | null;
  
    if (temperatureHumidityCanvas && otherDataCanvas) {
      this.createTemperatureHumidityChart(temperatureHumidityCanvas);
      this.createOtherDataChart(otherDataCanvas);
    }
  }
  
  
  private createTemperatureHumidityChart(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const formattedTimes = this.chartData.map(entry => moment(entry.Time * 1000).format('MM/DD HH:mm'));
  
      const temperatureHumidityConfig: ChartConfiguration = {
        type: 'line',
        data: {
          labels: formattedTimes,
          datasets: [
            {
              label: 'Temperature',
              data: this.chartData.map(entry => entry.Temperature),
              borderColor: 'rgb(255, 159, 64)',
              backgroundColor: 'rgba(255, 159, 64, 0.1)',
              pointRadius: 0,
              tension: 0.4
            },
            {
              label: 'Humidity',
              data: this.chartData.map(entry => entry.Humidity),
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.1)',
            },
          ],
        },
        options: this.getCommonChartOptions(`${this.selectedSensor.DeviceName} Temperature and Humidity`),
      };
  
      console.log('Temperature Humidity Config:', temperatureHumidityConfig);
  
      new Chart(ctx, temperatureHumidityConfig);
    }
  }
  
  private createOtherDataChart(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const formattedTimes = this.chartData.map(entry => moment(entry.Time * 1000).format('MM/DD HH:mm'));
  
      const otherDataConfig: ChartConfiguration = {
        type: 'line',
        data: {
          labels: formattedTimes,
          datasets: [
            {
              label: 'CO',
              data: this.chartData.map(entry => entry.CO),
              borderColor: 'rgb(128, 128, 128)',
              backgroundColor: 'rgba(128, 128, 128, 0.1)',
            },
            {
              label: 'Alcohol',
              data: this.chartData.map(entry => entry.Alcohol),
              borderColor: 'rgb(171, 121, 209)',
              backgroundColor: 'rgba(171, 121, 209, 0.1)',
            },
            {
              label: 'CO2',
              data: this.chartData.map(entry => entry.CO2),
              borderColor: 'rgb(106, 168, 79)',
              backgroundColor: 'rgba(106, 168, 79, 0.1)',
            },
            {
              label: 'Toluene',
              data: this.chartData.map(entry => entry.Toluene),
              borderColor: 'rgb(195, 123, 125)',
              backgroundColor: 'rgba(195, 123, 125, 0.1)',
            },
            {
              label: 'NH4',
              data: this.chartData.map(entry => entry.NH4),
              borderColor: 'rgb(164, 211, 156)',
              backgroundColor: 'rgba(164, 211, 156, 0.1)',
            },
            {
              label: 'Acetone',
              data: this.chartData.map(entry => entry.Acetone),
              borderColor: 'rgb(72, 201, 176)',
              backgroundColor: 'rgba(72, 201, 176, 0.1)',
            }
          ],
        },
        options: this.getCommonChartOptions(`${this.selectedSensor.DeviceName} Air Quality`, true, [0, 3]),
      };
  
      console.log('Other Data Config:', otherDataConfig);
  
      new Chart(ctx, otherDataConfig);
    }
  }
  
  

  private getCommonChartOptions(title: string, isLogScale: boolean = false, customYAxisTicks?: number[]): any {
    const options: any = {
      scales: {
        x: {
          type: 'category',
        },
        y: {
          type: isLogScale ? 'logarithmic' : 'linear',
          ticks: {
            min: customYAxisTicks ? Math.min(...customYAxisTicks) : undefined,
            max: customYAxisTicks ? Math.max(...customYAxisTicks) : undefined,
            stepSize: customYAxisTicks ? undefined : 1,
          },
        },
      },
      elements: {
        point: {
          radius: 0,
          pointStyle: 'line'
        }
      },
      plugins: {
        title: {
          display: true,
          text: title,
          color: '#444',
          font: {
            size: 16,
            family: "'Arial', 'Helvetica', 'sans-serif'",
            weight: 'bold'
          },
        },
        legend: {
          position: 'bottom',
        },
        zoom: {
          pan: {
            enabled: true,
          },
          zoom: {
            wheel: {
              enabled: true,
              speed: 0.1
            },
            pinch: {
              enabled: true
            },
            mode: 'xy'
          }
        },
      },
      maintainAspectRatio: false,
      responsive: true,
      layout: {
        padding: {
          top: 20,
          right: 20,
          bottom: 30,
          left: 20,
        },
      },
    };
  
    return options;
  }  

  openAIAnalysis(): void {
    this.closeModalEvent.emit();
    this.router.navigate(['/ai-analysis', { deviceID: this.selectedSensor.DeviceID, labApi: this.labApi }]);
  }

  parseInteger(value: string): number {
    return parseInt(value, 10);
  }
}
