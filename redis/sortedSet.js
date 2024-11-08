const redis = require("./connection");

// ADD members in form of array [score1 , value1, score2 , value2, ....]
const addMembersToSortedSet = async ({ key, members }) => {
  const res = await redis.zadd(key, ...members);
  //   console.log(`Response of adding memmbers to sorted set : `, res); // returns number of members added
  if (res) {
    console.log(`Response of adding memmbers to sorted set : `, res);
  } else {
    console.log("Not added in sorted set.");
  }
};

// ADD members in form of object
const addMembersFromObjectToSortedSet = async ({ key, members }) => {
  try {
    // Convert the array of objects into a flat array of [score, member, ...] as required by ioredis
    const flatMembers = members.flatMap(({ score, value }) => [score, value]);
    // console.log("flatMembers : ", flatMembers); // [score1 , value1, score2 , value2, ....]

    // Add members to the sorted set
    const addedCount = await redis.zadd(key, ...flatMembers);
    console.log(`Added ${addedCount} members to sorted set ${key}`);
  } catch (error) {
    console.error("Error adding members to sorted set:", error);
  }
};

const getDataFromSortedSet = async () => {
  // in sorted order from index 2 to index 3
  console.log("1 : ", await redis.zrange("sorted-set:cars", 2, 3)); // [ 'Royce', 'Castilla' ]

  // all in sorted order
  console.log("2 : ", await redis.zrange("sorted-set:cars", 0, -1)); // [ 'Ford', 'Sam-Bodden', 'Royce', 'Castilla', 'Prickett' ]

  // // in sorted order from index 2 to index 3 with scores
  console.log( "3 : ",await redis.zrange("sorted-set:cars", 2, 3, "WITHSCORES")); // [ 'Royce', '10', 'Castilla', '12' ]

  // in reverse sorted order from index 0 to index 2 (means till last 3rd element)
  console.log("4 : ",await redis.zrange("sorted-set:cars", 0, 2, "REV", "WITHSCORES")); // [ 'Prickett', '14', 'Castilla', '12', 'Royce', '10' ]

  // get memebers by score from score = 8 to score = 12
  console.log("5 : ", await redis.zrange("sorted-set:cars", 8, 12, "BYSCORE")); // [ 'Royce', 'Castilla', 'Prickett' ]

  // get memebers by score from score = 8 to score = 12 withsocre
  console.log("6 : ", await redis.zrange("sorted-set:cars", 8, 12, "BYSCORE", "WITHSCORES")); // [ 'Sam-Bodden', '8', 'Royce', '10', 'Castilla', '12' ]
};


// One general function 
const getMembersInRange = async({ key, minScore, maxScore, withScores = false }) => {
  try {
    const range = await redis.zrangebyscore(key, minScore, maxScore, withScores ?"WITHSCORES" : null);
    console.log(`Members in score range (${minScore} to ${maxScore}) from ${key}:`, range);
  } catch (error) {
    console.error("Error retrieving members in range:", error);
  }
}
  

// Getting the Rank of a Member (zrank / zrevrank)
async function getMemberRank({ key, member, reverse = false }) {
  try {
    const rank = reverse ? await redis.zrevrank(key, member) : await redis.zrank(key,member);
    console.log(`Rank of member ${member} in ${key}:`, rank !== null ? rank : "Not found");
  } catch (error) {
    console.error("Error getting member rank:", error);
  }
}
  

const getMemberScore = async({ key, member }) => {
  try {
    const score = await redis.zscore(key, member);
    console.log(`Score of member ${member} in ${key}:`, score);
  } catch (error) {
    console.error("Error getting member score:", error);
  }
}
  

// EXAMPLE USASE
let data = [
  95,
  "Vaibhav Verma",
  80,
  "Sarthak",
  85,
  "Suyash",
  90,
  "Ayush mahala",
];

addMembersToSortedSet({ key: "sorted-set:students", members: data });

data = [
  { score: 8, value: "Sam-Bodden" },
  { score: 10, value: "Royce" },
  { score: 6, value: "Ford" },
  { score: 14, value: "Prickett" },
  { score: 12, value: "Castilla" },
];

addMembersFromObjectToSortedSet({ key: "sorted-set:cars", members: data });

// GET
getDataFromSortedSet();


getMembersInRange({
    key: "sorted-set:cars",
    minScore: 8,
    maxScore: 12,
    withScores: true
});


// GET memebers by rank
getMemberRank({ key: "sorted-set:cars", member: "Castilla", reverse: false }); // index from 0


// GET member score
getMemberScore({ key: "sorted-set:cars", member: "Ford"});




// OTHER IMPORTANT FUNCTIONS -


// Incrementing a Member’s Score (zincrby)
// Increase (or decrease) the score of a member in the sorted set.
async function incrementMemberScore({ key, member, increment }) {
  try {
    const newScore = await redis.zincrby(key, increment, member);
    console.log(`New score of ${member} in ${key}:`, newScore);
    return newScore;
  } catch (error) {
    console.error("Error incrementing member score:", error);
  }
}

// usage - await incrementMemberScore({ key: "sorted:students", member: "Alice", increment: 5 });


// Removing Members (zrem)
// Remove one or more members from a sorted set.
async function removeMembersFromSortedSet({ key, members }) {
  try {
    const removedCount = await redis.zrem(key, ...members);
    console.log(`${removedCount} members removed from sorted set ${key}`);
  } catch (error) {
    console.error("Error removing members from sorted set:", error);
  }
}
// usage - await removeMembersFromSortedSet({ key: "sorted:students", members: ["Alice", "Bob"] });


// Getting the Count of Members within a Score Range (zcount)
// Get the number of members with scores within a given range.

async function getCountInRange({ key, minScore, maxScore }) {
  try {
    const count = await redis.zcount(key, minScore, maxScore);
    console.log(`Number of members in range (${minScore} to ${maxScore}) in ${key}:`, count);
    return count;
  } catch (error) {
    console.error("Error getting count in range:", error);
  }
}

//usage - await getCountInRange({ key: "sorted:students", minScore: 90, maxScore: 100 });


// Getting the Total Number of Members (zcard)
// Get the total number of members in a sorted set.
async function getSortedSetCardinality(key) {
  try {
    const count = await redis.zcard(key);
    console.log(`Total members in sorted set ${key}:`, count);
    return count;
  } catch (error) {
    console.error("Error getting sorted set cardinality:", error);
  }
}

// usage - await getSortedSetCardinality("sorted:students");