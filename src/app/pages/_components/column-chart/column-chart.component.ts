import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ChartComponent,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexTooltip,
} from 'ng-apexcharts';

@Component({
  selector: 'app-column-chart',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.css'],
})
export class ColumnChartComponent implements OnChanges {
  @ViewChild('chart') chart!: ChartComponent;

  @Input() series: any[] = [];
  @Input() categories: string[] = [];

  chartOptions: any;

  constructor() {
    this.chartOptions = this.getChartOptions([], []);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['series'] || changes['categories']) {
      this.chartOptions = this.getChartOptions(this.series, this.categories);
    }
  }

  getChartOptions(seriesData: any[], categoryData: string[]) {
    return {
      series: seriesData.length
        ? seriesData
        : [{ name: 'Loading...', data: [] }],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: categoryData.length ? categoryData : ['Loading...'],
      },
      yaxis: {
        title: {
          text: 'Values',
        },
      },
      title: {
        text: 'Column Chart',
        align: 'left',
      },
      tooltip: {
        enabled: true,
      },
    };
  }
}
