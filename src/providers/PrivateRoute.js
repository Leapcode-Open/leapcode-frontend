import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const allUserData = useContext(AuthContext)
  const { currentUser, claims } = allUserData;
  const pathname = rest.location ? rest.location.pathname : '/'
  return (
    <Route
      {...rest}
      render={routeProps =>
        !!currentUser ? (
          <>
          { !claims.claims.contributor && rest.path != '/invite' ? <Redirect to={"/invite"} /> : <RouteComponent {...allUserData} {...routeProps} /> }
          </>
          
        ) : (
          <Redirect to={`/login?topath=${pathname}`} />
        )
      }
    />
  );
};


//            { claims.claims.contributor && rest.path != '/invite' ? <Redirect to={"/invite"} /> : <RouteComponent {...allUserData} {...routeProps} /> }


export default PrivateRoute