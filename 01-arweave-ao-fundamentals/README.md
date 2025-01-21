# Lesson 1: Arweave and AO Fundamentals

[Presentation here](https://www.canva.com/design/DAGbJhZ1064/Nrr4I6i1Ppl-U5NAbYubkQ/edit?utm_content=DAGbJhZ1064&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

---

## 📖 Introduction

Welcome to **Lesson 1**, where we'll explore the foundational concepts of **Arweave** and **AO (Actor Oriented)** computing. This lesson introduces key concepts related to **on-chain permanent storage** and AO's **hyper-parallel supercomputer**, enabling decentralized and scalable applications.

By the end of this lesson, you will understand the principles of **data permanence**, **AO's architecture**, and gain hands-on experience by setting up your development environment.

---

## 🌐 Arweave: On-Chain Permanent Storage at Any Scale

Arweave offers a unique, permanent, and scalable storage solution for the decentralized web. Key topics covered in this lesson include:

1. **What is Arweave and Why is it Important?**

   - Arweave is a decentralized storage network designed to provide permanent data storage.
   - Its innovative blockweave technology ensures that data is stored immutably, offering a reliable foundation for decentralized applications.

2. **Proof-of-Access**

   - Arweave utilizes a consensus mechanism called Proof-of-Access (PoA), which requires miners to verify new data by accessing previously stored data.
   - This approach ensures data integrity and incentivizes the preservation of information.

3. **Gateways**

   - Gateways serve as access points to the Arweave network, allowing users to retrieve and interact with stored data seamlessly.
   - They bridge the gap between the decentralized storage layer and user-facing applications.

4. **Endowment**
   - Arweave's economic model includes an endowment, where upfront fees are used to incentivize long-term data storage.
   - This ensures that data remains available perpetually without recurring costs.

---

## ⚙️ AO: The Hyper-Parallel Supercomputer

AO is a decentralized, hyper-parallel computer designed to provide trustless and cooperative compute services without practical bounds on scale. It combines the trust minimization benefits of blockchain networks with the speed and scalability of traditional compute environments.

---

![AO Computer](https://cdn.prod.website-files.com/66c607043f775347e75460f6/66e098e2b527ee2c909e4652_PDzrxP16of7otg5EyBoMYI1BRk.png)

### **Holographic State**

The concept of **holographic state** in AO refers to how data is distributed and accessible across multiple processes without requiring each process to maintain a complete copy of the entire state.

- AO processes interact with each other asynchronously, with each process having its own **local state** while being able to reference external data stored on Arweave.
- This decentralized approach ensures that no single point of failure affects the entire system.
- It enables efficient scaling by offloading data persistence to Arweave and dynamically fetching relevant parts as needed.

---

## 🛠️ Hands-on Activities

[Presentation here](https://www.canva.com/design/DAGbMx7BRYg/rzm1g6rE768l5RKY5ebbLw/edit?utm_content=DAGbMx7BRYg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

### Activity: Set Up AOS and Create a "hello-world.lua" Process

In this activity, you'll set up the AOS environment and create a simple process that responds with `"Hello, AO!"` when prompted.

---

### Steps:

#### 1. Install Node.js

Ensure that **Node.js version 20 or higher** is installed on your system.  
If not, download and install it from the [official Node.js website](https://nodejs.org/).

---

#### 2. Install AOS

Open your terminal and run the following command to install AOS globally:

```bash
npm i -g https://get_ao.g8way.io
```

This command installs the AOS client, allowing you to interact with the AO decentralized supercomputer.

---

#### 3. Start AOS

Once installed, start a new AOS process by running:

```bash
aos
```

Upon successful connection, you'll see a welcome message similar to:

```plaintext
      _____                   _______                   _____
     /\    \                 /::\    \                 /\    \
    /::\    \               /::::\    \               /::\    \
   /::::\    \             /::::::\    \             /::::\    \
  /::::::\    \           /::::::::\    \           /::::::\    \
 /:::/\:::\    \         /:::/~~\:::\    \         /:::/\:::\    \
/:::/__\:::\    \       /:::/    \:::\    \       /:::/__\:::\    \
\:::\   \:::\    \     /:::/    / \:::\    \      \:::\   \:::\    \
 \:::\   \:::\    \   /:::/____/   \:::\____\   ___\:::\   \:::\    \
  \:::\   \:::\    \ |:::|    |     |:::|    | /\   \:::\   \:::\    \
   \:::\   \:::\____\|:::|____|     |:::|    |/::\   \:::\   \:::\____\
    \:::\   \::/    / \:::\    \   /:::/    / \:::\   \:::\   \::/    /
     \:::\   \/____/   \:::\    \ /:::/    /   \:::\   \:::\   \/____/
      \:::\    \        \:::\    /:::/    /     \:::\   \:::\    \
       \:::\____\        \:::\__/:::/    /       \:::\   \:::\____\
        \::/    /         \::::::::/    /         \:::\  /:::/    /
         \/____/           \::::::/    /           \:::\/:::/    /
                           \::::/    /             \::::::/    /
                            \::/____/               \::::/    /
                                                      \::/    /
                                                       \/____/

Welcome to AOS: Your operating system for AO, the decentralized open
access supercomputer.

Type ".load-blueprint chat" to join the community chat and ask questions!

AOS Client Version: 1.12.1. 2024
Type "Ctrl-C" twice to exit

Your AOS process:  QFt5SR6UwJSCnmgnROq62-W8KGY9z96k1oExgn4uAzk
```

This indicates that your personal server within the AO network is active and ready for interaction.

---

#### 4. Create the `hello-world.lua` Process

At the AOS prompt, define a handler that responds with `"Hello, AO!"` when it receives a message with the action `"Hello-World"`:

```lua
Handlers.add(
    "Hello-World",
    { Action = "Hello-World" },
    function(msg)
        msg.reply({ Data = "Hello, AO!" })
    end
)
```

This Lua script sets up a handler named `"Hello-World"` that listens for messages with the action `"Hello-World"` and replies accordingly.

---

#### 5. Test the Process

To verify that your process is functioning correctly, send a message to it:

```lua
Send({ Target = ao.id, Action = "Hello-World" }).receive().Data
```

The expected output should be:

```plaintext
"Hello, AO!"
```

This confirms that your process is correctly set up and responding to messages.

---

#### 6. Exit AOS

To exit the AOS environment, press `Ctrl+C` twice.

---

### Expected Outcome

By completing this activity, you will have:

- Installed and configured the AOS client.
- Initialized a personal process within the AO decentralized supercomputer.
- Created a Lua-based handler that responds to specific messages.
- Sent and received messages within your process, confirming its functionality.

---

Let us know if you need any help during the activity. Happy coding! 🚀
