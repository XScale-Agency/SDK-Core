import { z } from 'zod'
import { interpolate } from './interpolate.js'

export class Path {
  #path: string

  #rawPath: string[]

  #parse = (rawPath: string[]) =>
    z
      .array(
        z
          .string()
          .trim()
          .superRefine((key, ctx) => {
            if (key.startsWith(':')) {
              if (!key.match(/^:[a-zA-Z]+$/i)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'Only small letters allowed in parameter keys',
                })
              }
            } else {
              if (!key.match(/^[a-z0-9]+$/i)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'Only small letters and number allowed in non parameter keys',
                })
              }
            }
          })
          .transform((key) => {
            if (key.startsWith(':')) {
              return `{{ ${key.replace(':', '')} }}`
            } else {
              return key
            }
          })
      )
      .transform((_path) => _path.join('/'))
      .parse(rawPath)

  constructor(rawPath: string[]) {
    this.#rawPath = rawPath
    this.#path = this.#parse(this.#rawPath)
  }

  get = <PARAM>(data?: object, schema?: z.ZodType<PARAM>): string => {
    if (schema && data) {
      const parsedParams = schema.parse(data)

      return interpolate(this.#path, parsedParams)
    }

    return this.#path
  }

  add = (rawPath: string[]) => {
    return new Path([...this.#rawPath, ...rawPath])
  }
}
