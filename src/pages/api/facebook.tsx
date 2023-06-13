import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import dbClient from '../../utils/db';


export default withApiAuthRequired(async function myApiRoute(req, res) {
  // @ts-ignore
    const { user } = await getSession(req, res);

    if (req.method === 'GET') {
        const axios = require('axios');
        const url = 'https://graph.facebook.com/v17.0'
        const {pageid, time} = req.headers;
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
                console.log(posts)
                return res.status(200).json({ posts });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'An error occurred while fetching Posts' });
            }
        }
    return res.status(400)
    }
});

