const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_URL

class DBClient {
  client: typeof MongoClient;
  constructor() {
    this.client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    this.client.connect();
  }

  isAlive() {
    try {
      this.client.db().command({ ping: 1 });
      return true
    } catch (error) {
      console.error('Failed to check database status:', error);
      return false;
    }
  }

  countUsers() {
    try {
      return this.client.db('maindb').collection('users').countDocuments();
    } catch (error) {
      console.error('Failed to check database status:', error);
      return false;
    }
  }

  getUser(id: string) {
    try {
      return this.client.db('maindb').collection('users').find({id}).toArray();
    } catch (error) {
      console.error('Failed to check database status:', error);
      return false;
    }
  }

  update(col:string, id: string, obj: {}) {
    try {
      const filter = { id: id };

      const updateDoc = {
        $set: obj,
      };

      const options = { returnOriginal: false };

      this.client.db('maindb').collection(col).updateOne(filter, updateDoc, options);
      return true
    } catch (error) {
      console.error('Failed to check database status:', error);
      return false;
    }
  }

  close() {
    this.client.close();
  }
}

const dbClient = new DBClient();
export default dbClient;
