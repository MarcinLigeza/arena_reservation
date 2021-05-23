import React from 'react';
import { useHistory } from 'react-router-dom';
import parseJwt from "../../parseJwt";

export default function Home() {
    const history = useHistory();

    const role = parseJwt(sessionStorage.getItem("token")).role;

    const is_mode = (role === "admin" || role === "mode");
    const is_admin = (role === "admin");

    return (
        <>
            <h2>Strona główna:</h2>
            <p>
            </p>
            {/* Button */}
            <p>
                <button onClick={ () => history.push('/makeReservation')}>Zarezerwuj boisko</button>
            </p>
            <p>
                <button onClick={ () => history.push('/showMyReservations')}>Pokaż moje rezerwacje</button>
            </p>
            {
                is_mode
                ? <button onClick={ () => history.push('/fieldsManagement')}>Zarządzanie obiektami</button>
                : <p></p>
            }
        </>
    );
};
