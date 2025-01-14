Members = Members or {}

TOKEN = ""

-- Modify `chatroom.lua` to include a handler for `Members`
-- to register to the chatroom with the following code:

Handlers.add(
    "Register",
    { Action = "Register"},
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
    { Action = "Broadcast" },
    function (msg)
      for _, recipient in ipairs(Members) do
        ao.send({Target = recipient, Data = msg.Data})
      end
      msg.reply({Data = "Broadcasted." })
    end
  )