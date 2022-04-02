import React from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { PrivateRoute } from 'react-auth-kit'

function App() {
    return ( 
        <Router>
            <Switch>
                <PrivateRoute
                  component={Dashboard}
                  path={'/'}
                  loginPath={'/signin'}
                  exact
                />
                {/* <Route exact path="/" component={Dashboard} /> */}
                <Route exact path="/signin" component={SignIn} />
                <Route exact path="/signup" component={SignUp} />
            </Switch>
        </Router>
    );
}

export default App;
