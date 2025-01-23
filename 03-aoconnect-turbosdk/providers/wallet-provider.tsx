"use client";

import { AppInfo, PermissionType, GatewayConfig } from "arconnect";
import { ReactNode, createContext, useContext, useState } from "react";

const MESSAGE_TO_SIGN =
  "Welcome to AO Chat! By signing this message, you agree to the terms of service and privacy policy. Your data will be securely stored and used for the purpose of providing you with the best job search experience possible.";

const WALLET_PERMISSIONS: PermissionType[] = [
  "ACCESS_ADDRESS",
  "ACCESS_PUBLIC_KEY",
  "DISPATCH",
  "SIGNATURE",
  "SIGN_TRANSACTION",
];

const APP_INFO: AppInfo = {
  name: "Jobsy",
};

const GATEWAY: GatewayConfig = {
  host: "arweave.ph",
  port: 443,
  protocol: "https",
};

interface WalletContextType {
  connectWallet: () => Promise<{ success: boolean }>;
  fetchUserBalance: () => Promise<void>;
  userAddress: string;
  isConnected: boolean;
  disconnectWallet: () => Promise<void>;
  isUserSigned: boolean;
}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

interface IWalletProvider {
  children: ReactNode;
}

export const WalletProvider = ({ children }: IWalletProvider) => {
  const [userAddress, setUserAddress] = useState<string>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isUserSigned, setIsUserSigned] = useState<boolean>(false);

  const connectWallet = async () => {
    try {
      await globalThis.arweaveWallet.connect(
        WALLET_PERMISSIONS,
        APP_INFO,
        GATEWAY
      );
      const _userAddress = await globalThis.arweaveWallet.getActiveAddress();
      setUserAddress(_userAddress);
      setIsConnected(true);

      const isSigned = await signMessage(MESSAGE_TO_SIGN);
      setIsUserSigned(isSigned);

      console.log("Connected to wallet:", _userAddress);
      return { success: true, userAddress: _userAddress };
    } catch (error) {
      console.error("Failed to connect wallet:", error);

      return { success: false, error: error };
    }
  };

  const disconnectWallet = async () => {
    await globalThis.arweaveWallet.disconnect();
    setIsConnected(false);
    setUserAddress(undefined);
    setIsUserSigned(false);
  };

  const signMessage = async (message: string) => {
    try {
      const encodedMessage = new TextEncoder().encode(message);

      // create signature
      const signature = await globalThis.arweaveWallet.signMessage(
        encodedMessage
      );

      // verify signature
      const isValidSignature = await globalThis.arweaveWallet.verifyMessage(
        encodedMessage,
        signature
      );

      console.log(`The signature is ${isValidSignature ? "valid" : "invalid"}`);
      return isValidSignature;
    } catch (error) {
      console.error("Failed to sign message:", error);
      await disconnectWallet();
      setIsUserSigned(false);

      return false;
    }
  };

  const fetchUserBalance = async () => {
    const _connected = await connectWallet();
    if (_connected.success === false) {
      return;
    }

    try {
      const address = await globalThis.arweaveWallet.getActiveAddress();
      setUserAddress(address);
    } catch (e) {
      console.error("fetchUserBalance() error!", e);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connectWallet,
        disconnectWallet,
        fetchUserBalance,
        userAddress,
        isConnected,
        isUserSigned,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within an WalletProvider");
  }
  return context;
};
