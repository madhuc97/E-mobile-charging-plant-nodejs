const express = require('express');
const cors = require('cors');
const makeRequest = require('./utilities').makeRequest;
const PORT = process.env.PORT || 3000;

const app = express();

const corsOptions = {
    origin: ["http://localhost:8100","https://peppy-ward-280008.web.app"],
    default: "http://localhost",
    credentials:true,
    optionsSuccessStatus: 200
  };

//   app.all('*', function(req, res, next) {
//     const origin = cors.origin.contains(req.header('origin').toLowerCase()) ? req.headers.origin : cors.default;
//     res.header("Access-Control-Allow-Origin", origin);
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

app.use(cors(corsOptions));

app.set('json spaces', 4);

app.listen(PORT, () => console.log("Server running at port " + PORT));

app.post('/checkout', async (req, res) => {
    try {
        body = {
            amount:145,
            complete_payment_url:"https://peppy-ward-280008.web.app/home",
            country:"IN",
            currency:"INR",
            error_payment_url:"https://peppy-ward-280008.web.app/checkout-description",
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

app.get('/retrievecheckout/:id', async (req, res) => {

    try {
        console.log(req.params.id);
        const result = await makeRequest('GET', '/v1/checkout/' + req.params.id);

        res.json(result);
      } catch (error) {
        res.json(error);
      }

})
