export const queryKeys = {
  all: ["all"] as const,
  register: () => [...queryKeys.all, "register"] as const,
  checkRegistration: () => [...queryKeys.all, "checkRegistration"] as const,
  readMessages: () => [...queryKeys.all, "readMessages"] as const,
  sendMessage: () => [...queryKeys.all, "sendMessage"] as const,
  stake: () => [...queryKeys.all, "stake"] as const,
  unstake: () => [...queryKeys.all, "unstake"] as const,
};
