
import React, { useEffect, useState } from "react";
import { auth } from '../config/firebase';
import SkeletonLoading from "../Components/SkeletonLoading";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);
  const [token, setToken] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [claims, setClaims] = useState(null);

  const signOut = () => {
    auth().signOut().then(res => {
      setToken(null);
      setUserDetails(null);
      //window.location.href="https://leapcode.io"
    })
  }

  

  useEffect(() => {
    auth().onAuthStateChanged( async (user) => {
      setCurrentUser(user)
     
      if(user) {
        const idClains = await user.getIdTokenResult();
        setClaims(idClains);
        const idToken = await user.getIdToken();
        setToken(idToken);
        const userD = {
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          uid: user.uid,
          metadata: user.metadata
        }
        setUserDetails(userD)
      }


      else {
        setCurrentUser(null)
        setPending(false);
        //setToken(null)
      }

      setPending(false);
      
    });
  }, []);




  if( pending ){
    return (<div className="w-screen h-screen flex items-center justify-center">
      <div className="w-1/4 bg-white rounded-lg px-6 py-10 flex items-center flex-col">
        <SkeletonLoading />
      </div>
    </div>)
  }


  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authLoading: false,
        setToken,
        token,
        userDetails,
        signOut,
        claims
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};