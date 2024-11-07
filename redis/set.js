const redis = require("./connection");

// Function to add members to a set
const addMembersToSet = async ({ key, members }) => {
  try {
    const addedCount = await redis.sadd(key, ...members); // returns number of elements added
    console.log(`${addedCount} members added to set ${key}`);
  } catch (error) {
    console.error("Error adding members to set:", error);
  }
};

// Function to get all members of a set
const getMembersOfSet = async ({ key }) => {
  try {
    const members = await redis.smembers(key);
    console.log(`Members of set ${key}:`, members);
  } catch (error) {
    console.error("Error getting members of set:", error);
  }
};

// Function to check if a member exists in a set
const isMemberOfSet = async ({ key, member }) => {
  try {
    const isMember = await redis.sismember(key, member);
    console.log(`Is ${member} a member of set ${key}?`, Boolean(isMember));
  } catch (error) {
    console.error("Error checking membership in set:", error);
  }
};

// Function to remove members from a set
const removeMembersFromSet = async ({ key, members }) => {
  try {
    const removedCount = await redis.srem(key, ...members);
    console.log(`${removedCount} members removed from set ${key}`);
  } catch (error) {
    console.error("Error removing members from set:", error);
  }
};

// Function to get the count of members in a set
const getSetCount = async ({ key }) => {
  try {
    const count = await redis.scard(key);
    console.log(`Count of members in set ${key}:`, count);
  } catch (error) {
    console.error("Error getting count of set:", error);
  }
};

// Function to get random members from a set
const getRandomMembersFromSet = async ({ key, count = 1 }) => {
  try {
    const members = await redis.srandmember(key, count);
    console.log(`Random ${count} member(s) from set ${key}:`, members);
  } catch (error) {
    console.error("Error getting random members from set:", error);
  }
};

// Example Usage

// ADD
addMembersToSet({
  key: "set:fruits",
  members: ["apple", "banana", "grapes", "apple"],
}); // adds only 3 members because "apple" is duplicate

// GET
getMembersOfSet({ key: "set:fruits" });

// CHECK IF PRESENT
isMemberOfSet({ key: "set:fruits", member: "apple" }); // true

// REMOVE
// removeMembersFromSet({ key: "set:fruits", members: ["apple", "banana"] });

// TOTAL COUNT
getSetCount({ key: "set:fruits" });

// GET RANDOM
getRandomMembersFromSet({ key: "set:fruits" });
