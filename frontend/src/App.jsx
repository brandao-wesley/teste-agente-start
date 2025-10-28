import React from 'react';
import { AppointmentForm, AppointmentList } from './components';

function App() {
  return (
    <div>
      <h1>Sistema de Agendamento</h1>
      <AppointmentForm />
      <AppointmentList />
    </div>
  );
}

export default App;