import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";

//Pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";

//Components
import Navbar from "./components/Navbar";

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <div class="container">
            <Switch>
              <Route exact path="/" component={home} />
              <Route exact path="/login" component={login} />
              <Route exact path="/signup" component={signup} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
