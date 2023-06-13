import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import dbClient from '../../utils/db';
import fs from 'fs';
const path = require('path');

const axios = require('axios');
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (_req: any, file: any, cb: any) => cb(null, file.originalname),
});

const upload = multer({ storage });

export const config = {
    api: {
        bodyParser: false
    }
};

export default withApiAuthRequired(async function myApiRoute(req: any, res) {
  // @ts-ignore
    const { user } = await getSession(req, res);


    if (req.method === 'GET') {
        const axios = require('axios');
        const url = 'https://graph.facebook.com/v17.0'
        const {pageid, time} = req.headers as { [key: string]: string };
        const cursor = await dbClient.getUser(user.sub)

        if (cursor) {
            const dbUser = cursor[0]
            const page = dbUser.facebookApi.pages.find((el: {id: string}) => el.id === pageid )
            const token = page.access_token
            const metrics = 'page_impressions'
            const { start_date, end_date } = JSON.parse(time);
            const start = Math.floor(new Date(start_date).getTime() / 1000);
            const end = Math.floor(new Date(end_date).getTime() / 1000);


            try {

                const postsRes = await axios.get(
                    `${url}/${pageid}/posts?fields=updated_time,message,id,full_picture,permalink_url,reactions{id},likes{id}&access_token=${token}`
                );

                const posts = postsRes.data.data
                console.log("Posts Request")
                return res.status(200).json({ posts });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'An error occurred while fetching Posts' });
            }
        }
    return res.status(400)
    }

    if (req.method === 'POST') {
        const {pageid} = req.headers as { [key: string]: string };
        const cursor = await dbClient.getUser(user.sub);
        const dbUser = cursor[0];
        const page = dbUser.facebookApi.pages.filter((el: any) => el.id === pageid)
        const token = page[0].access_token

        upload.single('image')(req, res, async function (err: any) {
            if (err) {
                console.error('Error uploading file', err);
                return res.status(500).json({ error: 'An error occurred while uploading the file' });
            }

            try {
                const imagePath = req.file.path;
                const relativePath = path.basename(imagePath);
                const absoluteURL = `https://www.linkydash.com/${relativePath}`;
                console.log(absoluteURL);
                
                await axios.post(
                `https://graph.facebook.com/v17.0/${pageid}/photos?url=${absoluteURL}&access_token=${token}`
                ).then(function (response:{data: any}) {
                    res.status(200).json({ success: true });
                }).catch(function (error: {}) {
                    console.log(error);
                    res.status(500).json({ error: 'An error occurred while uploading the post to facebook' });
                }).finally( function (){
                    // Delete the temporary image file
                    fs.unlinkSync(imagePath);
                })
            } catch (error) {
                console.error('Error uploading post', error);
                res.status(500).json({ error: 'An error occurred while uploading the post' });
            }
        });
    } else {
        // Handle unsupported HTTP methods
        res.status(405).json({ error: 'Method Not Allowed' });
    }

});

