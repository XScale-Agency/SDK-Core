## XScale Agency SDK Core

This library empowers you to build robust and efficient REST API clients with ease.

**Key Features:**

- **ZOD Integration:** Ensures data integrity with robust input and output validation using ZOD.
- **Seamless URL Parameters:** Effortlessly manage URL parameters within your API requests.
- **Organized Endpoints:** Maintain clear separation and structure by creating dedicated files for each endpoint.

## Usage

### Endpoints

```ts
import { Method, Path, InferEndpoint, Client, z } from '@xscale/sdk-core'

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

export type FeatBlogListT = InferEndpoint<typeof ProductListEP>
```

Create a separate file for each endpoint to enhance readability and maintainability. The structure of an endpoint file is not provided here (refer to the `example` folder for details).

### Client

```ts
import { Client } from '@xscale/sdk-core'
import { ClientConfig } from '@xscale/sdk-core'
import { ProductListEP } from './endpoints/products/list.js'

const baseConfig: ClientConfig = {
  base: new URL('https://dummyjson.com'),
  beforeParse: (data) => ({ data }),
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
    },
  }
}
```

The `RestClient` class offers the `api` property that grants access to all available endpoints. Instructions on how to use the `RestClient` class can be found in the `example` folder.

## Building URLs

The `Path` class assists in constructing URLs for your endpoints. It facilitates:

- **Building Paths:** Create paths segment by segment (e.g., `new Path(['products', 'add'])`).
- **Including URL Parameters:** Define URL parameters using placeholders (e.g., `new Path(['products', ':productId'])`). Refer to the `example/endpoints/products/show.ts` file for an illustration on creating parameters objects within endpoints.

## Response Structure

The SDK Core expects a specific response structure from your API:

```typescript
type Response = {
  data: object
  errors: {
    field?: string
    message: string
  }[]
}
```

However, if your API response deviates from this format, you can leverage the `beforeParse` function to transform the data before parsing. Explore the `example` folder for a practical example of using this library.

## Sending Multipart/Form-Data Requests

The XScale Agency SDK Core empowers you to handle form data uploads within your API requests.

Here's how to send `multipart/form-data` requests:

1. **Configure Endpoint:** Set the `form` property to `true` in your `Endpoint` object. This signals that the request includes form data.

2. **Include File in Request Body:** Pass the file object you intend to upload within the body of your request.

**For detailed code examples and usage scenarios, please refer to the `example` folder within the repository.**
