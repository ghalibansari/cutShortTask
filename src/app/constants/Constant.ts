export class Constant {
  //PORT
  static readonly PORT: string | number = 9002;

  //secret key for token encryption.
  static readonly secret_key: string = "secret_key_jwt_token";
  static readonly jwt_key: string = "secrets";

  //pagination
  static readonly DEFAULT_PAGE_SIZE: number = 10;
  static readonly DEFAULT_PAGE_NUMBER: number = 1;

  static readonly limit: number = 1;
  static readonly startIndex: number = 0;
}
