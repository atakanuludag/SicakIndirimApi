import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import UserRole from '../common/enums/user-role.enum';
import { ReportService } from './report.service';

@Controller()
export class ReportController {
  constructor(
    private readonly service: ReportService,
  ) {}
  

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('report')
  async get() {
    const userCount = await this.service.getUserCount();
    const hotDealCount = await this.service.getHotDealCount();
    const todayHotDealCount = await this.service.getTodayHotDealCount();

    const data: {
      userCount: number;
      hotDealCount: number;
      todayHotDealCount: number
    } = {
      userCount,
      hotDealCount,
      todayHotDealCount
    }

    return data;
  }

}
