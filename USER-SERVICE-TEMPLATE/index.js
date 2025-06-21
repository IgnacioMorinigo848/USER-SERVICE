const express = require("express");
require("dotenv").config();
const {connection} = require("./src/config/mysql.connection");
const graphQlRouter = require("./src/router/graphQlRouter");
require("./src/model/user.model");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/user",graphQlRouter);

connection();

app.listen(PORT, () => {
    console.log("USER service is running on port " + PORT);
});
