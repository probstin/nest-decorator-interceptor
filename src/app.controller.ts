import { Controller, Get } from '@nestjs/common';
import { CacheKey } from './app-decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @CacheKey('READ')
  getHello(): string {
    return this.appService.getHello();
  }
}
