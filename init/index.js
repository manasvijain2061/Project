const mongoose = require("mongoose");
const initData = require("./data.js"); //require data
const Listing = require("../models/listing.js");
//require schema it is a collection/table

//connection code
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6669052d0a246477fc7cd8de",
  }));
  //initData is itself an Object
  //module.exports = { data: sampleListings };
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
