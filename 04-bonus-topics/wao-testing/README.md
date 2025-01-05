# WAO Testing

Visit [WAO](https://github.com/weavedb/wao) for full documentation.

### Setting up a Project

```bash
mkdir wao-test && cd wao-test
yarn init && yarn add wao
```

Add `test` and `test-only` commands to your `package.json`.

You might also need to add `"type": "module"` to your `package.json` if you are using ES modules.

```json
{
  "type": "module",
  "scripts": {
    "test": "node --experimental-wasm-memory64",
    "test-only": "node --experimental-wasm-memory64 --test-only"
  }
}
```

Create `test` directory with `hello.js` file and `hello.lua` file in the root of your project.

```bash
mkdir test && touch test/hello.js && touch hello.lua
```

### Writing Tests

Write a simple Lua script in `hello.lua`

```lua
Handlers.add("Hello", "Hello", function(msg)
    msg.reply({ Data = "Hello, World!" })
end)
```

Write a simple test in `hello.js`

```js
import assert from "assert"
import { describe, it } from "node:test"
import { acc, ArMem, connect, scheduler } from "wao/test"

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const mem = new ArMem()
const ao = connect(mem)

const signer = acc[0].signer

const getContractSrcData = () => {
  const contractPath = path.join(__dirname, "main.lua")
  const contract = fs.readFileSync(contractPath, "utf8")
  return contract
}

describe("Hello World", function () {
  it("should spawn a process and send messages", async () => {
    const srcData = getContractSrcData()
    const pid = await ao.spawn({
      signer,
      scheduler,
      module: mem.modules.aos2_0_1,
    })

    await ao.message({
      process: pid,
      tags: [{ name: "Action", value: "Eval" }],
      data: srcData,
      signer,
    })
    const res = await ao.dryrun({
      process: pid,
      tags: [{ name: "Action", value: "Hello" }],
      signer,
    })
    assert.equal(res.Messages[0].Data, "Hello, World!")
  })
})

```

Note that generating random Arweave wallets for every test takes time and slows down your test executions, so Wao connect provides pre-generated accounts for your tests, which saves hours if you are to run your tests thousands of times.

- `acc[0] = { jwk, addr, signer }`

### Run the test

```js
yarn test test/hello.js
```

