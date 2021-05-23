import React, {useState} from 'react'
import RecipeCard from './RecipeCard';
import {motion } from 'framer-motion';
import Grid from '@material-ui/core/Grid';



//TODO how to get recipe Source?

export default function SearchByIng(props) {

    const [recipeSource, setRecipeSource] = useState([{}]);
    const [searchTerm , setSearchTerm] = useState('');
    const [ingred, setIngred] = useState([])
    const [recipeData, setRecipeData] = useState(null);
    const [recipeQuantity, setRecipeQuantity] = useState(1);

    function getRecipeSource(){

        recipeData.map(recipe => {fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?includeNutrition=false`)})
        
    }

    function getRecipeByIng(){

        let ingredQuery = '';
        ingred.forEach(ingredient => {
            ingredQuery+=ingredient;
            ingredQuery+=',';
            
        })
        if(!ingredQuery){
            alert('Please check input!');
            return;
        }
        fetch(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=${process.env.REACT_APP_SPOON_API_KEY}&ingredients=${ingredQuery}&number=${recipeQuantity}`)
        .then(res => res.json())
        .then(data => {

            let titles = [];
            data.forEach(recipe => {titles.push(recipe.title)});
            if(!data)
                alert('Sorry, could not find any matches')
            setRecipeData(data);
                      
        })
        .catch((e)=>{
            console.log(e);
        }
        )
        
    }
    const handleSubmit = e => {
        e.preventDefault();
        getRecipeByIng()
        
    }

    const handleChange = e => {
        setSearchTerm(e.target.value);
    }

    const changeQuantity = e => {
        setRecipeQuantity(e.target.value);
    }

    const addIngredient = e => {
        e.preventDefault();
        if(!searchTerm)
            return;
        setIngred(arr => [...arr,searchTerm]);
        setSearchTerm('');
    }

    const removeIngred = (e,ingredient) =>{
        e.preventDefault();

        setIngred(arr=> arr.splice(arr.indexOf(ingredient),1));
        
    }

    const ingredientCard = {

        display : 'flex' ,
        flexDirection : 'row',
        justifyContent : 'center',
        backgroundColor : 'blueviolet' , 
        fontSize : '25px' , 
        color: 'white',
        width : 'fit-content' ,
        height : '60px',
        padding: '5px',
        margin: '5px',

        borderRadius : '15px', 
    };

    const removeButton = {
        backgroundColor : 'blueviolet' , 
        fontSize : '25px' ,
        boxShadow : '0px',
        border : 'none',
        marginLeft : '10px',

    }

    return (
       <Grid item xs={12}>
       <div>
           <h1 className="sbi-header">Search For Recipe using Ingredients!</h1>
            <form >
                <label className="sbi-label">Enter ingredient to add : </label>
                <input id="inputIngredient" type="text" value={searchTerm} placeholder="Apples!" onChange={handleChange}></input>
                
                <button type="submit" onClick={addIngredient} className="button-default">Add</button>
                <br /><br />
                <button onClick={handleSubmit} className="button-default">Search</button>
                <br /><br />
                <label className="sbi-label">Number of Recipes : </label>
                <input id="inputQuantity" type="number" name="quantity" min="1" max="6" onChange={changeQuantity}></input>
                
            </form>
            <div className="ingredients-div">
                    <h2 className="sbi-header">Ingredients:</h2>
                    {ingred && ingred.map(ingredient => {return <div style = {ingredientCard}>{ingredient}<button onClick={(e)=>removeIngred(e,ingredient)} style={removeButton}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z"/></svg> </button></div>})}
            </div>
            <motion.div layout className="recipe-cards-div">

                {recipeData && recipeData.map(recipe => {return <RecipeCard key={recipe.id} id={recipe.id} title={recipe.title} imageURL={recipe.image} recipe={recipe} missedIngredients={recipe.missedIngredients}/>})}
            </motion.div> 
        </div>
        </Grid>
    )
}
