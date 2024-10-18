import { AxiosError } from 'axios'
import { ZodError } from 'zod'

type SDKCoreErrorType = 'zod' | 'axios' | 'error' | 'unknown'

export class SDKCoreError extends Error {
  type: SDKCoreErrorType

  axios?: AxiosError<any, any>
  zod?: ZodError

  constructor(params: {
    message: string
    type: SDKCoreErrorType
    error: Error
    cause?: object

    // AXIOS SPECIFIC
    axios?: AxiosError<any, any>

    // ZOD SPECIFIC
    zod?: ZodError
  }) {
    super(params.message, { cause: { ...params.cause, error: params.error } })

    this.type = params.type
    this.axios = params.axios
  }

  toJSON() {
    return {
      message: this.message,
      type: this.type,
      stack: this.stack,
      cause: this.cause,

      // AXIOS SPECIFIC
      axios: this.axios,

      // ZOD SPECIFIC
      zod: this.zod,
    }
  }
}

export const ClientErrorHandler = (error: unknown) => {
  if (error instanceof SDKCoreError) {
    throw error
  } else if (error instanceof AxiosError) {
    if (error.response) {
      throw new SDKCoreError({
        message: 'Axios Response Error',
        type: 'axios',
        error: error,
        axios: error,
      })
    } else if (error.request) {
      throw new SDKCoreError({
        message: 'Axios Request Error',
        type: 'axios',
        error: error,
        axios: error,
      })
    } else {
      throw new SDKCoreError({
        message: 'Axios Error',
        type: 'axios',
        error: error,
        axios: error,
      })
    }
  } else if (error instanceof ZodError) {
    throw new SDKCoreError({
      message: 'Zod error in client error handler',
      type: 'zod',
      error: error,
      zod: error,
    })
  } else if (error instanceof Error) {
    throw new SDKCoreError({
      message: `Unknown error in client error handler: ${error.message}`,
      type: 'error',
      error,
    })
  } else {
    throw new SDKCoreError({
      message: 'Unknown error in client error handler',
      type: 'unknown',
      error: new Error('Unknown error in client error handler'),
      cause: {
        originalError: error,
      },
    })
  }
}
