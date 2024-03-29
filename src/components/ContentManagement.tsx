import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import CmDropDown from './utils/CmDropDown';
import axios from 'axios';
import { setPage, endPageRequest } from '@/redux/reducers/page';
import { setPosts } from '@/redux/reducers/posts';
import Image from 'next/image';
import PostForm from './utils/PostForm';

export default function FacebookTab() {

  // React states
  const [isSubmitting, setIsSubmitting] = useState(false);
  // React states

  const dispatch = useDispatch();

  // Redux States
  const tab = useSelector((state: {tab: any}) => state.tab);
  const page = useSelector((state: {page: any}) => state.page);
  const time = useSelector((state: {time: any}) => state.time);
  const posts = useSelector((state: {posts: any}) => state.posts);
  // Redux States


  const handlePostDelete = (event: any) => {
    if (confirm("Are you sure you want to delete this post")) {
        setIsSubmitting(true)
        const headers = {
          pageid: page.id,
          postid: event.target.value,
        };
        axios.delete('/api/facebook', { headers })
        .then(function (response:{data: any}) {
          console.log(response.data);
        const headers = {
          pageid: page.id,
          time: JSON.stringify(time),
        };
          axios.get('/api/facebook', { headers })
            .then(function (response:{data: any}) {
              dispatch(setPosts(response.data.posts));
              setIsSubmitting(false)
            })
            .catch(function (error: {}) {
              console.log(error);
            })
        })
        .catch(function (error: {}) {
          console.log(error);
        })
    } else {
      return;
    }
  }

    useEffect(() => {
    const headers = {
      pageid: page.id,
      time: JSON.stringify(time),
    };
    if (page.name) {
      axios.get('/api/facebook', { headers })
        .then(function (response:{data: any}) {
          dispatch(setPosts(response.data.posts));
        })
        .catch(function (error: {}) {
          console.log(error);
        }).finally(function () {
          dispatch(endPageRequest());
        })
    }
  }, [page, time]);

  return (
    <div className={` w-full ${tab.name === 'Content Management'? 'visible' : 'hidden'}`}>
      <div className={page.status? 'm-5 bg-white rounded-xl mx-auto w-11/12 shadow-xl text-black py-5 hidden':'m-5 bg-white rounded-xl mx-auto w-11/12 shadow-xl text-black py-5'}>
        <div role="status" className='flex justify-center'>
          <div>
            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </div>
          <h1 className="text-black font-medium">Loading...</h1>
        </div>
      </div>
      <div className={page.status? 'm-5 bg-white rounded-xl mx-auto w-11/12 shadow-xl text-black py-5':'m-5 bg-white rounded-xl mx-auto w-11/12 shadow-xl text-black py-5 hidden'}>
        <CmDropDown />
        <div className='flex justify-around'>
          <div className='w-1/3 m-5 p-2 bg-white shadow-2xl  rounded-xl'>
            <PostForm />
          </div>
          <div className='relative w-1/2 m-5 bg-white shadow-2xl rounded-xl max-h-200 '>
            {
              isSubmitting === true?
              <div className='flex justify-center flex-col absolute w-full opacity-50 bg-white rounded-xl h-costume backdrop-blur-md'>
                <div className='mx-auto'>
                  <svg aria-hidden="true" className="w-20 h-20 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                </div>
              </div>
              :
              ''
            }
            <div className="overflow-auto h-costume">
              <div className="flex flex-wrap items-center">
                {posts.map((el: { id: string, full_picture: string, updated_time:string, message: string, permalink_url:string }) => {
                  const strDate = el.updated_time;
                  const date = new Date(strDate)
                  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: false};
                  const formattedDate = date.toLocaleString('en-US', options);
                  return (
                    <div key={el.id} className="px-2 pb-4 rounded-xl bg-looksLikeWhite m-2 w-5/10.5 shadow-lg ">
                      <div className='flex justify-between'>
                        <h1 className='text-left my-5 font-semibold text-sm bg-white p-2 rounded-xl shadow-[inset_0_4px_4px_rgba(0.1,0.1,0.1,0.1)]'>{formattedDate}</h1>
                        <button disabled={isSubmitting} value={el.id} onClick={handlePostDelete} className=' bg-red-500 hover:bg-red-700 text-sm font-medium my-5 rounded-xl p-2 text-white'>Delete Post</button>
                      </div>
                      {
                        el.full_picture ?
                        <a href={el.permalink_url} target='_blank'>
                          <Image src={el.full_picture}
                          alt="facebook post picture"
                          width={200} height={200}
                          className='mx-auto border rounded-xl '
                          />
                        </a>
                        :
                        ''
                      }
                      {
                        el.message ?
                        <a href={el.permalink_url} target='_blank'>
                          <h1 className='text-center mt-5 font-semibold bg-white p-2 rounded-xl shadow-[inset_0_4px_4px_rgba(0.1,0.1,0.1,0.1)]'>{el.message}</h1>
                        </a>
                        :
                        ''
                      }    
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
