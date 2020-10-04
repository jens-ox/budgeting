import '../styles/globals.scss'
import '../styles/custom.scss'
import { ToastProvider } from 'react-toast-notifications'

function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider autoDismiss={true} autoDismissTimeout={2000}>
      <Component {...pageProps} />
    </ToastProvider>
  )
}

export default MyApp
