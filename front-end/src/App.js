import React, { Component } from 'react';
import './App.css';
import data from './data.json'

class App extends Component {
    componentDidMount() {
        console.log(data)
    }
    render() {
        return (
            <div id="App">
                <header id="header">MAPSTER FINANCIAL TOOL</header>
                <div id="main">
                    main table
                </div>
            </div>
        );
    }
}

export default App;
