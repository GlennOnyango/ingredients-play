import { useReducer, useCallback } from "react";

const initialState = {error:null,loading:false,data:null,reqIdenifire:null,reqExra:null,extraData:null};

const alertsReducers = (currentState,action)=>{
    switch (action.type) {
      case "SEND":
        return {...currentState,loading:true}
      case "RESPONSE":
        return {error:null,
            loading:false,
            data:action.dataResponse,
            id:action.extra,
            identifier:action.identifier,
            extraData:action.extraData,
        }
      case "ERROR":
        return {error:action.message,loading:false}
      case "CLOSE":
        return initialState
     
      default:
        break;
    }
  }
const useHttp=()=>{
    const [alert, dispatchAlert] = useReducer(alertsReducers, initialState);
    
    const sendRequest = useCallback((url, method, body, extra, identifier,extraData)=>{

            dispatchAlert({type:"SEND"});
                fetch(url,{
            method:method,
            body:body,
            headers:{'Content-Type' : 'application/json'}
            }).then(response => {
                return response.json();
            
            }).then(responseData =>{
                dispatchAlert({type:"RESPONSE",dataResponse:responseData,extra:extra,identifier:identifier,extraData:extraData});
            })
            .catch(err=>{
            dispatchAlert({type:"ERROR", message:err.message});
            });
    },[]);

    const closeModal = ()=>{
        dispatchAlert({type:"CLOSE"})
    }

    return {
            sendRequest:sendRequest,
            loading:alert.loading,
            data:alert.data,
            error:alert.error,
            reqIdenifire:alert.identifier,
            reqExra:alert.id,
            extraData:alert.extraData,
            close:closeModal,
            }
}

export default useHttp