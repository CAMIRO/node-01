const express = require('express');

const app = express()

app.use('/add-product',(req, res, next) => {
    console.log('another one');
    res.send('<h1>Add product page</h1>');
});


app.use('/',(req, res, next) => {
    console.log('another one');
    res.send('<h1>hello from Express!</h1>');
});

app.listen(3000)