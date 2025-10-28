import React, { useState } from 'react';

function AppointmentForm() {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // lógica para enviar dados
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <button type="submit">Agendar</button>
        </form>
    );
}

export default AppointmentForm;