import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';

// Imported Components 
import NavBar from '@/components/NavBar';
import Home from '@/components/Home';
import ContentManagement from '@/components/ContentManagement'
import AccountManagement from '@/components/AccountManagement'

export default function Dashboard() {
  const { user, isLoading, error } = useUser();
  const router = useRouter();
  const dispatch = useDispatch();


  // UI Related Functions

  // UI Related Functions

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  
  if (!user) {
    router.push('/login');
    return null; // Return null temporarily while redirecting
  }

  return (
      <div className="bg-weird flex min-h-screen flex-col items-center justify-start">
        <NavBar />
        <Home />
      </div>

  )
}
