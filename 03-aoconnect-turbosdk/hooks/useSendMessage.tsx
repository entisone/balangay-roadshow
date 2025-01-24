import { AO } from "@/lib/processes";
import { createDataItemSigner, message, result } from "@permaweb/aoconnect";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

interface Payload {
  message: string;
}

const sendMessage = async (payload: Payload) => {
  // TODO: Finish the function. Hints on the useRegistration hook!
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
