from fastapi import FastAPI
from pydantic import BaseModel
import psycopg2

app = FastAPI()

class Appointment(BaseModel):
    id: int
    name: str
    date: str

@app.get("/appointments/")
async def read_appointments():
    return []

@app.post("/appointments/")
async def create_appointment(appointment: Appointment):
    return appointment
