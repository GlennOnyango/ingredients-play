import React, { useCallback, useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

function Ingredients() {

  const [userIngredients,setuserIngredients] = useState([]);
  const [isLoading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const filterChange = useCallback((filteredIngredients)=>{
    setuserIngredients(filteredIngredients);
  },[setuserIngredients]); 

  const AddIngeredients = (ingredient)=>{
    setLoading(true);
    fetch("https://react-hooks-71b1e-default-rtdb.firebaseio.com/ingredients.json",{
      method:'POST',
      body:JSON.stringify(ingredient),
      headers:{'Content-Type' : 'application/json'}
    }).then(response => {
      setLoading(false);
      return response.json();
    }).then(responseData => {
      setuserIngredients(prev=>[...prev,{id:responseData.name,...ingredient}]);
    }).catch(err=>{
      setError(err.message);
      setLoading(false);
    });
    
  }
  const removeItem = id=>{
    setLoading(true);
    fetch(`https://react-hooks-71b1e-default-rtdb.firebaseio.com/ingredients/${id}.json`,{
      method:'DELETE',
    }).then(response => {
      setLoading(false)
      setuserIngredients(prev => prev.filter(ig=> ig.id !== id))
    }).catch(err=>{
      setError(err.message);
      setLoading(false);
    });
  }

  const closeError= ()=>{
    setError(null);
    setLoading(false);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={closeError}>{error}</ErrorModal>}
      <IngredientForm isLoading={isLoading}  onAddIngredient={AddIngeredients}/>

      <section>
        <Search onFilter={filterChange} />
        {/* Need to add list here! */}
        {<IngredientList ingredients={userIngredients} onRemoveItem={removeItem}/> }
      </section>
    </div>
  );
}

export default Ingredients;
