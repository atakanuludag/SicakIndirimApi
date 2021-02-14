import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IUserEntity } from '../../user/interfaces/user.entity.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      //Rol tanımlı değilse Authentication çalıştırma.
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authorization = request.header('Authorization');
    if (!authorization) {
      return false;
    }
    const user: IUserEntity = request.user;

    const hasRole = () => user.roles.every( role => roles.includes(role) );
    return user && user.roles && hasRole();
  }
}