import '../styles/global.scss';
import '../styles/dracula.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Algohare</title>
        <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
        <link rel="mask-icon" href="/favicon.svg" color="#ffffff" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css" integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X" crossOrigin="anonymous" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}