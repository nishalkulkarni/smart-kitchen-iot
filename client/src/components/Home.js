import React from 'react'
import Grid from '@material-ui/core/Grid';
import DashCard from './DashCard';

export default function Inventory(props) {


    return (
        <Grid item xs={12} >
            <h1 className="sbi-header">Welcome to your Smart Kitchen Companion</h1> 
            <div style={{boxShadow:'5px', border:'2px solid black'}}>
            </div>
            <div className="dash-div">
                <DashCard route="/search" title="Take Photo"/>
                <DashCard route="/inventory" title="Inventory"/>
                <DashCard route="/search" title="Look for Recipes"/>
            </div>
        </Grid>
    )
}
