import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';

import * as tbl from '../Table'
import parseJwt from "../../parseJwt";

async function removeReservation(data) {
    return fetch('http://localhost:3080/api/reservations/' + data.reservation_id, {
        method: 'DELETE',
        headers: {
            authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
    })
}

export default function ShowMyReservations() {
    const history = useHistory();
    const [isLoading, setLoading] = useState(true);
    const [reservations, setReservations] = useState();
    const [reservation_id, setReservationID] = useState();

    var username = parseJwt(sessionStorage.getItem("token")).email;
    var user_id = parseJwt(sessionStorage.getItem("token")).id;

    const handleDeleteReservation = async e => {
        e.preventDefault();
        // eslint-disable-next-line
        if (reservations.some(reservation => reservation.id == reservation_id))
        {
            const resp = await removeReservation({
                user_id,
                reservation_id
            })
            console.log(resp);
        }
        else
        {
            console.log("nie ma takiej rezerwacji o ID " + reservation_id);
        }
    }

    useEffect(() => {
        fetch('http://localhost:3080/api/reservations/byusername/' + username, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        }).then( response => response.json().then(data => {
            setReservations(data);
            console.log(data);
            setLoading(false);
        }));
    });

    if(isLoading){
        console.log("is loading");
        return <div className="ShowMyReservations">Loading...</div>;
    }

    return(
        <div className="ShowMyReservations">
            <h2>Moje rezerwacje</h2>
            <p>
            </p>
            {
                reservations.length > 0
                ? <tbl.Table data={reservations}/>
                : <br/>
            }
            <br />
            <form onSubmit={handleDeleteReservation}>
                <label>
                    <p>ID rezerwacji, którą chcesz zwolnić</p>
                    <input type="number" onChange={e => setReservationID(e.target.value)}/>
                </label>
                <div>
                    <button type={"submit"}>Zwolnij</button>
                </div>
            </form>
            <br/>
            <button onClick={ () => history.goBack()}>Wróć</button>
        </div>

    );
}
