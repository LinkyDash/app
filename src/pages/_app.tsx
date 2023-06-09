import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import '../styles/globals.css'
import { store } from '../redux/store'
import { Provider } from 'react-redux'


function MyApp({ Component, pageProps }: any) {
  return (
    <UserProvider>
      <Provider store={store}>
          <Component {...pageProps} />
      </Provider>
    </UserProvider>

  )
}

/* export function reportWebVitals(metric: any) {
  console.log(metric);
} */

export default MyApp