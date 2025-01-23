import React from "react";
import { useWallet } from "@/providers/wallet-provider";
import { shortenAddress } from "@/lib/utils";
import Image from "next/image";

export const ConnectWalletButton = () => {
  const { connectWallet, disconnectWallet, userAddress, isConnected } =
    useWallet();

  const handleClick = async () => {
    if (isConnected) {
      await disconnectWallet();
    } else {
      await connectWallet();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-row justify-around items-center px-4 py-2 w-40 rounded-lg border border-gray-200"
    >
      {!isConnected && (
        <>
          Connect{" "}
          <Image
            src="/assets/ao-logo.svg"
            alt="AO Logo"
            width={500}
            height={500}
            className="w-5 h-5"
          />
        </>
      )}
      {isConnected && (
        <div className="flex flex-row justify-around items-center w-full">
          <Image
            src="/assets/ao-logo.svg"
            alt="AO Logo"
            width={500}
            height={500}
            className="w-5 h-5"
          />
          {shortenAddress(userAddress)}
        </div>
      )}
    </button>
  );
};
