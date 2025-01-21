Members = Members or {}

MessageHistory = MessageHistory or {}
MAX_HISTORY = 50  -- Keep last 50 messages

-- Modify `chatroom.lua` to include a handler for `Members`
-- to register to the chatroom with the following code:

Handlers.add(
    "Register",
    "Register",
    function (msg)
        -- TODO: Add a check to see if the user is already registered
        -- TODO: Only staked users can register

      table.insert(Members, msg.From)
      print(msg.From .. " Registered")
      msg.reply({ Data = "Registered." })
    end
  )

    --   broadcast messages to all members of the chatroom
    Handlers.add(
      "Broadcast",
      "Broadcast",
      function (msg)
          -- TODO: Add a check to see if the user is registered
          -- TODO: Only registered users can broadcast

          -- Add message to history
          table.insert(MessageHistory, msg.From .. ": " .. msg.Data)
          -- Trim history if too long
          if #MessageHistory > MAX_HISTORY then
              table.remove(MessageHistory, 1)
          end

          
          for _, recipient in ipairs(Members) do
              ao.send({Target = recipient, Data = msg.From .. ": " .. msg.Data})
          end

          -- TODO: Add points to the user who broadcasted
          -- TODO: Add a unique code checkers to reply (not broadcast) with the leaderboards of the points and the user's points (e.g. "/leaderboards", "/balance")

          msg.reply({Data = "Broadcasted." })
      end
  )

  Handlers.add(
    "ListMembers",
    "ListMembers",
    function (msg)
        local memberList = table.concat(Members, ", ")
        msg.reply({ Data = "Current members: " .. memberList })
    end
)

Handlers.add(
  "RemoveAllMembers",
  "RemoveAllMembers",
  function (msg)
    if msg.From ~= ao.id then
      msg.reply({ Data = "Unauthorized message." })
      return
    end
    
    Members = {}
    msg.reply({ Data = "All members removed." })
  end
)