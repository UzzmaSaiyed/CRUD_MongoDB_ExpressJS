const express = require('express');
const { MongoClient } = require('mongodb');
const password = require('./imp.js')

const app = express();

const url = `mongodb+srv://uzzmasaiyed:${password}@cluster0.7qwtx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const url = 'mongodb://localhost:27017'; //for local mongodb connection

const client = new MongoClient(url);

async function connect() {
    try {
        await client.connect();
        console.log('Connected to Cloud Database');
        return client.db("product");//database name
    }
    catch (err) {
        console.error('Failed to connect to database', err);
    }
}
app.post("/CreateProducts", async (req, res) => {
    const db = await connect();
    const collection = db.collection("products");//collection name
    await collection.insertMany([{
        Pname: "Pen",
        Pprice: 20,
        Pquantity: 100
    },
    {
        Pname: "Pencil",
        Pprice: 200,
        Pquantity: 1000
    }
    ]);
    res.send("Product inserted successfully");
});

app.get("/FetchProducts", async (req, res) => {
    const db = await connect();
    const collection = db.collection("products");
    const data = await collection.find({}).toArray();
    res.send(data);
});

app.put("/UpdateProducts", async (req, res) => {
    const db = await connect();
    const collection = db.collection("products");
    await collection.updateMany({ Pname: "Pencil" }, { $set: { Pquantity: 900 } });
    res.send("Product updated successfully");
});

app.delete("/DeleteProducts", async (req, res) => {
    const db = await connect();
    const collection = db.collection("products");
    await collection.deleteMany({ Pname: "Pen" });
    res.send("Product deleted successfully");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});