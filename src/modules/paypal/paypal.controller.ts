import { Controller, Get, Query } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
    constructor(private readonly paypalService: PaypalService) { }

    @Get('payment')
    async createPayment() {
        const approvalUrl = await this.paypalService.createPayment(100);
        return { approvalUrl };
    }

    @Get('success')
    async ssPayment(@Query('paymentId') paymentId: string, @Query('token') token: string, @Query('PayerID') payerId: string) {
        const approvalUrl = await this.paypalService.executePayment(paymentId, payerId, token);
        return approvalUrl;
    }

    @Get('cancel')
    async cancel() {
        return "da huy don hang";
    }
}
