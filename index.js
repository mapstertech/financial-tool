const fs = require('fs');
const puppeteer = require('puppeteer');

const BASE_TMX_URL = 'https://web.tmxmoney.com/financials.php';
let tickerSymbol;

if (!process.argv[2]) {
    console.log('  Pass a valid ticker symbol as a CLI argument')
    console.log('  Usage:  node index.js [ticker_symbol]')
    process.exit();
} else {
    tickerSymbol = process.argv[2];
}
const url = BASE_TMX_URL + '?qm_symbol=' + tickerSymbol;

const getTickerInfo = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', (msg) => {
        for (let i = 0; i < msg.args().length; ++i)
            console.log(`${i}: ${msg.args()[i]}`);
    });

    await page.goto(url, {
        waitUntil: 'networkidle2'
    });

    try {
        await page.waitForFunction(() => {
            const table = document.querySelectorAll('.qmod-rowtitle');
            // console.log('~~~SUP~~~');
            // console.log(table)
            if (table[0].children[2].innerText || table[0].children[3].innerText) {
                console.log('--- ELEMENTS FOUND ---')
                return true;
            } else {
                console.log('--- ELEMENTS NOT FOUND ---')
                return false;
            }
        }, {
            polling: 100, timeout: 5000
        });
    } catch(err) {
        console.log(err.message);
    }

    try {
        const table_data = await page.evaluate((tickerSymbol) => {
            const all_data = [];
            const rows = Array.from(document.querySelectorAll('.qmod-rowtitle'));
            const name = document.querySelector('.quote-name h2').innerText;
            const years = document.querySelectorAll('th[rv-data-date="report.reportDate"]');

            function prepareTitle(item) {
                return item.toLowerCase().replace(/\s/g, '_');
            }

            for (let i = 0; i < years.length; i++) {
                // const year_data = [];
                let col = i + 2;
                const full_date = years[i].getAttribute('data-date');
                const year = full_date.split('-')[0];
                // data-date

                const data = rows.map((row) => {
                    const title = prepareTitle(row.children[0].innerText);
                    const row_data = row.children[col].innerText;
                    // console.log('row_data', row_data)

                    return {
                        [title]: row_data
                    }
                });

                // console.log(year_data);
                all_data.push({
                    symbol: tickerSymbol,
                    full_date,
                    year,
                    name,
                    data: data
                });

                // return year_data;
            }
            return all_data;
        }, tickerSymbol);
        // console.log(table_data[0].data)
        fs.writeFileSync('data.json', JSON.stringify(table_data))
    } catch(err) {
        console.log(err.message)
    }

    // console.log({ table_data: table_data[0] })

    // const table_data = await page.evaluate(() => {
    //     console.log(document.querySelector('#qmtip'))
    //     return document.querySelectorAll('.qmod-rowtitle');
    // });

    // // console.log(table_data)

    // table_data.forEach((row) => {
    //     console.log(row.children[0])
    // });

    await browser.close();
};

getTickerInfo();
