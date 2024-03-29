import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import DropDowns from './utils/DropDowns';
import { setPage, endPageRequest } from '@/redux/reducers/page';
import { updatePages } from '@/redux/reducers/pages';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {

  const dispatch = useDispatch();

  // React states
  const [insight, setInsight] = useState({
    messages: null,
    comments: null,
    posts: null,
    impressions: null,
    sentiments: [],
  })
  // React states

  // Redux States
  const tab = useSelector((state: {tab: any}) => state.tab);
  const page = useSelector((state: {page: any}) => state.page);
  const time = useSelector((state: {time: any}) => state.time);
  const pages = useSelector((state: {pages: any}) => state.pages);
  // Redux States

  const chartData = {
    labels: [],
    datasets: [
      {
        data: [-1, 0, 1].map(sentiment => ((insight.sentiments.filter(value => value === sentiment).length / insight.sentiments.length) * 100)),
        backgroundColor: ['#eb5649', '#2cde44', '#9d9e9d'],
      },
    ],
  };

  const chartOptions = {
    responsive: true
  }

  useEffect(() => {
    const headers = {
      pageid: page.id,
      time: JSON.stringify(time),
    };
    if (page.name) {
      axios.get('/api/insight', { headers })
        .then(function (response:{data: any}) {
          setInsight(response.data);
        })
        .catch(function (error: {}) {
          console.log(error);
        }).finally(function () {
          dispatch(endPageRequest());
        })
    }
  }, [page, time]);

  return (
    <div className={` w-full ${tab.name === 'Home'? 'visible' : 'hidden'} `}>
      
      <div className={page.status? 'm-5 bg-white rounded-xl mx-auto w-11/12 shadow-xl text-black py-5 hidden':'m-5 bg-white rounded-xl mx-auto w-11/12 shadow-xl text-black py-5'}>
        <div role="status" className='flex flex-col justify-center'>
          <div className='flex justify-center'>
            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <h1 className="text-black font-medium">Loading...</h1>
          </div>
          
          <h1 className="text-black font-medium mx-auto">Pleas make sure an API is properly configured</h1>
        </div>
      </div>
      <div className={page.status? 'm-5 bg-white rounded-xl mx-auto w-11/12 shadow-xl text-black py-5':'m-5 bg-white rounded-xl mx-auto w-11/12 shadow-xl text-black py-5 hidden'}>
        <DropDowns />
        <div className='p-2'>
          <div className='flex justify-around mb-8'>
            <div className='m-2 p-2 rounded-lg bg-looksLikeWhite shadow-xl w-1/6'>
              <h1 className='text-left font-medium text-xl w-full border-b-2 p-2 border-gray-400'>Messages</h1>
              <h1 className='text-center text-2xl font-bold p-5'>{insight.messages}</h1>
              <h1 className='text-center text-md font-medium mb-8'>The total number of messages received</h1>

            </div>
            <div className='m-2 p-2 rounded-lg bg-looksLikeWhite shadow-xl w-1/6'>
              <h1 className='text-left font-medium text-xl w-full border-b-2 p-2 border-gray-400'>Comments</h1>
              <h1 className='text-center text-2xl font-bold p-5'>{insight.comments}</h1>
              <h1 className='text-center text-md font-medium mb-8'>The total number of comments received</h1>

            </div>
            <div className='m-2 p-2 rounded-lg bg-looksLikeWhite shadow-xl w-1/6'>
              <h1 className='text-left font-medium text-xl w-full border-b-2 p-2 border-gray-400'>New Posts</h1>
              <h1 className='text-center text-2xl font-bold p-5'>{insight.posts}</h1>
              <h1 className='text-center text-md font-medium mb-8'>The total number of posted posts</h1>

            </div>
            <div className='m-2 p-2 rounded-lg bg-looksLikeWhite shadow-xl w-1/6'>
              <h1 className='text-left font-medium text-xl w-full border-b-2 p-2 border-gray-400'>Impressions</h1>
              <h1 className='text-center text-2xl font-bold p-5'>{insight.impressions}</h1>
              <h1 className='text-center text-md font-medium mb-8'>The total number of impressions</h1>

            </div>
          </div>
          <div className='flex'>
            <div className='m-2 p-2 rounded-lg bg-looksLikeWhite shadow-xl ml-20 w-2/5'>
              <h1 className='text-left font-medium text-xl w-full border-b-2 p-2 border-gray-400'>Audience Sentiment Status</h1>
              <div className=' flex m-5 p-5 rounded-lg bg-white text-center h-72'>
                {
                  insight.sentiments.length > 0?
                  <div className='flex'>
                    <div className='1/3'>
                      <Doughnut data={chartData} options={chartOptions}/>
                    </div>
                    <div className='w-2/3'>
                      <div className='p-5 flex mx-auto w-1/'>
                        <div className='bg-red-400 w-8 h-8 rounded-lg'></div>
                        <h1 className='ml-5 font-bold text-lg'>Negative Interactions</h1>
                      </div>
                      <div className='p-5 flex mx-auto'>
                        <div className='bg-green-400 w-8 h-8 rounded-lg'></div>
                        <h1 className='ml-5 font-bold text-lg'>Positive Interactions</h1>
                      </div>
                      <div className='p-5 flex mx-auto'>
                        <div className='bg-gray-400 w-8 h-8 rounded-lg'></div>
                        <h1 className='ml-5 font-bold text-lg'>Neutral Interactions</h1>
                      </div>
                    </div>
                  </div>
                  :
                  <h1 className='text-center font-bold w-full text-3xl'>No Data Available</h1>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
