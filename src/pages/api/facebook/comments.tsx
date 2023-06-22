import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import dbClient from '../../../utils/db';

export default withApiAuthRequired(async function myApiRoute(req, res) {
    try {
        //@ts-ignore
        const { user } = await getSession(req, res);
        const api = 'https://graph.facebook.com/v17.0';
        const axios = require('axios');

        if (req.method === 'POST') {
        const { pageid, comment, message, sentiment } = req.headers as { [key: string]: string };
        const cursor = await dbClient.getUser(user.sub);

        if (cursor) {
            const dbUser = cursor[0];
            const page = dbUser.facebookApi.pages.find((el: { id: string }) => el.id === pageid);
            const token = page.access_token;
            const commentObj = JSON.parse(comment);

            let url = `${api}/${commentObj.id}/comments?message=${message}&access_token=${token}`;
            const response = await axios.post(url);
            const data = {
            ...commentObj,
            replyid: response.data.id,
            reply: message,
            sentiment: Number(sentiment)
            };
            const dbAdd = await dbClient.addComment(user.sub, pageid, data);

            if (dbAdd) {
            return res.status(200).json({ success: true });
            } else {
            throw new Error("The database returned false");
            }
        }
        } else if (req.method === 'PUT') {
        const { pageid, commentid, action } = req.headers as { [key: string]: string };
        const cursor = await dbClient.getUser(user.sub);

        if (cursor) {
            const dbUser = cursor[0];
            const page = dbUser.facebookApi.pages.find((el: { id: string }) => el.id === pageid);
            const token = page.access_token;

            if (action === 'false') {
            await axios.post(`${api}/${commentid}/likes?access_token=${token}`);
            return res.status(200).json({ success: true });
            } else {
            await axios.delete(`${api}/${commentid}/likes?access_token=${token}`);
            return res.status(200).json({ success: true });
            }
        }
        } else if (req.method === 'DELETE') {
        const { pageid, commentid } = req.headers as { [key: string]: string };
        const cursor = await dbClient.getUser(user.sub);

        if (cursor) {
            const dbUser = cursor[0];
            const page = dbUser.facebookApi.pages.find((el: { id: string }) => el.id === pageid);
            const token = page.access_token;

            let url = `${api}/${commentid}?access_token=${token}`;
            await axios.delete(url);

            const dbRemove = await dbClient.deleteComment(user.sub, pageid, commentid);
            if (dbRemove) {
            return res.status(200).json({ success: 'Comment deleted successfully' });
            } else {
            throw new Error("The database returned false");
            }
        }
        } else {
        return res.status(400).json({ error: 'Bad request' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});
