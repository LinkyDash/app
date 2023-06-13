import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Inter } from 'next/font/google';
import page, { setPage, endPageRequest, requestPageData} from '../../redux/reducers/page';
import { setDate} from '../../redux/reducers/time';

const inter = Inter({
    weight: ['400', '500', '800'],
    subsets: ['latin']
});

export default function DropDowns() {

    const pages = useSelector((state: {pages: any}) => state.pages);
    const page = useSelector((state: {page: any}) => state.page);
    const time = useSelector((state: {time: any}) => state.time);
    const dispatch = useDispatch();

    const handleTimeSelect = (event: {target: any}) => {
        const selectedOption = event.target.value;
        dispatch(requestPageData());
        dispatch(setDate(selectedOption));
        
    };

    const handlePageSelect = (event: {target: any}) => {
        const selectedOption = event.target.value;
        dispatch(requestPageData());
        dispatch(setPage(JSON.parse(selectedOption)));
    };



    return (
    <div className={`${inter.className} visible flex justify-between m-5`}>
        <div className=''>
            <div className="relative w-full lg:max-w-sm">
                    <select
                        className="w-full p-3 font-medium text-gray-800 border rounded-xl shadow-xl focus:border-purple-800 cursor-pointer bg-looksLikeWhite"
                        onChange={handlePageSelect}
                    >
                    <option className='hidden'>{page.name}</option>
                    {
                        pages.status === false ?
                        <option>Loading...</option>
                        :
                        pages.data.map((el: {name: string, id: string}) =>{
                            return <option key={el.id} value={JSON.stringify(el)}>{el.name}</option>
                        })
                    }
                </select>
            </div>
        </div>
        <div className=''>
            <div className="relative w-full lg:max-w-sm">
                    <select
                        className="w-full p-3 font-medium text-gray-800 border rounded-xl shadow-xl focus:border-purple-800 cursor-pointer bg-looksLikeWhite"
                        onChange={handleTimeSelect}
                    >
                    <option className='hidden'>{time.name}</option>
                    <option value="today">Today</option>
                    <option value="7days">Past 7 Days</option>
                    <option value="30days">Past 30 Days</option>
                    <option value="60days">Past 60 Days</option>
                    <option value="90days">Past 90 Days</option>
                </select>
            </div>
        </div>
    </div>
    )
}
