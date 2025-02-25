import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { LambdaResponseService } from '@guini/lambda-response/lambda-response.service';

@Injectable()
export class LambdaResponseInterceptor implements NestInterceptor {
  constructor(private service: LambdaResponseService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(map((data) => this.service.build({ body: data })));
  }
}
