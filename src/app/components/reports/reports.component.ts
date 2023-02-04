import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { Observable } from 'rxjs';
import { ContextData } from 'src/app/dto/context-data';
import { ReportDto } from 'src/app/dto/report-dto';
import { ApiResponse } from 'src/app/models/api-response';
import { RideService } from 'src/app/services/ride/ride.service';
import { getSession } from 'src/app/util/context';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  @ViewChild('dateRange') calendar: any;
  @ViewChild('rideChart') rideChart!: UIChart;
  rangeDates: Date[] = [];
  numberOfRidesData: any;
  distanceData: any;
  transactionsData: any;
  chartOptions: any;
  sumOfRides: number = 0;
  sumOfDistance: number = 0;
  sumOfTransactions: number = 0;
  averageRides: number = 0;
  averageDistance: number = 0;
  averageTransactions: number = 0;

  constructor
    (
      private rideService: RideService,
      public datepipe: DatePipe
    ) { }

  ngOnInit(): void {
    this.chartOptions = {
      plugins: {
        legend: { display: false },
      }
    };
  }
  showGraphs() {
    if (this.rangeDates[1]) {
      const endDate: Date = new Date(this.rangeDates[1].getTime() + (1000 * 60 * 60 * 24));
      console.log(endDate);
      const startDateString: string = this.datepipe.transform(this.rangeDates[0], 'dd-MM-yyyy') || '';
      const endDateString: string = this.datepipe.transform(endDate, 'dd-MM-yyyy') || '';
      console.log(endDateString);
      this.getApiCall(startDateString, endDateString)
        .subscribe
        ({
          next: (data) => this.updateGraphData(data.body as ReportDto),
          error: (data) => console.log(data)
        });
    }
  }
  getApiCall(startDate: string, endDate: string): Observable<ApiResponse<ReportDto>> {
    const session: ContextData | undefined = getSession();
    let role = '';
    if (session !== undefined) {
      role = session.role;
    }
    if (role === 'ROLE_CLIENT') {
      return this.rideService.getClientReport(startDate, endDate);
    }
    else if (role === 'ROLE_DRIVER') {
      return this.rideService.getDriverReport(startDate, endDate);
    }
    else {
      return this.rideService.getAdminReport(startDate, endDate);
    }
  }
  updateGraphData(reportData: ReportDto) {
    this.sumOfRides = reportData.sumOfRides;
    this.sumOfDistance = Number(reportData.sumOfDistance.toFixed(3));
    this.sumOfTransactions = reportData.sumOfTransactions;
    this.averageRides = Number(reportData.averageRides.toFixed(3));
    this.averageDistance = Number(reportData.averageDistance.toFixed(3));
    this.averageTransactions = Number(reportData.averageTransactions.toFixed(3));

    this.numberOfRidesData = {
      labels: reportData.labels,
      datasets: [
        {
          data: reportData.ridesData,
          fill: true,
          borderColor: '#75C5F0',
          backgroundColor: 'RGB(117, 197, 240, 0.3)',
          tension: 0,
        }
      ],
    };
    this.distanceData = {
      labels: reportData.labels,
      datasets: [
        {
          data: reportData.distanceData,
          fill: true,
          borderColor: '#CDAFDB',
          backgroundColor: 'RGB(205, 175, 219, 0.3)',
          tension: 0,
        }
      ],
    };
    this.transactionsData = {
      labels: reportData.labels,
      datasets: [
        {
          data: reportData.transactionsData,
          fill: true,
          borderColor: '#FCE181',
          backgroundColor: 'RGB(252, 225, 129, 0.3)',
          tension: 0,
        }
      ],
    };
    setTimeout(() => {
      this.rideChart.reinit();
    }, 100);
  }
}
