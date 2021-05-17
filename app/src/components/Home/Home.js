import React from 'react';
import { useHistory } from 'react-router-dom';

export default function Home() {
    const history = useHistory();

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
        </>
    );
};
