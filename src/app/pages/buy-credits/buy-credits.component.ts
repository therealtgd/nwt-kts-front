import { Component, OnInit } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { CreditsService } from 'src/app/services/credits/credits.service';

@Component({
  selector: 'app-buy-credits',
  templateUrl: './buy-credits.component.html',
  styleUrls: ['./buy-credits.component.css']
})
export class BuyCreditsComponent implements OnInit {

  creditAmounts$!: Observable<any>;
  showPayPalModal: boolean = false;
  buyAmount: number = 0;

  constructor(private creditsService: CreditsService) { }

  ngOnInit() {
    this.creditAmounts$ = this.creditsService.getAmounts().pipe(
      catchError(_error => {
        console.error('An error occurred while retrieving credit amounts');
        return of([]);
      })
    );
  }

  buyCredits(amount: number) {
    this.buyAmount = amount;
    this.showPayPalModal = true;
  }

}
