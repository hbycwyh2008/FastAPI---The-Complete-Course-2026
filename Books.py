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
@app.get("/books")
async def read_books():
    return Books


@app.get("/books/{book_title}")
async def read_books(book_title: str):
    for book in Books:
        if book.get('title').casefold() == book_title.casefold():
            return book