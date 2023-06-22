import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Inter } from 'next/font/google';
import { setPage, endPageRequest, requestPageData} from '../../redux/reducers/page';

const inter = Inter({
    weight: ['400', '500', '800'],
    subsets: ['latin']
});

export default function CmDropDowns() {

    const pages = useSelector((state: {pages: any}) => state.pages);
    const page = useSelector((state: {page: any}) => state.page);
    const dispatch = useDispatch();

    const handlePageSelect = (event: {target: any}) => {
        const selectedOption = event.target.value;
        dispatch(requestPageData());
        dispatch(setPage(JSON.parse(selectedOption)));
    };



    return (
    <div className={`${inter.className} visible flex flex-start mt-0 m-3 mx-5`}>
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
    </div>
    )
}
