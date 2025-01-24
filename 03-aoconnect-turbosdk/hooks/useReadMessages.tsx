import { createDataItemSigner, dryrun } from "@permaweb/aoconnect";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { AO } from "@/lib/processes";

interface IMessage {
  sender: string;
  message: string;
}

const readMessages = async () =>
  dryrun({
    process: AO.chatroom,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [{ name: "Action", value: "ReadMessages" }],
  }).then((res) => {
    return JSON.parse(res.Messages[0].Data) as IMessage[];
  });

export const useReadMessages = () => {
  return useQuery({
    queryKey: queryKeys.readMessages(),
    queryFn: async () => readMessages(),
    refetchInterval: 5000,
  });
};
