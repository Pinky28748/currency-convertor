require('dotenv').config();

// External Module
const express = require("express");

const bodyParser = require("body-parser");
const cors = require('cors');

// Local Module
const errorController = require("./controllers/errorController");
const exchangeRouter = require("./routers/exchangeRouter");
const exchangeRateService = require("./service/exchangeRateService");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use('/api',exchangeRouter);
app.use(errorController.get404);

const PORT = process.env.PORT || 3000;
async function init()
{
  await exchangeRateService.getRates();
   app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
  });
}

init();
 
