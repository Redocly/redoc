import { Module } from '@nestjs/common';

import { DocsController } from './docs.controller';

@Module({
  controllers: [DocsController],
})
export class AppModule {}
