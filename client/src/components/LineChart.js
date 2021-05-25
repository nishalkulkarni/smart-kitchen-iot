import React from 'react'
import { Line } from 'react-chartjs-2';
import {motion} from 'framer-motion';


export default function LineChart({dataX,dataY,label,width = "100%",colorHex = "#4caf50"}) {

    const data = {
        labels: dataX,
        datasets: [
          {
            label: label,
            data: dataY,
            fill: false,
            backgroundColor: colorHex,
            borderColor: colorHex+"50",
            
          },
        ],
      };
      
      const options = {
        scales: {
          x : {
            display : false,
            title : {
              display : true,
              text : 'Time'
            }
          },
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      };

    return (
        <motion.div whileHover={{scale:1.05,y: -10}} style={{width:width,backgroundColor:"whitesmoke",padding:"5px",margin:"10px",borderRadius:"10px",}}>
                <Line data={data} options={options} />
        </motion.div>
    )
}
