import { withPageAuthRequired, useUser } from '@auth0/nextjs-auth0/client';
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from 'next/router';
import { useEffect, useState} from 'react';

function Profile() {
  const { user, error, isLoading} = useUser();
  const { getAccessTokenSilently } = useAuth0();
  const router = useRouter();

    const getToken = async () => {
    if (user) {
      const accessToken = await getAccessTokenSilently();
      console.log(accessToken); // Access token
    }
  };

  useEffect(() => {
    if (user) {
        console.log(user);
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (!user) {
    router.push('/login');
    return null; // Return null temporarily while redirecting
  }

  return (
    user && (
      <div>
        <p>Email :{user.email}</p>
        <button onClick={getToken}>Get Access Token</button>
        <a href="/api/auth/logout">
          <button className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'>Logout</button>
        </a>
      </div>
    )
  );
}

export default withPageAuthRequired(Profile);