import React, { useReducer, useCallback, useMemo, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../custom_hooks/http';

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



function Ingredients() {

  const [userIngredients, dispatch] = useReducer(ingredientsReducer, [])
  const {sendRequest, loading, data, error, reqIdenifire, reqExra, extraData, close} = useHttp(); 

  useEffect(() => {
    if(reqIdenifire === "Req_Add"){
      dispatch({type:"ADD",ingredient:{id:data.name,...extraData}})
    }else if(reqIdenifire === "Req_Delete"){
      dispatch({type:"DELETE", id:reqExra});
    }
  }, [reqIdenifire,data,reqExra,extraData]);
  
  const filterChange = useCallback((filteredIngredients)=>{
    dispatch({type:"SET",ingredients:filteredIngredients});
  },[]); 

   const AddIngeredients = useCallback((ingredient)=>{
    sendRequest("https://react-hooks-71b1e-default-rtdb.firebaseio.com/ingredients.json",
                "POST",
                JSON.stringify(ingredient),
                null,
                 "Req_Add",
                 ingredient
                 );
    
   },[sendRequest]);

  const removeItem = useCallback(id=>{
    let url = `https://react-hooks-71b1e-default-rtdb.firebaseio.com/ingredients/${id}.json`;
    sendRequest(url, 'DELETE', null, id, "Req_Delete");
    
  },[sendRequest]);

  const closeError= ()=>{
    close();
  }

  const ingredientsList = useMemo(()=>{
    return <IngredientList ingredients={userIngredients} onRemoveItem={removeItem}/>
  },[userIngredients,removeItem]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={closeError}>{error}</ErrorModal>}
      <IngredientForm isLoading={loading}  onAddIngredient={AddIngeredients}/>

      <section>
        <Search onFilter={filterChange} />
        {/* Need to add list here! */}
        {ingredientsList}
      </section>
    </div>
  );
}

export default Ingredients;
