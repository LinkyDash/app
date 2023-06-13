import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import dbClient from '../../utils/db';

export default withApiAuthRequired(async function myApiRoute(req, res) {
  // @ts-ignore
  const { user } = await getSession(req, res);



  if (req.method === 'GET') {
    const cursor = await dbClient.getUser(user.sub)

    if (cursor) {
      const dbUser = cursor[0]
      const userObject = {
        id: dbUser.id,
        email: dbUser.email,
        userName: dbUser.userName,
        apiStatus: dbUser.apiStatus
      }

      console.log(userObject);
      return res.status(200).json(userObject);
    }
  }

  /* if (req.method === 'PUT') {
    const { 
      appid,
      appsecret,
      accesstoken,
      clientid
    } = req.headers

    if (!appid || !appsecret || !accesstoken || !clientid) {
      return res.status(400).send({error: 'Missing Header'});
    } else {
      const obj = {
        apiStatus: true,
        facebookApi : {
          appId: appid,
          appSecret: appsecret,
          accessToken: accesstoken,
          clientId: clientid
        }
      }

      const result: {} = await dbClient.update('users', user.sub, obj);
      if(result) {
        const cursor = await dbClient.getUser(user.sub)
        if (cursor) {
          const dbUser = cursor[0]
          const userObject = {
            id: dbUser.id,
            userName: dbUser.userName,
            email: dbUser.email,
            apiStatus: dbUser.apiStatus
          }

          console.log(userObject);
          return res.status(200).json(userObject);
        }
      }

    }
    return res.send(500);
  } */

  if (req.method === 'PUT') {
    const axios = require('axios');
    const url = 'https://graph.facebook.com/v17.0'
    const { appid, appsecret, accesstoken, clientid } = req.headers;

    if (!appid || !appsecret || !accesstoken || !clientid) {
      return res.status(400).send({ error: 'Missing Header' });
    } else {
      try {
        const longTermTokenResponse = await axios.get(
          `${url}/oauth/access_token`,
          {
            params: {
              grant_type: 'fb_exchange_token',
              client_id: appid,
              client_secret: appsecret,
              fb_exchange_token: accesstoken,
            },
          }
        );

        const longTermAccessToken = longTermTokenResponse.data.access_token;

        const accountsResponse = await axios.get(`${url}/me/accounts?access_token=${longTermAccessToken}`);

        const accounts = accountsResponse.data.data;

        const obj = {
          apiStatus: true,
          facebookApi: {
            appId: appid,
            appSecret: appsecret,
            accessToken: longTermAccessToken,
            clientId: clientid,
            pages: accounts,
          },
        };

        const result = await dbClient.update('users', user.sub, obj);
        if (result) {
          const cursor = await dbClient.getUser(user.sub);
          if (cursor) {
            const dbUser = cursor[0];
            const userObject = {
              id: dbUser.id,
              userName: dbUser.userName,
              email: dbUser.email,
              apiStatus: dbUser.apiStatus,
            };

            console.log(userObject);
            return res.status(200).json(userObject);
          }
        }
      } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Bad API credentials' });
      }
    }
    return res.status(500);
  }

  if (req.method === 'DELETE') {
    const obj = {
      apiStatus: false,
      facebookApi : {
        appID: null,
        appSecret: null,
        accessToken: null,
        clientId: null,
        pages: {}
      }
    }
    const result: {} = await dbClient.update('users', user.sub, obj);
    if(result) {
      const cursor = await dbClient.getUser(user.sub)
      if (cursor) {
        const dbUser = cursor[0]
        const userObject = {
          id: dbUser.id,
          userName: dbUser.userName,
          email: dbUser.email,
          apiStatus: dbUser.apiStatus
        }

        console.log(userObject);
        return res.status(200).json(userObject);
      }
    }
    return res.send(500);
  }
});