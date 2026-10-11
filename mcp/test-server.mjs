import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const client = new Client({ name: 'usagescale-test', version: '1.0.0' });
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [fileURLToPath(new URL('./server.js', import.meta.url))],
});
const value = result => JSON.parse(result.content[0].text);
try {
  await client.connect(transport);
  assert.equal((await client.listTools()).tools.length, 4);
  const inputs = [[false], [true, false], [true, true, true], [true, true, false, true], [true, true, false, false, true], [true, true, false, false, false]];
  for (const [id, answers] of inputs.entries()) {
    const result = value(await client.callTool({ name: 'classify', arguments: { answers } }));
    assert.equal(result.level, id);
    if (id === 3) assert.match(result.caveat, /human review/);
  }
  for (const answers of [[], [true, true], ['false'], [true, 'no'], [1]]) {
    assert.equal((await client.callTool({ name: 'classify', arguments: { answers } })).isError, true);
  }
  assert.equal(value(await client.callTool({ name: 'get_level', arguments: { id: 5 } })).id, 5);
  for (const id of ['3', 6, 1.5]) assert.equal((await client.callTool({ name: 'get_level', arguments: { id } })).isError, true);
  const resources = await client.listResources();
  assert.equal(resources.resources[0].uri, 'usagescale://levels.json');
  const resource = await client.readResource({ uri: 'usagescale://levels.json' });
  assert.equal(JSON.parse(resource.contents[0].text).levels.length, 6);
  console.log('MCP protocol: initialization, four tools, six results, invalid inputs and local resource passed.');
} finally {
  await client.close();
}
