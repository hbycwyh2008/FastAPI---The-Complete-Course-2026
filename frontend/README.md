# Simple Book List (Vue 3 + Bootstrap 5)

For students: this is a **small** page that talks to your FastAPI `Books.py`.  
Styling uses **Bootstrap** classes (`container`, `card`, `btn`, `table`, …) — see [Bootstrap docs](https://getbootstrap.com/docs/5.3/getting-started/introduction/).

## Run

1. Terminal A (project root): `uvicorn Books:app --reload`
2. Terminal B (`frontend` folder): `npm install` then `npm run dev`
3. Open the URL Vite prints (usually `http://127.0.0.1:5173`).

## Files

- `src/App.vue` — UI wired to every FastAPI route.
- `src/api/books.js` — one function per route (see comments in that file).

## API map (same as `Books.py`)

| UI section | HTTP |
|------------|------|
| Refresh / Show all | `GET /books` |
| Find by title | `GET /books/title/{title}` |
| By category only | `GET /books/?category=…` |
| By author + category | `GET /books/author/{author}?category=…` |
| Add a book | `POST /books/create_book` |
| Save changes (edit) | `PUT /books/update_book` |
| Delete | `DELETE /books/title/{title}` |

Try changing a label, a color in `style.css`, or the success message after adding a book.
