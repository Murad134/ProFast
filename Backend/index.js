const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const admin = require("firebase-admin");

// -------------------- Cloudinary Setup --------------------
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Load environment variables
dotenv.config();


// -------------------- Cloudinary Configuration --------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------- Stripe Setup --------------------
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// -------------------- Express App --------------------
const app = express();
const port = process.env.PORT || 3050;

// -------------------- Middleware --------------------
app.use(cors());
app.use(express.json());

// -------------------- Firebase Admin Setup --------------------
var serviceAccount = require("./firebase-admin_key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// -------------------- Cloudinary Storage Setup --------------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "users",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

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
    const usersCollection = db.collection("users");
    const ridersCollection = db.collection("riders");

    // -------------------- Middleware for Token Verification (Placeholder) --------------------
    const verifyFBToken = async (req, res, next) => {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized access' });
      }
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).send({ message: 'Unauthorized access' });
      }

      // verify the  token
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach decoded token to request object
        next();
      }
      catch (error) {
        return res.status(401).send({ message: 'Unauthorized access' });
      }

    }


    // Middleware to allow access only if the logged-in user exists and has an admin role
    const verifyAdmin = async (req, res, next) => {
      const email = req.user.email;
      const query = { email }
      const user = await usersCollection.findOne(query);
      if (!user || user.role !== 'admin') {
        return res.status(403).send({ message: 'forbidden access' })
      }
      next();
    }


    // -------------------- Routes --------------------


    // Admin route to search users by email for managing admin role

    app.get('/users/search', verifyFBToken, async (req, res) => {
      const emailQuery = req.query.email;
      if (!emailQuery) {
        return res.status(400).send({ message: 'Missing email query' });
      }
      const regex = new RegExp(emailQuery, 'i');
      try {
        const users = await usersCollection.find({ email: { $regex: regex } })
          .project({ email: 1, createdAt: 1, role: 1, last_log_in: 1 })
          .limit(10)
          .toArray();
        res.send(users);
      } catch (err) {
        console.error("Error searching users", err);
        res.status(500).send({ message: 'Error searching users' });
      }
    })
    // Get user role by email
    app.get('/users/:email/role', verifyFBToken, async (req, res) => {
      try {
        const email = req.params.email;
        if (!email) {
          return res.status(400).send({ message: 'Email is required' });
        }
        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(404).send({ message: 'User not found' });
        }
        res.send({ role: user.role || 'user' });
      }
      catch (err) {
        console.log('Error getting user role', err);
        res.status(500).send({ message: 'Failed to get role' });
      }
    })

    // User registration API (placeholder, implement as needed)
    app.post("/users", verifyFBToken, async (req, res) => {
      const email = req.body.email;
      const userExists = await usersCollection.findOne({ email });
      if (userExists) {
        // update last log in time 
        const resUpdate = await usersCollection.updateOne({ email }, { $set: { last_log_in: new Date() } });

        return res.status(200).send({ message: 'User already exists', inserted: false });
      }
      const user = {
        ...req.body,
        created_at: new Date(),
        last_log_in: new Date(),

      };
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // Admin route to assign or remove admin role from a user
    app.patch('/users/:id/role', verifyFBToken, async (req, res) => {
      const { id } = req.params;
      const { role } = req.body;
      if (!['admin', 'user'].includes(role)) {
        return res.status(400).send({ message: 'Invalid role' });
      }
      try {

        const result = await usersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { role } }
        )
        res.send({ message: `User role updated to ${role}`, result });
      }
      catch (err) {
        console.log('Error updating user role', err);
        res.status(500).send({ message: 'Failed to update user role' });
      }

    })

    // Health check
    app.get('/', (req, res) => {
      res.send('Parcel Server is Running!');
    });

    // Get all parcels
    // Get all parcels with optional filters (COMBINED)
    app.get('/parcels', verifyFBToken, async (req, res) => {
      try {
        const { email, payment_status, delivery_status } = req.query;
        const query = {};

        // optional filter by user
        if (email) {
          query.created_by = email;
        }

        // optional payment status
        if (payment_status) {
          query.payment_status = {
            $regex: new RegExp(`^${payment_status}$`, 'i'),
          };
        }

        // optional delivery status
        if (delivery_status) {
          query.delivery_status = {
            $regex: new RegExp(`^${delivery_status}$`, 'i'),
          };
        }
        console.log(query);
        const parcels = await parcelsCollection
          .find(query)
          .sort({ created_at: -1 })
          .toArray();

        res.send(parcels);
      } catch (error) {
        console.error('Error fetching parcels:', error);
        res.status(500).send({ error: 'Failed to fetch parcels' });
      }
    });




    // specific parcel by id
    app.get("/parcels/:id", verifyFBToken, async (req, res) => {
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
    // Create a new parcel (SECURE)
    app.post('/parcels', verifyFBToken, async (req, res) => {
      try {
        const parcel = {
          ...req.body,
          created_by: req.user.email, // 🔐 secure
          created_at: new Date(),
          payment_status: 'Pending',
          delivery_status: 'Pending',
        };

        const result = await parcelsCollection.insertOne(parcel);

        res.send({
          success: true,
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error('Create parcel error:', error);
        res.status(500).send({ error: 'Failed to create parcel' });
      }
    });

    // Update parcel (status / editable fields only)
    app.patch('/parcels/:id', verifyFBToken, async (req, res) => {
      const { id } = req.params;

      const updateData = { ...req.body };
      delete updateData.created_by;
      delete updateData.created_at;

      updateData.updated_at = new Date();

      try {
        const result = await parcelsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Failed to update parcel' });
      }
    });

    // DELETE Parcel API for specific id delete & return deletedCount
    app.delete('/parcels/:id', verifyFBToken, async (req, res) => {
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

    // Rider registration API (placeholder, implement as needed)
    app.post('/riders', verifyFBToken, async (req, res) => {
      const rider = req.body;
      const result = await ridersCollection.insertOne(rider);
      res.send(result);
    })

    // pending Riders api
    app.get('/riders/pending', verifyFBToken, async (req, res) => {
      try {
        const pendingRiders = await ridersCollection
          .find({ status: 'pending' })
          .toArray();

        res.send(pendingRiders);
      } catch (error) {
        res.status(500).send({ message: 'Failed to load pending riders' });
      }
    });

    // Api for active riders
    app.get('/riders/active', verifyFBToken, async (req, res) => {
      const result = await ridersCollection.find({ status: 'active' }).toArray();
      res.send(result);
    });

    // Pending riders  api for Approve or rejected
    // app.patch('/riders/:id/status', async (req, res) => {
    //   const { id } = req.params;
    //   const { status, email } = req.body;
    //   const query = { _id: new ObjectId(id) }
    //   const updateDoc = {
    //     $set: {
    //       status
    //     }
    //   }
    //   try {
    //     const result = await ridersCollection.updateOne(
    //       query, updateDoc
    //     );

    //     // update user role for accepting rider
    //     if (status === 'active') {
    //       const userQuery = { email };
    //       const userUpdateDoc = {
    //         $set: {
    //           role: 'rider'
    //         }
    //       };
    //       const roleResult = await usersCollection.updateOne(userQuery, userUpdateDoc)
    //       console.log(roleResult.modifiedCount)
    //     }

    //     res.send(result);
    //   }
    //   catch (err) {
    //     res.status(500).send({ message: 'Failed to update rider status' });
    //   }
    // });
    app.patch('/riders/:id/status', async (req, res) => {
      const { id } = req.params;
      const { status, email } = req.body;
      const query = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          status
        }
      }
      try {
        const result = await ridersCollection.updateOne(query, updateDoc);

        // ------------------------ UPDATED LOGIC ------------------------
        // update user role for accepting rider
        if (status === 'active') {
          const userQuery = { email };
          const user = await usersCollection.findOne(userQuery); // ✅ fetch user first

          if (user.role === 'admin') {
            // ✅ NEW: Skip updating role if user is admin
            console.log(`Skipped updating role for admin: ${email}`);
          } else {
            // ✅ Only update role if user is NOT admin
            const userUpdateDoc = {
              $set: {
                role: 'rider'
              }
            };
            const roleResult = await usersCollection.updateOne(userQuery, userUpdateDoc)
            console.log(roleResult.modifiedCount)
          }
        }
        // ------------------------ END UPDATED LOGIC ------------------------

        res.send(result);
      } catch (err) {
        res.status(500).send({ message: 'Failed to update rider status' });
      }
    });


    // 🔐 Get eligible riders by district (ADMIN only)
    app.get('/riders/available', async (req, res) => {
      const { district } = req.query;
      try {
        const riders = await ridersCollection
          .find({
            district,
            // status: { $in: ['approved', 'active'] },
            // work_status: 'available',
          }).toArray();
        res.send(riders);
      }
      catch (err) {
        res.status(500).send({ message: 'Failed to load riders' });
      }
    })

    // 🔐 Assign rider to parcel (ADMIN only)
    // app.patch('/parcels/:id/assign', async (req, res) => {
    //   const { id } = req.params;
    //   const { riderId } = req.body;

    //   try {
    //     // 1️⃣ Update Parcel status and assign rider
    //     const parcelResult = await parcelsCollection.updateOne(
    //       { _id: new ObjectId(id) },
    //       { $set: { assignedRider: riderId, delivery_status: "in-transit" } }
    //     );

    //     if (parcelResult.matchedCount === 0) {
    //       return res.status(404).send({ message: "Parcel not found" });
    //     }

    //     // 2️⃣ Update Rider work status
    //     const riderResult = await ridersCollection.updateOne(
    //       { _id: new ObjectId(riderId) },
    //       { $set: { work_status: "in-delivery" } }
    //     );

    //     if (riderResult.matchedCount === 0) {
    //       return res.status(404).send({ message: "Rider not found" });
    //     }

    //     res.send({ message: "Rider assigned and status updated successfully" });
    //   } catch (err) {
    //     console.error(err);
    //     res.status(500).send({ message: "Assignment failed" });
    //   }
    // });

    app.patch(
      '/parcels/:id/assign',
      verifyFBToken,
      async (req, res) => {
        const { id } = req.params;
        const { riderId, riderName, riderEmail } = req.body;

        try {
          // 1️⃣ Update Parcel status and assign rider
          const parcelResult = await parcelsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                assignedRider: {
                  id: riderId,
                  name: riderName,
                  // email:riderEmail,
                },
                delivery_status: "assigned",
              },
            }
          );

          if (parcelResult.matchedCount === 0) {
            return res.status(404).send({ message: "Parcel not found" });
          }

          // 2️⃣ Update Rider work status
          const riderResult = await ridersCollection.updateOne(
            { _id: new ObjectId(riderId) },
            { $set: { work_status: "in-delivery" } }
          );

          if (riderResult.matchedCount === 0) {
            return res.status(404).send({ message: "Rider not found" });
          }

          res.send({
            success: true,
            message: "Rider assigned and status updated successfully",
          });
        } catch (err) {
          console.error(err);
          res.status(500).send({ message: "Assignment failed" });
        }
      }
    );


    // -------------------- Payment APIs --------------------
    // GET: Fetch payments by user email, sorted by latest
    app.get('/payments', verifyFBToken, async (req, res) => {
      try {
        const userEmail = req.query.email;

        // Check if the email in the token matches the requested email
        console.log('Decoded', req.user)

        if (req.user.email !== userEmail) {
          return res.status(403).send({ message: 'Forbidden access' });
        }

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
    app.post('/payments', verifyFBToken, async (req, res) => {
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

    app.post("/create-payment-intent", verifyFBToken, async (req, res) => {
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

    // -------------------- Image Upload API with Cloudinary --------------------
    app.post("/upload-image", upload.single("image"), async (req, res) => {
      try {
        res.send({
          success: true,
          imageUrl: req.file.path, // Cloudinary image URL
        });
      } catch (error) {
        res.status(500).send({ message: "Image upload failed" });
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