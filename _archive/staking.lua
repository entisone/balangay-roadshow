local bint = require('.bint')(256)

Stakers = Stakers or {}

local utils = {
  add = function(a, b)
    return tostring(bint(a) + bint(b))
  end,
  subtract = function(a, b)
    return tostring(bint(a) - bint(b))
  end,
  toBalanceValue = function(a)
    return tostring(bint(a))
  end,
  toNumber = function(a)
    return bint.tonumber(a)
  end
}

-- Stake Action Handler
Handlers.add("Stake", "Stake", function(msg)
  assert(type(msg.Quantity) == 'string', 'Quantity is required!')
  assert(bint.__lt(100, bint(msg.Quantity)), 'Quantity must be greater than 100')

  Balances[msg.From] = utils.subtract(Balances[msg.From], msg.Quantity)
  Stakers[msg.From] = utils.add(Stakers[msg.From], msg.Quantity)
  msg.reply({ Data = "Staked " .. tostring(msg.Quantity) .. " tokens from " .. msg.From })
end)

-- -- Unstake Action Handler
Handlers.add("Unstake", "Unstake", function(msg)
  assert(Stakers[msg.From] and bint(Stakers[msg.From]) >= bint(msg.Quantity), "Insufficient staked amount")
  Stakers[msg.From] = utils.subtract(Stakers[msg.From], msg.Quantity)
  Balances[msg.From] = utils.add(Balances[msg.From], msg.Quantity)

  msg.reply({ Data = "Unstaked " .. tostring(msg.Quantity) .. " tokens to " .. msg.From })
end)

-- Check if sender is registered
Handlers.add(
  "Check-Staked",
  "Check-Staked",
  function (msg)
    local address = msg.Data
    if bint(Stakers[address]) > 0 then
      msg.reply({ Status = "200", Data = "1" })
    else  
      msg.reply({ Status = "200", Data = "0" })
    end
  end
)