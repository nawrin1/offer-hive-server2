const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
console.log(process.env.DB_PASS)



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vqv383i.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const jobsCollection = client.db('Marketplace').collection('jobs');
    const bidsCollection = client.db('Marketplace').collection('allBids');
  //   app.get('/jobs', async (req, res) => {
  //     const cursor = jobsCollection.find();
  //     const result = await cursor.toArray();
  //     res.send(result);

  // })
  app.get('/jobs/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id)
    const query = { _id: new ObjectId(id) }
    const result = await jobsCollection.findOne(query);
    res.send(result);
  })
  app.post('/allBids', async (req, res) => {
    const allBids = req.body;
    console.log(allBids);
   
    const result = await bidsCollection.insertOne(allBids);
    res.send(result);
  });
  app.post('/jobs', async (req, res) => {
    const allJobs = req.body;
    console.log(allJobs);
   
    const result = await jobsCollection.insertOne(allJobs);
    res.send(result);
  });
  app.get('/allBids', async (req, res) => {
    
   
    
    let query={}
    if (req.query?.userEmail) {
        query = { userEmail: req.query.userEmail }
    }
    
    const result = await bidsCollection.find(query).toArray();
    res.send(result);
})
  app.get('/jobs', async (req, res) => {
    console.log(req.query.email);
   
    
    let query={}
    if (req.query?.email) {
        query = { email: req.query.email }
    }
    
    const result = await jobsCollection.find(query).toArray();
    res.send(result);
})



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('marketplace is running')
})

app.listen(port, () => {
    console.log(`marketplace Server is running on port ${port}`)
})