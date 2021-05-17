import React, {useState} from 'react';
import PropTypes from 'prop-types';

import './Login.css'

async function loginUser(credentials) {
    return fetch('http://localhost:3080/api/auth', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa( credentials.username + ':' + credentials.password),
        }
    })
        .then(data=>data.json())
}

async function registerUser(credentials) {
    return fetch('http://localhost:3080/api/users', {
        method: 'POST',
        body: JSON.stringify({
            email:credentials.username,
            password:credentials.password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export default function Login({setToken}) {

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [password2, setPassword2] = useState();

    let warning;

    const handleLogin = async e => {
        e.preventDefault();
        const resp = await loginUser({
            username,
            password
        });
        setToken(resp.token);
    }

    const handleRegister = async e => {
        e.preventDefault();
        if (password !== password2) {
            warning = <p>Hasła różnią się od siebie</p>;
            console.log("zle hasla");
        }
        else {
            const resp = await registerUser({
                username,
                password
            })
            console.log(resp);
        }
    }

    return(
        <div className="login-page">
            <div className="login-wrapper">
                <h1>Logowanie</h1>
                <form onSubmit={handleLogin}>
                    <label>
                        <p>Email</p>
                        <input type="text" onChange={e => setUserName(e.target.value)}/>
                    </label>
                    <label>
                        <p>Hasło</p>
                        <input type="password" onChange={e => setPassword(e.target.value)}/>
                    </label>
                    <p/>
                    <div>
                        <button type={"submit"}>Submit</button>
                    </div>
                </form>
            </div>
            <div className="register-wrapper">
                <h1>Rejestracja</h1>
                <form onSubmit={handleRegister}>
                    <label>
                        <p>Email</p>
                        <input type="text" onChange={e => setUserName(e.target.value)}/>
                    </label>
                    <label>
                        <p>Hasło</p>
                        <input type="password" onChange={e => setPassword(e.target.value)}/>
                    </label>
                    <label>
                        <p>Powtórz hasło</p>
                        <input type="password" onChange={e => setPassword2(e.target.value)}/>
                    </label>
                    {warning}
                    <p/>
                    <div>
                        <button type={"submit"}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}