import dbClient from '../../utils/db';

export default async function handler(req: any, res: any) {
  /* const origin = req.headers.origin;

  if (origin !== 'https://www.linkydash.com') {
    return res.status(403).send('Forbidden');
  } */

  if (req.method === 'GET') {
    const mongoStatus = await dbClient.isAlive();
    const nbUsers = await dbClient.countUsers();
    return res.status(200).send({ databaseStatus: mongoStatus, numberOfUsers: nbUsers });
  } else {
    return res.status(405).end();
  }
}
