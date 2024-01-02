import './App.css';
import React, { useEffect, useState } from 'react';

import { backendFetch } from './lib/backend';
import { formattedDateFromString } from './lib/datetime';

function App() {
    const [compstallHeight, setCompstallHeight] = useState(0);
    const [compstallDateTime, setCompstallDateTime] = useState('');
    const [marpleBridgeHeight, setMarpleBridgeHeight] = useState(0);
    const [marpleBridgeDateTime, setMarpleBridgeDateTime] = useState('');
    const [mccHeight, setMccHeight] = useState(0);
    useEffect(() => {
        async function fetchData() {
            const compstall = await backendFetch('id/stations/692190/measures');
            const compstallHeightValue = compstall['items'][0]['latestReading']['value'];
            setCompstallHeight(compstallHeightValue);
            setCompstallDateTime(compstall['items'][0]['latestReading']['dateTime']);
            console.log(compstallHeightValue);
            const marpleBridge = await backendFetch('id/stations/692370/measures');
            const marpleBridgeHeightValue=marpleBridge['items'][0]['latestReading']['value'];
            setMarpleBridgeHeight(marpleBridgeHeightValue);
            setMarpleBridgeDateTime(marpleBridge['items'][0]['latestReading']['dateTime']);
            console.log(marpleBridgeHeightValue);
            var goytFactor = 0.0;
            if (marpleBridgeHeightValue >= 0.2) {
                goytFactor = marpleBridgeHeightValue*8.8-0.9;
            } else if (marpleBridgeHeightValue >= 0.1) {
                goytFactor = 0.6;
            }
            console.log("goyt",goytFactor);
            var etherowFactor = 0.0;
            if (compstallHeightValue >= 0.2) {
                etherowFactor = compstallHeightValue*8.8-1.0;
            } else if (compstallHeightValue >= 0.1) {
                etherowFactor = 0.6;
            }
            console.log("etherow",etherowFactor);
            setMccHeight(goytFactor+etherowFactor);
        }
        fetchData();
    },[]);

    return (
        <div className="App" align="center">
            <h2>Manchester Canoe Club River Level</h2>
            <table>
                <thead>
                    <tr>
                        <th>Station</th>
                        <th>Reading</th>
                        <th>Taken at</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Etherow, Compstall</td>
                        <td>{compstallHeight.toFixed(2)} m</td>
                        <td>{formattedDateFromString(compstallDateTime)}</td>
                    </tr>
                    <tr>
                        <td>Goyt, Marple Bridge</td>
                        <td>{marpleBridgeHeight.toFixed(2)} m</td>
                        <td>{formattedDateFromString(marpleBridgeDateTime)}</td>
                    </tr>
                    <tr>
                        <td>MCC gauge (estimate)</td>
                        <td>{mccHeight.toFixed(1)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default App;
