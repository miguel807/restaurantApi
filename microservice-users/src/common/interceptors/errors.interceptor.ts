import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        console.log(data)
        if (data && data.error) {
          const statusCode = data.status || 500;
          context.switchToHttp().getResponse().statusCode = statusCode;
          return {
            status: statusCode,
            error: data.error,
          };
        }
        return data;
      }),
    );
  }
}
