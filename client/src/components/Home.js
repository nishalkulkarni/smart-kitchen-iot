import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {animate, motion} from 'framer-motion';


//Components
import LineChart from './LineChart';

//Custom made
import DashCard from './DashCard';
import useDatabase from '../hooks/useDatabase';
import * as HomeConstants from '../constants/HomeConstants';

import Paper from "@material-ui/core/Paper";
import useMaterialStyles from '../hooks/useMaterialStyles';
import { Divider } from '@material-ui/core';
import HeatIndexGauge from './HeatIndexGauge';
import HumidityBar from './HumidityBar';

export default function Home(props) {
    const { gasVoltList, tempList , heatIndex, humidity} = useDatabase("sensor/data");
    const { classes } = useMaterialStyles();

   

    ////Control Area
    //Defines the size of the graph by splicing the input array. For ex. -50 indicates taking the latest 50 values
    const noOfPointsInGraph = -50;

    // Defines which entry of the readings list we consider the main, ex. for calcStatus 
    let hIMainIndex = (heatIndex.length) - 1;
    let humidityMainIndex = (humidity.length) - 1;
    let gasVoltMainIndex = (gasVoltList.length) - 1;
    let tempMainIndex = (tempList.length) -1;

    // const [value1,setValue1] = useState(heatIndex[hIMainIndex]);
    // const [value2,setValue2] = useState(humidity[humidityMainIndex]);
    // const [value3,setValue3] = useState(gasVoltList[gasVoltMainIndex]);
    // const [value4,setValue4] = useState(tempList[tempMainIndex]);
    ////
    
    const statusRows = [
        {
            name:<label className={'sbi-label'}>Heat Index</label>,
            status: HomeConstants.calcStatus({value: heatIndex[hIMainIndex], ranges: HomeConstants.readingRanges.heatIndex}),
        },
        {
            name:<label className={'sbi-label'}>Humidity</label>,
            status: HomeConstants.calcHumidityStatus({value: humidity[humidityMainIndex], ranges: HomeConstants.readingRanges.humidity}),
        },
        {
            name:<label className={'sbi-label'}>Gas Volt</label>,
            status: HomeConstants.calcStatus({value: gasVoltList[gasVoltMainIndex], ranges: HomeConstants.readingRanges.gasVolt}),
        },
        {
            name:<label className={'sbi-label'}>Temperature</label>,
            status: HomeConstants.calcStatus({value: tempList[tempMainIndex], ranges: HomeConstants.readingRanges.temperature}),
        },
    ]
    
    
    //Used as a placeholder for time intervals in charts
    let timeLabels = [];
    for (let i = 0; i < Math.abs(noOfPointsInGraph); i++) {
        let seconds = i*4;
        let minutes = Math.floor(seconds / 60);
        let left_secs = seconds - minutes * 60
        timeLabels.push(seconds);
        
    }
    //

   
    
    return (
        <Grid item xs={12} style={{justifyContent:'space-evenly'}}>

            <h1 className="sbi-header" style={{textAlign:'left'}}>Welcome to your Smart Kitchen Companion</h1> 
            <Divider style={{width:'60%'}}/>
            
            <div className="dash-div">
                <DashCard route="/search" title="Add Item"/>
                <DashCard route="/inventory" title="Inventory"/>
                <DashCard route="/search" title="Look for Recipes"/>
            </div>

            {/* Status Indicators*/}
            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap'}}>
                <motion.h2 animate={{y:60}} whileHover={{scale:1.2, x: 30}} className="sbi-label bubble-heading" style={{background:"var(--blue-gradient)"}} >Heat Index</motion.h2>
                <motion.h2 animate={{y:60}} whileHover={{scale:1.3, }} className="sbi-label bubble-heading" style={{background:"var(--purple-gradient)"}} >System Status</motion.h2>
                <motion.h2 animate={{y:60}} whileHover={{scale:1.2, x: -30}} className="sbi-label bubble-heading" style={{background:"var(--blue-gradient)"}} >Humidity</motion.h2>
            </div>

            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap'}}>

                

                <Paper className={classes.paper} style={{width:'30%',minWidth:'300px'}}>
                    <HeatIndexGauge heatIndex={heatIndex} mainIndex={hIMainIndex} value={heatIndex[hIMainIndex]}/>
                </Paper>

                <Paper className={classes.paper} style={{width:'30%',minWidth:'300px'}}>
                    <motion.div whileHover={{scale: 1.05, }} style={{display:'flex',flexDirection:'column',}}>
                            <Table aria-label="Status Report" >
                                <TableBody>
                                    {statusRows.map((row)=>(
                                        <TableRow>
                                            <TableCell scope="row">{row.name}</TableCell>
                                            <TableCell align="right">{row.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>    
                    </motion.div>
                </Paper>

                <Paper className={classes.paper} style={{width:'30%',minWidth:'300px'}}>
                    <HumidityBar humidity={humidity} mainIndex={humidityMainIndex} value={humidity[humidityMainIndex]}/>
                </Paper>
            </div>


            {/* Simple Graphs*/}
            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',}}>
            <motion.h2 animate={{y:50}} whileHover={{scale:1.2, x: 30}} className="sbi-label bubble-heading"style={{background:"var(--blue-gradient)"}} >Gas Volt Graph</motion.h2>
            <motion.h2 animate={{y:50}} whileHover={{scale:1.2, x: -30}} className="sbi-label bubble-heading"style={{background:"var(--blue-gradient)"}} >Temperature Graph</motion.h2>                                    
            </div>
            
            <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}>
            <Paper className={classes.paper} style={{width:'45%',minWidth:'500px'}}>
                <div className="dash-graphs-div">
                    <LineChart dataX={timeLabels} dataY={gasVoltList.slice(noOfPointsInGraph)} label={'Gas Volt (V)'} width="100%" colorHex={HomeConstants.calcStatusColor({value:gasVoltList[gasVoltMainIndex],ranges:HomeConstants.readingRanges.gasVolt,isGradient:false})}/>
                </div>
            </Paper>
            <Paper className={classes.paper} style={{width:'45%',minWidth:'500px'}}>
                <div className="dash-graphs-div">
                    <LineChart dataX={timeLabels} dataY={tempList.slice(noOfPointsInGraph)} label={'Temperature (°C) '} width="100%" colorHex={HomeConstants.calcStatusColor({value:tempList[tempMainIndex],ranges:HomeConstants.readingRanges.temperature,isGradient:false})}/>
                </div>
            </Paper>
            </div>

            
        </Grid>
    )
}
