export class HttpException extends Error {
    public readonly status: number;
    public readonly message: string;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
        Object.setPrototypeOf(this, HttpException.prototype);
    }
}

export class NotFoundException extends HttpException {
    constructor(message: string = 'Resource not found') {
        super(404, message);
        Object.setPrototypeOf(this, NotFoundException.prototype);
    }
}

export class BadRequestException extends HttpException {
    constructor(message: string = 'Bad request') {
        super(400, message);
        Object.setPrototypeOf(this, BadRequestException.prototype);
    }
}

export class UnprocessableEntityException extends HttpException {
    constructor(message: string = 'Unauthorized') {
        super(422, message);
        Object.setPrototypeOf(this, UnprocessableEntityException.prototype);
    }
}