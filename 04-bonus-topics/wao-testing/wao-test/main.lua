Topics = Topics or {}

local function printData(k, v)
    local _data = { Key = k, Value = v }
    print(_data)
end

local function sendErrorMessage(msg, err, target)
    local targetId = target or msg.From
    ao.send({ Target = targetId, Error = "true", Data = err })
    printData("Error", "Target" .. " " .. targetId .. " " .. err)
end

-- Create or update a topic for a sender
Handlers.add("Upsert", { Action = "Upsert" }, function(msg)
    local success, err = pcall(function()
        if type(msg.Tags.Topic) ~= 'string' or msg.Tags.Topic:match("^%s*$") then
            sendErrorMessage(msg, 'Topic is required and must be a non-empty string!')
            return
        end

        local topic = msg.Tags.Topic
        local sender = msg.From

        -- Upsert logic to ensure sender can only have one topic
        Topics[sender] = { topic }

        ao.send({ Target = sender, Data = "Upsert successful" })
    end)

    if not success then
        sendErrorMessage(msg, 'An unexpected error occurred: ' .. tostring(err))
    end
end)

-- Delete a topic for a sender
Handlers.add("Delete", { Action = "Delete" }, function(msg)
    local success, err = pcall(function()
        local sender = msg.From

        if not Topics[sender] then
            sendErrorMessage(msg, 'No topic found for sender!')
            return
        end

        Topics[sender] = nil

        ao.send({ Target = sender, Data = "Delete successful" })
    end)

    if not success then
        sendErrorMessage(msg, 'An unexpected error occurred: ' .. tostring(err))
    end
end)


Handlers.add("GetUserTopic", { Action = "GetUserTopic" }, function(msg)
    local topic = {}

    -- If not Recipient is provided, then return the Senders balance
    if (msg.Tags.Recipient) then
        if (Topics[msg.Tags.Recipient]) then
            topic = Topics[msg.Tags.Recipient]
        end
    elseif msg.Tags.Target and Topics[msg.Tags.Target] then
        topic = Topics[msg.Tags.Target]
    elseif Topics[msg.From] then
        topic = Topics[msg.From]
    end

    if msg.reply then
        msg.reply({
            Data = topic,
        })
    else
        ao.send({
            Target = msg.From,
            Data = topic,
        })
    end
end)
