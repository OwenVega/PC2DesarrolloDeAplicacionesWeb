<template>
  <q-page class="q-pa-md">

    <!-- BUSCADOR -->
    <div class="q-mb-md">
      <q-input
        v-model="searchQuery"
        outlined
        dense
        clearable
        debounce="500"
        placeholder="Buscar por nombre..."
        :loading="loading"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- FILTROS -->
    <div class="row q-col-gutter-md q-mb-md">

      <div class="col-12 col-md-2">
        <q-select
          v-model="genderFilter"
          :options="genderOptions"
          label="Género"
          outlined
          clearable
        />
      </div>

      <div class="col-12 col-md-2">
        <q-input v-model.number="minAge" type="number" label="Edad mín" outlined />
      </div>

      <div class="col-12 col-md-2">
        <q-input v-model.number="maxAge" type="number" label="Edad máx" outlined />
      </div>

      <div class="col-12 col-md-2">
        <q-select
          v-model="companyFilter"
          :options="companyOptions"
          label="Empresa"
          outlined
          clearable
        />
      </div>

      <div class="col-12 col-md-2">
        <q-select
          v-model="cityFilter"
          :options="cityOptions"
          label="Ciudad"
          outlined
          clearable
        />
      </div>

      <div class="col-12 col-md-2">
        <q-select
          v-model="countryFilter"
          :options="countryOptions"
          label="País"
          outlined
          clearable
        />
      </div>

    </div>

    <!-- TABLA (CORREGIDA SEGÚN PDF) -->
    <q-table
      title="Directorio Corporativo"
      :rows="displayRows"
      :columns="columns"
      row-key="id"
      :loading="loading"
    >

      <!-- FOTO -->
      <template #body-cell-photo="props">
        <q-td :props="props">
          <q-avatar size="40px">
            <img :src="props.row.image" />
          </q-avatar>
        </q-td>
      </template>

      <!-- BOTÓN OJO (DETALLE) -->
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            icon="visibility"
            flat
            round
            color="primary"
            @click="verDetalle(props.row.id)"
          />
        </q-td>
      </template>

    </q-table>

    <!-- DETALLE -->
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

  // IMPORTANTE PARA PDF
  company?: { name: string; title: string }
  address?: { city: string; country: string }
}

const api = axios.create({ baseURL: 'https://dummyjson.com' })

const allUsers = ref<User[]>([])
const displayRows = ref<User[]>([])
const loading = ref(false)

const searchQuery = ref('')
const selectedUserId = ref<number | null>(null)

const genderFilter = ref<string | null>(null)
const companyFilter = ref<string | null>(null)
const cityFilter = ref<string | null>(null)
const countryFilter = ref<string | null>(null)

const minAge = ref<number | null>(null)
const maxAge = ref<number | null>(null)

const genderOptions = ['male', 'female']
const companyOptions = ref<string[]>([])
const cityOptions = ref<string[]>([])
const countryOptions = ref<string[]>([])

/* =========================
   COLUMNAS (CORREGIDO PDF)
========================= */
const columns = [
  { name: 'photo', label: 'Foto', field: 'image', align: 'center' as const },
  { name: 'fullName', label: 'Nombre', field: 'fullName', align: 'left' as const },
  { name: 'age', label: 'Edad', field: 'age', align: 'center' as const },
  { name: 'gender', label: 'Género', field: 'gender', align: 'center' as const },
  { name: 'email', label: 'Correo', field: 'email', align: 'left' as const },

  // 🔥 LO QUE TE FALTABA DEL PDF
  {
    name: 'company',
    label: 'Empresa',
    field: (r: User) => r.company?.name,
    align: 'left' as const
  },
  {
    name: 'position',
    label: 'Cargo',
    field: (r: User) => r.company?.title,
    align: 'left' as const
  },
  {
    name: 'city',
    label: 'Ciudad',
    field: (r: User) => r.address?.city,
    align: 'left' as const
  },
  {
    name: 'country',
    label: 'País',
    field: (r: User) => r.address?.country,
    align: 'left' as const
  },

  { name: 'actions', label: 'Acción', field: 'actions' }
]

/* =========================
   PREPARAR DATOS
========================= */
function prepare(users: User[]) {
  return users.map(u => ({
    ...u,
    fullName: `${u.firstName} ${u.lastName}`
  }))
}

/* =========================
   CARGA DE DATOS
========================= */
async function fetchAllUsers() {
  loading.value = true

  try {
    const { data } = await api.get('/users?limit=200')

    allUsers.value = prepare(data.users)
    displayRows.value = allUsers.value

    companyOptions.value = [...new Set(allUsers.value.map(u => u.company?.name).filter(Boolean))] as string[]
    cityOptions.value = [...new Set(allUsers.value.map(u => u.address?.city).filter(Boolean))] as string[]
    countryOptions.value = [...new Set(allUsers.value.map(u => u.address?.country).filter(Boolean))] as string[]

  } finally {
    loading.value = false
  }
}

/* =========================
   FILTROS (PREGUNTA 7)
========================= */
function applyFilters() {
  let result = [...allUsers.value]

  const text = searchQuery.value.toLowerCase()

  if (text) {
    result = result.filter(u =>
      (u.fullName ?? '').toLowerCase().includes(text)
    )
  }

  if (genderFilter.value) {
    result = result.filter(u => u.gender === genderFilter.value)
  }

  if (companyFilter.value) {
    result = result.filter(u => u.company?.name === companyFilter.value)
  }

  if (cityFilter.value) {
    result = result.filter(u => u.address?.city === cityFilter.value)
  }

  if (countryFilter.value) {
    result = result.filter(u => u.address?.country === countryFilter.value)
  }

  if (minAge.value != null) {
    result = result.filter(u => u.age >= (minAge.value as number))
  }

  if (maxAge.value != null) {
    result = result.filter(u => u.age <= (maxAge.value as number))
  }

  displayRows.value = result
}

/* =========================
   REACTIVIDAD
========================= */
watch(
  [
    searchQuery,
    genderFilter,
    companyFilter,
    cityFilter,
    countryFilter,
    minAge,
    maxAge
  ],
  applyFilters
)

/* =========================
   DETALLE
========================= */
function verDetalle(id: number) {
  selectedUserId.value = id
}

onMounted(() => {
  void fetchAllUsers()
})
</script>