# Lesson 3: Frontend Integration with AO Connect

## 📖 Introduction

Welcome to Lesson 3! In this lesson, we'll learn how to integrate our AO chatroom with a modern web frontend. By the end of this lesson, you'll understand:

- How to connect Arweave wallets to your frontend
- Methods for sending messages to AO processes using aoconnect
- Techniques for fetching real-time updates using dryrun
- Patterns for integrating AO processes with frontend code

## 🛠️ Technology Stack

### Core Libraries

1. **React.js / Next.js with ArNext**

   - Built on Next.js for optimal performance
   - Uses [ArNext](https://github.com/weavedb/arnext/) for deploying to permaweb
   - Enables both cloud and permaweb deployments from the same codebase

2. **@tanstack/react-query**

   - Powerful data synchronization
   - Cache management
   - Optimistic updates
   - Real-time data fetching

3. **@permaweb/aoconnect**
   - Core communication with AO processes
   - Wallet integration
   - Message handling
   - State querying

## 🔌 AOConnect Overview

The [@permaweb/aoconnect](https://cookbook_ao.arweave.dev/guides/aoconnect/aoconnect.html) library provides essential functions for interacting with AO processes:

```typescript
import {
  createDataItemSigner, // Create wallet signer
  message, // Send messages to processes
  result, // Get message results
  dryrun, // Query process state
} from "@permaweb/aoconnect";
```

### Key Functions

1. **message()**: Sends actions to processes

```typescript
const response = await message({
  process: AO.chatroom,
  signer: createDataItemSigner(window.arweaveWallet),
  tags: [{ name: "Action", value: "Broadcast" }],
});
```

2. **dryrun()**: Queries current state

```typescript
const state = await dryrun({
  process: AO.chatroom,
  tags: [{ name: "Action", value: "ReadMessages" }],
});
```

## 🎣 Custom React Hooks

Our application uses several custom hooks to manage different aspects of the chat:

1. **useWallet**

   - Manages wallet connection state
   - Handles connection/disconnection
   - Provides user address

2. **useRegistration**

   - Handles user registration flow
   - Checks registration status
   - Manages registration state

3. **useReadMessages**

   - Fetches chat messages
   - Handles real-time updates
   - Manages message cache

4. **useSendMessage**
   - Sends new messages
   - Handles message delivery status
   - Manages optimistic updates

## 🎯 Activities

### Activity 1: Implement Message Sending

In `useSendMessage.tsx`, complete the `sendMessage` function:

```typescript
const sendMessage = async (payload: Payload) => {
  // TODO: Implement message sending
  // 1. Use message() to send to AO process
  // 2. Add "Broadcast" action tag
  // 3. Include payload.message as data
  // 4. Get and parse result
};
```

**Implementation Steps:**

1. Create a message signer using `createDataItemSigner`
2. Send message using the `message()` function
3. Add appropriate tags for the Broadcast action
4. Get result using `result()` function
5. Parse and return the response

**Reference:** Look at the `register` function in `useRegistration.tsx`

### Activity 2: Implement Registration Check

In `useRegistration.tsx`, complete the `checkRegistration` function:

```typescript
const checkRegistration = async () => {
  // TODO: Implement registration check
  // 1. Use dryrun() to query registration
  // 2. Add CheckRegistration action tag
  // 3. Parse response (0 or 1)
};
```

**Implementation Steps:**

1. Create a data item signer
2. Use `dryrun()` to query the process
3. Add appropriate tags for CheckRegistration
4. Parse the response (returns "0" or "1")

**Reference:** Look at the `readMessages` function in `useReadMessages.tsx`

## 🧪 Testing Your Implementation

1. **Registration Flow**

   ```typescript
   const { register, checkRegistration } = useRegistration();
   await register.mutateAsync();
   const status = await checkRegistration.mutateAsync();
   ```

2. **Sending Messages**

   ```typescript
   const { mutate: sendMessage } = useSendMessage();
   sendMessage({ message: "Hello AO!" });
   ```

3. **Reading Messages**
   ```typescript
   const { data: messages } = useReadMessages();
   console.log(messages);
   ```

## 🚀 Next Steps

After completing these activities, you'll have a fully functional decentralized chat application that can be deployed both on traditional cloud platforms and the permaweb.

Consider these enhancements:

- Add message encryption
- Implement private messaging
- Add file sharing capabilities
- Create chat rooms

Happy coding! 🎉
