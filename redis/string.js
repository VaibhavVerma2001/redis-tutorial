const redis = require("./connection");

const insert = async ({ key, value }) => {
  // const res = await redis.set(key, value, 'NX', 'EX', 10); // expire in 10 sec
  // const res = await redis.set(key, value, 'NX'); // if not exists, then insert
  // const res = await redis.set(key, value, 'XX'); // insert if already exists
  const res = await redis.set(key, value); // create new if not exists, else overwrite

  // console.log("Response of insert : ", res); // Returns ok or null
  if (res) {
    console.log("Inserted successfully.");
  } else {
    console.log("Not inserted.");
  }
};

const getByKey = async ({ key }) => {
  const res = await redis.get(key);
  // console.log("Response of get by key : ", res); // returns ok or null
  if (res) {
    console.log(`Value for key ${key} is ${res}`);
  } else {
    console.log(`Key ${key} not found!`);
  }
};

const delByKey = async ({ key }) => {
  const res = await redis.del(key);
  // console.log("Response of delete by key : ", res);  // returns 1 or 0
  if (res) {
    console.log(`Deleted for key ${key}`);
  } else {
    console.log(`Key ${key} not found!`);
  }
};

const insertJSON = async ({ key, userData }) => {
  // const res = await redis.set(key, JSON.stringify(userData), "EX", 100);
  const res = await redis.set(key, JSON.stringify(userData));
  // console.log("Response of insert : ", res); // Returns ok or null
  if (res) {
    console.log("JSON Inserted successfully.");
  } else {
    console.log("JSON Not inserted.");
  }
};

const getJSONbyKey = async ({ key }) => {
  let res = await redis.get(key);
  res = JSON.parse(res);
  if (res) {
    console.log(
      `Value for key ${key} is name : ${res.name}, age : ${res.age}, role : ${res.role}`
    );
  } else {
    console.log(`Key ${key} not found!`);
  }
};

const timeToLive = async ({ key, value }) => {
  const res = await redis.set(key, value, "NX", "EX", 1000); // 1000 seconds
  const ttl = await redis.ttl(key);
  console.log(`Time to live if ${key} is : `, ttl); // number less than 1000
};

// Multiple set
const multipleSet = async ({ data }) => {
  const res = await redis.mset(data);
  console.log("Response of multipe set by key : ", res); // returns ok or null
  if (res) {
    console.log(`Value for key ${data} is ${res}`);
  }
};


// Function to get multiple keys using an array of keys
const getMultipleKeys = async (keysArray) => {
  try {
    const values = await redis.mget(...keysArray); // Spread the array
    console.log('Retrieved values:', values);
  } catch (error) {
    console.error('Error getting multiple keys:', error);
  }
}


// increment and decrement
const otherOperations = async () =>{
  await redis.set('counter', 0);
  let val = await redis.get('counter');
  console.log("Value of counter is : ", val);

  await redis.incr('counter'); // increase by 1
  val = await redis.get('counter');
  console.log("Value of counter is : ", val);

  await redis.decr('counter'); // decreases by 1
  val = await redis.get('counter');
  console.log("Value of counter is : ", val);


  // by specific number
  await redis.incrby('counter',10); // increase by 10
  val = await redis.get('counter');
  console.log("Value of counter is : ", val); 

  await redis.decrby('counter',5); // increase by 5
  val = await redis.get('counter');
  console.log("Value of counter is : ", val); 

}

// OPERATIONS --->

// INSERT
insert({ key: "string:user:1", value: "Vaibhav Verma" });
insert({ key: "string:user:2", value: "Asyush" });
insert({ key: "string:user:3", value: "Suyash" });

// GET
getByKey({ key: "string:user:1" });
getByKey({ key: "string:user:2" });
getByKey({ key: "string:user:3" });

// DELETE
// delByKey({key : "string:user:1"});

// INSERT JSON
let userData = {
  name: "Vaibhav",
  age: 20,
  role: "Developer",
  email: "abc@gmail.com",
};
insertJSON({ key: "string:user:4", userData: userData });

// GET JSON
getJSONbyKey({ key: "string:user:4" });

// CHECK TTL()
timeToLive({ key: "string:user:5", value: "Expiry value" });


// multiple set -
// const data = {
//   key1: 'value1',
//   key2: 'value2',
//   key3: 'value3'
// };

const data = {
  'string:user:6' : 'value1',
  'string:user:7': 'value2',
  'string:user:8': 'value3'
};

multipleSet({data});


// get mutiple values
getMultipleKeys(['string:user:6', 'string:user:7', 'string:user:8']);


// other operations
otherOperations();