const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./router/users");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use("/users", userRoutes);

app.get("/", (req, res) => {
	res.send("Welcome to User API");
});

app.listen(PORT, () => {
	console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
