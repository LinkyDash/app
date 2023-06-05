import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';


export default function Home() {
  const { user, isLoading, error } = useUser();
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  
  if (!user) {
    router.push('/login');
    return null; // Return null temporarily while redirecting
  }

  return (
      <div className="bg-white dark:bg-gray-900 flex min-h-screen flex-col items-center justify-between p-24">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <a href="/api/auth/logout">
          <button className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'>Logout</button>
        </a>
        <a href="/profile">
          <button className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'>Profile</button>
        </a>
      </div>

  )
}
