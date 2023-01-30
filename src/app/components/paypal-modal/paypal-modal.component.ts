import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { ApiResponse } from 'src/app/models/api-response';
import { CreditsService } from 'src/app/services/credits/credits.service';

@Component({
  selector: 'app-paypal-modal',
  templateUrl: './paypal-modal.component.html',
  styleUrls: ['./paypal-modal.component.css']
})
export class PaypalModalComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
  @Input() buyAmount: number = 0;
  @Input() modalVisible: boolean = false;
  @Output() onModalClose: EventEmitter<any> = new EventEmitter();
  showSuccess: boolean = false;
  showCancel: boolean = false;
  showError: boolean = false;

  constructor(private creditsService: CreditsService) { }

  ngOnInit(): void {
    this.initConfig();
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (_data: any) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: this.buyAmount.toString(),
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: this.buyAmount.toString()
              }
            }
          },
          items: [{
            name: 'Foober Credits',
            quantity: this.buyAmount.toString(),
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'EUR',
              value: '1',
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (_data, actions) => {
        actions.order.get().then((details: any) => {
        });
      },
      onClientAuthorization: (_data) => {
        this.creditsService.addCredits(this.buyAmount).subscribe({
          next: () => {
            this.showSuccess = true;
          },
          error: (error) => console.error(error.message),
        });
      },
      onCancel: (data, actions) => {
        this.showCancel = true;
      },
      onError: err => {
        this.showError = true;
      },
      onClick: (data, actions) => {
        this.resetStatus();
      }
    };
  }

  resetStatus() {
    this.showError = false;
    this.showSuccess = false;
    this.showCancel = false;
  }
}
