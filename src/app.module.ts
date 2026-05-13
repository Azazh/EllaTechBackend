import { Module } from '@nestjs/common';

import { ApplicationModule } from './application/application.module';
import { DomainModule } from './domain/domain.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { PresentationModule } from './presentation/presentation.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    SharedModule,
    DomainModule,
    ApplicationModule,
    InfrastructureModule,
    PresentationModule,
  ],
})
export class AppModule {}