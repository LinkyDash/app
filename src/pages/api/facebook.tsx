import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import dbClient from '../../utils/db';
const axios = require('axios');


export default withApiAuthRequired(async function myApiRoute(req: any, res) {
  // @ts-ignore
    const { user } = await getSession(req, res);

    if (req.method === 'GET') {
        const axios = require('axios');
        const url = 'https://graph.facebook.com/v13.0'
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
                    `${url}/${pageid}/feed?fields=updated_time,message,id,is_published,full_picture,permalink_url,reactions{id},likes{id}&is_published=false&access_token=${token}`
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
    } else if (req.method === 'POST') {
        const {fileurl, pageid, text, scheduledate} = req.headers as { [key: string]: string };
        const cursor = await dbClient.getUser(user.sub);
        const dbUser = cursor[0];
        const page = dbUser.facebookApi.pages.filter((el: any) => el.id === pageid)
        const token = page[0].access_token
        
        if (fileurl && text) {
            let url = `https://graph.facebook.com/v17.0/${pageid}/photos?url=${fileurl}&message=${text}&access_token=${token}`;
            await axios.post(url).then(function (response:{data: any}) {
                return res.status(200).json({ success: true });
            }).catch(function (error: {}) {
                console.log(error);
                res.status(500).json({ error: 'An error occurred while uploading the post to facebook' });
            })
        } else if (fileurl) {
            let url = `https://graph.facebook.com/v17.0/${pageid}/photos?url=${fileurl}&access_token=${token}`;
            await axios.post(url).then(function (response:{data: any}) {
                return res.status(200).json({ success: true });
            }).catch(function (error: {}) {
                console.log(error);
                res.status(500).json({ error: 'An error occurred while uploading the post to facebook' });
            })
        } else if (text){
            let url = `https://graph.facebook.com/v17.0/${pageid}/feed?message=${text}&access_token=${token}`;
            if (scheduledate) {
                url = `https://graph.facebook.com/v17.0/${pageid}/feed?published=false&message=${text}&access_token=${token}&scheduled_publish_time=${scheduledate}`;
            }
            await axios.post(url).then(function (response:{data: any}) {
                return res.status(200).json({ success: true });
            }).catch(function (error: {}) {
                console.log(error);
                res.status(500).json({ error: 'An error occurred while uploading the post to facebook' });
            })
        } else {
            return res.status(400).json({ error: 'Invalid request' });
        }
    } else if (req.method === 'DELETE') {
        const {pageid, postid} = req.headers as { [key: string]: string };
        const cursor = await dbClient.getUser(user.sub);
        const dbUser = cursor[0];
        const page = dbUser.facebookApi.pages.filter((el: any) => el.id === pageid)
        const token = page[0].access_token
        if (pageid && postid) {
            await axios.delete(
            `https://graph.facebook.com/v17.0/${postid}?access_token=${token}`
            ).then(function (response:{data: any}) {
                return res.status(200).json({ success: true });
            }).catch(function (error: {}) {
                console.log(error);
                return res.status(500).json({ error: 'An error occurred while deleting the post from facebook' });
            })
        }
    } else {
    // Handle unsupported HTTP methods
    return res.status(405).json({ error: 'Method Not Allowed' });
}
});

