import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ja">
      <link rel="stylesheet" href="https://unpkg.com/picnic" />
      <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.6/build/pure-min.css" />
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
