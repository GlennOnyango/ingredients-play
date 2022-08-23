import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  const [inputState,setInputState] = useState({title:"",amount:""});
  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient(inputState);
    // ...
  };

  const inputChange = event=>{
    event.persist();
    setInputState(prev => {return{...prev,[event.target.name] :  event.target.value}})
  }

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" name='title' value={inputState.title} onChange={inputChange}/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" name='amount' value={inputState.amount} onChange={inputChange}/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
