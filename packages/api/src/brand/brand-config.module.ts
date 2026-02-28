import { Global, Module } from '@nestjs/common';
import { BrandConfigService } from './brand-config.service';

@Global()
@Module({
  providers: [BrandConfigService],
  exports: [BrandConfigService],
})
export class BrandConfigModule {}
