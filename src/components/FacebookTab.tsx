import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import CmDropDowns from './utils/CmDropDown';
import axios from 'axios';
import { setPage, endPageRequest } from '@/redux/reducers/page';
import { stringify } from 'querystring';


export default function FacebookTab() {


  const dispatch = useDispatch();

  // React States
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState({ id: false})
  const [conversation, setConversation] = useState({id: false, messages: {data: []}})
  const [messages, setMessages] = useState([])
  const [pageData, setPageData] = useState({comments: []})
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  // React States

  // Redux States
  const tab = useSelector((state: {tab: any}) => state.tab);
  const page = useSelector((state: {page: any}) => state.page);
  // Redux States

  //UI functions
  const handleCommentSelect = (el: any) => {
    setComment(el);
  }

  const handleConvSelect = (el: any) => {
    setConversation(el);
  }
  
  const handleCommentSubmit = (event: any) => {
    event.preventDefault();
    if (!isLoading) {
      setIsLoading(true);
      axios.post('/api/facebook/comments', null, {
            headers: {
              pageid: page.id,
              comment: JSON.stringify(comment),
              message: text,
            },
          })
        .then((res) => {
          console.log(res.data)
          setText('')
          const headers = {
            pageid: page.id,
          };
          if (page.name) {
            axios.get('/api/facebook/data', { headers })
              .then(function (response:{data: any}) {
                console.log(response.data);
                setMessages(response.data.messages)
                setPageData(response.data.pageData.data)
                setComments(response.data.comments)
              })
              .catch(function (error: {}) {
                console.log(error);
                setIsLoading(false)
              })
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  const handleLike = (bool: boolean, id: string) => {
    console.log({bool, id});
    if (!isLoading) {
      setIsLoading(true);
      axios.put('/api/facebook/comments', null, {
            headers: {
              pageid: page.id,
              commentid: id,
              action: `${bool}`
            },
          })
        .then((res) => {
          const headers = {
            pageid: page.id,
          };
          if (page.name) {
            axios.get('/api/facebook/data', { headers })
              .then(function (response:{data: any}) {
                setMessages(response.data.messages)
                setPageData(response.data.pageData.data)
                setComments(response.data.comments)
              })
              .catch(function (error: {}) {
                console.log(error);
              })
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  const handleReplyDelete = (id: string) => {
    if (!isLoading) {
      setIsLoading(true);
      axios.delete('/api/facebook/comments', {
            headers: {
              pageid: page.id,
              commentid: id,
            },
          })
        .then((res) => {
          const headers = {
            pageid: page.id,
          };
          axios.get('/api/facebook/data', { headers })
            .then(function (response:{data: any}) {
              setMessages(response.data.messages)
              setPageData(response.data.pageData.data)
              setComments(response.data.comments)
            })
            .catch(function (error: {}) {
              console.log(error);
              setIsLoading(false)
            })
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false)
        })
    }
  }

    const handleTextChange = (event: any) => {
        setText(event.target.value);
    };
  //UI functions


    useEffect(() => {
    const headers = {
      pageid: page.id,
    };
    if (page.status) {
      axios.get('/api/facebook/data', { headers })
        .then(function (response:{data: any}) {
          setMessages(response.data.messages)
          setPageData(response.data.pageData.data)
          setComments(response.data.comments)
        })
        .catch(function (error: {}) {
          console.log(error);
          setIsLoading(false)
        }).finally(function () {
          dispatch(endPageRequest());
          setIsLoading(false);
        })
    }
  }, [page]);

  return (
    <div className={` w-full ${tab.name === 'Facebook'? 'visible' : 'hidden'}`}>
      <div className={page.status? 'm-4 bg-white rounded-xl mx-auto w-11/12 shadow-xl text-black py-5 hidden':'m-4 bg-white rounded-xl mx-auto w-11/12 shadow-xl text-black py-5'}>
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
      <div className={page.status? 'm-2 relative bg-white rounded-xl mx-auto w-11/12 shadow-xl text-black py-5':'m-2 bg-white rounded-xl mx-auto w-11/12 shadow-xl text-black py-5 hidden'}>
        <div className={isLoading === false ? 'absolute left-1/2 top-1/2 hidden' : 'absolute left-1/2 top-1/2'}>
            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
        </div>
        <CmDropDowns />
        <div className={isLoading === false ? 'flex justify-between p-2' : 'flex justify-between p-2  opacity-50 cursor-not-allowed'}>
          <div className='w-1/3 mx-2  p-2 shadow-xl rounded-xl '>
            <h1 className='text-center font-bold text-xl'>Latest Comments</h1>
            <div className='h-costume2 overflow-auto'>
              {
                comments.map((el: any) => {
                  return el.comments.data.map((ell: any) => {
                    const existingComment = pageData.comments.find((elll: any) => ell.id === elll.id);
                    const strDate = ell.created_time;
                    const date = new Date(strDate)
                    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: false};
                    const formattedDate = date.toLocaleString('en-US', options);
                    if (existingComment) {
                      return null;
                    } else {
                      return (
                        <div onClick={() => handleCommentSelect(ell)} key={ell.id} className={`bg-looksLikeWhite p-2 m-2 rounded-lg cursor-pointer ${ell.id === comment.id ? 'border-2 border-blue-700' : ''}`}>
                          <div className='flex justify-between mx-2'>
                            <a target='a_blank' href={ell.permalink_url}>
                              <h1 className='text-left may-5 font-semibold text-sm rounded-xl bg-white p-2'>{formattedDate}</h1>
                            </a>
                            <button className={ell.user_likes === false ? 'p-2  rounded-xl bg-gray-400 my-4 hover:bg-gray-500 text-white font-bold' : 'p-2 rounded-xl bg-blue-500 my-4 hover:bg-red-600 text-white font-bold' }  onClick={() => { handleLike(ell.user_likes, ell.id) }}>
                              {ell.user_likes === false ? "Like" : "Liked"}
                            </button>
                          </div>
                          <h1 className='mx-2 p-2 bg-white rounded-xl shadow-[inset_0_4px_4px_rgba(0.1,0.1,0.1,0.1)]'>{ell.message}</h1>
                        </div>
                      );
                    }
                  });
                })
              }
            </div>
            <div>
              <form onSubmit={handleCommentSubmit} className='w-full flex flex-col'>
                <label className='text-center font-bold mt-2'> Select a Comment to Reply </label>
                <textarea value={text} required onChange={handleTextChange} className=' w-10/12  m-3 rounded-xl mx-auto border  h-20 max-h-20'/>
                <button disabled={isLoading} type="submit" className=' p-2 rounded-xl font-bold bg-blue-400 w-1/2 mx-auto text-white hover:bg-blue-500'>
                  {
                    isLoading === false ? 'Post Reply ' : 'Posting...'
                  }
                </button>
              </form>
            </div>
          </div>
          <div className='w-1/3 ml-2  p-2 shadow-xl rounded-xl '>
            <h1 className='text-center font-bold text-xl'>Latest Replies</h1>
            <div className='h-costume2 overflow-auto'>
              {
                pageData.comments.map((el: any) => {
                  const strDate = el.created_time;
                  const date = new Date(strDate)
                  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: false};
                  const formattedDate = date.toLocaleString('en-US', options);
                  return <div key={el.id} className={`bg-looksLikeWhite p-2 m-2 rounded-lg cursor-pointer `}>
                    <h1 className='m-2 p-1 bg-white rounded-xl w-fit font-medium'>{formattedDate}</h1>
                    <h1 className='m-2 p-2 bg-white rounded-xl shadow-[inset_0_4px_4px_rgba(0.1,0.1,0.1,0.1)]' key={el.id}>{el.message}</h1>
                    <div className='flex bg-white rounded-xl mx-2 border'>
                      <h1 className='mx-2 p-2  w-3/4'>{el.reply}</h1>
                      <button className='w-1/6 bg-red-500 rounded-xl m-2 p-2 font-bold text-white hover:bg-red-600' onClick={()=>{handleReplyDelete(el.replyid)}}> Delete </button>
                    </div>
                  </div>
                })
              }
            </div>
          </div>
          <div className='w-1/2 mx-2  p-2 shadow-xl rounded-xl '>
            <h1 className='text-center font-bold text-xl'>Conversations</h1>
            <div className='flex h-costume2 overflow-auto'>
              <div className=' w-1/3 overflow-scroll rounded-xl border-r-2'>
              {  messages.map((el: any) => {
                  return <h1 key={el.id} onClick={() => handleConvSelect(el)} className={`${conversation.id === el.id ? 'border-2 border-blue-600' : '' } cursor-pointer shadow-xl text-center p-2 m-2 bg-white rounded-xl`}>{el.participants.data[0]['name']}</h1>
                })}
              </div>
              <div className='w-2/3 flex flex-col-reverse overflow-scroll rounded-xl'>
                {
                  conversation.messages.data.map((el:any) =>{
                    return <h1
                    className={`${el.from.name === page.name? 'text-right self-end bg-blue-400' : 'text-left self-start bg-red-300'} w-1/2 p-2 m-2 text-white font-medium rounded-xl shadow-xl`}
                    key={el.id}>
                    {el.message}
                    </h1>
                  })
                }
              </div>
            </div>
            <textarea className='border'></textarea>
            <button onClick={() => {console.log(conversation)}}>Log Messages</button>
          </div>
        </div>
      </div>
    </div>
  )
}
