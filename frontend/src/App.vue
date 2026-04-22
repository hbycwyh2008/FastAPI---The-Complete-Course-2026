<!--
  Vue 3 + Bootstrap 5 — calls every Books.py route from the browser.
-->
<script setup>
import { onMounted, ref } from 'vue'
import {
  addBook,
  asList,
  getBookByTitle,
  getBooks,
  getBooksByAuthorCategory,
  getBooksByCategory,
  removeBook,
  updateBook,
} from './api/books.js'

const books = ref([])
const note = ref('')
const busy = ref(false)

// Add form
const title = ref('')
const author = ref('')
const category = ref('')

// Search / filters
const findTitle = ref('')
const filterCategory = ref('')
const filterAuthor = ref('')

// Edit (backend finds row by title; title stays the same here)
const editingTitle = ref('')
const editAuthor = ref('')
const editCategory = ref('')

function setNote(msg) {
  note.value = msg
}

async function loadBooks() {
  busy.value = true
  note.value = ''
  try {
    books.value = asList(await getBooks())
    setNote('')
  } catch (e) {
    setNote(e instanceof Error ? e.message : 'Could not load books.')
    books.value = []
  } finally {
    busy.value = false
  }
}

async function handleFindByTitle() {
  const t = findTitle.value.trim()
  if (!t) {
    setNote('Type a title to search.')
    return
  }
  busy.value = true
  note.value = ''
  try {
    const one = await getBookByTitle(t)
    if (one == null) {
      books.value = []
      setNote('No book with that title.')
    } else {
      books.value = [one]
      setNote('Showing search result (one book).')
    }
  } catch (e) {
    setNote(e instanceof Error ? e.message : 'Search failed.')
    books.value = []
  } finally {
    busy.value = false
  }
}

async function handleFilterCategory() {
  const c = filterCategory.value.trim()
  if (!c) {
    setNote('Enter a category.')
    return
  }
  busy.value = true
  note.value = ''
  try {
    books.value = asList(await getBooksByCategory(c))
    setNote('Filtered by category: ' + c)
  } catch (e) {
    setNote(e instanceof Error ? e.message : 'Filter failed.')
    books.value = []
  } finally {
    busy.value = false
  }
}

async function handleFilterAuthorCategory() {
  const a = filterAuthor.value.trim()
  const c = filterCategory.value.trim()
  if (!a || !c) {
    setNote('Enter both author and category for this filter.')
    return
  }
  busy.value = true
  note.value = ''
  try {
    books.value = asList(await getBooksByAuthorCategory(a, c))
    setNote('Filtered by author + category.')
  } catch (e) {
    setNote(e instanceof Error ? e.message : 'Filter failed.')
    books.value = []
  } finally {
    busy.value = false
  }
}

async function handleAdd() {
  const t = title.value.trim()
  const a = author.value.trim()
  const c = category.value.trim()
  if (!t || !a || !c) {
    setNote('Please fill in title, author, and category.')
    return
  }
  busy.value = true
  note.value = ''
  try {
    await addBook({ title: t, author: a, category: c })
    title.value = ''
    author.value = ''
    category.value = ''
    setNote('Book added.')
    cancelEdit()
    await loadBooks()
  } catch (e) {
    setNote(e instanceof Error ? e.message : 'Could not add book.')
  } finally {
    busy.value = false
  }
}

function startEdit(b) {
  editingTitle.value = b.title
  editAuthor.value = b.author
  editCategory.value = b.category
  setNote('Editing: change author/category, then Save. (Title is the id for the API.)')
}

function cancelEdit() {
  editingTitle.value = ''
  editAuthor.value = ''
  editCategory.value = ''
}

async function handleSaveEdit() {
  if (!editingTitle.value) return
  const a = editAuthor.value.trim()
  const c = editCategory.value.trim()
  if (!a || !c) {
    setNote('Author and category cannot be empty.')
    return
  }
  busy.value = true
  note.value = ''
  try {
    await updateBook({
      title: editingTitle.value,
      author: a,
      category: c,
    })
    setNote('Book updated.')
    cancelEdit()
    await loadBooks()
  } catch (e) {
    setNote(e instanceof Error ? e.message : 'Could not update book.')
  } finally {
    busy.value = false
  }
}

async function handleDelete(bookTitle) {
  if (!window.confirm('Delete "' + bookTitle + '"?')) return
  busy.value = true
  note.value = ''
  try {
    await removeBook(bookTitle)
    if (editingTitle.value === bookTitle) cancelEdit()
    setNote('Book deleted.')
    await loadBooks()
  } catch (e) {
    setNote(e instanceof Error ? e.message : 'Could not delete book.')
  } finally {
    busy.value = false
  }
}

onMounted(() => {
  loadBooks()
})
</script>

<template>
  <div class="container py-4" style="max-width: 960px">
    <h1 class="h2 mb-2">My Book List</h1>
    <p class="text-muted small mb-3">
      API:
      <code class="small">uvicorn Books:app --reload</code>
      · UI:
      <code class="small">npm run dev</code>
    </p>

    <div v-if="note" class="alert alert-info py-2 mb-3" role="alert">{{ note }}</div>

    <div v-if="busy" class="d-flex align-items-center gap-2 text-muted mb-3">
      <span class="spinner-border spinner-border-sm" aria-hidden="true" />
      <span>Loading…</span>
    </div>

    <!-- GET /books/title/{title} -->
    <div class="card shadow-sm mb-3">
      <div class="card-header fw-semibold">Find by title</div>
      <div class="card-body">
        <div class="row g-2 align-items-end">
          <div class="col-md-8">
            <label class="form-label mb-0" for="find-title">Title</label>
            <input id="find-title" v-model="findTitle" type="text" class="form-control" placeholder="e.g. Title One" />
          </div>
          <div class="col-md-4">
            <button type="button" class="btn btn-outline-primary w-100" :disabled="busy" @click="handleFindByTitle">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- GET /books/?category=  and  GET /books/author/{author}?category= -->
    <div class="card shadow-sm mb-3">
      <div class="card-header fw-semibold">Filters</div>
      <div class="card-body">
        <div class="row g-2 mb-2">
          <div class="col-md-4">
            <label class="form-label mb-0" for="flt-cat">Category</label>
            <input id="flt-cat" v-model="filterCategory" type="text" class="form-control" placeholder="Science" />
          </div>
          <div class="col-md-4">
            <label class="form-label mb-0" for="flt-auth">Author (for 2nd filter)</label>
            <input id="flt-auth" v-model="filterAuthor" type="text" class="form-control" placeholder="Author One" />
          </div>
          <div class="col-md-4 d-flex flex-column gap-1 pt-md-4">
            <button type="button" class="btn btn-sm btn-outline-primary" :disabled="busy" @click="handleFilterCategory">
              By category only
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-primary"
              :disabled="busy"
              @click="handleFilterAuthorCategory"
            >
              By author + category
            </button>
            <button type="button" class="btn btn-sm btn-secondary" :disabled="busy" @click="loadBooks">Show all</button>
          </div>
        </div>
      </div>
    </div>

    <!-- POST /books/create_book -->
    <div class="card shadow-sm mb-3">
      <div class="card-header fw-semibold">Add a book</div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label" for="f-title">Title</label>
            <input id="f-title" v-model="title" type="text" class="form-control" placeholder="e.g. Title Seven" />
          </div>
          <div class="col-md-4">
            <label class="form-label" for="f-author">Author</label>
            <input id="f-author" v-model="author" type="text" class="form-control" placeholder="e.g. Author Seven" />
          </div>
          <div class="col-md-4">
            <label class="form-label" for="f-cat">Category</label>
            <input id="f-cat" v-model="category" type="text" class="form-control" placeholder="e.g. Science" />
          </div>
        </div>
        <button type="button" class="btn btn-primary mt-3" :disabled="busy" @click="handleAdd">Add book</button>
      </div>
    </div>

    <!-- PUT /books/update_book -->
    <div v-if="editingTitle" class="card shadow-sm border-primary mb-3">
      <div class="card-header fw-semibold d-flex justify-content-between align-items-center">
        <span>Edit book</span>
        <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="busy" @click="cancelEdit">Cancel</button>
      </div>
      <div class="card-body">
        <p class="small text-muted mb-2">
          Backend route:
          <code>PUT /books/update_book</code>
          — it finds the row by <strong>title</strong>.
        </p>
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Title (fixed)</label>
            <input type="text" class="form-control" :value="editingTitle" disabled />
          </div>
          <div class="col-md-4">
            <label class="form-label" for="e-auth">Author</label>
            <input id="e-auth" v-model="editAuthor" type="text" class="form-control" />
          </div>
          <div class="col-md-4">
            <label class="form-label" for="e-cat">Category</label>
            <input id="e-cat" v-model="editCategory" type="text" class="form-control" />
          </div>
        </div>
        <button type="button" class="btn btn-success mt-3" :disabled="busy" @click="handleSaveEdit">Save changes</button>
      </div>
    </div>

    <!-- Table uses whatever list is loaded (all / filter / search) -->
    <div class="card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span class="fw-semibold">Books</span>
        <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="busy" @click="loadBooks">
          Refresh (GET /books)
        </button>
      </div>
      <div class="card-body">
        <p v-if="!busy && books.length === 0" class="text-muted mb-0">No rows to show.</p>
        <div v-else class="table-responsive">
          <table class="table table-striped table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Author</th>
                <th scope="col">Category</th>
                <th scope="col" class="text-end" style="width: 8rem">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in books" :key="b.title">
                <td>{{ b.title }}</td>
                <td>{{ b.author }}</td>
                <td><span class="badge text-bg-secondary">{{ b.category }}</span></td>
                <td class="text-end text-nowrap">
                  <button type="button" class="btn btn-sm btn-outline-primary me-1" :disabled="busy" @click="startEdit(b)">
                    Edit
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    :disabled="busy"
                    @click="handleDelete(b.title)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
