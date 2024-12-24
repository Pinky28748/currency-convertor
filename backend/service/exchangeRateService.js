const axios = require("axios");

class ExchangeRateService {
    constructor() {
        this.rates = null;
        this.apiKey = process.env.EXCHANGE_RATE_API;

        if (!this.apiKey) {
            throw new Error("API key is missing. Please set EXCHANGE_RATE_API in your environment variables.");
        }

        this.baseUrl = 'https://v6.exchangerate-api.com/v6/';
    }

    async getRates() {
        const url = `${this.baseUrl}${this.apiKey}/latest/INR`;
        console.log('Fetching rates from', url);

        try {
            const response = await axios.get(url);

            if (response.status === 200 && response.data.result === 'success') {
                this.rates = response.data.conversion_rates;
                console.log("Exchange rates loaded:", this.rates);
            } else {
                throw new Error("Failed to fetch exchange rates");
            }
        } catch (error) {
            console.error("Error fetching exchange rates:", error.message);
            throw new Error("Unable to load exchange rates");
        }
    }

    convert(amount, sourceCurrency, targetCurrency) {
        if (!this.rates) {
            throw new Error("Exchange rates are not loaded. Please call getRates() first.");
        }

        const sourceRate = this.rates[sourceCurrency];
        const targetRate = this.rates[targetCurrency];

        if (!sourceRate || !targetRate) {
            throw new Error(`Invalid currency code: ${sourceCurrency} or ${targetCurrency}`);
        }

        return amount * (targetRate / sourceRate);
    }
}

module.exports = new ExchangeRateService();
