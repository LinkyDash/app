import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import dbClient from '../../utils/db';
const axios = require('axios');

interface Page {
    name: string;
    id: string;
    link: string;
    about: string;
    picture: string;
}

export default withApiAuthRequired(async function myApiRoute(req, res) {
    try {
    // @ts-ignore
        const { user } = await getSession(req, res);
        const url = 'https://graph.facebook.com/v17.0/'
        if (req.method === 'GET') {
            const cursor = await dbClient.getUser(user.sub)
            
            if (cursor) {
                const dbUser = cursor[0]
                const token = dbUser.facebookApi.accessToken
                axios.get(`${url}me/accounts?fields=about,access_token,description,link,name,picture&access_token=${token}`)
                    .then(function (response:{data: any}) {
                        const data: { pages: Page[] } = { pages: [] };
                        response.data.data.forEach((el: any) => {
                            data.pages.push({
                                name: el.name,
                                id: el.id,
                                link: el.link,
                                about: el.about,
                                picture: el.picture.data.url
                            })
                        });
                        res.status(200).json(data)
                    })
                    .catch(function (error: {}) {
                    console.log(error);
                    })
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