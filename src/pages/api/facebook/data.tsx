import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import dbClient from '../../../utils/db';


export default withApiAuthRequired(async function myApiRoute(req, res) {
    try {
        if (req.method === 'GET') {
            // @ts-ignore
            const { user } = await getSession(req, res);
            const axios = require('axios');
            const url = 'https://graph.facebook.com/v17.0'
            const {pageid} = req.headers as { [key: string]: string };
            const cursor = await dbClient.getUser(user.sub)

            if (cursor) {
                const dbUser = cursor[0]
                const page = dbUser.facebookApi.pages.find((el: {id: string}) => el.id === pageid )
                const token = page.access_token
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
                
                res.status(200).json({ messages: messagesRes.data.data, comments, pageData});    
            } else {
                res.status(500).json({ error: 'An error occurred getting the user' });
            }
        } else {
            res.status(405).json({message: 'Method Not Allowed'})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    } finally {
        /* await dbClient.close(); */
    }
});
