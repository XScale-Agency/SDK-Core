import { z } from 'zod'

const inputSchema = z
  .object({
    body: z.any(),
    param: z.any(),
    query: z.any(),
  })
  .optional()

export const inputParser = <Input>(data?: Input, schema?: z.ZodType<Input>) => {
  if (!data || !schema) {
    return undefined
  }

  const parsedInput = schema.parse(data)

  return inputSchema.parse(parsedInput)
}

const errorSchema = z.array(
  z.object({
    field: z.string().optional(),
    message: z.string(),
  })
)

const outputSchema = z.object({
  errors: errorSchema.optional(),
})

export const outputParser = <Output>(data: Output, schema: z.ZodType<Output>) => {
  const parsedOutput = outputSchema
    .extend({
      data: schema,
    })
    .parse(data)

  return parsedOutput.data as Output
}

export const errorParser = (data: any) => {
  const errorArray = errorSchema.parse(data)

  const fields: Record<string, string> = {}
  const messages: string[] = []

  errorArray.forEach((error) => {
    if (error.field) {
      fields[error.field] = error.message
    } else {
      messages.push(error.message)
    }
  })

  return { fields, messages }
}
