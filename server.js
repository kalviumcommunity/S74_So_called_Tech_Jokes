const express = require('express');
const app = express();
const port = 3000;


// /ping route

app.get('/ping', (req, res) => {
    res.send('pong');


});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);


});