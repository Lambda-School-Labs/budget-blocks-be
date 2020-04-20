require("dotenv").config(); // read .env if it exists
const server = require("./data/server.js");
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n*** Server is running at http://locahost:${PORT}... ***\n`);
});
