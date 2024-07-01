export interface Exception {
  message: string;
}

export class Exception extends Error implements Exception {
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

export class BleException extends Exception {}
