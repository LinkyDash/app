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

  getData(userId: string) {
    try {
      return this.client.db('maindb').collection('userPages').find({userId}).toArray();
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

  async addComment(userid: string, pageid: string, data: {}) {
    try {
      const filter = {
        userId: userid,
        pages: {
          $elemMatch: { id: pageid }
        }
      };

      const updateDoc = {
        $push: {
          "pages.$.data.comments": data
        }
      };

      await this.client.db('maindb').collection('userPages').updateOne(filter, updateDoc);
      return true
      
    } catch (error) {
      console.error('Failed to check database status:', error);
      return false;
    }
  }

  async deleteComment(userid: string, pageid: string, replyid: string) {
    try {
      const filter = {
        userId: userid,
        pages: {
          $elemMatch: { id: pageid }
        }
      };

    const updateDoc = {
      $pull: {
        "pages.$.data.comments": { replyid: replyid }
      }
    };

      await this.client.db('maindb').collection('userPages').updateOne(filter, updateDoc);
      return true
      
    } catch (error) {
      console.error('Failed to check database status:', error);
      return false;
    }
  }

  addMessage(userid: string, pageid: string, data: {}) {
    try {
      const filter = {
        userId: userid,
        "pages.pageId": pageid
      };

      const updateDoc = {
        $push: {
          "pages.$.data.messages": data
        }
      };

      this.client.db('maindb').collection('usersPages').updateOne(filter, updateDoc);
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
