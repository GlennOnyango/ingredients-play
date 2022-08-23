import React, { useEffect, useState } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const {onFilter} =  props;  
  const [enteredfilter,setFilter] = useState("");

  useEffect(()=>{
    const query = enteredfilter.length === 0 ? '' :
    `?orderBy="title"&equalTo="${enteredfilter}"`;
    fetch("https://react-hooks-71b1e-default-rtdb.firebaseio.com/ingredients.json"+query)
    .then(response => response.json())
    .then(responseData => {
      const loadedIngredients = [];
      for(const key in responseData){
          loadedIngredients.push({
            id:key,
            title:responseData[key].title,
            amount:responseData[key].amount
          });
      }
      onFilter(loadedIngredients);
    });
  },[enteredfilter,onFilter]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" value={enteredfilter} onChange={event=>setFilter(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
