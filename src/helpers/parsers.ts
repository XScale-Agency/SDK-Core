import { z } from 'zod'
import { SDKCoreError } from '../error.js'

const inputSchema = z
  .object({
    body: z.any(),
    param: z.any(),
    query: z.any(),
  })
  .optional()

export const inputParser = <Input>(data?: Input, schema?: z.ZodType<Input>) => {
  try {
    if (!data || !schema) {
      return undefined
    }

    const parsedInput = schema.parse(data)

    return inputSchema.parse(parsedInput)
  } catch (error) {
    throw new SDKCoreError({
      type: 'zod',
      message: 'Unable to parse input data',
      error,
      zod: error,
    })
  }
}

export const outputParser = <Output>(data: Output, schema: z.ZodType<Output>) => {
  try {
    const parsedOutput = schema.parse(data)

    return parsedOutput as Output
  } catch (error) {
    throw new SDKCoreError({
      type: 'zod',
      message: 'Unable to parse output data',
      error,
      zod: error,
    })
  }
}
