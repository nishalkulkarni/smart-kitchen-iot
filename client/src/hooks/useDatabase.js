import {useState, useEffect} from 'react';
import {projectDatabase} from '../firebase/config';

const useDatabase = ( path ) => {
    //path = "/sensor/data"
    const [gasVoltList, setGasVoltList] = useState([]);
    const [tempList, setTempList] = useState([]);
    const [heatIndex, setHeatIndex] = useState([]);
    const [humidity, setHumidity] = useState([]);

    useEffect(() => {
        
        const DBref = projectDatabase.ref(path);
        DBref.on('value', (snap) => {
            let values = snap.val();
            
            let readings = [];
            let gasVolt = [];
            let temps = [];
            let HI = [];
            let humidities = [];
            
            Object.entries(values).map(item => { readings.push(item[1])});
            
            gasVolt = readings.map(item => {return item.gasvolt});
            temps = readings.map(item => {return item.temperature});
            HI = readings.map(item => {return item.heatindex});
            humidities = readings.map(item => {return item.humidity});

            setGasVoltList(gasVolt);
            setTempList(temps);
            setHeatIndex(HI);
            setHumidity(humidities);
            }
        )
        
        return () => {
            DBref.off();
        }
    }, [path])

    

    return { gasVoltList , tempList , heatIndex, humidity }
}

export default useDatabase;