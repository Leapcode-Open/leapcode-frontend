import React, { useContext } from 'react';
import logo from './logo.svg';
import './styles.css';
import './basic.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import { AuthProvider, AuthContext } from './providers/AuthProvider.js';
import PrivateRoute from './providers/PrivateRoute';
import Projects from './Pages/Projects';
import SingleProject from './Pages/SingleProject';
import Logout from './Pages/Logout';
import SingleProjectV3 from './Pages/SingleProjectV3';
//v3
import V3Dashboard from './V3Pages/Dashboard';
import Profile from './V3Pages/Profile';
import Invite from './V3Pages/Invite'
import NoPage from './Pages/404';
import AllProjectsV3 from './V3Pages/AllProjects';

function App() {

  return (
      <AuthProvider>

        <div className="App bg-indigo-100 w-full min-h-screen font-jak flex flex-col justify-between">
      
          <Router>
          <Switch>
              <Route  path="/login" component={Login} />
              <Route  path="/logout" component={Logout} />  
              <PrivateRoute exact path="/invite" component={Invite} />  
              <PrivateRoute exact path="/" component={V3Dashboard} />
              <PrivateRoute exact path="/v3/" component={V3Dashboard} />
              {/* <PrivateRoute path="/v3/project/:id/:pageId" component={SingleProjectV3} /> */}

              <PrivateRoute path="/v3/project/:id" component={SingleProjectV3} />

              <PrivateRoute exact path="/projects" component={AllProjectsV3} />
              <PrivateRoute path="/project/:id" component={SingleProjectV3} />
              <PrivateRoute path="/session/:id" component={SingleProject} />
              <PrivateRoute path="/u/:slug" component={Profile} />
              <Route component={NoPage} />

            </Switch>
          </Router>
        </div>
      </AuthProvider>

  );
}

export default App;
