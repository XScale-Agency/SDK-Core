import { test } from '@japa/runner'
import { Client } from '../src/client.js'
import { Method } from '../src/types/index.js'
import { Path } from '../src/helpers/path.js'
import { z } from 'zod'

test.group('File Upload', (group) => {
  let client: Client

  group.setup(async () => {
    client = new Client({
      base: new URL('https://eoyg5h4uppzm9s3.m.pipedream.net'),
      beforeParse: (data) => ({ data }),
    })
  })

  test('File Upload', async ({ assert }) => {
    const res = await client.send(
      {
        method: Method.POST,
        form: true,
        path: new Path(['upload']),
        output: z
          .object({
            event_id: z.string(),
          })
          .optional(),

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

    assert.isObject(res)
    assert.exists(res?.event_id)
  })
})
