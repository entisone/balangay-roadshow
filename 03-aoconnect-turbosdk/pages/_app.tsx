import { ArNext } from "arnext";
import { WalletProvider } from "@/providers/wallet-provider";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

export default function App({ children, ...props }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <WalletProvider>
        <ArNext {...props}>{children}</ArNext>
      </WalletProvider>
    </ThemeProvider>
  );
}
