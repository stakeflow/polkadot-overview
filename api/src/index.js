require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonRouter = require('express-json-rpc-router');
const JSBI = require('jsbi');
const { MongoClient } = require('mongodb');

// Connect to mongo
let mongoClient = new MongoClient(`mongodb://${process.env.DB_LOCATION}:${process.env.DB_PORT}`,  { useUnifiedTopology: true });
mongoClient.connect();
let db =  mongoClient.db(process.env.DB_NAME);

// API methods
const controller = {

  // Get network common data and node synchronization status
  getAppState() {
    return db.collection('state').findOne();
  },

  // Get nodes list
  getNodes() {
    return db.collection('validators').find({}, { historicalData: 0, events: 0 }).toArray();
  },

  // Get node's data
  getNode(params) {
    return db.collection('validators').findOne({ stashAddress: params.stashAddress }, { events: 0 });
  },

  // Get user stakes
  async getUserStakes({ addresses }) {
    let userStakes = {};

    let validators = await db.collection('validators').find({ "nominators.address": { "$in": addresses } }, {
      stashAddress: 1,
      nominators: 1
    }).toArray();

    addresses.forEach(address => {
      validators.forEach(v => {
        let nominator = v.nominators.find(n => n.address === address);
        if (nominator !== undefined) {
          userStakes[v.stashAddress] = (userStakes[v.stashAddress] !== undefined) ? JSBI.BigInt(userStakes[v.stashAddress]) : JSBI.BigInt('0');
          userStakes[v.stashAddress] = String(JSBI.add(userStakes[v.stashAddress], JSBI.BigInt(nominator.stake)));
        }
      });
    });

    return {
      userStakes: userStakes
    }
  }

};

// Init and start express app
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(jsonRouter({methods: controller}));

app.listen(process.env.APP_API_PORT, () => {
  console.log(`API listening on port ${process.env.APP_API_PORT}`);
});
