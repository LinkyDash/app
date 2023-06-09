import { withPageAuthRequired, useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import { useEffect, useState} from 'react';
import Link from 'next/link';
const axios = require('axios');

function Profile() {
  const { user, error, isLoading} = useUser();
  const router = useRouter();

  const [dbUser, setDbUser] = useState({})

  const deleteApi = () => {
    axios.delete('/api/user')
      .then(function (response) {
        setDbUser(response.data)
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  const updateApi = () => {
    const headers = {
      appid: "123456789",
      appsecret: "Arg5ertv345g6",
      accesstoken: "vw56236%@#%^V",
      clientid: "123456789"
    };

    axios.put('/api/user', null, { headers })
      .then(function (response) {
        setDbUser(response.data)
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  useEffect(() => {
    if (user ) {
      axios.get('/api/user')
        .then(function (response) {
          setDbUser(response.data)
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (!user) {
    router.push('/login');
    return null; // Return null temporarily while redirecting
  }

  return (
    user && (
      <div className=' bg-weird h-full flex flex-col'>
        <div className='text-gray-800 p-6'>
          <h1>Profile Information</h1>
          <ul>
            <li>ID: {dbUser.id}</li>
            <li>USERNAME: {dbUser.userName}</li>
            <li>EMAIL: {dbUser.email}</li>
          </ul>
        </div>
        <div className='flex justify-around p-6'>
          <h1 className='text-gray-800'>API STATUS: {dbUser.apiStatus? 'All Good' : 'Action Required' }</h1>
          <button className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded' onClick={updateApi}>Update API</button>
          <button className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded' onClick={deleteApi}>Delete API</button>
          
        </div>
        <Link href="/api/auth/logout" className='mx-auto p-6'>
            <button className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'>Logout</button>
        </Link>
      </div>
    )
  );
}

export default withPageAuthRequired(Profile);