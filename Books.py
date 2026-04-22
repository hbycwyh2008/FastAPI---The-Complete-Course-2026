from fastapi import FastAPI
app = FastAPI()
Books = [
    {'title':'Title One','author':'Author One','Category':'Science'},
    {'title':'Title Two','author':'Author Two','Category':'Science'},
    {'title':'Title Three','author':'Author Three','Category':'Math'},
    {'title':'Title Four','author':'Author Four','Category':'Math'},
    {'title':'Title Five','author':'Author Five','Category':'Math'},
    {'title':'Title Six','author':'Author One','Category':'Science'},
]
@app.get("/")
async def read_books():
    return Books