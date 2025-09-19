const express = require("express");

const app = express();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Express application started at localhost:${PORT}`);
});
