import { StatisticalRepository } from './../../repositories/statistical.repository';
import { Injectable } from '@nestjs/common';
import { StatisticalDto } from './dto/statistical.dto';


@Injectable()
export class StatisticalService {
    constructor(
        private readonly statisticalRepository: StatisticalRepository,

    ) { }

    async getStatistical(query: StatisticalDto) {
        return await this.statisticalRepository.getStatistical(query);
    }

    async getStatisticalFullMonth() {
        return await this.statisticalRepository.getStatisticalFullMonth();
    }
}
