import { z } from 'zod'
import { Method } from '../../../src/types/index.js'
import { Path } from '../../../src/helpers/path.js'
import { InferEndpoint } from '../../../src/types/function.js'
import { Client } from '../../../src/client.js'

export class ProductShowEP {
  static method = Method.GET
  static path = new Path(['products', ':productId'])

  static param = z.object({
    productId: z.number(),
  })

  static input = z
    .object({
      param: this.param,
    })
    .optional()

  static output = z
    .object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      category: z.string(),
      price: z.number(),
    })
    .optional()

  static send = async (client: Client, input: z.infer<typeof this.input>) =>
    client.send(this, input)
}

export type ProductShowT = InferEndpoint<typeof ProductShowEP>
