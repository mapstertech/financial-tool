const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

const PORT = 3000;
const getTickerInfo = require('./scrape').default;
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'))
console.log(__dirname)
app.use(express.static(__dirname + '/public'))

app.get('/reports/:tickerSymbol', async (req, res) => {
    const tickerSymbol = req.params.tickerSymbol.toUpperCase();
    try {
        const report = await getTickerInfo(tickerSymbol);
        res.render('report', { report });
    } catch (err) {
        res.send(err.message);
    }
});

app.get('/*', (req, res) => {
    res.render('index', { message: ':)'})
});

app.listen(PORT, () => {
    console.log('app running on port:', PORT)
});
