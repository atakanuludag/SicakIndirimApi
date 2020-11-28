export class HTTPExceptionModel {
    constructor(
        public status: number,
        public error: string
    ) { }
}