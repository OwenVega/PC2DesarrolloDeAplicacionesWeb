import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  image: string;
  university?: string;
  height?: number;
  weight?: number;
  bloodGroup?: string;
  company?: { name: string; title: string; department?: string };
  address?: { city: string; country: string };
}

interface UsersResponse {
  users: User[];
  total: number;
}

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const loaded = ref(false);

  async function fetchAllUsers() {
    if (loaded.value) return;
    loading.value = true;
    try {
      const { data } = await axios.get<UsersResponse>('https://dummyjson.com/users?limit=0');
      users.value = data.users;
      loaded.value = true;
    } finally {
      loading.value = false;
    }
  }

  return { users, loading, loaded, fetchAllUsers };
});
