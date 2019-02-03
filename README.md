<h1 align="center">
  <img src="https://microlink.io/banner_mql.png" alt="microlink logo">
</h1>

## Features

### Cache Support

You can enable cache for saving API calls if they have been previously done


```js
const mql = require('@microlink/mql')
const cache = new Map()

;(async () => {
  let data

  data = await mql('https://kikobeats.com', { cache })
  console.log(data.response.fromCache)
  // => false

  data = await mql('https://kikobeats.com', { cache })
  console.log(data.response.fromCache)
  // => true
})()
```

### Error Handling

If something does not go as expected, it returns a `MicrolinkError`

```js
const mql = require('@microlink/mql')

// The library exposes `MicrolinkError` constructor
const { MicrolinkError } = mql

;(async () => {
  try {
    mql('https://kikobeats.com', {
      screenshot: true,
      waitFor: 30000
    })
  } catch (err) {
    err instanceof MicrolinkError
    // => true
  }
})()
```

A `MicrolinkError` always have associated `status`, `message` and `code`.

Additionally, it can have the rest of the response information, such as `headers`, `statusCode` or `body`.

## License

**mql** © [microlink.io](https://microlink.io), released under the [MIT](https://github.com/microlinkhq/mql/blob/master/LICENSE.md) License.<br>
Authored and maintained by microlink.io with help from [contributors](https://github.com/microlinkhq/mql/contributors).

> [microlink.io](https://microlink.io) · GitHub [microlink.io](https://github.com/microlinkhq) · Twitter [@microlinkhq](https://twitter.com/microlinkhq)
