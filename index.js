const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r8yk5up.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // DB collections
        const roomCollection = client.db("stavelio").collection("rooms");
        const bookingCollection = client.db("stavelio").collection("bookings");

        // api to get all the rooms
        app.get("/api/rooms", async (req, res) => {
            const results = await roomCollection.find().toArray();
            res.send(results);
        })
        // api to get single room
        app.get("/api/rooms/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await roomCollection.findOne(query);
            res.send(result);
        })

        // api to update room views
        app.patch("/api/rooms/:id", async (req, res) => {
            const filter = { _id: new ObjectId(req.params.id) }
            const updatedData = req.body;
            const updateDoc = {
                $set: updatedData,
            }
            const result = await roomCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        // api to post bookings
        app.post("/api/bookings", async (req, res) => {
            const bookingData = req.body;
            const result = await bookingCollection.insertOne(bookingData);
            res.send(result);
        })

        // api to update room availability after booking a room
        app.patch("/api/rooms/:id", async (req, res) => {
            const filter = { _id: new ObjectId(req.params.id) }
            const updateDoc = {
                $set: req.body
            }
            const result = await roomCollection.updateOne(filter, updateDoc);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Stavelio server is running');
})

app.listen(port, () => {
    console.log("server is running on port: ", port);
})