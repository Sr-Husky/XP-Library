import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // Lê os roles da rota (se tiver algum)
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(), // método (rota específica)
            context.getClass(),   // controller
        ]);

        if (!requiredRoles) return true; // se a rota não exige roles, permite o acesso

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        console.log('User:', user);
        console.log('Required roles:', requiredRoles);

        const hasRole = requiredRoles.includes(user.role);
        if (!hasRole) throw new ForbiddenException('Você não tem permissão');

        return true;
    }
}
