const https = require('https');
const crypto = require('crypto');
const accessKey = "30219A5F57C46AAF86ED";
const secretKey = "b1144db21861cb0c0ef7097944c111b0dd1624644563d20f7a0ccde036839e621b200f7aceedb961";
const log = false;

async function makeRequest(method, urlPath, body) {

    try {
        httpMethod = method;
        httpBaseURL = "sandboxapi.rapyd.net";
        httpURLPath = urlPath;
        salt = generateRandomString(8);
        idempotency = new Date().getTime().toString();
        timestamp = Math.round(new Date().getTime() / 1000).toString();
        signature = sign(httpMethod, httpURLPath, salt, timestamp, body)
        const options = {
            hostname: httpBaseURL,
            port: 443,
            path: httpURLPath,
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': 'http://localhost:8100',
                salt: salt,
                timestamp: timestamp,
                signature: signature,
                access_key: accessKey,
                idempotency: idempotency
            }
        }

        return await httpRequest(options, body, log);
    }
    catch (error) {
        console.error("Error generating request options");
        throw error;
    }
}

function sign(method, urlPath, salt, timestamp, body) {

    try {
        let bodyString = "";
        if (body) {
            bodyString = JSON.stringify(body);
            bodyString = bodyString == "{}" ? "" : bodyString;
        }

        let toSign = method.toLowerCase() + urlPath + salt + timestamp + accessKey + secretKey + bodyString;
        log && console.log(`toSign: ${toSign}`);

        let hash = crypto.createHmac('sha256', secretKey);
        hash.update(toSign);
        const signature = Buffer.from(hash.digest("hex")).toString("base64")
        log && console.log(`signature: ${signature}`);

        return signature;
    }
    catch (error) {
        console.error("Error generating signature");
        throw error;
    }
}

function generateRandomString(size) {
    try {
        return String(crypto.randomBytes(size).toString('hex'));
    }
    catch (error) {
        console.error("Error generating salt");
        throw error;
    }
}

async function httpRequest(options, body) {

    return new Promise((resolve, reject) => {

        try {
            
            let bodyString = "";
            if (body) {
                bodyString = JSON.stringify(body);
                bodyString = bodyString == "{}" ? "" : bodyString;
            }

            log && console.log(`httpRequest options: ${JSON.stringify(options)}`);
            const req = https.request(options, (res) => {
                let response = {
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: ''
                };

                res.on('data', (data) => {
                    response.body += data;
                });

                res.on('end', () => {

                    response.body = response.body ? JSON.parse(response.body) : {}
                    log && console.log(`httpRequest response: ${JSON.stringify(response)}`);

                    if (response.statusCode !== 200) {
                        return reject(response);
                    }

                    return resolve(response);
                });
            })
            
            req.on('error', (error) => {
                return reject(error);
            })
            
            req.write(bodyString)
            req.end();
        }
        catch(err) {
            return reject(err);
        }
    })

}

exports.makeRequest = makeRequest;