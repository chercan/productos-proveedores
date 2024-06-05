export class ResponseData {
  constructor(
    readonly payload: any,
    readonly message: string,
  ) {
    this.payload = payload;
    this.message = message;
  }
}
