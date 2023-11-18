import { ChartType } from './models/chart.model';
import { Component } from '@angular/core';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { readFile } from './core/functions/files';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  dummyData: string =
    `34.688 33.249 1
 34.759 33.307 2
 34.765 33.379 3
 34.669 33.330 4
 34.687 33.290 5
 34.617 33.286 6
 34.624 33.288 7
 34.626 33.288 8
 34.537 33.404 9
     `;


  earningLineChart: ChartType = {
    series: [
      {
        name: 'Left Leg',
        data: []
      },
      {
        name: 'Right Leg',
        data: []
      },
      {
        name: 'Summation',
        data: []
      },
    ],
    chart: {
      height: 330,
      type: 'area',
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: false,
        zoomedArea: {
          fill: {
            color: '#90CAF9',
            opacity: 0.4
          },
          stroke: {
            color: '#0D47A1',
            opacity: 0.4,
            width: 1
          }
        }
      }
    },
    colors: ['#556ee6', '#f1b44c', '#34c38f'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100]
      },
    },
    markers: {
      size: 3,
      strokeWidth: 3,
      hover: {
        size: 4,
        sizeOffset: 2
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
  };

  onSelect(event: NgxDropzoneChangeEvent) {
    const file = event.addedFiles[0];
    readFile(file).then(() => {
      console.log(file);
      this.readTextFile(file);
    });
  }


  txtToJson(txtData: string) {
    const lines = txtData.trim().split('\n');
    const data = lines.map(line => {
      const [left, right, sample] = line.split(' ').map(Number);
      return { left, right, sample };
    });

    const jsonData = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'miArchivo.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    const parsed = JSON.parse(jsonData);
    this.handleChart(parsed);
  }


  readTextFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const contenidoTexto = e.target.result;
      this.txtToJson(contenidoTexto);
    };
    reader.readAsText(file);
  }


  handleChart(dataParsed: any) {
    console.log('series', this.earningLineChart.series);

    this.earningLineChart.series[0].data = [];
    this.earningLineChart.series[1].data = [];
    this.earningLineChart.series[2].data = [];
    setTimeout(() => {
      for(const i in dataParsed){
        this.earningLineChart.series[0].data.push([dataParsed[i].sample, dataParsed[i].left])
        this.earningLineChart.series[1].data.push([dataParsed[i].sample, dataParsed[i].right])
        this.earningLineChart.series[2].data.push([dataParsed[i].sample, dataParsed[i].right + dataParsed[i].left])
      }
    }, 300);
  }
}
