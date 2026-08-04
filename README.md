# mcp-colorapi

Color API MCP — wraps thecolorapi.com (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `identify_color` | Identify a color by hex code (e.g., "#FF5733"). Returns color name, RGB/HSL/HSV/CMYK values, and WCAG contrast ratios for accessibility. |
| `generate_scheme` | Generate harmonious color palettes from a seed hex color (e.g., "#3498DB"). Returns complementary, analogous, triadic, or monochromatic schemes with hex codes. |
| `convert_color` | Convert between color formats: RGB to hex, HSL, HSV, CMYK. Returns the closest named color for the input values. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "colorapi": {
      "url": "https://gateway.pipeworx.io/colorapi/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Colorapi data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
