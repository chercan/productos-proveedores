import { HttpException, HttpStatus } from '@nestjs/common';

export class ResourceNotFoundException extends HttpException {
  constructor(message?: string | 'Resource(s) not found(s)') {
    super(message, HttpStatus.NOT_FOUND);
  }
}
