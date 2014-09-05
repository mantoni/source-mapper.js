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
- `consumer(map)` returns a source map consumer for the given `map`.
- `line(consumer, line[, offset])` maps the given line to the original source
  using a consumer. If `offset` is given, it is substracted from the line
  number.
- `stream(consumer[, offset])` returns a [through][] stream that replaces URLs
  in stack traces with the original source location using a consumer. If
  `offset` is given, it is substracted from the line number.
- `stream(map[, offset])` returns a [through][] stream that replaces URLs in
  stack traces with the original source location using a source map. If
  `offset` is given, it is substracted from the line number.

## Development

Clone the repository and then run:

```
npm install
npm test
```

## Compatibility

- Node 0.10 or later
- Browserify 5.9 or later

## License

MIT

[source-map]: https://github.com/mozilla/source-map
[through]: https://github.com/dominictarr/through
