import { ClientConfig, Token } from './types/index.js'
import axios, { type AxiosRequestConfig, AxiosInstance } from 'axios'
import { Endpoint } from './endpoint.js'
import qs from 'qs'
import { inputParser, outputParser } from './helpers/parsers.js'
import { ClientErrorHandler } from './error.js'
import { z } from 'zod'

export class Client {
  #axios: AxiosInstance
  #token?: Token
  #beforeParse?: (input: any) => any

  readonly base: URL

  constructor(params: ClientConfig) {
    this.base = params.base
    this.#token = params.token
    this.#beforeParse = params.beforeParse

    this.#axios = axios.create({
      baseURL: this.base.origin,
      headers: {
        'Content-Type': 'application/json',
      },
      paramsSerializer: (_params) => qs.stringify(_params),
    })
  }

  setToken(token: Token) {
    this.#token = token
  }

  async token() {
    if (typeof this.#token === 'string') {
      return this.#token
    } else if (typeof this.#token === 'function') {
      return this.#token()
    } else {
      return undefined
    }
  }

  async send<EP extends Endpoint>(
    endpoint: EP,
    rawInput: EP['input'] extends z.ZodTypeAny ? z.infer<EP['input']> : undefined
  ) {
    try {
      const input = inputParser(rawInput, endpoint.input)

      const token = await this.token()

      const config: AxiosRequestConfig = {
        method: endpoint.method,
        url: endpoint.path.get(input?.param, endpoint?.param),
        data: input?.body,
        params: input?.query,
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': endpoint.form ? 'multipart/form-data' : 'application/json',
        },
      }

      const res = await this.#axios.request(config)

      const resData = this.#beforeParse ? this.#beforeParse(res.data) : res.data

      return outputParser<z.infer<EP['output']>>(resData, endpoint.output)
    } catch (err) {
      ClientErrorHandler(err)
    }
  }
}
