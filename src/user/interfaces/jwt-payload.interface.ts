import UserRole from '../../common/enums/user-role.enum';

export interface IJwtPayload {
    readonly userId: string;
    readonly userName: string;
    readonly roles: string[];
}