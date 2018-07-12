import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import './App.css';
import data from './data.json'

class App extends Component {
    // componentDidMount() {
    //     console.log(data)
    // }

    handleBalanceSheetsTotalAssets = (data) => {
        const sorted = data.balance_sheet.sort((a, b) => {
            return b.year - a.year;
        });

        return sorted[0].data.filter((e) => {
            if (e.title === 'total_assets') {
                return e.row_data;
            }
        })[0].row_data;
    }

    cashFlowStatementOperatingCashFlow = (data) => {
        const sorted = data.cash_flow.sort((a, b) => {
            return b.year - a.year;
        });

        return sorted[0].data.filter((e) => {
            if (e.title === 'operating_cash_flow') {
                return e.row_data;
            }
        })[0].row_data;
    }

    handleIncomeStatementTotalRevenue = (data) => {
        const sorted = data.income_statement.sort((a, b) => {
            return b.year - a.year;
        });

        return sorted[0].data.filter((e) => {
            if (e.title === 'total_revenue') {
                return e.row_data;
            }
        })[0].row_data;
    }

    render() {
        const columns = [
            {
                Header: 'Company',
                accessor: 'company_name'
            },
            {
                Header: 'Ticker',
                accessor: 'symbol'
            },
            {
                id: 'balanceSheetsTotalAssets',
                Header: 'Balance Sheet -- Total Assets',
                accessor: this.handleBalanceSheetsTotalAssets
            },
            {
                id: 'cashFlowStatementOperatingCashFlow',
                Header: 'Cash Flow Statement -- Operating Cash Flow',
                accessor: this.cashFlowStatementOperatingCashFlow
            },
            {
                id: 'incomeStatementTotalRevenue',
                Header: 'Income Statement -- Total Revenue',
                accessor: this.handleIncomeStatementTotalRevenue
            },
        ];

        return (
            <div id="App">
                <header id="header">MAPSTER FINANCIAL TOOL</header>
                <div id="main">
                    <ReactTable
                        data={data}
                        columns={columns}
                    />
                </div>
            </div>
        );
    }
}

export default App;
