import { Client } from '../src/client.js'
import { ClientConfig } from '../src/types/index.js'
import { ProductListEP } from './endpoints/products/list.js'
import { ProductShowEP } from './endpoints/products/show.js'

const baseConfig: ClientConfig = {
  base: new URL('https://dummyjson.com'),
}

export class RestClient {
  client = new Client(baseConfig)

  constructor(config?: Partial<ClientConfig>) {
    this.client = new Client({
      ...baseConfig,
      base: config?.base ?? baseConfig.base,
    })

    if (config?.token) {
      this.client.setToken(config.token)
    }
  }

  #client() {
    return this.client
  }

  api = {
    product: {
      list: ProductListEP.send.bind(null, this.#client()),
      show: ProductShowEP.send.bind(null, this.#client()),
    },
  }
}
