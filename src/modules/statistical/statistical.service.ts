import { CartRepository } from 'src/repositories/cart.repository';
import { Injectable } from '@nestjs/common';
import { StatisticalDto } from './dto/statistical.dto';


@Injectable()
export class StatisticalService {
    constructor(
        public readonly cartRepository: CartRepository
    ) { }

    async getStatistical(query: StatisticalDto) {
        return await this.cartRepository.getStatistical(query);
    }

    async getStatisticalFullMonth() {
        return await this.cartRepository.getStatisticalFullMonth();
    }
}
