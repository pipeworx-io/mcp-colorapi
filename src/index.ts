/**
 * Color API MCP — wraps thecolorapi.com (free, no auth)
 *
 * Tools:
 * - identify_color: Get color name, formats, and contrast info for a hex value
 * - generate_scheme: Generate a color scheme from a hex value and mode
 * - convert_color: Convert an RGB color to all other formats
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://www.thecolorapi.com';

type RawColor = {
  hex: { value: string; clean: string };
  rgb: { r: number; g: number; b: number; value: string };
  hsl: { h: number; s: number; l: number; value: string };
  hsv: { h: number; s: number; v: number; value: string };
  cmyk: { c: number; m: number; y: number; k: number; value: string };
  name: { value: string; closest_named_hex: string; exact_match_name: boolean };
  contrast: { value: string };
};

type RawSchemeResponse = {
  mode: string;
  count: number;
  colors: RawColor[];
};

function formatColor(c: RawColor) {
  return {
    name: c.name.value,
    exact_name_match: c.name.exact_match_name,
    closest_named_hex: c.name.closest_named_hex,
    hex: c.hex.value,
    rgb: c.rgb.value,
    hsl: c.hsl.value,
    hsv: c.hsv.value,
    cmyk: c.cmyk.value,
    contrast: c.contrast.value,
  };
}

const tools: McpToolExport['tools'] = [
  {
    name: 'identify_color',
    description:
      'Identify a color by its hex value. Returns the color name, all format representations (RGB, HSL, HSV, CMYK), and contrast info.',
    inputSchema: {
      type: 'object',
      properties: {
        hex: {
          type: 'string',
          description: 'Hex color value without the # prefix (e.g. "FF5733").',
        },
      },
      required: ['hex'],
    },
  },
  {
    name: 'generate_scheme',
    description:
      'Generate a color scheme from a seed hex color. Returns a set of harmonious colors based on the chosen mode.',
    inputSchema: {
      type: 'object',
      properties: {
        hex: {
          type: 'string',
          description: 'Seed hex color value without the # prefix (e.g. "FF5733").',
        },
        mode: {
          type: 'string',
          description:
            'Color scheme mode. One of: monochrome, analogic, complement, triad, quad. Defaults to "monochrome".',
        },
        count: {
          type: 'number',
          description: 'Number of colors to return (1-10, default 5).',
        },
      },
      required: ['hex'],
    },
  },
  {
    name: 'convert_color',
    description:
      'Convert an RGB color to all other color formats (hex, HSL, HSV, CMYK) and get its closest color name.',
    inputSchema: {
      type: 'object',
      properties: {
        r: { type: 'number', description: 'Red channel (0-255).' },
        g: { type: 'number', description: 'Green channel (0-255).' },
        b: { type: 'number', description: 'Blue channel (0-255).' },
      },
      required: ['r', 'g', 'b'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'identify_color':
      return identifyColor(args.hex as string);
    case 'generate_scheme':
      return generateScheme(
        args.hex as string,
        (args.mode as string | undefined) ?? 'monochrome',
        (args.count as number | undefined) ?? 5,
      );
    case 'convert_color':
      return convertColor(args.r as number, args.g as number, args.b as number);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function identifyColor(hex: string) {
  const clean = hex.replace(/^#/, '');
  const res = await fetch(`${BASE_URL}/id?hex=${encodeURIComponent(clean)}`);
  if (!res.ok) throw new Error(`Color API error: ${res.status}`);
  const data = (await res.json()) as RawColor;
  return formatColor(data);
}

async function generateScheme(hex: string, mode: string, count: number) {
  const clean = hex.replace(/^#/, '');
  const safeCount = Math.min(10, Math.max(1, count));
  const params = new URLSearchParams({
    hex: clean,
    mode,
    count: String(safeCount),
  });
  const res = await fetch(`${BASE_URL}/scheme?${params}`);
  if (!res.ok) throw new Error(`Color API error: ${res.status}`);
  const data = (await res.json()) as RawSchemeResponse;
  return {
    seed_hex: `#${clean}`,
    mode: data.mode,
    count: data.count,
    colors: data.colors.map(formatColor),
  };
}

async function convertColor(r: number, g: number, b: number) {
  const params = new URLSearchParams({ rgb: `rgb(${r},${g},${b})` });
  const res = await fetch(`${BASE_URL}/id?${params}`);
  if (!res.ok) throw new Error(`Color API error: ${res.status}`);
  const data = (await res.json()) as RawColor;
  return formatColor(data);
}

export default { tools, callTool } satisfies McpToolExport;
