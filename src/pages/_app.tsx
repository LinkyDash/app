import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import '../styles/globals.css'
import { Urbanist } from 'next/font/google';


const urbanist = Urbanist({ subsets: ['latin'] });

function MyApp({ Component, pageProps }: any) {
  return (
    <UserProvider>
          <Component {...pageProps} />
    </UserProvider>

  )
}

/* export function reportWebVitals(metric: any) {
  console.log(metric);
} */

export default MyApp