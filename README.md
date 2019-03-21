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

You can do exactly the same thing than performing a `cURL` or any other HTTP client.

```js
const mql = require('@microlink/mql')

;(async () => {
  const { status, data, response } = await mql('https://kikobeats.com')
  console.log(status)
  // => success
})()
```

Additionally, you pass any [API Parameter](https://docs.microlink.io/api/#api-parameters/url) as second argument.

```js
const mql = require('@microlink/mql')

;(async () => {
  const { status, data, response } = await mql('https://kikobeats.com', {
    screenshot: true,
    waitFor: 3000
  })

  console.log(`My screenshot at ${data.screenshot.url}`)
})()
```

## Custom Rules

[Custom Rule](https://microlink.io/blog/custom-rules/) allows you setup your own rules for getting specific content.

```js
const { status, data } = await mql('https://kikobeats.com', {
  palette: true,
  rules: {
    avatar: {
      type: 'image',
      selectors: [
        {
          selector: '#avatar',
          attr: 'href'
        }
      ],
    }
  }
})
```

where a rule is defined by two things:

#### type

Type: `string`</br>
Default: `undefined`

It defined the [data shape](https://docs.microlink.io/api/#introduction) to use for the value extracted.

If you define a valid type, It will validate and alter the original value to strictly accomplish the shape.

For example, if you define a rule with `date` type, then, if the value extracted is a `number` and not possible to cast into `new Date()`, the value extracted will be `null`.

If you don't specify a `type`, then it returns the raw value extracted.

The `type` is also important if you are interested in combine the value extracted with the rest of [API Parameters](https://docs.microlink.io/api).

For example, if you enable [palette](https://docs.microlink.io/api/#api-parameters/palette), then all the fields in the payload with `image` type will have extra color information. 

####  **selectors**

*Required*<br>
Type: `array`

It defines the rules to be apply into the target url markup for extracting the value.

The position into the collection matters: The first rule that returns a truthy value after applying `type` will be used, not being applying the rest of the rules.

A selector rule should be defined as:

##### selector

*Required*<br>
Type: `string`

It defines the HTML element you want to get from the HTML of the targeted URL.

You can specify the selector using:

- An HTML tag, e.g. `img`.
- An CSS class or pseudo class, id or data-attribute, e.g. `.avatar`.
- A combination of both, e.g. `first:img`.

##### attr

Type: `string`<br>
default: `html`

It defines which property from the matched selector should be picked.

For example, if you want to extract an `img`, probably you are interested in `src` property, so you should specify it.

Not defining the `attr` means you are going to get the `html` of the matched selector.

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

Additionally, it can have the rest of the response information, such as `headers`, `statusCode` or `data`.

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
