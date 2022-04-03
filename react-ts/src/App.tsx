import React from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import SignInPanel from "./components/SignInPanel";
import SignUpPanel from "./components/SignUpPanel";
import { PrivateRoute } from "react-auth-kit";
import { Store } from "./services/StoreService";

function App() {
  return (
    <Store>
      <Router>
        <Switch>
          <PrivateRoute
            component={Dashboard}
            path={"/"}
            loginPath={"/signin"}
            exact
          />
          {/* <Route exact path="/" component={Dashboard} /> */}
          <Route exact path="/signin" component={SignInPanel} />
          <Route exact path="/signup" component={SignUpPanel} />
        </Switch>
      </Router>
    </Store>
  );
}

export default App;
