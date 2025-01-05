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
  const contractPath = path.join(__dirname, "..", "main.lua")
  const contract = fs.readFileSync(contractPath, "utf8")
  return contract
}

describe("CRUD test", async function () {
  const srcData = getContractSrcData()
  // Spawn
  const pid = await ao.spawn({
    signer,
    scheduler,
    module: mem.modules.aos2_0_1,
  })

  // Eval
  await ao.message({
    process: pid,
    tags: [{ name: "Action", value: "Eval" }],
    data: srcData,
    signer,
  })

  it("should return blank topic", async () => {
    const res = await ao.dryrun({
      process: pid,
      tags: [{ name: "Action", value: "GetUserTopic" }],
      signer,
    })
    assert.equal(res.Messages[0].Data, "[]")
  })

  it("should create new topic", async () => {
    // Create
    await ao.message({
      process: pid,
      tags: [
        { name: "Action", value: "Upsert" },
        { name: "Topic", value: "Rico Blanco" },
      ],
      signer,
    })

    const res = await ao.dryrun({
      process: pid,
      tags: [{ name: "Action", value: "GetUserTopic" }],
      signer,
    })
    assert.equal(res.Messages[0].Data, '["Rico Blanco"]')
  })

  it("should update topic", async () => {
    // Update
    await ao.message({
      process: pid,
      tags: [
        { name: "Action", value: "Upsert" },
        { name: "Topic", value: "Maris Racal" },
      ],
      signer,
    })

    const res = await ao.dryrun({
      process: pid,
      tags: [{ name: "Action", value: "GetUserTopic" }],
      signer,
    })
    assert.equal(res.Messages[0].Data, '["Maris Racal"]')
  })

  it("should delete topic", async () => {
    // Delete
    await ao.message({
      process: pid,
      tags: [{ name: "Action", value: "Delete" }],
      signer,
    })

    const res = await ao.dryrun({
      process: pid,
      tags: [{ name: "Action", value: "GetUserTopic" }],
      signer,
    })
    assert.equal(res.Messages[0].Data, "[]")
  })
})
