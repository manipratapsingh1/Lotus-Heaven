import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Only log mutating operations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const userId = request.user?.id || null;
      const action = `${method} ${request.path}`;
      const ipAddress =
        request.ip || request.headers['x-forwarded-for'] || 'unknown';

      return next.handle().pipe(
        tap(() => {
          // Fire and forget - don't block response
          this.prisma.auditLog
            .create({
              data: {
                userId,
                action,
                details: JSON.stringify({
                  body: this.sanitizeBody(request.body),
                  params: request.params,
                }),
                ipAddress: String(ipAddress),
              },
            })
            .catch(() => {}); // Silently fail to not affect user operations
        }),
      );
    }

    return next.handle();
  }

  private sanitizeBody(body: any): any {
    if (!body) return null;
    const sanitized = { ...body };
    // Remove sensitive fields from audit logs
    delete sanitized.password;
    delete sanitized.passwordHash;
    delete sanitized.newPassword;
    delete sanitized.refreshToken;
    return sanitized;
  }
}
