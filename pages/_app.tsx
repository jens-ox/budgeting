import Head from 'next/head'
import '../styles/globals.scss'
import '../styles/custom.scss'
import { ToastProvider } from 'react-toast-notifications'

function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider autoDismiss={true} autoDismissTimeout={2000}>
      <Head>
        <title>Budget</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </ToastProvider>
  )
}

export default MyApp
