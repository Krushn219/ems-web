import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import jwt from "jsonwebtoken";

import Login from "./component/Login.jsx";
import Temp from "./component/Temp.jsx";
import NotFound404 from "./component/NotFound404.jsx";
import DashboardAdmin from "./component/admin/DashboardAdmin.jsx";
import DashboardHR from "./component/hr/DashboardHR.jsx";
import DashboardEmployee from "./component/employee/DashboardEmployee.jsx";
import { Switch } from "react-router";

import {
  HashRouter as Router,
  Route,
  Link,
  Redirect,
  DefaultRoute,
} from "react-router-dom";
import history from "./history.js";

class App extends Component {
  state = {
    data: {},
    loading: false,
    pass: true,
    isLogin: false,
    firstTimeAlert: true,
  };
  componentDidMount() {
    this.setState(
      {
        data: {
          _id: localStorage.getItem("_id") || "",
          Account: localStorage.getItem("Account") || "",
          Name: localStorage.getItem("Name") || "",
        },
        isLogin: localStorage.getItem("isLogin") == "true",
      },
      () => {
        // temporary : for user to see user id and pass of all accounts to explore all features of app
        // this.alertFirstTime();
      }
    );
  }

  render() {
    return (
      // <div>{this.state.isLogin ? (
      //   <div>

      //   <DashboardAdmin data={this.state.data}/>
      //   </div>
      // ) : (
      // <Login
      //   onSubmit={this.handleSubmit}
      //   loading={this.state.loading}
      //   pass={this.state.pass}
      // />
      // )}</div>
      //  <DashboardAdmin data={this.state.data}/>
      //  <DashboardHR  data={this.state.data}/>
      //  <DashboardEmployee   data={this.state.data}/>
      //  <Temp />
      // <NotFound404/>
      <Switch>
        <Route
          exact
          path="/login"
          render={(props) =>
            this.state.data["Account"] == 1 ? (
              // <Dashboard />
              <Redirect to="/admin" />
            ) : // <Login OnLogin={this.handleLogin}/>

            this.state.data["Account"] == 2 ? (
              // <Dashboard />
              <Redirect to="/hr" />
            ) : //
            this.state.data["Account"] == 3 ? (
              // <Dashboard />
              <Redirect to="/employee" />
            ) : (
              <Login
                onSubmit={this.handleSubmit}
                loading={this.state.loading}
                pass={this.state.pass}
              />
            )
          }
        />
        <Route
          // exact
          path="/admin"
          render={(props) =>
            this.state.data["Account"] == 1 ? (
              <DashboardAdmin
                data={this.state.data}
                onLogout={this.handleLogout}
              />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          // exact
          path="/hr"
          render={(props) =>
            this.state.data["Account"] == 2 ? (
              <DashboardHR
                data={this.state.data}
                onLogout={this.handleLogout}
              />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          // exact
          path="/employee"
          render={(props) =>
            this.state.data["Account"] == 3 ? (
              <DashboardEmployee
                data={this.state.data}
                onLogout={this.handleLogout}
              />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        {/* <Route path="/" render={() => <Redirect to="/login" />} />
          <Route
            render={() => (
              //  <h1>Not Found app.JS</h1>
              <Redirect to="/login" />
            )}
          /> */}
        <Redirect to="/login" />
      </Switch>
      // <Router>
      // </Router>
    );
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ pass: true });
    this.setState({ loading: true });
    this.login(event.target[0].value, event.target[1].value);
    event.target.reset();
  };
  handleLogout = (event) => {
    console.log("logout");
    localStorage.clear();
    this.componentDidMount();
  };
  login = (id, pass) => {
    let bodyLogin = {
      email: id,
      password: pass,
    };

    axios
      // .post("https://ems-back.vercel.app/" + "api/login", bodyLogin)
      .post(process.env.REACT_APP_API_URL + "/api/login", bodyLogin)
      .then((res) => {
        console.log(jwt.decode(res.data));
        var decodedData = jwt.decode(res.data);
        localStorage.setItem("token", res.data);

        if (
          (res === undefined ||
            res == null ||
            decodedData.Account == undefined ||
            decodedData.Account == null) &&
          !(
            decodedData.Account == 1 ||
            decodedData.Account == 2 ||
            decodedData.Account == 3
          )
        ) {
          this.setState({ pass: false });
          this.setState({ loading: false });
        } else {
          if (decodedData.Account == 1) {
            // this.setState({ data: decodedData });
            // localStorage.setItem('data', JSON.stringfy(decodedData));

            this.setState({ pass: true });
            // localStorage.setItem('pass', 'true');

            this.setState({ loading: false });
            // localStorage.setItem('loading', 'false');

            this.setState({ isLogin: true });
            localStorage.setItem("isLogin", true);

            // localStorage.setItem('isLogin', 'true');
            localStorage.setItem("Account", 1);
            localStorage.setItem("_id", decodedData["_id"]);
            localStorage.setItem(
              "Name",
              decodedData["FirstName"] + " " + decodedData["LastName"]
            );
            this.componentDidMount();
            history.push("#/admin/role");
          }
          if (decodedData.Account == 2) {
            // this.setState({ data: decodedData });

            this.setState({ pass: true });
            this.setState({ loading: false });
            this.setState({ isLogin: true });
            localStorage.setItem("isLogin", true);

            localStorage.setItem("Account", 2);
            localStorage.setItem("_id", decodedData["_id"]);
            localStorage.setItem(
              "Name",
              decodedData["FirstName"] + " " + decodedData["LastName"]
            );
            this.componentDidMount();

            // history.push("/hr/employee");
            history.push("/hr/employee");
          }
          if (decodedData.Account == 3) {
            // this.setState({ data: decodedData });

            this.setState({ pass: true });
            this.setState({ loading: false });
            this.setState({ isLogin: true });
            localStorage.setItem("isLogin", true);

            localStorage.setItem("Account", 3);
            localStorage.setItem("_id", decodedData["_id"]);
            localStorage.setItem(
              "Name",
              decodedData["FirstName"] + " " + decodedData["LastName"]
            );
            this.componentDidMount();

            history.push("#/employee/" + decodedData._id + "/personal-info");
          }
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ pass: false });
        this.setState({ loading: false });
      });
  };
}

export default App;
