const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

// -------------------- Stripe Setup --------------------
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// -------------------- Express App --------------------
const app = express();
const port = process.env.PORT || 3050;

// -------------------- Middleware --------------------
app.use(cors());
app.use(express.json());

// -------------------- MongoDB URI --------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@parcelsend.cr3fpi2.mongodb.net/?appName=parcelsend`;

// -------------------- Mongo Client --------------------
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// -------------------- Run Server --------------------
async function run() {
  try {
    await client.connect();
    console.log('MongoDB connected');

    // ✅ Database & Collection (clean naming)
    const db = client.db('parcelsend');
    const parcelsCollection = db.collection('parcels');

    // -------------------- Routes --------------------

    // Health check
    app.get('/', (req, res) => {
      res.send('Parcel Server is Running!');
    });

    // Get all parcels
    app.get('/parcels', async (req, res) => {
      try {
        const parcels = await parcelsCollection.find().toArray();
        res.send(parcels);
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch parcels' });
      }
    });

    // Get all parcels by user(created_by),shorted by  latest
    app.get('/parcels', async (req, res) => {
      try {
        const userEmail = req.query.email;
        const query = userEmail ? { created_by: userEmail } : {};
        const options = {
          sort: { created_at: -1 }
        };
        const parcels = await parcelsCollection.find(query, options).toArray();
        res.send(parcels);
      } catch (error) {
        console.error('Error fetching parcels:', error);
        res.status(500).send({ error: 'Failed to fetch parcels' });
      }
    })

    // specific parcel by id
    app.get("/parcels/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          success: false,
          message: "Invalid parcel ID",
        });
      }

      try {
        const parcel = await parcelsCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!parcel) {
          return res.status(404).send({
            success: false,
            message: "Parcel not found",
          });
        }

        return res.status(200).send({
          success: true,
          data: parcel,
        });
      } catch (error) {
        console.error("Get parcel by id error:", error);
        return res.status(500).send({
          success: false,
          message: "Internal server error",
        });
      }
    });

    // Create a new parcel for delivery & return insertedId
    app.post('/parcels', async (req, res) => {
      try {
        const newParcel = req.body;

        if (!newParcel || Object.keys(newParcel).length === 0) {
          return res.status(400).send({ error: 'Parcel data is required' });
        }

        const result = await parcelsCollection.insertOne(newParcel);
        res.send({
          success: true,
          insertedId: result.insertedId,
        });
      } catch (error) {
        res.status(500).send({ error: 'Failed to create parcel' });
      }
    });

    // DELETE Parcel API for specific id delete & return deletedCount
    app.delete('/parcels/:id', async (req, res) => {
      const id = req.params.id;

      try {
        const result = await parcelsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
          res.status(200).json({ success: true, message: 'Parcel deleted', deletedCount: result.deletedCount });
        } else {
          res.status(404).json({ success: false, message: 'Parcel not found', deletedCount: 0 });
        }
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // -------------------- Stripe Payment Integration --------------------

    app.post("/create-payment-intent", async (req, res) => {
      const { amount } = req.body;

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100,
          currency: "usd",
          payment_method_types: ["card"],
        });

        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // Ping MongoDB
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged MongoDB successfully');

  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
}

run();

// -------------------- Start Server --------------------
app.listen(port, () => {
  console.log(`Parcel Server is listening on port ${port}`);
});