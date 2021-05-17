import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';

import * as tbl from '../Table';
import './ReservationForm.css';
import parseJwt from "../../parseJwt";

async function submitReservation(data) {
    return fetch('http://localhost:3080/api/reservations', {
        method: 'POST',
        body: JSON.stringify({
            user_id: data.user_id,
            field_id: data.fieldId,
            date: data.date,
            hour: data.hour
        }),
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
    }).then(data=>data.json())
}

export default function MakeReservation() {
    const history = useHistory();
    const [isLoading, setLoading] = useState(true);
    const [fields, setFields] = useState();

    const [fieldId, setFieldId] = useState();
    const [date, setDate] = useState();
    const [hour, setHour] = useState();

    const [isSubmSuccess, setIsSubmSuccess] = useState(false);
    const [isSubmFail, setIsSubmFail] = useState(false);


    const user_id = parseJwt(sessionStorage.getItem("token")).id;

    const handleSubmit = async e => {
        e.preventDefault();
        const resp = await submitReservation({
            user_id,
            fieldId,
            date,
            hour
        })
        if (resp.error) {
            setIsSubmFail(true);
            setIsSubmSuccess(false);
        }
        else
        {
            setIsSubmFail(false);
            setIsSubmSuccess(true);
        }
    }

    useEffect(() => {
       fetch('http://localhost:3080/api/fields/', {
           method: 'GET',
           headers: {
               authorization: `Bearer ${sessionStorage.getItem('token')}`
           }
       }).then( response => response.json().then(data => {
           setFields(data);
           setLoading(false);
       }));
    });

    if(isLoading){
        console.log("is loading");
        return <div className="MakeReservation">Loading...</div>;
    }

    let status = <label>...</label>;
    if(isSubmSuccess) {
        status = <label>Zarezerwowano pomyślnie</label>;
    } else if (isSubmFail) {
        status = <label>Rezerwacja nie powiodła się</label>;
    }

    return (
        <div className="MakeReservation">
            <h2>Rezerwacja boiska</h2>
            <div className="ReservationForm">
                <form onSubmit={handleSubmit}>
                    <label>
                        <p>ID obiektu</p>
                        <input type="number" onChange={e => setFieldId(e.target.value)}/>
                    </label>
                    <label>
                        <p>Data (DD-MM-RRRR)</p>
                        <input type="text" onChange={e => setDate(e.target.value)}/>
                    </label>
                    <label>
                        <p>Godzina</p>
                        <input type="number" onChange={e => setHour(e.target.value)}/>
                    </label>
                    <div>
                        <button type={"submit"}>Rezerwuj</button>
                    </div>
                    <p>
                        {status}
                    </p>
                    <br/>
                    <button onClick={ () => history.goBack()}>Wróć</button>
                </form>
            </div>
            <h3>Lista obiektów</h3>
            <tbl.Table data={fields}/>
        </div>

    );
}