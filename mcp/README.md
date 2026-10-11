# Local AI Usage Scale MCP server

A stdio server for the vocabulary and classification procedure. Install dependencies once; it makes no runtime network requests.

The package `usagescale-mcp` was **not published in the public npm registry** when checked on 10 October 2026. Use the repository source:

```sh
git clone https://github.com/karauda/ai-usage-scale.git
cd ai-usage-scale/mcp
npm ci
node server.js
```

In an MCP client:

```json
{
  "mcpServers": {
    "usagescale": {
      "command": "node",
      "args": ["/absolute/path/to/ai-usage-scale/mcp/server.js"]
    }
  }
}
```

| Tool | Purpose |
|---|---|
| `classify` | Walk the five questions with boolean answers; partial or invalid answers return an error. |
| `get_level` | Retrieve a complete definition for integer 0–5. |
| `list_levels` | List IDs, names and one-line descriptions. |
| `get_spec` | Retrieve the full vocabulary. |

The resource `usagescale://levels.json` exposes the same vocabulary.

A Level 3 suggestion includes a caveat: its definition requires meaningful human review, while the current tree path does not check that condition. A number describes a process, not quality or verified truth.

The server reads `../spec/levels.json` from a repository checkout. A distributable package uses a bundled copy.

```sh
npm test
npm run test:server
npm run sync
npm pack --dry-run
```

Package preparation includes `classify.js`; omitting it would prevent startup outside the repository. No publication is performed by these commands.

Code is MIT. Vocabulary data is CC0. Declaration metadata does not grant training permission.
