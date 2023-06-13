import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { setDbUser} from '../redux/reducers/dbUser';
import { updatePages} from '../redux/reducers/pages';
import { setPage} from '../redux/reducers/page';

// Imported Components 
import NavBar from '@/components/NavBar';
import Home from '@/components/Home';
import ContentManagement from '@/components/ContentManagement'
import AccountManagement from '@/components/AccountManagement'
import FacebookTab from '@/components/FacebookTab';
import InstagramTab from '@/components/InstagramTab';
import TwitterTab from '@/components/TwitterTab';


export default function Dashboard() {
  const { user, isLoading, error } = useUser();
  const router = useRouter();
  const dispatch = useDispatch();

  const axios = require('axios');
  // UI Related Functions

  // UI Related Functions

  // Redux States
  const dbUser = useSelector((state: {dbUser: any}) => state.dbUser);
  // Redux States

  useEffect(() => {
    if (user ) {
      axios.get('/api/user')
        .then(function (response:{data: any}) {
          dispatch(setDbUser(response.data))
          
        })
        .catch(function (error: {}) {
          console.log(error);
        })

      axios.get('/api/pages')
        .then(function (response:{data: any}) {
          dispatch(updatePages(response.data.pages));
          dispatch(setPage(response.data.pages[0]));
        })
        .catch(function (error: {}) {
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
        <div className="bg-weird flex min-h-screen flex-col items-center justify-start">
          <NavBar />
          <Home /> 
          <FacebookTab />
          <InstagramTab />
          <TwitterTab />
          <ContentManagement />
          <AccountManagement /> 
        </div>
      )

  )
}
