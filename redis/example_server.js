const express = require("express");
const axios = require("axios");
const redis = require("./connection");

const app = express();
app.use(express.json());

const redisKey = "example-redis";

app.get("/", (req, res) => {
  res.status(200).json("Welcome to server....");
});

app.get("/getData", async (req, res) => {
  // check if data already in redis simply return
  const value = await redis.get(redisKey);
  if (value) {
    console.log("returned from redis");
    return res.status(200).json(JSON.parse(value));
  } else {
    // if not present, get from  then store in in redis and return
    console.log("outside");
    const resp = await axios.get("https://jsonplaceholder.typicode.com/todos/");
    const data = resp.data;
    await redis.set(redisKey, JSON.stringify(data), 'EX', (1*60*60)); // EXPIRE AFTER 1 HOUR 
    return res.status(200).json(data);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, (req, res) => {
  console.log(`Server running on port : ${port}`);
});
