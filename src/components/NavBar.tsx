import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { useSelector, useDispatch } from 'react-redux';
import { openTab, closeTab} from '../redux/reducers/tabs';
import { activeTab} from '../redux/reducers/tab';
import { useUser } from '@auth0/nextjs-auth0/client';

const inter = Inter({
  weight: ['400', '500', '800'],
  subsets: ['latin']
});

function NavBar() {
  const [logOut, setLogOut] = useState(false);
  const [menu, setMenu] = useState(false);
  const logOutRef: any = useRef(null);
  const menuRef: any = useRef(null);
  const dispatch = useDispatch();

  const { user, error, isLoading} = useUser();

  // Redux States
  const tabs = useSelector((state: {tabs: any}) => state.tabs);
  const tab = useSelector((state: {tab: any}) => state.tab);
  // Redux States

  // UI Related Functions
  const profileClick = () => {
    if (logOut) {
        return setLogOut(false);
    }
    return setLogOut(true)
  }
  const menuClick = () => {
    if (menu) {
        return setMenu(false);
    }
    return setMenu(true)
  }
  const handleClickOutside = (event: {target: any}) => {
    if (
      logOutRef.current &&
      !logOutRef.current.contains(event.target) &&
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      setLogOut(false);
      setMenu(false);
    }
  };

  const openNewTab = (tb: string) => {
    if (tabs.includes(tb)){
      alert('The Tab is Already Open')
    } else {
      dispatch(openTab(tb));
      dispatch(activeTab(tb));
    }
  };

  const closeOpenedTab = (tb: string) => {
    if (tab.name === tb) {
      dispatch(closeTab(tb));
      dispatch(activeTab('Home'));
    } else {
      dispatch(closeTab(tb));
    }
  };

  const tabClick = (tb: string) => {
    dispatch(activeTab(tb));
  };
  // UI Related Functions
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    user && (
      <nav className={` bg-zinc-900 w-full flex ${inter.className} z-50 h-14 shadow-xl`}>
          <div className='flex-none mx-4 w-14 h-14'>
            <svg xmlns="http://www.w3.org/2000/svg" height="60" width="60" zoomAndPan="magnify" viewBox="0 0 375 374.999991"  preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="c2c886ade2"><path d="M 16.21875 65.15625 L 358.707031 65.15625 L 358.707031 309.652344 L 16.21875 309.652344 Z M 16.21875 65.15625 " clipRule="nonzero"/></clipPath></defs><g clipPath="url(#c2c886ade2)"><path fill="#8c52ff" d="M 187.464844 170.503906 L 196.117188 179.160156 C 200.683594 183.726562 200.683594 191.078125 196.117188 195.644531 L 187.464844 204.300781 L 178.808594 195.644531 C 174.242188 191.078125 174.242188 183.726562 178.808594 179.160156 Z M 138.433594 65.160156 C 132.476562 65.160156 126.519531 67.4375 121.953125 72.003906 L 23.070312 170.921875 C 13.9375 180.054688 13.9375 194.75 23.070312 203.882812 L 121.953125 302.800781 C 131.082031 311.933594 145.785156 311.933594 154.917969 302.800781 L 171.398438 286.316406 L 130.199219 245.105469 L 80.761719 195.652344 L 80.585938 195.480469 L 80.59375 195.472656 C 76.195312 190.894531 76.242188 183.667969 80.75 179.160156 L 130.199219 129.703125 C 134.761719 125.136719 142.113281 125.136719 146.679688 129.703125 L 154.507812 137.53125 L 121.125 170.921875 C 111.996094 180.054688 111.996094 194.753906 121.125 203.886719 L 220.011719 302.800781 C 229.140625 311.933594 243.84375 311.933594 252.972656 302.800781 L 351.859375 203.886719 C 360.992188 194.753906 360.992188 180.054688 351.859375 170.921875 L 252.972656 72.007812 C 243.84375 62.875 229.140625 62.875 220.011719 72.007812 L 203.527344 88.492188 L 244.738281 129.703125 L 294.175781 179.152344 L 294.351562 179.328125 L 294.339844 179.335938 C 298.734375 183.914062 298.683594 191.140625 294.175781 195.648438 L 244.738281 245.105469 C 240.171875 249.671875 232.820312 249.671875 228.253906 245.105469 L 220.425781 237.277344 L 253.808594 203.886719 C 262.941406 194.753906 262.941406 180.054688 253.808594 170.921875 L 154.917969 72.007812 C 150.351562 67.4375 144.390625 65.164062 138.433594 65.164062 L 138.433594 65.160156 " fillOpacity="1" fillRule="nonzero"/></g></svg>
          </div>
          <div ref={menuRef} className={`flex-none mx-4 flex flex-col justify-start mt-1  rounded-t-xl ${menu? 'bg-white py-1 shadow-2xl' : '' }`}>
              <button onClick={menuClick} className={`h-16 w-16 mx-auto ${menu? 'hidden' : '' }`}>
                  <Image src={'/menu.png'} alt='Profile Image' height={40} width={40}/>
              </button>
              <div className={`${menu? 'visible' : 'hidden' } p-3 bg-white rounded-lg`}>
                  <div onClick={() => openNewTab('Facebook')} className='bg-gray-400 hover:bg-red-500 text-white font-bold py-2 px-4 m-3 rounded shadow-xl cursor-pointer'>
                      <h1 className='text-center text-xl font-medium'>Facebook</h1>
                  </div>
                  <div onClick={() => openNewTab('Instagram')} className='bg-gray-400 hover:bg-red-500 text-white font-bold py-2 px-4 m-3 rounded shadow-xl cursor-pointer'>
                      <h1 className='text-center text-xl font-medium'>Instagram</h1>
                  </div>
                  <div onClick={() => openNewTab('Twitter')} className='bg-gray-400 hover:bg-red-500 text-white font-bold py-2 px-4 m-3 rounded shadow-xl cursor-pointer'>
                      <h1 className='text-center text-xl font-medium'>Twitter</h1>
                  </div>
                  <div onClick={() => openNewTab('Content Management')} className='bg-gray-400 hover:bg-red-500 text-white font-bold py-2 px-4 m-3 rounded shadow-xl cursor-pointer'>
                      <h1 className='text-center text-xl font-medium'>Content Management</h1>
                  </div>
                  <div onClick={() => openNewTab('Account Management')} className='bg-gray-400 hover:bg-red-500 text-white font-bold py-2 px-4 m-3 rounded shadow-xl cursor-pointer'>
                      <h1 className='text-center text-xl font-medium'>Account Management</h1>
                  </div>
              </div>
          </div>
          <div className='grow flex justify-start '>
            {tabs.map((el: string) =>
            <div key={tabs.indexOf(el)} onClick={() => tabClick(el)} className={`flex justify-between p-2 mt-4 rounded-t-xl mr-2 cursor-pointer ${tab.name === el? 'bg-slate-400' : 'bg-slate-800 text-gray-500' }`}>
              <p className={`${el === 'Home'? '' : 'mr-2'}  font-medium`}>{el}</p>
              {
                el === 'Home' ?
                '' : <button onClick={(event) => { event.stopPropagation(); closeOpenedTab(el); }}  type="button" className="text-white z-50 bg-white hover:bg-red-500  focus:outline-none  font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center">
                <svg className="w-3 h-3" fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 460.775 460.775" xmlSpace="preserve">
                <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
                  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
                  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
                  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
                  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
                  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
                </svg>
              </button>
              }
            </div>
            )}
          </div>
          <div ref={logOutRef} className={`flex-none mx-4 flex flex-col justify-start mt-1  rounded-t-xl ${logOut? 'bg-white py-1 shadow-2xl' : '' }`}>
              <div onClick={profileClick} className='h-12 w-12 rounded-full bg-gray-400 cursor-pointer mx-auto'>
                  <Image src={`${user.picture}`} alt='Profile Image' height={56} width={56} className='rounded-full' />
              </div>
              <div className={`${logOut? 'visible' : 'hidden' } p-3 bg-white rounded-b-lg`}>
                  <Link href="/api/auth/logout">
                      <button className='bg-orange-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded shadow-xl'>Logout</button>
                  </Link>
              </div>
          </div>
      </nav>
    )
  )
}

export default NavBar