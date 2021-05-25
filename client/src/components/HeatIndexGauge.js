import React, { useState } from 'react'
import * as HomeConstants from '../constants/HomeGraphConstants';
import ReactCardFlip from 'react-card-flip';
import GaugeChart from 'react-gauge-chart';
import {animate, motion} from 'framer-motion';
import { Divider } from '@material-ui/core';

export default function HeatIndexGauge({heatIndex}) {
    const [isFlipped,setIsFlipped] = useState(false); 
    const [heatIndexPercent, setHeatIndexPercent] = useState(null);
    const getHeatIndexPercent = () => {
    
        if(heatIndexPercent!=null){
            return heatIndexPercent;
        }
        if(heatIndex.length)
            setHeatIndexPercent( (((heatIndex[0] - HomeConstants.readingRanges.heatIndex.min)) / (HomeConstants.readingRanges.heatIndex.max - HomeConstants.readingRanges.heatIndex.min)).toFixed(1) );
    
        
        return heatIndexPercent;
    }

    function handleClick(){
        setIsFlipped(!isFlipped);
    }

    return (
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
                        <motion.div whileHover={{scale: 1.05,}} >
                            <GaugeChart id="gauge-chart-heat-index" nrOfLevels={100} arcPadding={0.01} percent={getHeatIndexPercent()} arcsLength={[0.34, 0.33, 0.33]} colors={['var(--theme-green)', 'var(--theme-orange)', 'var(--theme-red)']}/>
                            <Divider/>
                            
                            <h3 className="sbi-label" style={{fontSize:'x-large'}}>Heat Index : {heatIndex[0]}</h3>
                            <svg onClick={handleClick} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1.25 17c0 .69-.559 1.25-1.25 1.25-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25c.691 0 1.25.56 1.25 1.25zm1.393-9.998c-.608-.616-1.515-.955-2.551-.955-2.18 0-3.59 1.55-3.59 3.95h2.011c0-1.486.829-2.013 1.538-2.013.634 0 1.307.421 1.364 1.226.062.847-.39 1.277-.962 1.821-1.412 1.343-1.438 1.993-1.432 3.468h2.005c-.013-.664.03-1.203.935-2.178.677-.73 1.519-1.638 1.536-3.022.011-.924-.284-1.719-.854-2.297z"/></svg>
                        </motion.div>

                        <div className={"info-text"}>
                            <p>The heat index (HI) is an index that combines air temperature and relative humidity, in shaded areas, to posit a human-perceived equivalent temperature, as how hot it would feel if the humidity were some other value in the shade. The result is also known as the "felt air temperature", "apparent temperature", "real feel" or "feels like".</p>
                            <svg onClick={handleClick} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1.25 17c0 .69-.559 1.25-1.25 1.25-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25c.691 0 1.25.56 1.25 1.25zm1.393-9.998c-.608-.616-1.515-.955-2.551-.955-2.18 0-3.59 1.55-3.59 3.95h2.011c0-1.486.829-2.013 1.538-2.013.634 0 1.307.421 1.364 1.226.062.847-.39 1.277-.962 1.821-1.412 1.343-1.438 1.993-1.432 3.468h2.005c-.013-.664.03-1.203.935-2.178.677-.73 1.519-1.638 1.536-3.022.011-.924-.284-1.719-.854-2.297z"/></svg>
                        </div>
                    </ReactCardFlip>
    )
}
