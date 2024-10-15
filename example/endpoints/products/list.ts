import { z } from 'zod'
import { Method } from '../../../src/types/index.js'
import { Path } from '../../../src/helpers/path.js'
import { InferEndpoint } from '../../../src/types/function.js'
import { Client } from '../../../src/client.js'

export class ProductListEP {
  static method = Method.GET
  static path = new Path(['products'])

  static query = z
    .object({
      skip: z.number(),
      limit: z.number(),
    })
    .optional()

  static input = z
    .object({
      query: this.query,
    })
    .optional()

  static output = z
    .object({
      products: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          description: z.string(),
          category: z.string(),
          price: z.number(),
        })
      ),
      total: z.number(),
      skip: z.number(),
      limit: z.number(),
    })
    .optional()

  static send = async (client: Client, input?: z.infer<typeof this.input>) =>
    client.send(this, input)
}

export type ProductListT = InferEndpoint<typeof ProductListEP>
