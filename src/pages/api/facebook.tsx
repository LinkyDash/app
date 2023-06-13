import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import dbClient from '../../utils/db';
const axios = require('axios');


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
        const {fileurl, pageid, text} = req.headers as { [key: string]: string };
        const cursor = await dbClient.getUser(user.sub);
        const dbUser = cursor[0];
        const page = dbUser.facebookApi.pages.filter((el: any) => el.id === pageid)
        const token = page[0].access_token
        console.log(fileurl, pageid);

        if (fileurl && text) {
            await axios.post(
            `https://graph.facebook.com/v17.0/${pageid}/photos?url=${fileurl}&message=${text}&access_token=${token}`
            ).then(function (response:{data: any}) {
                res.status(200).json({ success: true });
            }).catch(function (error: {}) {
                console.log(error);
                res.status(500).json({ error: 'An error occurred while uploading the post to facebook' });
            })
        } else if (fileurl) {
            await axios.post(
            `https://graph.facebook.com/v17.0/${pageid}/photos?url=${fileurl}&access_token=${token}`
            ).then(function (response:{data: any}) {
                res.status(200).json({ success: true });
            }).catch(function (error: {}) {
                console.log(error);
                res.status(500).json({ error: 'An error occurred while uploading the post to facebook' });
            })
        } else if (text){
            await axios.post(
            `https://graph.facebook.com/v17.0/${pageid}/feed?message=${text}&access_token=${token}`
            ).then(function (response:{data: any}) {
                res.status(200).json({ success: true });
            }).catch(function (error: {}) {
                console.log(error);
                res.status(500).json({ error: 'An error occurred while uploading the post to facebook' });
            })
        }
    } else {
        // Handle unsupported HTTP methods
        res.status(405).json({ error: 'Method Not Allowed' });
    }

});

