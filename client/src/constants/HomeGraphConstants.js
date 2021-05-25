import React, { useState } from 'react'
import useDatabase from '../hooks/useDatabase';

export default function HomeGraphConstants() {
    const { gasVoltList, tempList , heatIndex, humidity} = useDatabase("sensor/data");
    const joke = 11;
}


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
        poor: 'Poor',
    }
}

//Specific Ranges to decide resp. status - Change as needed
export const readingRanges = { 
heatIndex : {
    max : 35.7,
    mid : 33.3,
    min : 31.3,
},
humidity : {
    max : 54.0,
    mid : 53.5,
    min : 53.0,
},
gasVolt :{
    max : 2.52,
    mid : 2.19,
    min : 1.92,
},
temperature : {
    max : 34.7,
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
        return "var(--theme-red)";
}
else if(value < ranges.max && value >=ranges.mid){
    if(isGradient)
        return "var(--orange-gradient)";
    else
        return "var(--theme-orange)";
}
else{
    if(isGradient)
        return "var(--green-gradient)";
    else
        return "var(--theme-green)";
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



   