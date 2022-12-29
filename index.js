const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express()

/* middleware */
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kzjjck3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const taskcollection = client.db('demoProjects').collection('task')

        app.get('/task', async (req, res) => {
            const query = {};
            const task = await taskcollection.find(query).toArray();
            res.send(task)
        })
        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskcollection.findOne(query);
            res.send(result)
        })

        app.post('/task', async (req, res) => {
            const task = req.body;
            const result = await taskcollection.insertOne(task);
            res.send(result)
        })

        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const user = req.body;
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    task: user.taskname,
                    image: user.image
                }
            }
            const result = await taskcollection.updateOne(filter, updatedUser, option);
            res.send(result);
        })


        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) };
            const result = await taskcollection.deleteOne(filter);
            res.send(result)
        })


    }

    finally {

    }

}
run().catch(console.log);




app.get('/', async (req, res) => {
    res.send('Demo projects server running on the port')
})

app.listen(port, () => console.log(`Demo projects Running on ${port}`))