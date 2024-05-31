import { HttpException, HttpStatus } from '@nestjs/common';

export class ResourceAlreadyExistsException extends HttpException {
  constructor(message?: string | 'User name already exists') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
