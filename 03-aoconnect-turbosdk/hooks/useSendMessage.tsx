import { AO } from "@/lib/processes";
import { createDataItemSigner, message, result } from "@permaweb/aoconnect";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

interface Payload {
  message: string;
}

const sendMessage = async (payload: Payload) => {
  const sendMessageToProcess = await message({
    process: AO.chatroom,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [{ name: "Action", value: "Broadcast" }],
    data: payload.message,
  });

  const sendMessageResponse = await result({
    message: sendMessageToProcess,
    process: AO.chatroom,
  }).then((res) => JSON.parse(res.Messages[0].Data) as string);

  return sendMessageResponse;
};

export const useSendMessage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 60, // 1hr
      },
    },
  });

  return useMutation({
    mutationFn: (payload: Payload) => sendMessage(payload),
    onSuccess: async () => {
      const queryKey = queryKeys.sendMessage();
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.refetchQueries({ queryKey });
    },
    onError(error) {
      console.error(error.message);
    },
  });
};
