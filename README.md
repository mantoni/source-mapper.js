# Source Mapper

Replace URLs in stack traces with original sources based on [source-map][]. For
node and the browser.

## Install

```
npm install source-mapper
```

## Usage

```js
var sourceMapper = require('source-mapper');

var extracted = sourceMapper.extract(js);
var throughStream = sourceMapper.stream(extracted.map);
```

## API

- `extract(string)` extracts an inline source map from the given string. The
  returned object has the `js` without source maps and a `map` with source
  maps.
- `stream(map)` returns a [through][] stream that replaces URLs in stack traces
  with the original source location.

## Development

Clone the repository and then run:

```
npm install
npm test
```

## License

MIT

[source-map]: https://github.com/mozilla/source-map
[through]: https://github.com/dominictarr/through
