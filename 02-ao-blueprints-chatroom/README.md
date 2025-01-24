# Lesson 2: AO Blueprints and Chat Room

## 📖 Introduction

Welcome to Lesson 2! In this lesson, we will explore how to create a **token-gated chat room** using AO (Autonomous Open) technology. You will learn how to utilize key blueprints such as **token management**, **staking**, and **chat room processes** to build decentralized applications on Arweave.

---

## 🏗️ Lua File Structure

In AO development, Lua scripts define smart contract logic that runs on the network. Each Lua file typically consists of:

1. **State Variables**

   - Used to maintain persistent data throughout the execution of the process.
   - Example:
     ```lua
     Members = Members or {}  -- Keeps track of registered users
     Balances = Balances or {}  -- Stores token balances
     ```

2. **Handlers**

   - Functions that respond to specific actions (e.g., "Register", "Transfer", "Stake").
   - Example:
     ```lua
     Handlers.add("Register", { Action = "Register" }, function(msg)
         table.insert(Members, msg.From)
         msg.reply({ Data = "Registered successfully." })
     end)
     ```

3. **Utility Functions**

   - Helper functions to process logic efficiently, such as handling numbers, formatting responses, etc.
   - Example:
     ```lua
     local function checkBalance(address)
         return Balances[address] or 0
     end
     ```

4. **Process Initialization**

   - Defines the initial state and configuration when the process starts for the first time.
   - Example:
     ```lua
     if not Balances[ao.id] then
         Balances[ao.id] = 1000000  -- Initial balance
     end
     ```

---

## ⚙️ Typical AO Process / Smart Contract Structure

An AO process (smart contract) generally follows this structure:

````lua
-- 1. Import Dependencies
local json = require("json")  -- Handling JSON data
local bint = require(".bint")(256)  -- Large number support

-- 2. Define State Variables
Balances = Balances or {}
Stakers = Stakers or {}

-- 3. Utility Functions
local function addBalance(address, amount)
    Balances[address] = (Balances[address] or 0) + amount
end

-- 4. Handlers for Actions
Handlers.add("Transfer", { Action = "Transfer" }, function(msg)
    local sender = msg.From
    local recipient = msg.Tags.Recipient
    local amount = tonumber(msg.Tags.Quantity)

    assert(Balances[sender] >= amount, "Insufficient balance")
    Balances[sender] = Balances[sender] - amount
    addBalance(recipient, amount)

    msg.reply({ Data = "Transfer successful" })
end)

-- 5. Process Initialization
if not Balances[ao.id] then
    Balances[ao.id] = 1000000  -- Initial token balance for contract owner
end

## ⚡ Composition of a Handler

In AO, **handlers** are the core building blocks of smart contracts. They define how a process responds to incoming messages and execute specific logic based on the message's content.

### **Handler Structure Overview**

An AO handler follows the general format:

```lua
Handlers.add(name, pattern, handle)
````

## ⚡ Composition of a Handler

In AO, **handlers** are the core building blocks of smart contracts. They define how a process responds to incoming messages and execute specific logic based on the message's content.

### **Handler Structure Overview**

An AO handler follows the general format:

```lua
Handlers.add(name, pattern, handle)
```

- `name` – A unique identifier for the handler (e.g., `"Transfer"`, `"Stake"`).
- `pattern` – A table that specifies the conditions under which the handler will execute.
- `handle` – A function that defines the logic to be executed when a message matches the pattern.

---

### **Example Breakdown**

```lua
Handlers.add(
    "Transfer",
    { Action = "Transfer" },
    function (msg)
        local sender = msg.From
        local recipient = msg.Tags.Recipient
        local amount = tonumber(msg.Tags.Quantity)

        assert(Balances[sender] and Balances[sender] >= amount, "Insufficient balance")
        Balances[sender] = Balances[sender] - amount
        Balances[recipient] = (Balances[recipient] or 0) + amount

        msg.reply({ Data = "Transfer successful!" })
    end
)
```

#### **Dissecting the Handler Components:**

Full docs on Handlers: [Handlers](https://cookbook_ao.arweave.dev/references/handlers.html#handlers-append-name-pattern-handle)

1. **Handler Name (`"Transfer"`)**

   - This identifier is used to refer to the handler within the contract.
   - Example: `"Transfer"`, `"Stake"`, `"Register"`.

2. **Pattern (`{ Action = "Transfer" }`)**

   - Specifies the action that triggers the handler.
   - In this example, it activates when a message contains `{ Action = "Transfer" }`.
   - Patterns can match multiple criteria, such as:
     ```lua
     { Action = "Stake", Quantity = "100" }
     ```

3. **Handle Function (`function(msg) ... end`)**
   - The actual logic that runs when the pattern matches.
   - Handles incoming messages by:
     - Validating inputs with `assert()`.
     - Performing operations such as updating balances.
     - Sending replies or further actions.

## 🛠️ Hands-on Activities

### Activity 1: Establish Gating on the Chat Room

In this activity, you'll implement **gated access** to the chat room. Only users who have registered will be able to register and participate.

#### Steps:

1. **Modify the `Register` handler in `chatroom.lua`:**

   - Implement logic to ensure:
     - Users cannot register more than once.

2. **Register to the chat room:**

   ```lua
   Send({ Target = "<chatroom_process_id>", Action = "Register" }).receive().Data
   ```

3. **Verify registration:**

   - Check your registration:
     ```lua
     Send({ Target = "<chatroom_process_id>", Action = "CheckRegistration" }).receive().Data
     ```

4. **Send a message:**

   - Check your registration:
     ```lua
     Send({ Target = "<chatroom_process_id>", Action = "Broadcast", Data = "<your_message>" }).receive().Data
     ```

---

### Activity 2: Earn Points for Active Participation 🎯

To make the chatroom more engaging, participants will earn **points for sending messages**, with a leaderboard feature to track the most active users.

#### Steps:

1. **Modify the `Broadcast` handler in `chatroom.lua`:**

   - Implement the following improvements:
     - Ensure only registered users can broadcast messages.
     - Award points to users when they send messages.
     - Add a unique command to check leaderboards and balance (e.g., `/leaderboards`, `/balance`).

2. **Send a message to earn points:**

   - Use the command to send a message and earn points:
     ```lua
     Send({ Target = "<chatroom_process_id>", Action = "Broadcast", Data = "Hello everyone!" }).receive().Data
     ```

3. **Check your current points:**

   - Use the `/balance` command to check your earned points:
     ```lua
     Send({ Target = "<chatroom_process_id>", Action = "Broadcast", Data = "/balance" }).receive().Data
     ```

4. **View the leaderboard:**
   - Use the `/leaderboards` command to see top users by points:
     ```lua
     Send({ Target = "<chatroom_process_id>", Action = "Broadcast", Data = "/leaderboards" }).receive().Data
     ```

---

### Expected Outcome

By completing these activities, participants will:

- Understand how to implement a simple **gated access** to a decentralized chat room.
- Earn points for message activity and track engagement using leaderboard commands.
- Gain hands-on experience interacting with AO smart contracts via commands.

---

Let us know if you need any help during the activity. Happy coding! 🚀
