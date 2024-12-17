import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaypalApiService } from '../../../services/API/paypal-api.service';
import { NgxPayPalModule, IPayPalConfig } from 'ngx-paypal';

@Component({
  selector: 'ui-paypal-button',
  standalone: true,
  imports: [NgxPayPalModule],
  template: `<ngx-paypal [config]="payPalConfig"></ngx-paypal>`,
})
export class PaypalButtonComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
  @Input() id: string = '';
  @Output() onApproved = new EventEmitter<void>();
  @Output() onSuccess = new EventEmitter<{
    transactionId: string;
    email: string;
  }>();
  @Output() onFailure = new EventEmitter<void>();

  constructor(private APIService: PaypalApiService) {}

  ngOnInit() {
    this.payPalConfig = {
      currency: 'HUF',
      clientId: import.meta.env['NG_APP_PAYPAL_CLIENT_ID'],
      // createOrderOnClient: (data: any) =>
      //   <ICreateOrderRequest>{
      //     intent: 'CAPTURE',
      //     purchase_units: [
      //       {
      //         amount: {
      //           currency_code: 'HUF',
      //           value: this.price,
      //           breakdown: {
      //             item_total: {
      //               currency_code: 'HUF',
      //               value: this.price,
      //             },
      //           },
      //         },
      //         items: [
      //           {
      //             name: 'test',
      //             quantity: '1',
      //             category: 'PHYSICAL_GOODS',
      //             unit_amount: { currency_code: 'HUF', value: this.price },
      //           },
      //         ],
      //       },
      //     ],
      //   },
      createOrderOnServer: (data) => this.APIService.createOrder(this.id),
      advanced: {
        commit: 'true',
      },
      style: {
        shape: 'rect',
        color: 'white',
        label: 'pay',
        layout: 'vertical',
      },
      onApprove: (
        data: any,
        actions: { order: { get: () => Promise<any> } }
      ) => {
        // console.log('onApprove - transaction was approved, but not authorized', data, actions);
        // actions.order.get().then((details: any) => {
        //   console.log('onApprove - you can get full order details inside onApprove: ', details);
        // });
        this.onApproved.emit();
      },
      onClientAuthorization: (data: any) => {
        // console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        const transactionId = data.id;
        const email = data.payer.email_address;

        this.onSuccess.emit({ transactionId, email });
      },
      // onCancel: (data: any, actions: any) => {
      //   console.log('OnCancel', data, actions);
      //   // this.onFailure.emit();
      // },
      onError: (err: any) => {
        // console.log('OnError', err);
        this.onFailure.emit();
      },
      // onClick: (data: any, actions: any) => {
      //   console.log('onClick', data, actions);
      // },
      // onInit: (data: any, actions: any) => {
      //   console.log('onInit', data, actions);
      // },
    };
  }
}
