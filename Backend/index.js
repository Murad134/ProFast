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
    const paymentsCollection = db.collection('payments');


    const trackingCollection = db.collection("tracking");


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


    // -------------------- Payment APIs --------------------
    // GET: Fetch payments by user email, sorted by latest
    app.get('/payments', async (req, res) => {
      try {
        const userEmail = req.query.email;
        const query = userEmail ? { email: userEmail } : {};
        const options = { sort: { paid_at: -1 } };
        const payments = await paymentsCollection.find(query, options).toArray();
        res.send(payments);

      }
      catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).send({ message: 'Failed to fetch payments' });
      }
    });


    // POST: Record payment and update parcel status 
    app.post('/payments', async (req, res) => {
      try {
        const { parcelId: id, email, amount, paymentMethod, transactionId } = req.body;

        //step :1 update parcels payment_status
        const updateResult = await parcelsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { payment_status: 'Paid' } }
        );
        if (updateResult.modifiedCount === 0) {
          return res.status(404).send({ error: 'Parcel not found or payment status not updated or already paid' });
        }


        // step:2  Insert payment record
        const paymentDoc = {
          parcelId: id, email, amount, paymentMethod, transactionId,
          paid_at_string: new Date().toISOString(),
          paid_at: new Date(),
        };
        const paymentResult = await paymentsCollection.insertOne(paymentDoc);

        res.status(201).send({
          message: 'Payment recorded and parcel updated successfully',
          insertedId: paymentResult.insertedId,
        });

      }




      catch (error) {
        res.status(500).send({ error: 'Failed to record payment or update parcel' });
      }
    });

    // -------------------- Stripe Payment Integration --------------------



    app.post("/create-payment-intent", async (req, res) => {
      const amountInCents = req.body.amountInCents;

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
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

    // -------------------- Tracking APIs --------------------
    // GET: Fetch tracking info by trackingId
    // app.get("/tracking/:trackingId", async (req, res) => {
    //   try {
    //     const { trackingId } = req.params;

    //     const data = await trackingCollection
    //       .find({ trackingId })
    //       .sort({ createdAt: 1 })
    //       .toArray();

    //     res.send(data);
    //   } catch (err) {
    //     res.status(500).send({ message: "Failed to fetch tracking" });
    //   }
    // });


    // POST: Add tracking info
    app.post("/tracking", async (req, res) => {
      try {
        const {
          tracking_Id,
          parcel_Id,
          status,
          message,
          update_by = ''
        } = req.body;
        const doc = {
          tracking_Id,                     // MUST match frontend
          parcel_Id: parcel_Id ? new ObjectId(parcel_Id) : null,
          status,
          message: message || "",
          update_by: update_by || "",
          createdAt: new Date()
        };

        const result = await trackingCollection.insertOne(doc);

        res.send({
          success: true,
          insertedId: result.insertedId
        });
      } catch (err) {
        res.status(500).send({ message: "Failed to add tracking" });
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