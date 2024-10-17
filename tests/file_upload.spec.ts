import { test } from '@japa/runner'
import { Client } from '../src/client.js'
import { Method } from '../src/types/index.js'
import { Path } from '../src/helpers/path.js'
import { z } from 'zod'

test.group('File Upload', (group) => {
  let client: Client

  group.setup(async () => {
    client = new Client({
      base: new URL('https://httpdump.app/'),
    })
  })

  test('File Upload', async ({ assert }) => {
    const res = await client.send(
      {
        method: Method.POST,
        form: true,
        path: new Path(['dumps', '5cd25953-2173-43cd-ad63-ee32a347f4c1']),
        output: z.string().optional(),

        input: z.object({
          body: z.object({
            file: z.instanceof(ArrayBuffer),
          }),
        }),
      },
      {
        body: {
          file: await new File(['hello'], 'hello.txt', {
            type: 'text/plain',
            lastModified: Date.now(),
          }).arrayBuffer(),
        },
      }
    )

    assert.isString(res)
  })
})
