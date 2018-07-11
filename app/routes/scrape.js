const express = require('express');
const scrape_router = express.Router();
const getTickerInfo = require('../scrape').default;
const axios = require('axios');

module.exports = (db) => {
    scrape_router.get('/', (req, res) => {
        res.send('Scrape a new report and send it to the database');
    });

    scrape_router.get('/:tickerSymbol', async (req, res) => {
        console.log('Scrape a new report and send it to the database');
        const tickerSymbol = req.params.tickerSymbol.toUpperCase();
        try {
            const report = await getTickerInfo(tickerSymbol);
            const { ticker_symbol, company_name, balance_sheet, cash_flow, income_statement } = report;
            try {
                try {
                    // build insert_data
                    console.log('TODO: build insert_data')
                } catch (err) {
                    console.error(err.message);
                    res.status(500).send(err.message);
                }
                // console.log({ company_name, ticker_symbol });
                // const q = await db.select().table('companies');
                // console.log(q)
                const insert = await db.insert([{ company_name, ticker_symbol }]).into('companies');
                // console.log(insert)
                res.sendStatus(201);
            } catch (err) {
                console.error(err.message);
                res.status(500).send(err.message);
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    });

    return scrape_router;
}
