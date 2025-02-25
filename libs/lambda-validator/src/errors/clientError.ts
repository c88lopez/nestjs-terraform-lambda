export class ClientError extends Error {
  type: string;

  constructor(message) {
    super();

    this.type = 'ClientError';
    this.message = message;
  }
}
