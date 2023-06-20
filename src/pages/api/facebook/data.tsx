import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import dbClient from '../../../utils/db';


export default withApiAuthRequired(async function myApiRoute(req, res) {
  // @ts-ignore
    const { user } = await getSession(req, res);

    if (req.method === 'GET') {
        const axios = require('axios');
        const url = 'https://graph.facebook.com/v17.0'
        const {pageid} = req.headers as { [key: string]: string };
        const cursor = await dbClient.getUser(user.sub)

        if (cursor) {
            const dbUser = cursor[0]
            const page = dbUser.facebookApi.pages.find((el: {id: string}) => el.id === pageid )
            const token = page.access_token

            try {
                const commentsRes = await axios.get(
                    `${url}/${pageid}/posts?fields=comments{created_time,message,user_likes,permalink_url}&access_token=${token}`
                );

                const comments = commentsRes.data.data.filter((obj: any ) => obj.comments);

                const messagesRes = await axios.get(
                    `${url}/${pageid}/conversations?fields=messages{message,from,created_time},participants&access_token=${token}`
                );

                const dbDataCursor = await dbClient.getData(user.sub)
                const dbData = dbDataCursor[0]
                const pageData = dbData.pages.find((el: {id: string}) => el.id === pageid )
                
                return res.status(200).json({ messages: messagesRes.data.data, comments, pageData});
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'An error occurred while fetching data' });
            }
        }
    return res.status(400)
    }
});
