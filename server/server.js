const db = require("./database");
const app = require("./app");

const PORT = process.env.PORT;

db.connect();
app.listen(PORT, () => {
  //   logger.info("[Server] => Started");
});
