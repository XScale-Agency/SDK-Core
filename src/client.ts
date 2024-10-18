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

  readonly base: URL

  constructor(params: ClientConfig) {
    this.base = params.base
    this.#token = params.token

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
        data: input?.body,
        params: input?.query,
        method: endpoint.method,
        url: endpoint.path.get(input?.param, endpoint?.param),
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': endpoint.form ? 'multipart/form-data' : 'application/json',
        },
      }

      const res = await this.#axios.request(config)

      return outputParser<z.infer<EP['output']>>(res.data, endpoint.output)
    } catch (err) {
      ClientErrorHandler(err)
    }
  }
}
