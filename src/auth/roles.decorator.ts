import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/user/types/user-role.type';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
