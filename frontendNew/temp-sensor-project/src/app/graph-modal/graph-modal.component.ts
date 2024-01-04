// graph-modal.component.ts

import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import * as moment from 'moment';

import 'chartjs-adapter-moment';
Chart.register(...registerables);

@Component({
  selector: 'app-graph-modal',
  templateUrl: './graph-modal.component.html',
  styleUrls: ['./graph-modal.component.css']
})
export class GraphModalComponent implements OnInit {
  @Input() selectedSensor: any;
  @Input() labApi: any;
  @Output() closeModalEvent = new EventEmitter<void>;

  @ViewChild('temperatureHumidityCanvas') temperatureHumidityCanvas!: ElementRef;
  @ViewChild('otherDataCanvas') otherDataCanvas!: ElementRef;
  chartData: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Fetching historical data for the device
    this.apiService.getAllHistoricalDataForDevice(this.labApi, this.selectedSensor.DeviceID).subscribe(
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
              borderColor: 'red',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
            },
            {
              label: 'Humidity',
              data: this.chartData.map(entry => entry.Humidity),
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 0, 255, 0.1)',
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
              borderColor: 'red',
              backgroundColor: 'red',
            },
            {
              label: 'Alcohol',
              data: this.chartData.map(entry => entry.Alcohol),
              borderColor: 'orange',
              backgroundColor: 'orange',
            },
            {
              label: 'CO2',
              data: this.chartData.map(entry => entry.CO2),
              borderColor: 'yellow',
              backgroundColor: 'yellow',
            },
            {
              label: 'Toluene',
              data: this.chartData.map(entry => entry.Toluene),
              borderColor: 'green',
              backgroundColor: 'green',
            },
            {
              label: 'NH4',
              data: this.chartData.map(entry => entry.NH4),
              borderColor: 'blue',
              backgroundColor: 'blue',
            },
            {
              label: 'Acetone',
              data: this.chartData.map(entry => entry.Acetone),
              borderColor: 'purple',
              backgroundColor: 'purple',
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
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
          },
        },
        legend: {
          position: 'bottom',
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
  
  
  
}
