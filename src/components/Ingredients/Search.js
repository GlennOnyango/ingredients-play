import React, { useEffect, useState } from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../custom_hooks/http';

const Search = React.memo(props => {
  const {onFilter} =  props;  
  const [enteredfilter,setFilter] = useState("");
  const {sendRequest, data, reqIdenifire} = useHttp(); 


  useEffect(()=>{
    const query = enteredfilter.length === 0 ? '' :
    `?orderBy="title"&equalTo="${enteredfilter}"`;
    sendRequest("https://react-hooks-71b1e-default-rtdb.firebaseio.com/ingredients.json"+query,
    "GET", null, null, "Req_Search"
    );
  },[sendRequest,enteredfilter]);

  useEffect(() => {
    if(reqIdenifire === "Req_Search"){
      const loadedIngredients = [];
      for(const key in data){
          loadedIngredients.push({
            id:key,
            title:data[key].title,
            amount:data[key].amount
          });
      }
      onFilter(loadedIngredients);
    }
  }, [reqIdenifire,data,onFilter]);
  

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
