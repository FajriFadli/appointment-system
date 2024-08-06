import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Config } from './entities/config.entity';
import { validate } from 'class-validator';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Config)
    private configRepository: Repository<Config>,
  ) {}

  async getConfig(): Promise<Config> {
    let config = await this.configRepository.findOne({
      where: {},
    });
    if (!config) {
      config = await this.createDefaultConfig();
    }
    return config;
  }

  private async createDefaultConfig(): Promise<Config> {
    const defaultConfig = this.configRepository.create({
      slotDuration: 30,
      maxSlotsPerAppointment: 1,
      operationalStartTime: '09:00',
      operationalEndTime: '18:00',
      operationalDays: [1, 2, 3, 4, 5], // Monday to Friday
    });
    return this.configRepository.save(defaultConfig);
  }

  async updateConfig(configData: Partial<Config>): Promise<Config> {
    let config = await this.getConfig();
    Object.assign(config, configData);

    const errors = await validate(config);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return this.configRepository.save(config);
  }
}
