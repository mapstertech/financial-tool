const express        = require('express');
const morgan         = require('morgan');
const path           = require('path');
const app            = express();
const getTickerInfo  = require('./scrape').default;
const knexConfig     = require('../knexfile');
const knex           = require('knex')(knexConfig.development);
const PORT           = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'))

app.use(express.static(__dirname + '/public'))
app.use(morgan('dev'));

const scrape = require('./routes/scrape')(knex);

app.get('/reports/:tickerSymbol', async (req, res) => {
    const tickerSymbol = req.params.tickerSymbol.toUpperCase();
    try {
        const report = await getTickerInfo(tickerSymbol);
        res.render('report', { report });
    } catch (err) {
        res.send(err.message);
    }
});

app.use('/scrape', scrape);

app.get('/*', (req, res) => {
    res.render('index', { message: ':)'})
});

app.listen(PORT, () => {
    console.log('app running on port:', PORT)
});


// const connection = mysql.createConnection({
//     host: '127.0.0.1',
//     user: 'root',
//     password: '',
//     database: 'financial-tool'
// });

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting:', err.stack);
//         return;
//     }

//     console.log('Connected as id:', connection.threadId)
// });

