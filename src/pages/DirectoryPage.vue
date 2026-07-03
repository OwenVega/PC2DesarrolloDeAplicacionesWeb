<template>
  <q-page class="q-pa-md">
    <q-table
      title="Directorio Corporativo"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
      v-model:pagination="pagination"
      @request="onRequest"
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
          <q-btn
            dense
            round
            flat
            icon="visibility"
            @click="verDetalle(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface User {
  id: number
  firstName: string
  lastName: string
  fullName?: string
  age: number
  gender: string
  email: string
  image: string
  company?: { name: string; title: string }
  address?: { city: string; country: string }
}

interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

const api = axios.create({ baseURL: 'https://dummyjson.com' })

const rows = ref<User[]>([])
const loading = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const columns = [
  { name: 'photo', label: 'Foto', field: 'image', align: 'center' as const },
  { name: 'fullName', label: 'Nombre Completo', field: 'fullName', align: 'left' as const },
  { name: 'age', label: 'Edad', field: 'age', align: 'center' as const },
  { name: 'gender', label: 'Género', field: 'gender', align: 'center' as const },
  { name: 'email', label: 'Correo', field: 'email', align: 'left' as const },
  { name: 'company', label: 'Empresa', field: (row: User) => row.company?.name, align: 'left' as const },
  { name: 'position', label: 'Cargo', field: (row: User) => row.company?.title, align: 'left' as const },
  { name: 'city', label: 'Ciudad', field: (row: User) => row.address?.city, align: 'left' as const },
  { name: 'country', label: 'País', field: (row: User) => row.address?.country, align: 'left' as const },
  { name: 'actions', label: 'Acción', field: 'actions', align: 'center' as const },
]

async function fetchUsers(limit: number, skip: number) {
  loading.value = true
  try {
    const { data } = await api.get<UsersResponse>('/users', { params: { limit, skip } })
    rows.value = data.users.map((u) => ({
      ...u,
      fullName: `${u.firstName} ${u.lastName}`,
    }))
    pagination.value.rowsNumber = data.total
  } finally {
    loading.value = false
  }
}

interface RequestProp {
  pagination: {
    page: number
    rowsPerPage: number
  }
}

function onRequest(requestProp: RequestProp) {
  const { page, rowsPerPage } = requestProp.pagination
  const skip = (page - 1) * rowsPerPage
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  void fetchUsers(rowsPerPage, skip)
}

function verDetalle(id: number) {
  console.log('detalle de usuario', id)
}

onMounted(() => {
  onRequest({ pagination: pagination.value })
})
</script>