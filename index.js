const axios = require('axios');
const cheerio = require('cheerio')

const BASE_TMX_URL = 'https://web.tmxmoney.com/financials.php'

async function getCompanyData(tickerSymbol) {
    const url = `${BASE_TMX_URL}?qm_symbol=${tickerSymbol}`
    console.log({ url })

    let html, json;
    let data = [];

    try {
        // const res = await axios.get(BASE_TMX_URL + '?qm_symbol=' + tickerSymbol);
        const res = await axios.get(url);
        html = res.data;
        // console.log(html)
    } catch (err) {
        console.log(err.message);
    }

    const $ = cheerio.load(html);

    console.log(html)



    let table_rows = $('.qmod-rowtitle');
    console.log('table_rows', table_rows)


    table_rows.each(function(i, row) {



        // data.push({
    	// 	title: $(this).children[0].innerText,
    	// 	Y1: row.children[2].innerText,
    	// 	Y2: row.children[3].innerText,
    	// 	Y3: row.children[4].innerText,
    	// 	Y4: row.children[5].innerText,
    	// 	Y5: row.children[6].innerText,
    	// })
    });

    console.log('data', data);

    return data;
}

getCompanyData('RY').then(data => {console.log(data)})

// table_rows.forEach((row) => {
// 	console.log({
// 		title: row.children[0].innerText,
// 		Y1: row.children[2].innerText,
// 		Y2: row.children[3].innerText,
// 		Y3: row.children[4].innerText,
// 		Y4: row.children[5].innerText,
// 		Y5: row.children[6].innerText,
// 	})
// });
