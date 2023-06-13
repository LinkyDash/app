import React from 'react'
import { useSelector} from 'react-redux';
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['400', '500', '800'],
  subsets: ['latin']
});


export default function TwitterTab() {

  // Redux States
  const tab = useSelector((state: {tab: any}) => state.tab);
  // Redux States

  return (
    <div className={`${inter.className} text-black w-full ${tab.name === 'Twitter'? 'visible' : 'hidden'}`}>
      <h1 className='text-center text-9xl font-bold mt-24 bg-looksLikeWhite p-5 w-1/2 mx-auto rounded-full drop-shadow-2xl'>Coming Soon!</h1>
      <p className='text-center font-medium w-10/12 mx-auto mt-20'>We are excited to announce that we will be adding Twitter support to our app in the near future! Our team is currently working on implementing the Twitter API into our application, allowing you to enjoy a richer experience and enhanced functionality. Stay tuned for updates as we continue to enhance your app experience by integrating Twitter&apos;s features and capabilities. We can&apos;t wait to bring you even more value and possibilities with the upcoming Twitter integration!</p>
    </div>
  )
}
