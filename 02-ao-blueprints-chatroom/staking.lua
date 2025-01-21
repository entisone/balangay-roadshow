local bint = require('.bint')(256)

Stakers = Stakers or {}

-- Stake Action Handler
Handlers.add("stake", "Stake", function(msg)
  assert(type(msg.Quantity) == 'string', 'Quantity is required!')
  local quantity = bint(msg.Quantity)
  assert(quantity > bint(0), 'Quantity must be greater than 0')

  Balances[msg.From] = bint(Balances[msg.From]) - quantity
  Stakers[msg.From] = Stakers[msg.From] or {}
  Stakers[msg.From].amount = bint(Stakers[msg.From].amount or 0) + quantity
  msg.reply({ Data = "Staked " .. tostring(quantity) .. " tokens from " .. msg.From })
end)

-- -- Unstake Action Handler
Handlers.add("unstake", "Unstake", function(msg)
  local quantity = bint(msg.Quantity)
  local stakerInfo = Stakers[msg.From]
  assert(stakerInfo and bint(stakerInfo.amount) >= quantity, "Insufficient staked amount")
  stakerInfo.amount = bint(stakerInfo.amount) - quantity
  Balances[msg.From] = bint(Balances[msg.From]) + quantity
  Stakers[msg.From] = Stakers[msg.From] or {}

  msg.reply({ Data = "Unstaked " .. quantity .. " tokens to " .. msg.From })
end)