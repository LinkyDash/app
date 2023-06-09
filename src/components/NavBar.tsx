import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { useSelector, useDispatch } from 'react-redux';
import { openTab, closeTab} from '../redux/reducers/tabs';

const inter = Inter({
  weight: ['400', '500', '800'],
  subsets: ['latin']
});

function NavBar() {
  const [logOut, setLogOut] = useState(false);
  const [menu, setMenu] = useState(false);
  const logOutRef = useRef(null);
  const menuRef = useRef(null);

  // Redux States
  const tabs = useSelector((state: {tabs: any}) => state.tabs);
  const dispatch = useDispatch();
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

  const openNewTab = (tab: string) => {
    if (tabs.includes(tab)){
      alert('The Tab is Already Open')
    } else {
      dispatch(openTab(tab));
    }
  };

  const closeOpenedTab = (tab: string) => {
    dispatch(closeTab(tab));
  };
  // UI Related Functions
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={` bg-zinc-900 w-full h-16 flex ${inter.className} z-50`}>
        <div ref={menuRef} className={`flex-none mx-4 flex flex-col justify-start mt-1  rounded-t-xl ${menu? 'bg-white py-1 shadow-2xl' : '' }`}>
            <button onClick={menuClick} className={`h-16 w-16 mx-auto ${menu? 'hidden' : '' }`}>
                <Image src={'/menu.png'} alt='Profile Image' height={48} width={48}/>
            </button>
            <div className={`${menu? 'visible' : 'hidden' } p-3 bg-white rounded-lg`}>
                <div onClick={() => openNewTab('Home')} className='bg-gray-400 hover:bg-red-500 text-white font-bold py-2 px-4 m-3 rounded shadow-xl cursor-pointer'>
                    <h1 className='text-center text-xl font-medium'>Home</h1>
                </div>
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
          {tabs.map((tab: string) =>
          <div key={tabs.indexOf(tab)} className=' bg-slate-400 flex justify-between p-2 mt-6 rounded-t-xl mr-2'>
            <p className='mr-2 font-medium'>{tab}</p>
            <button onClick={() => closeOpenedTab(tab)}  type="button" className="text-white bg-white hover:bg-red-500  focus:outline-none  font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center">
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
          </div>
          )}
        </div>
        <div ref={logOutRef} className={`flex-none mx-4 flex flex-col justify-start mt-1  rounded-t-xl ${logOut? 'bg-white py-1 shadow-2xl' : '' }`}>
            <div onClick={profileClick} className='h-14 w-14 rounded-full bg-gray-400 cursor-pointer mx-auto'>
                <Image src={'/user.png'} alt='Profile Image' height={56} width={56} />
            </div>
            <div className={`${logOut? 'visible' : 'hidden' } p-3 bg-white rounded-b-lg`}>
                <Link href="/api/auth/logout">
                    <button className='bg-orange-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded shadow-xl'>Logout</button>
                </Link>
            </div>
        </div>
    </nav>
  )
}

export default NavBar