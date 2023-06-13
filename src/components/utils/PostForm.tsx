import { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

export default function PostForm() {
    const [selectedFile, setSelectedFile] = useState(null);


    // Redux States
    const page = useSelector((state: {page: any}) => state.page);
    // Redux States

    const handleFileChange = (event: any) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            // Upload the image and post to Facebook API in a single request
            await axios.post('/api/facebook', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    pageid: page.id
                },
            });

            console.log('Post uploaded successfully');
        } catch (error) {
            console.error('Error uploading post', error);
        }
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" name="image" onChange={handleFileChange} />
        <button type="submit">Upload and Post</button>
        </form>
    );
}
