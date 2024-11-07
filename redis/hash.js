const redis = require("./connection");

// Set all multiple fields
const setAllHashFields = async ({ key, data }) => {
  // const res = await redis.hset(key,data); // returns number of elements in hset
  const res = await redis.hmset(key, data); // returns ok or null
  console.log(`Response of setting multiple fields push in key ${key} : `, res);
  if (res) {
    console.log(
      `Response of setting multiple fields push in key ${key} : `,
      res
    );
  } else {
    console.log("Not inserted.");
  }
};

// Set all multiple fields in form of array
const setAllHashFieldsArray = async ({ key, array }) => {
  // const res = await redis.hset(key,data); // returns number of elements in hset
  const res = await redis.hmset(key, ...array); // returns ok or null
  console.log(`Response of setting multiple fields push in key ${key} : `, res);
  if (res) {
    console.log(
      `Response of setting multiple fields push in key ${key} : `,
      res
    );
  } else {
    console.log("Not inserted.");
  }
};

// Get all fields
const getAllFields = async ({ key }) => {
  const res = await redis.hgetall(key);
  // console.log(`Response of getting multiple fields push in key ${key} : `, res); // returns object or empty object if not found
  if (Object.keys(res).length) {
    console.log(`Response of getting all  fields in hash of key ${key}: `, res);
  } else {
    console.log("Not found!");
  }
};

// Function to get a specific field from a hash
const getHashField = async ({ key, field }) => {
  const value = await redis.hget(key, field);
  // console.log(`Response of getting fields in hash of key : `, value); // null or value if found
  if (value) {
    console.log(`Response of getting fields in hash of key : `, value);
  } else {
    console.log("Not found!");
  }
};

// Function to update a specific field in a hash
const updateHashField = async ({ key, field, value }) => {
  try {
    const res = await redis.hset(key, field, value);
    // console.log('Response of updating by field', res); // reutrns 0 or 1
    console.log(`Field '${field}' updated in hash ${key}:`, value);
  } catch (error) {
    console.error("Error updating hash field:", error);
  }
};

// Function to delete specific fields from a hash
const deleteHashFields = async ({ key, fields }) => {
  try {
    const res = await redis.hdel(key, ...fields);
    // console.log('Response of deleting hash fields : ', res); // return numbers of deleted fields, 0 if nothing deleted
    console.log(`Deleted fields ${fields} from hash ${key}`);
  } catch (error) {
    console.error("Error deleting hash fields:", error);
  }
};


// Perform operations

// Delete by key
const delByKey = async ({ key }) => {
  const res = await redis.del(key);
  // console.log("Response of delete by key : ", res);  // returns 1 or 0
  if (res) {
    console.log(`Deleted for key ${key}`);
  } else {
    console.log(`Key ${key} not found!`);
  }
};

// SET
const data = {
  name: "Vaibhav verma",
  age: 23,
  email: "abc@gmail.com",
  role: "Developer",
};
setAllHashFields({ key: "hash:employee:1", data });

const arrayData = ["key 1", "value 1", "key 2", "value 2", "key 3", "value 3"];
setAllHashFieldsArray({ key: "hash:employee:3", array: arrayData });

// GET
getAllFields({ key: "hash:employee:1" });
getHashField({ key: "hash:employee:1", field: "age" });

// UPDATE
updateHashField({ key: "hash:employee:1", field: "age", value: 23 });

// DELETE
// delByKey({key : "hash:employee:1"}); // all fields
// deleteHashFields({key :"hash:employee:1", fields : ["age", "role"] });



// other functions for NX, XX , and expiry
// const exists = await redis.exists(key); // Check if hash key exists
// await redis.expire(key, expiryInSeconds); // Set expiry on the hash key