const redis = require("./connection");

// ADD in stream -- XADD()
const addEntryToStream = async ({ key, fields }) => {
  try {
    // `fields` is an object of key-value pairs (field: value)
    console.log(...Object.entries(fields).flat());
    const entryId = await redis.xadd(
      key,
      "*",
      ...Object.entries(fields).flat()
    ); // returns 1731350692751-0 , unique id where 1731350692751 is time in ms and -0 is used to if multiple entries come at same time when it will be 1,2,3 and so on
    console.log(`Added entry to stream ${key} with ID: ${entryId}`);
  } catch (error) {
    console.error("Error adding entry to stream:", error);
  }
};

// READ -- XREAD()
const readEntriesFromStream = async ({ key, start = "0", count = 10 }) => {
  try {
    // `start` can be "0" (beginning) or any specific ID; "count" limits the number of entries
    const entries = await redis.xread("COUNT", count, "STREAMS", key, start);
    console.log(`Read entries from stream ${key}:`, entries);
    console.log(
      `Read entries from stream ${key}:`,
      JSON.stringify(entries, null, 2)
    );
  } catch (error) {
    console.error("Error reading entries from stream:", error);
  }
};

// DELETE - XDEL()
const deleteEntriesFromStream = async ({ key, entryIds }) => {
  try {
    const deletedCount = await redis.xdel(key, ...entryIds);
    console.log(`Deleted ${deletedCount} entries from stream ${key}`);
  } catch (error) {
    console.error("Error deleting entries from stream:", error);
  }
};

// GET LENGTH OF STREAM - XLEN()
const getStreamLength = async ({ key }) => {
  try {
    const length = await redis.xlen(key);
    console.log(`Stream ${key} has ${length} entries`);
  } catch (error) {
    console.error("Error getting stream length:", error);
  }
};

// EXAMPLE USE

// ADD
const data = {
  user: "Vaibhav",
  action: "login",
  status: "success",
  email: "abc@gmail.com",
};
// addEntryToStream({ key: "stream:logs:1", fields: data });

// GET
// readEntriesFromStream({ key: "stream:logs:1", start: "0", count: 5 }); // starting
readEntriesFromStream({
  key: "stream:logs:1",
  start: "1731351361673-0",
  count: 1,
}); // from given id

// DELETE
deleteEntriesFromStream({
  key: "stream:logs:1",
  entryIds: ["1731351310804-0"],
});

// GET LENGTH -
getStreamLength({ key: "stream:logs:1" });




// OTHER USEFUL FUNCTIONS -

// Trimming a Stream to a Specified Length (XTRIM)
// Keeps only the last N entries in the stream, deleting older entries.
async function trimStream({ key, maxLength }) {
  try {
    const trimmedCount = await redis.xtrim(key, "MAXLEN", maxLength);
    console.log(
      `Trimmed stream ${key} to ${maxLength} entries, removed ${trimmedCount} entries`
    );
  } catch (error) {
    console.error("Error trimming stream:", error);
  }
}

// Usage:
trimStream({ key: "stream:logs", maxLength: 100 });




// Reading New Entries in a Blocking Manner (XREAD with BLOCK)
// Reads new entries that arrive in the stream, blocking until an entry is added.
async function readNewEntriesFromStream({ key, lastId = "$", timeout = 5000 }) {
  try {
    const entries = await redis.xread("BLOCK", timeout, "STREAMS", key, lastId);
    console.log(`Read new entries from stream ${key}:`, entries);
  } catch (error) {
    console.error("Error reading new entries from stream:", error);
  }
}

// Usage:
readNewEntriesFromStream({
  key: "stream:logs:1",
  lastId: "$",   // "$" waits for new entries
  timeout: 10000 // 10-second timeout
});