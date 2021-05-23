import React, {useState, useEffect} from 'react';

import * as tbl from '../Table';
import parseJwt from "../../parseJwt";

import './FieldsManagement.css'

async function submitField(data) {
    return fetch('http://localhost:3080/api/fields', {
        method: 'POST',
        body: JSON.stringify({
            name: data.fieldName,
            address: data.fieldAddress
        }),
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
    }).then(data=>data.json())
}

async function deleteField(data) {
    return fetch('http://localhost:3080/api/fields/' + data.fieldId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
    }).then(data=>data.json())
}

export default function FieldsManagement() {
    const [fieldName, setFieldName] = useState();
    const [fieldAddress, setFieldAddress] = useState();

    const [fieldId, setFieldId] = useState();

    const [isLoading, setLoading] = useState(true);
    const [fields, setFields] = useState();

    const [isSubmSuccess, setIsSubmSuccess] = useState(false);
    const [isSubmFail, setIsSubmFail] = useState(false);

    const user_role = parseJwt(sessionStorage.getItem("token")).role;


    const handleSubmit = async e => {
        e.preventDefault();
        const resp = await submitField({
            fieldName,
            fieldAddress
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

    const handleDelete = async e => {
        e.preventDefault();
        const resp = await deleteField({
            fieldId
        });
        console.log(resp);
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

    if(!(user_role === "admin" || user_role === "mode"))
    {
        return <p>Brak uprawnień</p>;
    }

    if(isLoading){
        return <div className="MakeReservation">Loading...</div>;
    }

    let status = <label>...</label>;
    if(isSubmSuccess) {
        status = <label>Zapisano obiekt</label>;
    } else if (isSubmFail) {
        status = <label>Nie udało się zapisać obiektu</label>;
    }

    return (
        <div>
            <h2>Zarządzanie boiskami</h2>
            <div className="FieldsManagement">
                <div className="FieldForm">
                    <form onSubmit={handleSubmit}>
                        <label>
                            <p>Nazwa obiektu</p>
                            <input type="text" onChange={e => setFieldName(e.target.value)}/>
                        </label>
                        <label>
                            <p>Adres obiektu</p>
                            <input type="text" onChange={e => setFieldAddress(e.target.value)}/>
                        </label>
                        <div>
                            <button type={"submit"}>Dodaj</button>
                        </div>
                        <p>
                            {status}
                        </p>
                    </form>
                    <form onSubmit={handleDelete}>
                        <h3>Usuń obiekt</h3>
                        <label>
                            <p>ID obiektu</p>
                            <input type="number" onChange={e => setFieldId(e.target.value)}/>
                        </label>
                        <div>
                            <button type={"submit"}>Usuń</button>
                        </div>
                    </form>
                </div>
                <div className="FieldsList">
                    <h3>Lista obiektów</h3>
                    <tbl.Table data={fields}/>
                </div>
            </div>
        </div>
    );
}