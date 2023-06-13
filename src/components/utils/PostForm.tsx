import { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { setPosts } from '@/redux/reducers/posts';

export default function PostForm() {
    const [fileUrl, setFileUrl] = useState('');
    const [postType, setPostType] = useState('image');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    // Redux States
    const page = useSelector((state: {page: any}) => state.page);
    const time = useSelector((state: {time: any}) => state.time);
    // Redux States

    const handleFileChange = (event: any) => {
        setFileUrl(event.target.value);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (fileUrl && !isLoading) {
            setIsLoading(true);
            try {
                // Upload the image and post to Facebook API in a single request
                await axios.post('/api/facebook', null, {
                    headers: {
                        fileurl: fileUrl,
                        pageid: page.id,
                        type: postType,
                    },
                });

                setFileUrl('')
                setIsLoading(false);

                const headers = {
                pageid: page.id,
                time: JSON.stringify(time),
                };

                axios.get('/api/facebook', { headers })
                    .then(function (response:{data: any}) {
                    dispatch(setPosts(response.data.posts));
                    })
                    .catch(function (error: {}) {
                    console.log(error);
                    })
            } catch (error) {
                setFileUrl('')
                setIsLoading(false);
                alert("Invalid Media Url")
                console.error('Error uploading post', error);
            }
        }
    };

    const handleClick = (event: any) => {
        setPostType(event.target.value)
    }

    return (
        <div>
            <div className='flex justify-between p-3 w-10/12 mx-auto'>
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
            <div className='flex justify-around w-1/2 mx-auto p-5'>
                <button onClick={handleClick} value={'image'} className={postType === 'image'? 'bg-looksLikeWhite p-2 m-2 border-2 border-blue-700 rounded-xl w-1/2 shadow-md font-medium':'w-1/2 bg-white p-2 m-2 border rounded-xl font-medium'}>Image</button>
                <button onClick={handleClick} value={'text'} className={postType === 'text'? 'bg-looksLikeWhite p-2 m-2 border-2 border-blue-700 rounded-xl w-1/2 shadow-md font-medium':'w-1/2 bg-white p-2 m-2 border rounded-xl font-medium'}>Text</button>
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className='flex flex-col mt-5'>
            {
                postType === 'image' ?
                <div className='flex flex-col mx-8'>
                    <label className='pl-2'>Media URL</label>
                    <input value={fileUrl} required type="text" onChange={handleFileChange} className='m-3 w-1/2 rounded-md border mt-1 h-8 pl-2'/>
                </div>
                :
                <div className='flex flex-col mx-8'>
                    <label className='pl-2'>Post Text</label>
                    <textarea value={fileUrl} required onChange={handleFileChange} className='m-3 rounded-md border mt-1 h-8 pl-2 max-h-72'/>
                </div>         
            }
            <button disabled={isLoading} type="submit" className={`bg-red-500 hover:bg-red-600 text-white font-semibold p-3 rounded-lg w-1/3 mx-auto mt-5 ${isLoading? 'bg-red-200 hover:bg-red-200 cursor-not-allowed':''}`}>
                {isLoading ? 'Uploading...' : 'Upload and Post'}
            </button>
            </form>
        </div>
    );
}
