import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import { Exo_2, Oswald } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

const exo = Exo_2({
  weight: '800',
  subsets: ['latin'],
});

const oswald = Oswald({
  weight: ['200', '500'],
  subsets: ['latin'],
});

export default function Home() {
  const { user, isLoading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="bg-gradient-to-r from-shibi to-zerak flex min-h-screen flex-col items-center justify-between p-24">
      {isLoading && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      {!isLoading && !error && (
        <>
          <div className='flex justify-center items-center'>
            <Image
              priority
              src='/logo.svg'
              width={150}
              height={150}
              alt="Follow us on Twitter"
            />
            <h1 className={`${exo.className} text-8xl relative right-0 bottom-0`}>LinkyDash</h1>
          </div>
          <p className='font-helvetica font-thin text-8xl text-center'>Unite your world,<br></br><span className='font-helvetica font-extrabold'>effortlessly</span></p>
          <div className='w-1/3 flex justify-between'>
            <Link href="/api/auth/login">
              <button className='font-helvetica bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  rounded text-2xl'>Login</button>
            </Link>
            <Link href="#">
              <button  className='font-helvetica bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-70 cursor-not-allowed cursor text-2xl'>Sign Up FOR FREE</button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
