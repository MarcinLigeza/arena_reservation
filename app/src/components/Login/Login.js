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
            password:credentials.password1
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export default function Login({setToken}) {

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [password1, setPassword1] = useState();
    const [password2, setPassword2] = useState();

    const [registerSuccess, setRegisterSuccess] = useState(false);
    const [registerFail, setRegisterFail] = useState(false);

    let warning = <p>Ok</p>;

    const handleEmailChange = email => {
        setUserName(email);
        setRegisterSuccess(false);
        setRegisterFail(false);
    }

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
        if(password1 === password2) {
            const resp = await registerUser({
                username,
                password1
            })
            console.log(resp);
            if(resp.status === 400)
            {
                console.log("resp status 400");
                setRegisterSuccess(false);
                setRegisterFail(true);
            }
            else
            {
                setRegisterSuccess(true);
                setRegisterFail(false);
            }
        }
    }

    if (password1 !== password2 && password1.length > 0) {
        warning = <p>Hasła różnią się od siebie</p>;
    }

    if(registerSuccess) {
        warning = <p>Zarejestrowano pomyślnie, teraz możesz się zalogować</p>
    }

    if(registerFail) {
        warning = <p>Rejestracja nie powiodła się, użytkownik o takim adresie email już istnieje</p>
    }

    return(
        <div className="login-page">
            <div className="login-wrapper">
                <h1>Logowanie</h1>
                <form onSubmit={handleLogin}>
                    <label>
                        <p>Email</p>
                        <input type="text" onChange={e => handleEmailChange(e.target.value)}/>
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
                        <input type="password" onChange={e => setPassword1(e.target.value)}/>
                    </label>
                    <label>
                        <p>Powtórz hasło</p>
                        <input type="password" onChange={e => setPassword2(e.target.value)}/>
                    </label>
                    <p/>
                    {warning}
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