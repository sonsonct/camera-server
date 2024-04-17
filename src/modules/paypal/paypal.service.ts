import { Injectable } from '@nestjs/common';
import * as paypal from 'paypal-rest-sdk';

@Injectable()
export class PaypalService {
    constructor() {
        paypal.configure({
            mode: 'sandbox',
            client_id: process.env.PAYPAL_CLIENT_ID,
            client_secret: process.env.PAYPAL_SECRET,
        });
    }

    async createPayment(amount: number) {
        const payment = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: 'http://localhost:3008/camera/api/v1/paypal/success',
                cancel_url: 'http://localhost:3008/camera/api/v1/paypal/cancel',
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: "camera ne",
                                quantity: '1',
                                price: amount.toFixed(2),
                                currency: 'USD',
                            },
                        ],
                    },
                    amount: {
                        total: amount.toFixed(2),
                        currency: 'USD',
                    },
                    description: 'Purchase of ' + "camera ne",
                },
            ],
        };

        return new Promise((resolve, reject) => {
            paypal.payment.create(payment, function (error, payment) {
                if (error) {
                    reject(error);
                } else {
                    resolve(payment.links.find(link => link.rel === 'approval_url').href);
                }
            });
        });
    }

    async executePayment(paymentId: string, payerId: string, token: string) {
        const execute_payment_json = {
            payer_id: payerId,
        };

        return new Promise((resolve, reject) => {
            paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                if (error) {
                    reject(error);
                } else {
                    resolve(payment);
                }
            });
        });
    }
}
