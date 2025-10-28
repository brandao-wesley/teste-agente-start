from fastapi import FastAPI

app = FastAPI()

@app.get('/saude')
def handler():
    return {'status': 'ok'}
