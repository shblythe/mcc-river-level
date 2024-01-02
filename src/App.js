import './App.css';
import React, { useEffect, useState } from 'react';

import { backendFetch } from './lib/backend';
import { formattedDateFromString } from './lib/datetime';
import { calcMccHeight, calcTrend } from './lib/calculations';

function App() {
    const [compstallHeight, setCompstallHeight] = useState(0);
    const [compstallDateTime, setCompstallDateTime] = useState('');
    const [compstallTrend, setCompstallTrend] = useState('');
    const [marpleBridgeHeight, setMarpleBridgeHeight] = useState(0);
    const [marpleBridgeDateTime, setMarpleBridgeDateTime] = useState('');
    const [marpleBridgeTrend, setMarpleBridgeTrend] = useState('');
    const [mccHeight, setMccHeight] = useState(0);
    const [mccTrend, setMccTrend] = useState('');
    useEffect(() => {
        async function fetchData() {
            const compstall = await backendFetch('id/stations/692190/readings?_sorted&_limit=2');
            const compstallHeightValue = compstall['items'][0]['value'];
            const compstallHeightPrev = compstall['items'][1]['value'];
            setCompstallHeight(compstallHeightValue);
            setCompstallDateTime(compstall['items'][0]['dateTime']);
            setCompstallTrend(calcTrend(compstallHeightValue, compstallHeightPrev));

            const marpleBridge = await backendFetch('id/stations/692370/readings?_sorted&_limit=2');
            const marpleBridgeHeightValue=marpleBridge['items'][0]['value'];
            const marpleBridgeHeightPrev=marpleBridge['items'][1]['value'];
            setMarpleBridgeHeight(marpleBridgeHeightValue);
            setMarpleBridgeDateTime(marpleBridge['items'][0]['dateTime']);
            setMarpleBridgeTrend(calcTrend(marpleBridgeHeightValue, marpleBridgeHeightPrev));

            const currentMccHeight = calcMccHeight(marpleBridgeHeightValue, compstallHeightValue);
            const prevMccHeight = calcMccHeight(marpleBridgeHeightPrev, compstallHeightPrev);
            setMccHeight(currentMccHeight);
            setMccTrend(calcTrend(currentMccHeight, prevMccHeight));
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
                        <th></th>
                        <th>Taken at</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Etherow, Compstall</td>
                        <td>{compstallHeight.toFixed(2)} m</td>
                        <td>{compstallTrend}</td>
                        <td>{formattedDateFromString(compstallDateTime)}</td>
                    </tr>
                    <tr>
                        <td>Goyt, Marple Bridge</td>
                        <td>{marpleBridgeHeight.toFixed(2)} m</td>
                        <td>{marpleBridgeTrend}</td>
                        <td>{formattedDateFromString(marpleBridgeDateTime)}</td>
                    </tr>
                    <tr>
                        <td>MCC gauge (estimate)</td>
                        <td>{mccHeight.toFixed(1)}</td>
                        <td>{mccTrend}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default App;
