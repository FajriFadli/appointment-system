import { Controller, Get, Put, Body } from '@nestjs/common';
import { ConfigService } from './config.service';
import { Config } from './entities/config.entity';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getConfig() {
    return this.configService.getConfig();
  }

  @Put()
  updateConfig(@Body() configData: Partial<Config>) {
    return this.configService.updateConfig(configData);
  }
}
