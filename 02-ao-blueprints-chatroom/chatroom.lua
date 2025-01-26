local json = require('json')

Members = Members or {}
MessageHistory = MessageHistory or {}
Points = Points or {}
MAX_HISTORY = 50  -- Keep last 50 messages


-- Send({ Target = CR, Action = "Register" }).receive().Data
-- Utility functions
local function isUserRegistered(user)
    for _, member in ipairs(Members) do
        if member == user then
            return true
        end
    end
    return false
end

local function saveMessage(sender, message)
    if #MessageHistory >= MAX_HISTORY then
        table.remove(MessageHistory, 1)
    end
    table.insert(MessageHistory, { sender = sender, message = message })
end

Handlers.add(
  "Register",
  "Register",
  function (msg)
      if isUserRegistered(msg.From) then
          msg.reply({ Data = "You are already registered." })
          return
      end
      table.insert(Members, msg.From)
      print(msg.From .. " Registered")
      msg.reply({ Data = "Registered." })
  end
)

Handlers.add(
  "CheckRegistration",
  "CheckRegistration",
  function (msg)
    print("Checking registration for " .. json.encode(msg.From))
    if isUserRegistered(msg.From) then
      msg.reply({ Data = "1"})
    else
      msg.reply({ Data = "0" })
    end
  end
)

Handlers.add(
  "Broadcast",
  "Broadcast",
  function (msg)
    if not isUserRegistered(msg.From) then
        msg.reply({ Data = "You are not registered." })
        return
    end
    saveMessage(msg.From, msg.Data)
    Points[msg.From] = (Points[msg.From] or 0) + 1
    
    if msg.Data == "/leaderboards" then
        local leaderboard = {}
        for user, points in pairs(Points) do
            table.insert(leaderboard, user .. ": " .. points)
        end
        msg.reply({ Data = table.concat(leaderboard, ", ") })
        return
    elseif msg.Data == "/balance" then
        msg.reply({ Data = "Your balance: " .. (Points[msg.From] or 0) })
        return
    end
    msg.reply({ Data = "Broadcasted." })
  end
)

Handlers.add(
  "List-Members",
  "List-Members",
  function (msg)
      local memberList = table.concat(Members, ", ")
      msg.reply({ Data = "Current members: " .. memberList })
      return
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
    if not isUserRegistered(msg.From) then
        msg.reply({ Data = "You are not registered." })
        return
    end
    msg.reply({ Data = json.encode(MessageHistory) })
  end
)

Handlers.add("Clear-Messages", "Clear-Messages", function(msg)
  if msg.From ~= ao.id then
      msg.reply({ Data = "Unauthorized message." })
      return
  end
  MessageHistory = {}
  msg.reply({ Data = "All messages cleared." })
end)
