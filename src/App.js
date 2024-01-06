import './App.css';
import React, { useEffect, useState, Fragment } from 'react';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack } from '@mui/material';

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
    const [chartData, setChartData] = useState({});
    const [maxYAxis, setMaxYAxis] = useState(0);
    const [minYAxis, setMinYAxis] = useState(0);
    const NUM_READINGS=192;
    useEffect(() => {
        async function fetchData() {
            const compstall = await backendFetch(`id/stations/692190/readings?_sorted&_limit=${NUM_READINGS}`);
            const compstallHeightValue = compstall['items'][0]['value'];
            const compstallHeightPrev = compstall['items'][1]['value'];
            setCompstallHeight(compstallHeightValue);
            setCompstallDateTime(compstall['items'][0]['dateTime']);
            setCompstallTrend(calcTrend(compstallHeightValue, compstallHeightPrev));

            const marpleBridge = await backendFetch(`id/stations/692370/readings?_sorted&_limit=${NUM_READINGS}`);
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

            const chartReadings={};
            for (let i=0; i<NUM_READINGS; i++) {
                let dateTime = compstall['items'][i]['dateTime'];
                if (chartReadings[dateTime] === undefined) {
                    chartReadings[dateTime] = {dateTime: new Date(dateTime)};
                }
                chartReadings[dateTime]['compstall']=compstall['items'][i]['value'];
                dateTime = marpleBridge['items'][i]['dateTime'];
                if (chartReadings[dateTime] === undefined) {
                    chartReadings[dateTime] = {dateTime: new Date(dateTime)};
                }
                chartReadings[dateTime]['marpleBridge']=marpleBridge['items'][i]['value'];
            }
            const chartArray=Object.values(chartReadings);
            const finalChartArray = [];
            let maxYAxis = 0;
            let minYAxis = 99;
            for (let entry of chartArray) {
                if (entry['compstall'] !== undefined && entry['marpleBridge'] !== undefined) {
                    entry['mcc'] = calcMccHeight(entry['marpleBridge'], entry['compstall']);
                    finalChartArray.push(entry);
                    maxYAxis = Math.max(maxYAxis, entry['mcc']/10.0, entry['marpleBridge'], entry['compstall']);
                    minYAxis = Math.min(minYAxis, entry['mcc']/10.0, entry['marpleBridge'], entry['compstall']);
                }
            }
            setChartData(finalChartArray);
            setMaxYAxis(Math.round(maxYAxis*10.0)/10.0+0.1);
            setMinYAxis(Math.round(minYAxis*10.0)/10.0-0.1);
        }
        fetchData();
    },[]);

    const keyToLabel = {
        compstall: 'Compstall (m)',
        marpleBridge: 'Marple Bridge (m)',
        mcc: 'MCC gauge (est.)'
    };

    const colours = {
        compstall: 'lightblue',
        marpleBridge: 'lightgreen',
        mcc: 'black'
    };

    const yAxis = {
        compstall: 'metres',
        marpleBridge: 'metres',
        mcc: 'mccGauge'
    }

    return (
        <div className="App" align="center">
            <Stack style={{ maxWidth: 440, margin: 'auto' }} >
                <Typography variant="h4">Manchester Canoe Club</Typography>
                <Typography variant="h4">River Level</Typography>
                { dataFetched && 
                    <Fragment>
                        <TableContainer>
                            <Table size="small" aria-label="simple table">
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
                        <LineChart
                            xAxis={[
                                {
                                    dataKey: 'dateTime',
                                    scaleType: 'time',
                                }
                            ]}
                            yAxis={[
                                { id: 'metres', label: '(m)', scaleType: 'linear', min:minYAxis, max:maxYAxis },
                                { id: 'mccGauge', label: 'gauge', scaleType: 'linear', min:minYAxis*10, max:maxYAxis*10 },
                            ]}
                            series={Object.keys(keyToLabel).map((key) => ({
                                dataKey: key,
                                label: keyToLabel[key],
                                color: colours[key],
                                yAxisKey: yAxis[key],
                                showMark: false
                            }))}
                            leftAxis = 'metres'
                            rightAxis = 'mccGauge'
                            dataset={chartData}
                            height={250}
                            slotProps={{
                                legend: {
                                    labelStyle: {
                                        fontSize: 11
                                    },
                                    itemMarkWidth: 8,
                                    itemMarkHeight:8,
                                    position: { vertical: 'bottom' }
                                }
                            }}
                            margin={{ top: 20, bottom: 80 }}
                        />
                    </Fragment>
                }
            </Stack>
        </div>
    );
}

export default App;
