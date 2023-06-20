import dbClient from '../../utils/db';

export default async function handler(req: any, res: any) {

  if (req.method === 'GET') {
    const mongoStatus = await dbClient.isAlive();
    const nbUsers = await dbClient.countUsers();
    
    res.status(200).send({ databaseStatus: mongoStatus, numberOfUsers: nbUsers });
  } else {
    res.status(405).end();
  }
  /* return dbClient.close() */
}
