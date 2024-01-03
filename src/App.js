import './App.css';
import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

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
    const [dataFetched, setDataFetched] = useState(false);
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
            setDataFetched(true);
        }
        fetchData();
    },[]);

    return (
        <div className="App" align="center">
            <Typography variant="h4">Manchester Canoe Club</Typography>
            <Typography variant="h4">River Level</Typography>
            { dataFetched && 
                <TableContainer>
                    <Table style={{ maxWidth: 440, margin: 'auto' }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Station</TableCell>
                                <TableCell>Reading</TableCell>
                                <TableCell></TableCell>
                                <TableCell>Taken at</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Etherow, Compstall</TableCell>
                                <TableCell>{compstallHeight.toFixed(2)} m</TableCell>
                                <TableCell>{compstallTrend}</TableCell>
                                <TableCell>{formattedDateFromString(compstallDateTime)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Goyt, Marple Bridge</TableCell>
                                <TableCell>{marpleBridgeHeight.toFixed(2)} m</TableCell>
                                <TableCell>{marpleBridgeTrend}</TableCell>
                                <TableCell>{formattedDateFromString(marpleBridgeDateTime)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>MCC gauge (estimate)</TableCell>
                                <TableCell>{mccHeight.toFixed(1)}</TableCell>
                                <TableCell>{mccTrend}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </div>
    );
}

export default App;
