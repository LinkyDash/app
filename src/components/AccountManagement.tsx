import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import { updatePages, deletePages} from '../redux/reducers/pages';
import { setDbUser} from '../redux/reducers/dbUser';

const axios = require('axios');
const inter = Inter({
  weight: ['400', '500', '800'],
  subsets: ['latin']
});


export default function AccountManagement() {
  
  const dispatch = useDispatch();

// React States
  const { user, error, isLoading} = useUser();
  const [formData, setFormData] = useState({
    appid: '',
    appsecret: '',
    accesstoken: '',
    clientid: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
// React States

// Redux States
  const tab = useSelector((state: {tab: any}) => state.tab);
  const pages = useSelector((state: {pages: any}) => state.pages);
  const dbUser = useSelector((state: {dbUser: any}) => state.dbUser);
  // Redux States

// UI Related Functions
  const deleteApi = (e: any) => {
    e.preventDefault();

    if (confirm("Are you sure you want to delete your API")) {
      setIsSubmitting(true);
      axios.delete('/api/user')
        .then(function (response:{data: any}) {
          dispatch(setDbUser(response.data))
        })
        .catch(function (error: {}) {
          console.log(error);
        })
        .finally( function (){
          setFormData({
            appid: '',
            appsecret: '',
            accesstoken: '',
            clientid: ''
          })
          dispatch(deletePages());
          setIsSubmitting(false);
        })
    } else {
      return; // Exit the function if the user clicks "No"
    }
  }

  const updateApi = (e: any) => {
    e.preventDefault();

    setIsSubmitting(true);

    const headers = {
      appid: formData.appid,
      appsecret: formData.appsecret,
      accesstoken: formData.accesstoken,
      clientid: formData.clientid
    };

    axios.put('/api/user', null, { headers })
      .then(function (response:{data: any}) {
        dispatch(setDbUser(response.data))
        
      })
      .catch(function (error: {}) {
        console.log(error);
      })
      .finally( function (){
        setFormData({
          appid: '',
          appsecret: '',
          accesstoken: '',
          clientid: ''
        })

      axios.get('/api/pages')
        .then(function (response:{data: any}) {
          dispatch(updatePages(response.data.pages));
        })
        .catch(function (error: {}) {
          console.log(error);
        })

        setIsSubmitting(false);
      })
  }

  const handleChange = (e: {target: {name:any, value: any}}) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
// UI Related Functions

  return (
    <div className={`${inter.className}  w-full ${tab.name === 'Account Management'? 'visible' : 'hidden'}`}>
      <div className='m-5 bg-white rounded-xl mx-auto w-11/12 shadow-xl text-black py-8 flex justify-around'>
        <div className='w-1/3 bg-looksLikeWhite rounded-xl shadow-xl p-5'>
          <h1 className='text-gray-800 p-3 pb-0 font-semibold text-xl'>Choose a Platform:</h1>
          <div className='flex justify-between p-3 w-10/12'>
            <div className='w-1/3 flex flex-col justify-center m-2 p-1 rounded-xl border-2 bg-white border-blue-600 cursor-pointer'>
              <Image src={'/Meta-Logo.png'} width={160} height={90} alt='' className='mx-auto'/>
            </div>
            <div className='w-1/3  flex flex-col justify-center m-2 p-3 rounded-xl border-2 bg-white grayscale cursor-no-drop hover:grayscale-0'>
              <Image src={'/Instagram_logo.svg.png'} width={320} height={78} alt='' className='mx-auto'/>
            </div>
            <div className='w-1/3 flex flex-col justify-center m-2 p-3 rounded-xl border-2 bg-white grayscale cursor-no-drop hover:grayscale-0'>
              <Image src={'/Twitter_logo.svg.png'} width={320} height={64} alt='' className='mx-auto'/>
            </div>
          </div>
          <form onSubmit={dbUser.apiStatus === false ? updateApi: deleteApi} className=' p-3'>
            <label  className=' block text-gray-800 px-3 font-semibold text-xl'>Client ID:</label>
            <input disabled={dbUser.apiStatus === true? true : false} required className='m-3 w-1/2 rounded-md border mt-1 h-8 pl-2' type="password" placeholder={dbUser.apiStatus === true ? "*********"  : '' } name="clientid" value={formData.clientid} onChange={handleChange} />

            <label className='block text-gray-800 px-3 font-semibold text-xl'>App ID:</label>
            <input disabled={dbUser.apiStatus === true? true : false} required className='m-3 w-1/2 rounded-md border mt-1 h-8 pl-2' type="password" placeholder={dbUser.apiStatus === true ? "*********"  : '' } name="appid" value={formData.appid} onChange={handleChange} />

            <label className='block text-gray-800 px-3 font-semibold text-xl'>App Secret:</label>
            <input disabled={dbUser.apiStatus === true? true : false} required className='m-3 w-1/2 rounded-md border mt-1 h-8 pl-2' type="password" placeholder={dbUser.apiStatus === true ? "*********"  : '' } name="appsecret" value={formData.appsecret} onChange={handleChange} />

            <label className='block text-gray-800 px-3 font-semibold text-xl'>Access Token:</label>
            <input disabled={dbUser.apiStatus === true? true : false} required className='m-3 w-1/2 rounded-md border mt-1 h-8 pl-2' type="password" placeholder={dbUser.apiStatus === true ? "*********"  : '' } name="accesstoken" value={formData.accesstoken} onChange={handleChange} />

            <div className=' p-3 flex justify-around'>
              {
              <button
                disabled={isSubmitting}
                type="submit"
                className={`text-white font-semibold p-3 rounded-lg w-1/3 ${
                  dbUser.apiStatus ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
                onClick={dbUser.apiStatus ? deleteApi : updateApi}
              >
                {isSubmitting ? (dbUser.apiStatus ? 'Deleting...' : 'Submitting...') : (dbUser.apiStatus ? 'Delete' : 'Submit')}
              </button>
              }


            </div>
          </form>

        </div>
        <div className='w-1/4 bg-looksLikeWhite p-5 rounded-xl shadow-xl'>
          <h1 className='text-gray-800 p-3 pb-0 font-semibold text-xl'>Connected Accounts:</h1>
          
            {
              pages.status === true?
                pages.data.map(
                  (el: any) => {
                    return  <div className='p-3 rounded-xl bg-white m-2' key={pages.data.indexOf(el)}>
                            <Image src={el.picture} alt='page-profile-picture' width={50} height={50} className='rounded-full border-gray-700 border mx-auto' />
                            <a href={el.link} target='a_blank'>
                              <h1 className='font-medium text-xl text-center'>{el.name}</h1>
                            </a>
                            <p className='mt-2 text-center'>{el.about}</p>
                            </div>
                  }
                )
              :
              <h1>No Facebook Pages Were Found</h1>
            }
          
        </div>
        <div className='w-1/4 bg-looksLikeWhite p-5 rounded-xl shadow-xl'>
          <h1 className='text-gray-800 p-3 pb-0 font-semibold text-xl'>User Profile:</h1>
          <div className='p-3'>
            <div className='p-3'>
              <Image src={`${user?.picture}`} width={100} height={100} alt='profile-picture' className='mx-auto rounded-full mb-5'/>
              <div className='p-2 rounded-xl border bg-white'>
                <label className='block text-gray-800 font-semibold text-xl'>Id:</label>
                <h1 className='mb-2 px-4 '> {user?.sub}</h1>

                <label className='block text-gray-800  font-semibold text-xl'>User Type</label>
                <h1 className='mb-2 px-4'>Admin</h1>

                <label className='block text-gray-800  font-semibold text-xl'>Name</label>
                <h1 className='mb-2 px-4'> {user?.name}</h1>

                <label className='block text-gray-800 font-semibold text-xl'>Email</label>
                <h1 className='mb-2 px-4'>{user?.email}</h1>

                <label className='block text-gray-800 font-semibold text-xl'>Email Status:</label>
                <h1 className='mb-2 p-2'>{user?.email_verified ? "Verified" : "Not Verified" }</h1>
              </div>

              <div className='flex justify-around mt-8'>
                <button disabled={true} className='text-white font-semibold p-3 rounded-lg bg-orange-500 hover:bg-orange-600 opacity-50 cursor-not-allowed'>Verify Email</button>
                <button disabled={true} className='text-white font-semibold p-3 rounded-lg bg-red-500 hover:bg-red-600 opacity-50 cursor-not-allowed'>Delete Account</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
