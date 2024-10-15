import { RestClient } from './client.js'

const rest = new RestClient()

const list = await rest.api.product.list()

console.log(list)

const show = await rest.api.product.show({
  param: {
    productId: 1,
  },
})

console.log(show)
