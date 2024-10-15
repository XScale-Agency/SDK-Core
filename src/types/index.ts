export enum Method {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export type Token = string | (() => string | undefined) | (() => Promise<string | undefined>)

export type ClientConfig = {
  base: URL
  token?: Token

  /**
   * make changes in data before it goes to output parser
   */
  beforeParse?: (input: any) => any
}
