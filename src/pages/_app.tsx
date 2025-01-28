import "@/styles/globals.css";
import "@/styles/Home.module.css"
import type { AppProps } from "next/app";
import { ReactFlowProvider } from "react-flow-renderer";


export default function App({ Component, pageProps }: AppProps) {
  return(
    <ReactFlowProvider>
      <Component {...pageProps} />
    </ReactFlowProvider>
  )
}
