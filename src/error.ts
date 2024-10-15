import { AxiosError } from 'axios'
import { ZodError } from 'zod'
import { errorParser } from './helpers/parsers.js'

export class ClientError extends Error {
  type: string

  status?: number
  headers?: object

  constructor(params: {
    message: string
    type: string
    status?: number
    headers?: object
    cause?: object
    stack?: string
  }) {
    super(params.message, { cause: params.cause })

    this.type = params.type

    this.status = params.status
    this.headers = params.headers
    this.stack = params.stack
  }

  toJSON() {
    return {
      message: this.message,
      type: this.type,
      status: this.status,
      headers: this.headers,
      stack: this.stack,
      cause: this.cause,
    }
  }
}

export class ClientResponseError extends ClientError {
  constructor(
    public fields: Record<string, string>,
    public messages: string[],
    error: object
  ) {
    super({
      message: 'Axios Response Error',
      type: 'axios',
      cause: {
        error,
      },
    })
  }
}

export const ClientErrorHandler = (error: unknown) => {
  if (error instanceof ClientError) {
    throw error
  } else if (error instanceof AxiosError) {
    if (error.response) {
      const { fields, messages } = errorParser(error.response.data.errors)

      throw new ClientResponseError(fields, messages, error.toJSON())
    } else if (error.request) {
      throw new ClientError({
        message: 'Axios Request Error',
        type: 'axios',
        cause: {
          error: error.toJSON(),
        },
      })
    } else {
      throw new ClientError({
        message: 'Axios Error',
        type: 'axios',
        cause: {
          error: error.toJSON(),
        },
      })
    }
  } else if (error instanceof ZodError) {
    throw new ClientError({
      message: 'Zod error in client error handler',
      type: 'zod',
      stack: error.stack,
      cause: {
        issues: error.issues,
      },
    })
  } else if (error instanceof Error) {
    throw new ClientError({
      message: error.message,
      type: 'error',
      stack: error.stack,
      cause: {
        error,
      },
    })
  } else {
    throw new ClientError({
      message: 'Unknown error in client error handler',
      type: 'unknown',
      cause: {
        error,
      },
    })
  }
}
