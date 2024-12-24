require('dotenv').config();

// External Module
const express = require("express");
const bodyParser = require("body-parser");
const exchangeRateService = require('./service/exchangeRateService');
const errorController = require("./controllers/errorController");
const exchangeRouter = require("./routers/exchangeRouter");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Initialize exchange rates before starting the server
async function initializeApp() {
  try {
    await exchangeRateService.getRates();
    
    app.use('/api', exchangeRouter);
    app.use(errorController.get404);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

initializeApp();