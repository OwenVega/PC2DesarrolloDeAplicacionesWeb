<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <q-input
        v-model="searchQuery"
        outlined
        dense
        placeholder="Buscar por nombre o apellido..."
        debounce="500"
        clearable
        :loading="loading"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <q-table
      title="Directorio Corporativo"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
      v-model:pagination="pagination"
      @request="onRequest"
      no-data-label="No se encontraron coincidencias con la búsqueda."
    >
      <template v-slot:body-cell-photo="props">
        <q-td :props="props">
          <q-avatar size="40px">
            <img :src="props.row.image" />
          </q-avatar>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn dense round flat icon="visibility" @click="verDetalle(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <UserDetail :userId="selectedUserId" @update:userId="selectedUserId = $event" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import UserDetail from 'src/components/UserDetail.vue';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  age: number;
  gender: string;
  email: string;
  image: string;
  company?: { name: string; title: string };
  address?: { city: string; country: string };
}

interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

const api = axios.create({ baseURL: 'https://dummyjson.com' });

const rows = ref<User[]>([]);
const loading = ref(false);
const selectedUserId = ref<number | null>(null);
const searchQuery = ref<string | null>('');

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const columns = [
  { name: 'photo', label: 'Foto', field: 'image', align: 'center' as const },
  { name: 'fullName', label: 'Nombre Completo', field: 'fullName', align: 'left' as const },
  { name: 'age', label: 'Edad', field: 'age', align: 'center' as const },
  { name: 'gender', label: 'Género', field: 'gender', align: 'center' as const },
  { name: 'email', label: 'Correo', field: 'email', align: 'left' as const },
  {
    name: 'company',
    label: 'Empresa',
    field: (row: User) => row.company?.name,
    align: 'left' as const,
  },
  {
    name: 'position',
    label: 'Cargo',
    field: (row: User) => row.company?.title,
    align: 'left' as const,
  },
  {
    name: 'city',
    label: 'Ciudad',
    field: (row: User) => row.address?.city,
    align: 'left' as const,
  },
  {
    name: 'country',
    label: 'País',
    field: (row: User) => row.address?.country,
    align: 'left' as const,
  },
  { name: 'actions', label: 'Acción', field: 'actions', align: 'center' as const },
];

async function fetchUsers(limit: number, skip: number) {
  loading.value = true;
  try {
    const query = searchQuery.value || '';
    const isSearching = query.trim() !== '';

    const endpoint = isSearching ? '/users/search' : '/users';
    const params: { limit: number; skip: number; q?: string } = { limit, skip };

    if (isSearching) {
      params.q = query.trim();
    }

    const { data } = await api.get<UsersResponse>(endpoint, { params });

    rows.value = data.users.map((u) => ({
      ...u,
      fullName: `${u.firstName} ${u.lastName}`,
    }));
    pagination.value.rowsNumber = data.total;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

interface RequestProp {
  pagination: {
    page: number;
    rowsPerPage: number;
  };
}

function onRequest(requestProp: RequestProp) {
  const { page, rowsPerPage } = requestProp.pagination;
  const skip = (page - 1) * rowsPerPage;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  void fetchUsers(rowsPerPage, skip);
}

watch(searchQuery, () => {
  pagination.value.page = 1;
  onRequest({ pagination: pagination.value });
});

function verDetalle(id: number) {
  selectedUserId.value = id;
}

onMounted(() => {
  onRequest({ pagination: pagination.value });
});
</script>
