import { z } from 'zod'
import { Endpoint } from '../endpoint.js'

export type InferEndpoint<EP extends Endpoint> = {
  input: {
    param: NonNullable<z.infer<NonNullable<EP['param']>>>
    body: NonNullable<z.infer<NonNullable<EP['body']>>>
    query: NonNullable<z.infer<NonNullable<EP['query']>>>
  }
  output: NonNullable<z.infer<NonNullable<EP['output']>>>
}
