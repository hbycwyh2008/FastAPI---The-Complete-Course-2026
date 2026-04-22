/**
 * All Book API routes (same paths as Books.py).
 * Dev: Vite proxies /books → http://127.0.0.1:8000
 */

const JSON_HDR = { 'Content-Type': 'application/json' }
const base = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')
const url = (path) => base + path

async function readJson(res) {
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = data && data.detail ? data.detail : res.statusText
    throw new Error(msg)
  }
  return data
}

/** Normalize: API may return one object or an array */
export function asList(data) {
  if (data == null) return []
  return Array.isArray(data) ? data : [data]
}

/** GET /books */
export function getBooks() {
  return fetch(url('/books')).then(readJson)
}

/** GET /books/title/{title} — may return null if not found */
export function getBookByTitle(title) {
  return fetch(url('/books/title/' + encodeURIComponent(title))).then(readJson)
}

/** GET /books/?category= */
export function getBooksByCategory(category) {
  const q = new URLSearchParams({ category })
  return fetch(url('/books/?' + q)).then(readJson)
}

/** GET /books/author/{author}?category= */
export function getBooksByAuthorCategory(author, category) {
  const q = new URLSearchParams({ category })
  return fetch(url('/books/author/' + encodeURIComponent(author) + '?' + q)).then(readJson)
}

/** POST /books/create_book */
export function addBook(book) {
  return fetch(url('/books/create_book'), {
    method: 'POST',
    headers: JSON_HDR,
    body: JSON.stringify(book),
  }).then(readJson)
}

/** PUT /books/update_book (matches existing book by title) */
export function updateBook(book) {
  return fetch(url('/books/update_book'), {
    method: 'PUT',
    headers: JSON_HDR,
    body: JSON.stringify(book),
  }).then(readJson)
}

/** DELETE /books/title/{title} */
export function removeBook(title) {
  return fetch(url('/books/title/' + encodeURIComponent(title)), {
    method: 'DELETE',
  }).then(readJson)
}
