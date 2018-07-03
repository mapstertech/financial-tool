var page = require('webpage').create();

var BASE_TMX_URL = 'https://web.tmxmoney.com/financials.php';
var tickerSymbol = 'RY'
var url = BASE_TMX_URL + '?qm_symbol=' + tickerSymbol;

page.onConsoleMessage = function(msg) {
    console.log(msg);
}

console.log('Opening page at:', url)
page.open(url, function(status) {
    console.log("Status: " + status);
    if (status !== "success") {
        console.log('Error opening the page')
    } else  {
        var table_data = page.evaluate(function() {
            return document.querySelectorAll('.qmod-rowtitle');
        });

        for (var i = 0; i < table_data.length; i++) {
            console.log(table_data[i].children[0])
        }
    }
    phantom.exit();
});
