import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import dbClient from '../../../utils/db';

export default withApiAuthRequired(async function myApiRoute(req, res) {
    try {
        //@ts-ignore
        const { user } = await getSession(req, res);
        const api = 'https://graph.facebook.com/v17.0';
        const axios = require('axios');

        if (req.method === 'POST') {
            const { pageid, userid, message } = req.headers as { [key: string]: string };
            const cursor = await dbClient.getUser(user.sub);

            if (cursor) {
                const dbUser = cursor[0];
                const page = dbUser.facebookApi.pages.find((el: { id: string }) => el.id === pageid);
                const token = page.access_token;

                let url = `${api}/${pageid}/messages?recipient={id:${userid}}&messaging_type=RESPONSE&message={text:'${message}'}&access_token=${token}`;
                axios.post(url)
                .then((response: any) => {
                    res.status(200).json(response.data);
                }).catch((error: any) => {
                    console.log(error);
                })

            } else {
                res.status(500).json({ error: 'An error occurred getting the user' });
            }
        } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }finally {
        /* await dbClient.close(); */
    }
});
