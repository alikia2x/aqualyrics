# AquaLyrics

AquaLyrics is a versatile package designed to facilitate the serialization and deserialization between [AquaVox's](https://github.com/alikia2x/AquaVox) unified lyric format and multiple common lyric formats such as **LRC, TTML, SRT and so on**.

## Features

- **Serialization**: Convert AquaVox's unified lyric format into LRC, TTML, and SRT formats.
- **Deserialization**: Parse LRC, TTML, and SRT formats into AquaVox's unified lyric format.
- **Customizable**: Easily extend the package to support additional lyric formats as needed.
- **Type-safe**: Fully written in TypeScript with strong typing to ensure robust and maintainable code.

## Installation

This package was published to [JSR](https://jsr.io/) only. 
You can install it through these commands with your favorite package manager:

```bash
deno add jsr:@alikia/aqualyrics
```

```bash
npx jsr add @alikia/aqualyrics
```

```bash
yarn dlx jsr add @alikia/aqualyrics
```

```bash
pnpm dlx jsr add @alikia/aqualyrics
```

```bash
bunx jsr add @alikia/aqualyrics
```

## Usage

### Parsing LRC

```typescript
import { parseLRC } from '@alikia/aqualyrics';

const lrcText = `
[ti:Song Title]
[00:00.00]Lyric line 1
[00:02.00]
[00:03.00]Lyric line 2
`;

const lyricData = parseLRC(lrcText, 4);
console.log(lyricData);
/* Outputs:
{
    ti: "Song Title",
    scripts: [
        {
            start: 0,
            end: 2,
            text: "Lyric line 1",
        },
        {
            start: 3,
            end: 4,
            text: "Lyric line 2",
        },
    ],
}
*/
```

## Contributing

We welcome contributions to AquaLyrics! If you have any ideas, bug reports, or feature requests, please open an issue or submit a pull request.

## License

AquaLyrics is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
