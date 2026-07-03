<template>
  <q-page class="q-pa-md">

    <div class="q-mb-md">
      <q-input
        v-model="searchQuery"
        outlined
        dense
        clearable
        debounce="500"
        placeholder="Buscar por nombre o apellido..."
        :loading="loading"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="text-grey text-caption q-mb-sm">
      Total de resultados: {{ pagination.rowsNumber }}
    </div>

    <q-table
      title="Directorio Corporativo"
      :rows="displayRows"
      :columns="columns"
      row-key="id"
      :loading="loading"
      loading-label="Consultando usuarios..."
      no-data-label="No se encontraron coincidencias."
      v-model:pagination="pagination"
      @request="onRequest"
    >

      <template #body-cell-photo="props">
        <q-td :props="props">
          <q-avatar size="40px">
            <img :src="props.row.image">
          </q-avatar>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense
            flat
            round
            icon="visibility"
            @click="verDetalle(props.row.id)"
          >
            <q-tooltip>
              Ver información del usuario
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template #no-data>
        <div class="q-pa-md text-center text-grey">
          No se encontraron usuarios con la búsqueda realizada.
        </div>
      </template>

    </q-table>

    <UserDetail
      :userId="selectedUserId"
      @update:userId="selectedUserId = $event"
    />

  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import UserDetail from 'src/components/UserDetail.vue'

interface User {
  id: number
  firstName: string
  lastName: string
  fullName?: string
  age: number
  gender: string
  email: string
  image: string
  company?: {
    name: string
    title: string
  }
  address?: {
    city: string
    country: string
  }
}

interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

const api = axios.create({
  baseURL: 'https://dummyjson.com',
})

const rows = ref<User[]>([])
const displayRows = ref<User[]>([])
const allUsers = ref<User[]>([])

const loading = ref(false)

const selectedUserId = ref<number | null>(null)

const searchQuery = ref('')

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const columns = [
  {
    name: 'photo',
    label: 'Foto',
    field: 'image',
    align: 'center' as const,
  },
  {
    name: 'fullName',
    label: 'Nombre Completo',
    field: 'fullName',
    align: 'left' as const,
  },
  {
    name: 'age',
    label: 'Edad',
    field: 'age',
    align: 'center' as const,
  },
  {
    name: 'gender',
    label: 'Género',
    field: 'gender',
    align: 'center' as const,
  },
  {
    name: 'email',
    label: 'Correo',
    field: 'email',
    align: 'left' as const,
  },
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
  {
    name: 'actions',
    label: 'Acción',
    field: 'actions',
    align: 'center' as const,
  },
]

function prepareUsers(users: User[]) {
  return users.map(user => ({
    ...user,
    fullName: [user.firstName, user.lastName]
      .filter(Boolean)
      .join(' '),
  }))
}

async function fetchUsers(limit: number, skip: number) {
  loading.value = true

  try {

    const text = searchQuery.value.trim()

    const endpoint =
      text.length > 0
        ? '/users/search'
        : '/users'

    const params: {
      limit: number
      skip: number
      q?: string
    } = {
      limit,
      skip,
    }

    if (text.length > 0) {
      params.q = text
    }

    const { data } = await api.get<UsersResponse>(
      endpoint,
      { params }
    )

    rows.value = prepareUsers(data.users)
    displayRows.value = rows.value

    pagination.value.rowsNumber = data.total

  } catch (error) {

    console.error(error)

  } finally {

    loading.value = false

  }
}

async function fetchAllUsers() {

  try {

    const { data } = await api.get<UsersResponse>(
      '/users',
      {
        params: {
          limit: 200,
        },
      }
    )

    allUsers.value = prepareUsers(data.users)

  } catch (error) {

    console.error(error)

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

  pagination.value.page = page

  pagination.value.rowsPerPage = rowsPerPage

  const skip =
    (page - 1) * rowsPerPage

  void fetchUsers(rowsPerPage, skip)

}

watch(searchQuery, (newValue, oldValue) => {

  const current = newValue.trim()

  const previous = oldValue.trim()

  if (current === previous) {
    return
  }

  pagination.value.page = 1

  onRequest({
    pagination: pagination.value,
  })

})

function verDetalle(id: number) {

  selectedUserId.value = id

}

onMounted(() => {

  onRequest({
    pagination: pagination.value,
  })

  void fetchAllUsers()

})
</script>