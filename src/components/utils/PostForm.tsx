import { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { setPosts } from '@/redux/reducers/posts';

export default function PostForm() {

    // React States
    const [fileUrl, setFileUrl] = useState('');
    const [postType, setPostType] = useState('image');
    const [text, setText] = useState('');
    const [date, setDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDateRequired, setIsDateRequired] = useState(false);
    // React States

    const dispatch = useDispatch();

    // Redux States
    const page = useSelector((state: {page: any}) => state.page);
    const time = useSelector((state: {time: any}) => state.time);
    // Redux States

    const handleFileChange = (event: any) => {
        setFileUrl(event.target.value);
    };

    function getCurrentDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let mth = currentDate.getMonth() + 1;
    let dy = currentDate.getDate();
    let hr = currentDate.getHours();
    let mt = currentDate.getMinutes();

    // Format month, day, hour, and minute to have leading zeros if necessary
    const month = mth.toString().padStart(2, '0');
    const day = dy.toString().padStart(2, '0');
    const hour = hr.toString().padStart(2, '0');
    const minute = mt.toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}`;
    }

    const handleTextChange = (event: any) => {
        setText(event.target.value);
    };

    const handleDateChange = (event: any) => {
        setDate(event.target.value);
        console.log(event.target.value);
        
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (!isLoading) {
            setIsLoading(true);
            try {
                // Upload the image and post to Facebook API in a single request
                await axios.post('/api/facebook', null, {
                    headers: {
                        fileurl: fileUrl,
                        pageid: page.id,
                        text: text,
                        scheduledate: date,
                    },
                });

                setFileUrl('')
                setText('')
                setDate('')
                setIsDateRequired(false)
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
                setText('')
                setDate('')
                setIsDateRequired(false)
                setIsLoading(false);
                alert("Invalid Media Url")
                console.error('Error uploading post', error);
            }
        }
    };

    const handleClick = (event: any) => {
        setPostType(event.target.value)
    }

const handleCheckboxChange = (event: any) => {
    setIsDateRequired(event.target.checked);
};

    return (
        <div >
            {
                page.picture?
                <div className='flex p-5 mb-2'>
                    <Image width={50}  height={50} alt='page-profile-image' src={page.picture} className='rounded-full border'/>
                    <h1 className='flex flex-col justify-center pl-5 text-xl font-medium'>{page.name}</h1>
                </div>
                :
                ''
            }

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
                    <label className='pl-2'>Post Text</label>
                    <textarea value={text} onChange={handleTextChange} className='m-3 rounded-md border mt-1 h-8 pl-2 max-h-72'/>
                </div>
                :
                <div className='flex flex-col mx-8'>
                    <label className='pl-2'>Post Text</label>
                    <textarea value={text} required onChange={handleTextChange} className='m-3 rounded-md border mt-1 h-8 pl-2 max-h-72'/>
                    <div className='border p-2 rounded-xl'>
                    <label className='block'>
                        <input
                        type="checkbox"
                        checked={isDateRequired}
                        onChange={handleCheckboxChange}
                        className='mr-2 mb-3'
                        />
                        Schedule Post
                    </label>
                        <input className={!isDateRequired? 'bg-looksLikeWhite p-1 rounded-md opacity-40' : 'bg-looksLikeWhite p-1 rounded-md'} disabled={!isDateRequired} value={date || ''} required={isDateRequired} min={getCurrentDateTime()} onChange={handleDateChange} type="datetime-local" />
                    </div>  
                </div>
            }

            <button disabled={isLoading} type="submit" className={` text-white font-semibold p-3 rounded-lg w-1/3 mx-auto mt-5 ${isLoading? 'bg-red-200 hover:bg-red-200 cursor-not-allowed':'bg-green-600 hover:bg-green-700'}`}>
                {isLoading ? 'Processing...' : 'Post'}
            </button>
            </form>
        </div>
    );
}
