<h1 align="center">
  <img src="https://microlink.io/banner_mql.png" alt="microlink logo">
</h1>

## Featues

### Cache Support

You can enable cache for saving API calls if they have been previously done


```js
const mql = requir('@microlink/mql')
const cache = new Map();

(async () => {
  let status, data, response

  { status, data, response } = await mql('https://kikobeats.com', { cache })
  console.log(response.fromCache);
  //=> false

  { status, data, response } = await mql('https://kikobeats.com', { cache })
  console.log(response.fromCache);
  //=> true
})();
```

## License

**mql** © [microlink.io](https://microlink.io), released under the [MIT](https://github.com/microlinkhq/mql/blob/master/LICENSE.md) License.<br>
Authored and maintained by microlink.io with help from [contributors](https://github.com/microlinkhq/mql/contributors).

> [microlink.io](https://microlink.io) · GitHub [microlink.io](https://github.com/microlinkhq) · Twitter [@microlinkhq](https://twitter.com/microlinkhq)
