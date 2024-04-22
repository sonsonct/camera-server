import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  // @Get('payment/:id')
  // async createPayment(
  //     @Param('id') id: number
  // ) {
  //     const approvalUrl = await this.paypalService.createPayment(id);
  //     return { approvalUrl };
  // }

  // @Get('success')
  // async ssPayment(@Query('paymentId') paymentId: string, @Query('token') token: string, @Query('PayerID') payerId: string) {
  //     const approvalUrl = await this.paypalService.executePayment(paymentId, payerId, token);
  //     return approvalUrl;
  // }

  // @Get('cancel')
  // async cancel() {
  //     return "da huy don hang";
  // }
}
