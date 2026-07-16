# usagescale-mcp

The [AI Usage Scale](https://usagescale.org) as an [MCP](https://modelcontextprotocol.io) server. It lets an AI agent query the standard directly — walk the five questions to a level, look one up, or read the spec — instead of scraping the site. Runs locally over stdio; the whole standard travels inside the package, so it needs no network.

## Use

Add it to any MCP client (an agent's `mcp.json`, a desktop MCP client, etc.):

```json
{
  "mcpServers": {
    "usagescale": {
      "command": "npx",
      "args": ["-y", "usagescale-mcp"]
    }
  }
}
```

Or run it directly: `npx -y usagescale-mcp`.

## Tools

| Tool | Does |
|------|------|
| `classify` | Walk the five yes/no questions to a level 0–5. |
| `get_level` | Full definition of one level — name, definition, examples, sentences, mappings. |
| `list_levels` | All six levels: id, name, one-liner. |
| `get_spec` | The whole machine-readable spec (equivalent to `/levels.json`). |

## Resources

- `usagescale://levels.json` — the complete standard, CC0.

## Notes

- The scale is CC0; the marks and `levels.json` are free to fork and mirror.
- No level ranks above another. `classify` returns a position, never a score.
- A declaration describes how a work was made. It does not grant or deny any training right.

The standard's canonical source is `spec/levels.json`; this package bundles a copy at publish time (`npm run sync`) and, when run from the repository, reads the canonical file directly.

MIT.
