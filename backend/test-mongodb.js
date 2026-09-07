const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 15000,
});

async function test() {
  try {
    console.log("Testing MongoDB connection...");
    console.log("Using Google DNS...");

    await client.connect();

    console.log("✅ MongoDB connection SUCCESSFUL");

    const result = await client.db("admin").command({ ping: 1 });

    console.log("Ping result:", result);
  } catch (error) {
    console.log("❌ MongoDB connection FAILED");
    console.log("Name:", error.name);
    console.log("Message:", error.message);
    console.log("Code:", error.code || "N/A");

    if (error.reason) {
      console.log("Reason:", error.reason);
    }

    if (error.cause) {
      console.log("Cause:", error.cause);
    }
  } finally {
    await client.close();
  }
}

test();