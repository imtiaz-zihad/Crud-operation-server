const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

const port = process.env.PORT || 5000;

const uri =
  "mongodb+srv://curd-101:ILrBqDavVuZt4Flp@cluster0.x6gil.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// middleware
app.use(express.json());
app.use(cors());

// ILrBqDavVuZt4Flp
// curd-101

async function Main() {
  try {
    const gymSchedule = client.db("gym-schedule").collection("schedule");
    app.post("/schedule", async (req, res) => {
      const data = req.body;

      const result = await gymSchedule.insertOne(data);
      res.send(result);
    });

    app.get("/schedule", async (req, res) => {
      const { searchParams } = req.query;
      console.log(searchParams);
      let option = {};
      if (searchParams) {
        option = { title: { $regex: searchParams, $options: "i" } }; // Remove the `let` keyword
      }
    
      try {
        const result = await gymSchedule.find(option).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching gym schedule:", error);
        res.status(500).send({ error: "Internal server error" });
      }
    });
    
    app.delete("/schedule/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await gymSchedule.deleteOne(query);
      res.send(result);
    });

    app.get("/schedule/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await gymSchedule.findOne(query);
      res.send(result);
    });

    app.patch("/schedule/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const query = { _id: new ObjectId(id) };

      const update = {
        $set: {
          title: data?.title,
          day: data?.day,
          date: data?.date,
          time: data?.time,
        },
      };

      app.patch("/status/:id", async (req, res) => {
        const id = req.params.id;
        const data = req.body;
        const query = { _id: new ObjectId(id) };

        const update = {
          $set: {
            isCompleted: true,
          },
        };

        const result = await gymSchedule.updateOne(query, update);
        res.send(result);
      });

      const result = await gymSchedule.updateOne(query, update);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.log(error);
  }
}
Main();
app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log("Server running ....");
});
