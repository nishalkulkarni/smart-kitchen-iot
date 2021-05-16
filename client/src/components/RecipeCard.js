import React, { useState } from 'react';
import { motion } from 'framer-motion';
import bigBasketLogo from '../assets/bigbasket.png'
function RecipeCard(props) {

    const [isExpanded, setIsExpanded] = useState(false);
    const [originalUrl, setOrignialUrl] = useState(null);

    const handleExpand = () => {
        if(originalUrl==null){
            gotToOrignal();
        }
        if(isExpanded == false){
            setIsExpanded(true);
        }
        else{
            setIsExpanded(false);
        }
    }

    const gotToOrignal = () =>{
        if(props.recipe.id==null){
            alert("Opps, There was an error!");
        }

        fetch(`https://api.spoonacular.com/recipes/${props.recipe.id}/information?apiKey=${process.env.REACT_APP_SPOON_API_KEY}&includeNutrition=false`).then(res => res.json()).then(data => {
            
            
            //window.location.href = data.sourceUrl;
            setOrignialUrl(data.sourceUrl);
            
        })
    }

    const ingredientInfo = {
        display : 'flex',
        flexDirection : 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
    
    return (
        <motion.div className={"recipe-card "+(isExpanded ? "expand ":"")} initial={{opacity : 0.9}} whileHover={{opacity : 1.0}}   >
            <div className="recipe-preview">
                <h1 className="recipe-card-header">{props.title}</h1>
                <img src={props.imageURL} alt={props.title}></img>
                
            </div>
            <motion.div className={"recipe-info-panel "} >
                {/* {props.title && <h2 className="sbi-label" style={{fontSize : 'x-large'}}>Information</h2>} */}
                
                {isExpanded && props.title && <h3 className="sbi-label" >All Ingredients</h3>}
                {isExpanded && props.title && props.recipe.usedIngredients.map(ing => {return <div style={ingredientInfo}><p className="sbi-label" key={ing.id}>{ing.name} : {(ing.amount.toFixed(2))} {ing.unit}</p></div>})}

                {isExpanded && props.title && props.recipe.missedIngredients.map(ing => {return <div style={ingredientInfo}><p className="sbi-label" key={ing.id}>{ing.name} : {(ing.amount.toFixed(2))} {ing.unit}</p></div>})}
                {isExpanded && props.title && <a href={`${originalUrl}`} target="_blank" rel="noopener noreferrer" className="button-default">Original Recipe</a>}
            </motion.div>
            <button className={"button-default button-expand "} onClick={handleExpand} >{isExpanded ? <motion.svg whileHover={{rotate: -180,}} fill="white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/></motion.svg> : <motion.svg whileHover={{rotate: -180,}} fill="white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></motion.svg>}</button>
        </motion.div>
    )
}

export default RecipeCard
