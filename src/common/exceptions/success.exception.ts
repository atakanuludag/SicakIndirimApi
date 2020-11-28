import { HttpException, HttpStatus } from '@nestjs/common';
import { HTTPExceptionModel } from '../models/http.exception.model';

export class SuccessException extends HttpException {
    constructor(message: string) {
        const exception: HTTPExceptionModel = {
            error: message,
            status: HttpStatus.OK
        }
        super(exception, HttpStatus.OK);
    }
}