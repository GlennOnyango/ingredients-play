import React, { useCallback, useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {

  const [userIngredients,setuserIngredients] = useState([]);

  const filterChange = useCallback((filteredIngredients)=>{
    setuserIngredients(filteredIngredients);
  },[setuserIngredients]); 

  const AddIngeredients = (ingredient)=>{
    
    fetch("https://react-hooks-71b1e-default-rtdb.firebaseio.com/ingredients.json",{
      method:'POST',
      body:JSON.stringify(ingredient),
      headers:{'Content-Type' : 'application/json'}
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setuserIngredients(prev=>[...prev,{id:responseData.name,...ingredient}]);
    });
    
  }
  const removeItem = id=>{
    fetch(`https://react-hooks-71b1e-default-rtdb.firebaseio.com/ingredients/${id}.json`,{
      method:'DELETE',
    }).then(response => {
      setuserIngredients(prev => prev.filter(ig=> ig.id !== id))
    });
  }


  return (
    <div className="App">
      <IngredientForm onAddIngredient={AddIngeredients}/>

      <section>
        <Search onFilter={filterChange} />
        {/* Need to add list here! */}
        {<IngredientList ingredients={userIngredients} onRemoveItem={removeItem}/> }
      </section>
    </div>
  );
}

export default Ingredients;
