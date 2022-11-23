const express = require('express');
const cors = require('cors');
const makeRequest = require('./utilities').makeRequest;
const PORT = process.env.PORT || 3000;

const app = express();

const corsOptions = {
    origin: "http://localhost:8100"
  };

app.use(cors(corsOptions));

app.set('json spaces', 4);

app.listen(PORT, () => console.log("Server running at port " + PORT));

app.post('/checkout', async (req, res) => {
    try {
        body = {
            amount:145,
            complete_payment_url:"http://example.com/complete",
            country:"IN",
            currency:"INR",
            error_payment_url:"http://example.com/error",
            merchant_reference_id:"950ae8c6-78",
            cardholder_preferred_currency:true,
            language:"en",
            metadata:{
                "merchant_defined":true
            },
            payment_method_type_categories:['bank_redirect','bank_transfer','card','cash','ewallet'],
            payment_method_types_include:[],
            expiration:"1671532380",
        };
        const result = await makeRequest('POST', '/v1/checkout', body);
    
        res.json(result);
      } catch (error) {
        res.json(error);
      }

})

app.get('/payment', async (req, res) => {

    try {
        const body = {
            amount: 230,
            currency: 'MXN',
            payment_method: {
                type: 'mx_diestel_cash'
            }
        };
        const result = await makeRequest('POST', '/v1/payments', body);
        res.json(result);
    } catch (error) {
        res.json(error);
    }

})

app.get('/country', async (req, res) => {

    try {
        const result = await makeRequest('GET', '/v1/payment_methods/country?country=in');
    
        res.json(result);
      } catch (error) {
        res.json(error);
      }

})
