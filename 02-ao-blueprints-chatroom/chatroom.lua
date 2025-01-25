local json = require('json')

Members = Members or {}
MessageHistory = MessageHistory or {}
MAX_HISTORY = 50  -- Keep last 50 messages

Handlers.add(
  "Register",
  "Register",
  function (msg)
      -- Check if the user is already registered using ao.id
      for _, member in ipairs(Members) do
          if member.ao.id == msg.From.ao.id then
              msg.reply({ Data = "You are already registered." })
              return
          end
      end

      -- Add the user to the Members list
      table.insert(Members, msg.From)
      print(msg.From.ao.id .. " Registered")
      msg.reply({ Data = "Registered." })
  end
)

-- Check if sender is registered
Handlers.add(
  "CheckRegistration",
  "CheckRegistration",
  function (msg)
    print("Checking registration for " .. json.encode(msg.From))

    local found = false
    for _, member in ipairs(Members) do
      if member == msg.From then
        found = true
        break
      end
    end
    if found then
      msg.reply({ Data = "1"})
    else
      msg.reply({ Data = "0" })
    end
  end
)

-- broadcast messages to all members of the chatroom
Handlers.add(
  "Broadcast",
  "Broadcast",
  function (msg)
    -- TODO: Add a check to see if the user is registered

    local saveMessage = {}
    saveMessage.sender = msg.From
    saveMessage.message = msg.Data

    -- Add message to history
    table.insert(MessageHistory, saveMessage)
    -- Trim history if too long
    if #MessageHistory > MAX_HISTORY then
        table.remove(MessageHistory, 1)
    end
    
    for _, recipient in ipairs(Members) do
        ao.send({Target = recipient, Data = msg.From .. ": " .. msg.Data})
    end

    -- TODO: Add points to the user who broadcasted
    -- TODO: Add a unique code checkers to reply (not broadcast) with the leaderboards of the points and the user's points (e.g. "/leaderboards", "/balance")

    msg.reply({ Data = "Broadcasted." })
  end
)

Handlers.add(
  "List-Members",
  "List-Members",
  function (msg)
      local memberList = table.concat(Members, ", ")
      msg.reply({ Data = "Current members: " .. memberList })
  end
)

Handlers.add(
  "Remove-All-Members",
  "Remove-All-Members",
  function (msg)
    if msg.From ~= ao.id then
      msg.reply({ Data = "Unauthorized message." })
      return
    end
    
    Members = {}
    msg.reply({ Data = "All members removed." })
  end
)

Handlers.add(
  "Read-Messages",
  "Read-Messages",
  function (msg)
    
    -- TODO: Add a validation that only people registered and staked can fetch messages
    msg.reply({ Data = json.encode(MessageHistory) })
  end
)

-- Clear all messages
Handlers.add("Clear-Messages", "Clear-Messages", function(msg)
  -- TODO: Add a check to see if the sender is the owner of the chatroom
  MessageHistory = {}
  msg.reply({ Data = "All messages cleared." })
end)