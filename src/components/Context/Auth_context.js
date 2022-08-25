import React,{useState} from "react";

export const AuthContext = React.createContext({
    isAuth:false,
    login:()=>{}
});

export const AuthContextProvider = props =>{

    const [isAuthenticated,setAuthenticated] = useState(false);

    const loginUser = ()=>{
        setAuthenticated(true);
    }
    return(
        <AuthContext.Provider value={{isAuth:isAuthenticated,login:loginUser}}>
        {props.children}
    </AuthContext.Provider>
    );

}