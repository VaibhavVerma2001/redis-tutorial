const redis = require("./connection");

// INSERT TO LEFT
const addLeftToList = async ({ key, value }) => {
  const res = await redis.lpush(key, ...value); // ... is not needed bec ioredis handels internally
  // console.log(`Response of left push in key ${key} : `, res); // returns number of elements in list
  if (res) {
    console.log(`Response of left push in key ${key} : `, res);
  } else {
    console.log("Not inserted.");
  }
};

// 'NX' AND 'XX' not there in lists, so use exists() and expire() to set expiry
const lpushIfNotExists = async ({ key, value }) => {
  const exists = await redis.exists(key); // returns 1 if exists else 0
  //   console.log(exists);
  //   await redis.expire(key, expireTimeInSeconds); // to set expiry bec EX dont exists here
  if (!exists) {
    await redis.lpush(key, ...value);
    console.log(`List created and items pushed: ${value}`);
  } else {
    console.log("List already exists. Items not pushed.");
  }
};

// INSERT TO RIGHT
const addRightToList = async ({ key, value }) => {
  const res = await redis.rpush(key, ...value);
  //   console.log(`Response of right push in key ${key} : `, res); // returns number of elements in list
  if (res) {
    console.log(`Response of left push in key ${key} : `, res);
  } else {
    console.log("Not inserted.");
  }
};

// GET items from left
const getListItems = async ({ key, start, end }) => {
  const res = await redis.lrange(key, start, end);
  // console.log(`Response of getting items from list ${key} : `, res); // array of values, if key dont exists then empty array
  if (res.length > 0) {
    console.log(`Response of getting items from list ${key} : `, res);
  } else {
    console.log("No items found with given key");
  }
};

// Function to remove an item from the left of the list
const removeFromListLeft = async ({ key }) => {
  const item = await redis.lpop(key); // returns that value of null if not found
  if (item) {
    console.log(`Removed item from the left of ${key}:`, item);
  } else {
    console.log("Nothing removed from list");
  }
};

// Function to remove an item from the right of the list
const removeFromListRight = async ({ key }) => {
  const item = await redis.rpop(key); // returns that value of null if not found
  if (item) {
    console.log(`Removed item from the left of ${key}:`, item);
  } else {
    console.log("Nothing removed from list");
  }
};

// FING POSITION OF AN ELEMENT FROM LEFT
const findPos = async ({ key, value }) => {
  const res = await redis.lpos(key, value);
  // console.log(`Response of getting items from list ${key} : `, res);  // returns pos or null
  if (res) {
    console.log(`Response of getting position of item in list ${key} : `, res);
  } else {
    console.log("Element not found");
  }
};

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

// GET LENGTH OF LISTS
const getListLength = async ({ key }) => {
    const res = await redis.llen(key);
    console.log(`Response of getting length of list ${key} : `, res);
};

// INSERT
// addLeftToList({ key: "list:employees", value: ["item 1"] }); // single , push in array
// addLeftToList({ key: "list:employees", value: ["item 2", "item 3", "item 4"] }); // in array
lpushIfNotExists({ key: "list:employees", value: ["item 5"] }); // will not insert if key exists
// delByKey({key : "list:employees"});

// addRightToList({ key: "list:employees", value: ["item 5", "item 6", "item 7"] });

// REDIS used 0-based indexing
// start = 0, end = -1 begining to end all items
getListItems({ key: "list:employees", start: 0, end: -1 });
// start = 1, end = 3 index = 1 to index = 3, means 3 items
getListItems({ key: "list:employees", start: 1, end: 3 });
// Negative Indices: Use a negative number to count from the end of the list (e.g., -1 for the last element, -2 for the second-to-last).
getListItems({ key: "list:employees", start: -5, end: -3 }); // 5th last to 3rd last

// Summary Table
// Command	Result
// LRANGE myList  0   -1	 All elements in the list
// LRANGE myList  0    2	 First 3 elements
// LRANGE myList -2   -1	 Last 2 elements
// LRANGE myList  1    3	 Elements from index 1 to index 3
// LRANGE myList  3    1	 Empty list (since start > end)

// removeFromListLeft({key : "list:employees"});
// removeFromListRight({key : "list:employees"});

getListLength({ key: "list:employees" });

findPos({ key: "list:employees", value: "item 1" });

// await redis.rpush(key, "apple", "banana", "apple", "cherry", "apple");

// // Find the first occurrence of "apple"
// const firstPosition = await redis.lpos(key, "apple");
// console.log("First occurrence of 'apple':", firstPosition);

// // Find the second occurrence of "apple" using RANK
// const secondPosition = await redis.lpos(key, "apple", { rank: 2 });
// console.log("Second occurrence of 'apple':", secondPosition);

// // Find all occurrences of "apple" using COUNT
// const allPositions = await redis.lpos(key, "apple", { count: 3 });
// console.log("All positions of 'apple' (up to 3 matches):", allPositions);

// // Find the first occurrence of "apple" within the first 3 elements using MAXLEN
// const limitedPosition = await redis.lpos(key, "apple", { maxlen: 3 });
// console.log("Position of 'apple' within first 3 elements:", limitedPosition);
