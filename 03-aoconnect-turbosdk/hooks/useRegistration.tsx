import { AO } from "@/lib/processes";
import {
  createDataItemSigner,
  dryrun,
  message,
  result,
} from "@permaweb/aoconnect";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

const register = async () => {
  const registerToProcess = await message({
    process: AO.chatroom,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [{ name: "Action", value: "Register" }],
  });

  const registerResponse = await result({
    message: registerToProcess,
    process: AO.chatroom,
  }).then((res) => JSON.parse(res.Messages[0].Data) as string);

  return registerResponse;
};

const checkRegistration = async () => {
  // TODO: Finish the function. Hints above on the other one!
};

export const useRegistration = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 60, // 1hr
      },
    },
  });

  const mutateRegister = useMutation({
    mutationFn: () => register(),
    onSuccess: async () => {
      const queryKey = queryKeys.register();
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.refetchQueries({ queryKey });
    },
    onError(error) {
      console.error(error.message);
    },
  });

  const mutateCheckRegistration = useMutation({
    mutationFn: () => checkRegistration(),
    onSuccess: async () => {
      const queryKey = queryKeys.checkRegistration();
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.refetchQueries({ queryKey });
    },
    onError(error) {
      console.error(error.message);
    },
  });

  return {
    checkRegistration: mutateCheckRegistration,
    register: mutateRegister,
  };
};
