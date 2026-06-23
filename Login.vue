<script setup> 
import { ref } from 'vue'; 
import { useRouter } from 'vue-router'; 
import { useAuth } from '../stores/auth'; 
  
const auth = useAuth(); 
const router = useRouter(); 
const email = ref('member@books.test'); 
const password = ref('password'); 
const error = ref(''); 
  
async function submit() { 
  try { 
    await auth.login(email.value, password.value); 
    router.push('/'); 
  } catch (e) { 
    error.value = e.response?.data?.error || e.message; 
  } 
} 
</script> 
  
<template> 
  <p v-if="error" style="color:red">{{ error }}</p> 
  <input v-model="email" placeholder="Email" /> 
  <input v-model="password" type="password" placeholder="Password" /> 
  <button @click="submit">Sign in</button> 
</template> 