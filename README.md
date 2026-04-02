# @pipeworx/mcp-colorapi

MCP server for [The Color API](https://www.thecolorapi.com) — identify colors by hex, generate color schemes, and convert between RGB/HSL/HSV/CMYK formats. Free, no auth required.

## Tools

| Tool | Description |
|------|-------------|
| `identify_color` | Get color name, all formats, and contrast info for a hex value |
| `generate_scheme` | Generate a harmonious color scheme (monochrome, analogic, complement, triad, quad) |
| `convert_color` | Convert an RGB color to all other formats |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "colorapi": {
      "type": "url",
      "url": "https://gateway.pipeworx.io/colorapi"
    }
  }
}
```

## CLI Usage

```bash
npx @anthropic-ai/mcp-client https://gateway.pipeworx.io/colorapi
```

## License

MIT
