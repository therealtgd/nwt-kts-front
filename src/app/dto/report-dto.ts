export interface ReportDto {
  sumOfRides: number;
  sumOfDistance: number;
  sumOfTransactions: number;
  averageRides: number;
  averageDistance: number;
  averageTransactions: number;
  ridesData: number[];
  distanceData: number[];
  transactionsData: number[];
  labels: string[];
}
