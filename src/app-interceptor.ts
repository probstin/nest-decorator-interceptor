import { HttpService } from '@nestjs/axios';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { catchError, forkJoin, map, Observable, of, tap } from 'rxjs';

@Injectable()
export class AppInterceptor implements NestInterceptor {

    constructor(
        private reflector: Reflector,
        private httpService: HttpService
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const auditEvent: string = this.reflector.get('audit-event', context.getHandler());
        return forkJoin([next.handle(), this.asyncRequest(auditEvent)]).pipe(map(([handle]) => handle));
    }

    asyncRequest(auditEvent: string): Observable<any> {
        return this.httpService
            .post('http://localhost:5000/auditor', { auditEvent})
            .pipe(
                tap(() => console.info(`Sent ${auditEvent} event to the auditor service`)),
                catchError(error => {
                    console.error(`An error occurred sending the ${auditEvent} event to the auditor service:`, error.message)
                    return of(error)
                }));
    }

}