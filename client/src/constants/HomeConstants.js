import React, { useState } from 'react'
import useDatabase from '../hooks/useDatabase';

// const [value1,setValue1] = useState(heatIndex[hIMainIndex]);
// const [value2,setValue2] = useState(humidity[humidityMainIndex]);
// const [value3,setValue3] = useState(gasVoltList[gasVoltMainIndex]);
// const [value4,setValue4] = useState(tempList[tempMainIndex]);

//Defines the Colors and Labels of each status    
export const statusValues = {
colors : {
        good:'#4caf50',
        average:'#ff9800',
        poor:'#f44336',
    },
    labels : {
        good: 'Good',
        average: 'Average',
        poor: 'Alert',
    }
}

//Specific Ranges to decide resp. status - Change as needed
export const readingRanges = { 
heatIndex : {
    max : 35.7,
    mid : 32.8,
    min : 30.9,
},
humidity : {
    max : 54.0,
    mid : 43.5,
    min : 40.0,
},
gasVolt :{
    max : 2.50,
    mid : 2.19,
    min : 1.92,
},
temperature : {
    max : 45.7,
    mid : 32.5,
    min : 30.2,
}


};

//For assigning statuses and colors according to values
export function calcStatus({value,ranges}){
if(value >= ranges.max){
    return <label className={'status-label'} style={{color:statusValues.colors.poor}}>{statusValues.labels.poor}</label>;
}
else if(value < ranges.max && value >=ranges.mid){
    return <label className={'status-label'} style={{color:statusValues.colors.average}}>{statusValues.labels.average}</label>;
}
else{
    return <label className={'status-label'} style={{color:statusValues.colors.good}}>{statusValues.labels.good}</label>;
}
}

//background:HomeConstants.calcStatusColor({value: tempList[0], ranges: HomeConstants.readingRanges.temperature, isGradient: true})
export function calcStatusColor({value,ranges,isGradient}){
if(value >= ranges.max){
    if(isGradient)
        return "var(--red-gradient)";
    else 
        return statusValues.colors.poor;
}
else if(value < ranges.max && value >=ranges.mid){
    if(isGradient)
        return "var(--orange-gradient)";
    else
        return statusValues.colors.average;
}
else{
    if(isGradient)
        return "var(--green-gradient)";
    else
        return statusValues.colors.good;
}
}

export function calcStatusColorHumidity({value,ranges,isGradient}){
if(value <= ranges.min){
    if(isGradient)
        return "var(--red-gradient)";
}
else if(value > ranges.min && value <=ranges.mid){
    if(isGradient);
        return "var(--orange-gradient)";
}
else{
    if(isGradient)
        return "var(--green-gradient)"
}
}

//Special One for humiidity
export function calcHumidityStatus({value,ranges}){
if(value <= ranges.min){
    return <label className={'status-label'} style={{color:statusValues.colors.poor}}>{statusValues.labels.poor}</label>;
}
else if(value > ranges.min && value <=ranges.mid){
    return <label className={'status-label'} style={{color:statusValues.colors.average}}>{statusValues.labels.average}</label>;
}
else{
    return <label className={'status-label'} style={{color:statusValues.colors.good}}>{statusValues.labels.good}</label>;
}
}



   