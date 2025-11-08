import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Request } from "express";



@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        
        if(!token) {
            throw new UnauthorizedException('Invalid token');
        }
        
        try {
            const payload = this.jwtService.verify(token)
            // console.log('payload', payload)
            // console.log('payload.email', payload.payload.email)
            request.email = payload.payload.email
            // request.userId = payload.userId
            // console.log('request.email', request.email)
        } catch (error) {
            Logger.error(error.message)
            throw new UnauthorizedException('Invalid token');
        }
        return true
        
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        return request.headers.authorization?.split(' ')[1];
    }
}