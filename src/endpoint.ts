import { z, ZodOptional } from 'zod'
import { Path } from './helpers/path.js'
import { Method } from './types/index.js'

export interface Endpoint {
  method: Method
  path: Path
  param?: z.ZodTypeAny
  body?: z.ZodTypeAny
  query?: z.ZodTypeAny
  input?: z.ZodTypeAny
  output: ZodOptional<z.ZodTypeAny>
}
