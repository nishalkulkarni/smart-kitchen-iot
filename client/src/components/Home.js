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
import Plot from 'react-plotly.js';
import ToolTip from '@material-ui/core/Tooltip'
import ReactCardFlip from 'react-card-flip';
import GaugeChart from 'react-gauge-chart'
import { CircularProgressbar, buildStyles  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

//Custom made
import DashCard from './DashCard';
import useDatabase from '../hooks/useDatabase';
import * as HomeConstants from '../constants/HomeGraphConstants';

import Paper from "@material-ui/core/Paper";
import useMaterialStyles from '../hooks/useMaterialStyles';
import { Divider } from '@material-ui/core';
import HeatIndexGauge from './HeatIndexGauge';
import HumidityBar from './HumidityBar';

export default function Home(props) {
    const { gasVoltList, tempList , heatIndex, humidity} = useDatabase("sensor/data");
    const { classes } = useMaterialStyles();
    const [isFlipped,setIsFlipped] = useState(false);
    
    
    


    const statusRows = [
        {
            name:<label className={'sbi-label'}>Heat Index</label>,
            status: HomeConstants.calcStatus({value: heatIndex[0], ranges: HomeConstants.readingRanges.heatIndex}),
        },
        {
            name:<label className={'sbi-label'}>Humidity</label>,
            status: HomeConstants.calcHumidityStatus({value: humidity[0], ranges: HomeConstants.readingRanges.humidity}),
        },
        {
            name:<label className={'sbi-label'}>Gas Volt</label>,
            status: HomeConstants.calcStatus({value: gasVoltList[0], ranges: HomeConstants.readingRanges.gasVolt}),
        },
        {
            name:<label className={'sbi-label'}>Temperature</label>,
            status: HomeConstants.calcStatus({value: tempList[0], ranges: HomeConstants.readingRanges.temperature}),
        },
    ]
    
    
    //Used as a placeholder for time intervals in charts
    let timeLabels = [];
    for (let i = 0; i < gasVoltList.length; i++) {
        timeLabels.push(i);
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
                    <HeatIndexGauge heatIndex={heatIndex}/>
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
                    <HumidityBar humidity={humidity}/>
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
                    <LineChart dataX={timeLabels} dataY={gasVoltList} label={'Gas Volt (V)'} width="100%" />
                </div>
            </Paper>
            <Paper className={classes.paper} style={{width:'45%',minWidth:'500px'}}>
                <div className="dash-graphs-div">
                    <LineChart dataX={timeLabels} dataY={tempList} label={'Temperature (°C) '} width="100%" colorHex={"#ff9800"}/>
                </div>
            </Paper>
            </div>


            {/* Complex Graphs*/}
            <Paper className={classes.paper} style={{width:'auto',height:'fit-content',display:'flex',flexDirection:'row'}}>
                <div>
                    <h2 className="sbi-header">Info</h2>
                </div>
                <div>

                    <Plot 
                        data={[
                            {
                                // x:tempList,
                                // y:gasVoltList,
                                //y-z-x
                                z:[gasVoltList,tempList,heatIndex,],
                                type: 'surface',
                                
                                
                            }
                        ]}
                        layout={ { 
                            width: 800,
                            title : '3D Surface Plot', 
                            scene: {
                                camera: {
                                    eye: {x: 1.87, y: -0.88, z: 0.64},
                                    
                                },
                                xaxis : {
                                    title : 'Heat Index',
                                    
                                },
                                yaxis : {
                                    title : 'Gas Volt',
                                },
                                zaxis : {
                                    title : 'Temperature (°C)'
                                }
                                
                            },
                            
                            
                        } }
                        />

                </div>
            </Paper>
            
        </Grid>
    )
}
