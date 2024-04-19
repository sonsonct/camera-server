import { CartRepository } from 'src/repositories/cart.repository';
import { Injectable } from '@nestjs/common';
import * as paypal from 'paypal-rest-sdk';

@Injectable()
export class PaypalService {
    constructor(
        private readonly cartRepository: CartRepository
    ) {
        paypal.configure({
            mode: 'sandbox',
            client_id: process.env.PAYPAL_CLIENT_ID,
            client_secret: process.env.PAYPAL_SECRET,
        });
    }

    async createPayment(userId: number) {
        const data = await this.cartRepository.getCart(userId);
        //console.log(data[0].orders);

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
                        ]
                    },
                    amount: {
                        total: 0,
                        currency: 'USD',
                    },
                    description: 'Purchase of ' + "camera ne",
                },
            ],
        };

        let sumPrice = 0;
        data[0].orders.forEach((order) => {
            const item = {
                name: order.product.productName,
                quantity: order.total,
                price: (order.total * order.product.price),
                currency: 'USD',
            }
            sumPrice += order.total * order.product.price
            payment.transactions[0].item_list.items.push(item);
        });
        payment.transactions[0].amount.total = sumPrice;

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
