const fs = require('fs');
const puppeteer = require('puppeteer');

const getTickerInfo = async (tickerSymbol) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const BASE_TMX_URL = 'https://web.tmxmoney.com/financials.php';
    const url = BASE_TMX_URL + '?qm_symbol=' + tickerSymbol;
    const report_selectors = {
        dropdown_menu: 'div.qmod-dropdown',
        balance_sheet: '#innerContent > div.quote-tabs-content > div.qtool > div > div.qmod-tool-wrap > div > div.qmod-block-wrapper.qmod-financials-block > div.qmod-modifiers > div > div:nth-child(1) > div.qmod-mod-pad.qmod-pad-right > div > div > ul > li:nth-child(1) > a',
        cash_flow : '#innerContent > div.quote-tabs-content > div.qtool > div > div.qmod-tool-wrap > div > div.qmod-block-wrapper.qmod-financials-block > div.qmod-modifiers > div > div:nth-child(1) > div.qmod-mod-pad.qmod-pad-right > div > div > ul > li:nth-child(2) > a',
        income_statement : '#innerContent > div.quote-tabs-content > div.qtool > div > div.qmod-tool-wrap > div > div.qmod-block-wrapper.qmod-financials-block > div.qmod-modifiers > div > div:nth-child(1) > div.qmod-mod-pad.qmod-pad-right > div > div > ul > li:nth-child(3) > a',
    }

    page.on('console', (msg) => {
        for (let i = 0; i < msg.args().length; ++i)
            console.log(`${i}: ${msg.args()[i]}`);
    });

    await page.goto(url, {
        waitUntil: 'networkidle2' // wait untill there are no more than 2 network connections for at least 500 ms.
    });

    try {
        await page.waitForFunction(() => {
            const table = document.querySelectorAll('.qmod-rowtitle');
            if (table[0].children[2].innerText || table[0].children[3].innerText) { // like waitForElementsToDisplay() in LI
                console.log('---ELEMENTS FOUND---')
                return true;
            } else {
                console.log('---ELEMENTS NOT FOUND AFTER 5 SECONDS---')
                return false;
            }
        }, {
            polling: 100, timeout: 5000
        });
    } catch(err) {
        console.log(err.message);
    }

    // Get balance sheet data
    try {
        const bs_table_data = await page.evaluate(() => {
            const all_data = [];
            const rows = Array.from(document.querySelectorAll('.qmod-rowtitle'));
            const years = document.querySelectorAll('th[rv-data-date="report.reportDate"]');

            function prepareTitle(item) {
                return item.toLowerCase().replace(/\s/g, '_');
            }

            for (let i = 0; i < years.length; i++) {
                let col = i + 2;
                const full_date = years[i].getAttribute('data-date');
                const year = full_date.split('-')[0];

                const data = rows.map((row) => {
                    const title = prepareTitle(row.children[0].innerText);
                    const row_data = row.children[col].innerText;
                    const indent_level = row.className.split(' ')[1].replace('qmod-indent-', '');

                    return {
                        title,
                        row_data,
                        indent_level
                    }
                    // return {
                    //     [title]: {
                    //         row_data,
                    //         indent_level
                    //     }
                    // }
                });

                all_data.push({
                    year,
                    data: data,
                    full_date,
                });
            }
            return all_data;
        });

        // Navigate to cash flow
        try {
            console.log('Clicking on cashflow');
            await page.hover(report_selectors.dropdown_menu);
            await page.click(report_selectors.cash_flow);
        } catch(err) {
            console.log(err.message);
            await browser.close();
        }

        // Get cash flow data
        const cf_table_data = await page.evaluate(() => {
            const all_data = [];
            const rows = Array.from(document.querySelectorAll('.qmod-rowtitle'));
            const years = document.querySelectorAll('th[rv-data-date="report.reportDate"]');

            function prepareTitle(item) {
                return item.toLowerCase().replace(/\s/g, '_');
            }

            for (let i = 0; i < years.length; i++) {
                let col = i + 2;
                const full_date = years[i].getAttribute('data-date');
                const year = full_date.split('-')[0];

                const data = rows.map((row) => {
                    const title = prepareTitle(row.children[0].innerText);
                    const row_data = row.children[col].innerText;
                    const indent_level = row.className.split(' ')[1].replace('qmod-indent-', '');

                    return {
                        title,
                        row_data,
                        indent_level
                    }
                    // return {
                    //     [title]: {
                    //         row_data,
                    //         indent_level
                    //     }
                    // }
                });

                all_data.push({
                    year,
                    data: data,
                    full_date,
                });
            }
            return all_data;
        });

        // Navigate to income statement
        try {
            console.log('Clicking on income state');
            await page.hover(report_selectors.dropdown_menu);
            await page.click(report_selectors.income_statement);
        } catch(err) {
            console.log(err.message);
            await browser.close();
        }

        // Get income statement data
        const is_table_data = await page.evaluate(() => {
            const all_data = [];
            const rows = Array.from(document.querySelectorAll('.qmod-rowtitle'));
            const years = document.querySelectorAll('th[rv-data-date="report.reportDate"]');

            function prepareTitle(item) {
                return item.toLowerCase().replace(/\s/g, '_');
            }

            for (let i = 0; i < years.length; i++) {
                let col = i + 2;
                const full_date = years[i].getAttribute('data-date');
                const year = full_date.split('-')[0];

                const data = rows.map((row) => {
                    const title = prepareTitle(row.children[0].innerText);
                    const row_data = row.children[col].innerText;
                    const indent_level = row.className.split(' ')[1].replace('qmod-indent-', '');

                    return {
                        title,
                        row_data,
                        indent_level
                    }
                    // return {
                    //     [title]: {
                    //         row_data,
                    //         indent_level
                    //     }
                    // }
                });

                all_data.push({
                    year,
                    data: data,
                    full_date,
                });
            }
            return all_data;
        });

        // Get company name
        let company_name;

        try {
            company_name = await page.evaluate(() => document.querySelector('.quote-name h2').innerText)
        } catch(err) {
            console.log(err.message);
        }

        /* From old.index.js, send single json object for reports/:tickerSymbol */
        // Combine financial reports
        // master_data.push({
        //     symbol: tickerSymbol,
        //     company_name,
        //     balance_sheet: bs_table_data,
        //     cash_flow: cf_table_data,
        //     income_statement: is_table_data
        // });

        // return json data
        return {
            symbol: tickerSymbol,
            company_name,
            balance_sheet: bs_table_data,
            cash_flow: cf_table_data,
            income_statement: is_table_data
        };
    } catch(err) {
        console.log(err.message)
    }

    await browser.close();
};

module.exports.default = getTickerInfo
