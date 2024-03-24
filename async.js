// Task 2: Using async.js with Express.js

const express = require('express');
const request = require('request');
const async = require('async');
const { parse } = require('node-html-parser');

const app = express();
const port = 3000;

app.get('/I/want/title', (req, res) => {
    let addresses = req.query.address;
    if (!addresses) {
        res.status(400).send('No addresses provided');
        return;
    }
    // Convert single address to an array
    if (!Array.isArray(addresses)) {
        addresses = [addresses];
    }

    if (!Array.isArray(addresses)) {
        res.status(400).send('Addresses should be provided as an array');
        return;
    }

    const titles = [];

    async.eachOf(addresses, (address, index, callback) => {
        request(address, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const root = parse(body);
                const title = root.querySelector('title');
                if (title) {
                    titles[index] = title.text.trim();
                } else {
                    titles[index] = 'No Title Found';
                }
            } else {
                titles[index] = 'No Response';
            }
            callback();
        });
    }, () => {
        res.send(`<html>
<head></head>
<body>
    <h1> Following are the titles of given websites: </h1>
    <ul>
       ${addresses.map((address, index) => `<li>${address} - "${titles[index]}"</li>`).join('\n')}
    </ul>
</body>
</html>`);
    });
});

// Handle other routes
app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
