import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import dbClient from '../../utils/db';


export default withApiAuthRequired(async function myApiRoute(req, res) {
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
                const impressionsRes = await axios.get(
                `${url}/${pageid}/insights?metric=${metrics}&access_token=${token}&since=${start}&until=${end}`
                );

                const commentsRes = await axios.get(
                    `${url}/${pageid}/posts?fields=comments{created_time}&access_token=${token}`
                );

                const postsRes = await axios.get(
                    `${url}/${pageid}/posts?&access_token=${token}&since=${start}&until=${end}`
                );

                const messagesRes = await axios.get(
                    `${url}/${pageid}/conversations?&access_token=${token}`
                );

                const comments = commentsRes.data.data.reduce((total: any, item: any) => {
                    if (item.comments && item.comments.data) {
                        const filteredComments = item.comments.data.filter((comment: any) => {
                        const commentTime = Math.floor(new Date(comment.created_time).getTime() / 1000);
                        return commentTime >= start && commentTime <= end;
                    });
                    return total + filteredComments.length;
                }
                return total;
                }, 0);

                const impressions = impressionsRes.data.data.reduce(
                (total: any, el: any) => total + el.values.reduce((sum: any, val: any) => sum + val.value, 0),
                0
                );

                const messages = messagesRes.data.data.filter(( el: any) => {
                    const messageTime = Math.floor(new Date(el.updated_time).getTime() / 1000);
                    return messageTime >= start && messageTime <= end;
                });

                const posts = postsRes.data.data.length
                
                return res.status(200).json({ impressions, comments, posts, messages: messages.length });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'An error occurred while fetching data' });
            }
        }
    return res.status(400)
    }
});

