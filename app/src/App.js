import React, { useState } from "react"
import {BrowserRouter, Route, Switch} from "react-router-dom";

import './App.css'
import MakeReservation from "./components/MakeReservation/MakeReservation";
import ShowMyReservations from "./components/ShowMyReservations/ShowMyReservations";
import Login from "./components/Login/Login"
import Home from "./components/Home/Home";
import parseJwt from "./parseJwt";
import FieldsManagement from "./components/FieldsManagement/FieldsManagement";

function App() {
    const [token, setToken] = useState();

    if(!token) {
        return <Login setToken={setToken} />
    }
    sessionStorage.setItem("token", token);
    const email = parseJwt(token).email

    return (
        <div className="wrapper">
          <h1>Arena Reservation</h1>
            {email && <p>Witaj { email }</p>}
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact>
                        <Home />
                    </Route>
                    <Route path="/makeReservation">
                        <MakeReservation />
                    </Route>
                    <Route path="/showMyReservations">
                        <ShowMyReservations />
                    </Route>>
                    <Route path="/fieldsManagement">
                        <FieldsManagement />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
