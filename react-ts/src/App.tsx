import React from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

function App() {
    return ( 
        <Router>
        <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/signup" component={SignUp} />
        </Switch>
        </Router>
    );
}

export default App;
