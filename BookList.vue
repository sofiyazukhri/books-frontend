<script setup> 
import { ref, onMounted } from 'vue'; 
import api from '../api/client'; 
import { useAuth } from '../stores/auth'; 
import BookForm from '../components/BookForm.vue'; 
  
const books = ref([]); 
const q = ref(''); 
const showCreateForm = ref(false); 
const editingBook = ref(null); 

const authStore = useAuth(); 

function handleBookCreated() {
  showCreateForm.value = false;
  load(); 
}

// Refreshes the list and closes the edit block cleanly
function handleBookUpdated() {
  editingBook.value = null;
  load();
}

async function load() { 
  const { data } = await api.get('/api/books', { params: { q: q.value || undefined } }); 
  books.value = data.data; 
} 

async function removeBook(id) {
  if (confirm("Are you sure you want to delete this book?")) {
    try {
      await api.delete(`/api/books/${id}`);
      load(); // Refresh the list automatically after deletion
    } catch (error) {
      alert(error.response?.data?.error || "Failed to delete book");
    }
  }
}

onMounted(load); 
</script> 

<template> 
  <div style="margin-bottom: 20px;">
    <button @click="showCreateForm = !showCreateForm">
      {{ showCreateForm ? 'Cancel' : '+ New Book' }}
    </button>
  </div>

  <div v-if="showCreateForm" style="margin-bottom: 20px; padding: 15px; border: 1px solid #ccc; max-width: 400px;">
    <h3>Add New Book</h3>
    <BookForm @saved="handleBookCreated" />
  </div>

  <div v-if="editingBook" style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0f7fa; max-width: 400px;">
    <h3>Edit Book: {{ editingBook.title }}</h3>
    <BookForm :key="editingBook.id" :book="editingBook" @saved="handleBookUpdated" @cancel="editingBook = null" />
  </div>

  <hr style="margin-bottom: 20px;" />

  <input v-model="q" @keyup.enter="load" placeholder="Search title or author" /> 
  <button @click="load">Search</button> 
  
  <ul> 
    <li v-for="b in books" :key="b.id" style="margin-bottom: 10px;"> 
      <strong>{{ b.title }}</strong> — {{ b.author }} ({{ b.year }}) 
      
      <button 
        v-if="b.created_by === authStore.user?.id" 
        @click="editingBook = b" 
        style="margin-left: 10px; background-color: #4caf50; color: white;"
      >
        Edit
      </button>

      <button 
        v-else 
        @click="editingBook = b" 
        style="margin-left: 10px; background-color: #f44336; color: white;"
      >
        Edit 
      </button>

      <button 
        @click="removeBook(b.id)" 
        style="margin-left: 10px; background-color: #333; color: white;"
      >
        Delete
      </button>
    </li> 
  </ul> 
</template>