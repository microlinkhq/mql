<h1 align="center">
  <img src="https://microlink.io/banner_mql.png" alt="microlink logo">
</h1>

Microlink Query Language (MQL) is the way to interact with the [Microlink API](https://docs.microlink.io/api).

## Install

```bash
npm install @microlink/mql
```

## Getting Started

The purpose of the library is to provide a good developer experience while you interact with [Microlink API](https://docs.microlink.io/api).

You can do exactly the same thing than performing a cURL or any other HTTP client.

```js
const mql = require('@microlink/mql')

;(async () => {
  const { status, body, response } = await mql('https://kikobeats.com')
  console.log(status)
  // => success
})()
```

Additionally, you pass the same [API Parameters](https://docs.microlink.io/api/#api-parameters/url).

```js
const mql = require('@microlink/mql')

;(async () => {
  const { status, body, response } = await mql('https://kikobeats.com', {
    screenshot: true,
    waitFor: 3000
  })

  console.log(`My screenshot at ${body.screenshot.url}`)
})()
```

## Cache Support

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

## Error Handling

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

## API

### mql(url, [opts])

#### url

*Required*<br>
Type: `string`

The target URL for extracting structure data.

#### options

Type: `object`<br>

You can pass any [API Parameters](https://docs.microlink.io/api/#introduction) from [Microlink API](https://docs.microlink.io/api/#introduction) as option, including [specific parameters](https://docs.microlink.io/api/#api-parameters/screenshot/specific-parameters) or [device emulation](https://docs.microlink.io/api/#api-parameters/screenshot/device-emulation).

Additionally, you can setup

##### apiKey

Type: `string`<br>
Default: `undefined`

The API Key used for authenticating your requests as `x-api-key` header.

When the `apiKey` is provided, the `pro.microlink.io` endpoint will used.

Read more about [authentication on docs](https://docs.microlink.io/api/#api-basics/authentication).

##### cache

Type: `string`<br>
Default: `undefined`

##### retry

Type: `number`<br>
Default: `3`

See [got#retry](https://www.npmjs.com/package/got#retry).

##### timeout

Type: `number`<br>
Default: `25000`

See [got#timeout](https://www.npmjs.com/package/got#timeout).

## License

**mql** © [microlink.io](https://microlink.io), released under the [MIT](https://github.com/microlinkhq/mql/blob/master/LICENSE.md) License.<br>
Authored and maintained by microlink.io with help from [contributors](https://github.com/microlinkhq/mql/contributors).

> [microlink.io](https://microlink.io) · GitHub [microlink.io](https://github.com/microlinkhq) · Twitter [@microlinkhq](https://twitter.com/microlinkhq)
