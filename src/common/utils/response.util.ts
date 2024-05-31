export class ResponseData {
  payload: any;
  message?: string;

  constructor(payload: any, message: string) {
    this.payload = payload;
    this.message = message;
  }
}
