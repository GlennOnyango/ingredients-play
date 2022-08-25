import React, { useReducer, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientsReducer = (currentIngredient,action)=>{
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredient,action.ingredient];
    case "DELETE":
      return currentIngredient.filter(ig=> ig.id !== action.id);
    default:
      throw new Error("Error");
  }
}

const alertsReducers = (currentState,action)=>{
  switch (action.type) {
    case "SEND":
      return {...currentState,loading:true}
    case "RESPONSE":
      return {error:null,loading:false}
    case "ERROR":
      return {error:action.message,loading:false}
    case "CLOSE":
      return {error:null,loading:false}
   
    default:
      break;
  }
}

function Ingredients() {

  const [userIngredients, dispatch] = useReducer(ingredientsReducer, [])
  const [alert, dispatchAlert] = useReducer(alertsReducers, {error:null,loading:false})
  
  const filterChange = useCallback((filteredIngredients)=>{
    dispatch({type:"SET",ingredients:filteredIngredients});
  },[]); 

  const AddIngeredients = useCallback((ingredient)=>{
    dispatchAlert({type:"SEND"});
    fetch("https://react-hooks-71b1e-default-rtdb.firebaseio.com/ingredients.json",{
      method:'POST',
      body:JSON.stringify(ingredient),
      headers:{'Content-Type' : 'application/json'}
    }).then(response => {
      dispatchAlert({type:"RESPONSE"});
      return response.json();
    }).then(responseData => {
      dispatch({type:"ADD",ingredient:{id:responseData.name,...ingredient}})
    }).catch(err=>{
      dispatchAlert({type:"ERROR", message:err.message});
    });
    
  },[]);
  const removeItem = useCallback(id=>{
    
    dispatchAlert({type:"SEND"});
    fetch(`https://react-hooks-71b1e-default-rtdb.firebaseio.com/ingredients/${id}.json`,{
      method:'DELETE',
    }).then(response => {
      dispatchAlert({type:"RESPONSE"});
      dispatch({type:"DELETE", id:id});
    }).catch(err=>{
      dispatchAlert({type:"ERROR", message:err.message});
    });
  },[]);

  const closeError= ()=>{
    dispatchAlert({type:"CLOSE"});
  }

  const ingredientsList = useMemo(()=>{
    return <IngredientList ingredients={userIngredients} onRemoveItem={removeItem}/>
  },[userIngredients,removeItem]);

  return (
    <div className="App">
      {alert.error && <ErrorModal onClose={closeError}>{alert.error}</ErrorModal>}
      <IngredientForm isLoading={alert.loading}  onAddIngredient={AddIngeredients}/>

      <section>
        <Search onFilter={filterChange} />
        {/* Need to add list here! */}
        {ingredientsList}
      </section>
    </div>
  );
}

export default Ingredients;
