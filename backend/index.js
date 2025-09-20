const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { PORT } = require('./config');

const app = express();

app.use(cors());
app.use(express.json());

const mainRouter = require("./routes/index");

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'production' });
});

app.use("/api/v1", mainRouter);

if (process.env.NODE_ENV !== 'test') {
	app.listen(PORT, () => {
		console.log(`Running on port ${PORT}`);
	});
}

module.exports = app;