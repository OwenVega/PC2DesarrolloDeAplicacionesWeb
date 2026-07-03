<template>
  <q-dialog v-model="show" maximized>
    <q-card>

      <q-bar class="bg-primary text-white">
        <div class="text-h6">Detalle del Usuario</div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>

      <!-- LOADING USER -->
      <q-card-section v-if="loading" class="flex flex-center q-pa-xl">
        <q-spinner color="primary" size="80px" />
      </q-card-section>

      <q-card-section v-else>

        <!-- HEADER -->
        <div class="flex flex-center q-mb-md">
          <q-avatar size="100px">
            <img :src="user.image || ''" />
          </q-avatar>

          <div class="q-ml-md">
            <div class="text-h5">
              {{ user.firstName }} {{ user.lastName }}
            </div>
            <div class="text-subtitle1 text-grey">
              {{ user.username || '-' }}
            </div>
          </div>
        </div>

        <!-- TABS -->
        <q-tabs v-model="tab" dense align="justify" class="bg-primary text-white">
          <q-tab name="personal" label="Personal" />
          <q-tab name="laboral" label="Laboral" />
          <q-tab name="direccion" label="Dirección" />
          <q-tab name="banco" label="Banco" />
          <q-tab name="fisica" label="Física" />
          <q-tab name="crypto" label="Crypto" />
          <q-tab name="compras" label="Compras" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>

          <!-- PERSONAL -->
          <q-tab-panel name="personal">
            <div class="text-h6 q-mb-md text-primary">DATOS PERSONALES</div>

            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Edad</q-item-label>
                  <q-item-label>{{ user.age ?? '-' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Género</q-item-label>
                  <q-item-label>{{ user.gender ?? '-' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Email</q-item-label>
                  <q-item-label>{{ user.email ?? '-' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Teléfono</q-item-label>
                  <q-item-label>{{ user.phone ?? '-' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Universidad</q-item-label>
                  <q-item-label>{{ user.university ?? '-' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>

          <!-- LABORAL -->
          <q-tab-panel name="laboral">
            <div class="text-h6 q-mb-md text-primary">INFORMACIÓN LABORAL</div>

            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Empresa</q-item-label>
                  <q-item-label>{{ user.company?.name ?? '-' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Cargo</q-item-label>
                  <q-item-label>{{ user.company?.title ?? '-' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Departamento</q-item-label>
                  <q-item-label>{{ user.company?.department ?? '-' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>

          <!-- DIRECCIÓN -->
          <q-tab-panel name="direccion">
            <div class="text-h6 q-mb-md text-primary">DIRECCIÓN</div>

            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Dirección</q-item-label>
                  <q-item-label>{{ user.address?.address ?? '-' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Ciudad</q-item-label>
                  <q-item-label>{{ user.address?.city ?? '-' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>País</q-item-label>
                  <q-item-label>{{ user.address?.country ?? '-' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Código Postal</q-item-label>
                  <q-item-label>{{ user.address?.postalCode ?? '-' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>

          <!-- BANCO -->
          <q-tab-panel name="banco">
            <div class="text-h6 q-mb-md text-primary">INFORMACIÓN BANCARIA</div>

            <q-list>
              <q-item>
                <q-item-label caption>Número de tarjeta</q-item-label>
                <q-item-label>{{ user.bank?.cardNumber ?? '-' }}</q-item-label>
              </q-item>

              <q-item>
                <q-item-label caption>Tipo de tarjeta</q-item-label>
                <q-item-label>{{ user.bank?.cardType ?? '-' }}</q-item-label>
              </q-item>

              <q-item>
                <q-item-label caption>Moneda</q-item-label>
                <q-item-label>{{ user.bank?.currency ?? '-' }}</q-item-label>
              </q-item>

              <q-item>
                <q-item-label caption>IBAN</q-item-label>
                <q-item-label>{{ user.bank?.iban ?? '-' }}</q-item-label>
              </q-item>
            </q-list>
          </q-tab-panel>

          <!-- FÍSICA -->
          <q-tab-panel name="fisica">
            <div class="text-h6 q-mb-md text-primary">CARACTERÍSTICAS FÍSICAS</div>

            <q-list>
              <q-item>
                <q-item-label caption>Altura</q-item-label>
                <q-item-label>{{ user.height ?? '-' }} cm</q-item-label>
              </q-item>

              <q-item>
                <q-item-label caption>Peso</q-item-label>
                <q-item-label>{{ user.weight ?? '-' }} kg</q-item-label>
              </q-item>

              <q-item>
                <q-item-label caption>Tipo de sangre</q-item-label>
                <q-item-label>{{ user.bloodGroup ?? '-' }}</q-item-label>
              </q-item>

              <q-item>
                <q-item-label caption>Color de ojos</q-item-label>
                <q-item-label>{{ user.eyeColor ?? '-' }}</q-item-label>
              </q-item>
            </q-list>
          </q-tab-panel>

          <!-- CRYPTO -->
          <q-tab-panel name="crypto">
            <div class="text-h6 q-mb-md text-primary">INFORMACIÓN CRYPTO</div>

            <q-list>
              <q-item>
                <q-item-label caption>Moneda</q-item-label>
                <q-item-label>{{ user.crypto?.coin ?? '-' }}</q-item-label>
              </q-item>

              <q-item>
                <q-item-label caption>Wallet</q-item-label>
                <q-item-label>{{ user.crypto?.wallet ?? '-' }}</q-item-label>
              </q-item>

              <q-item>
                <q-item-label caption>Red</q-item-label>
                <q-item-label>{{ user.crypto?.network ?? '-' }}</q-item-label>
              </q-item>
            </q-list>
          </q-tab-panel>

          <!-- COMPRAS -->
          <q-tab-panel name="compras">
            <div class="text-h6 q-mb-md text-primary">COMPRAS DEL USUARIO</div>

            <div v-if="loadingCarts" class="flex flex-center q-pa-xl">
              <q-spinner color="primary" size="50px" />
            </div>

            <div v-else-if="carts.length === 0" class="text-center text-grey q-pa-md">
              Este usuario no registra compras.
            </div>

            <div v-else>
              <q-card
                v-for="cart in carts"
                :key="cart.id"
                class="q-mb-md"
                flat bordered
              >
                <q-card-section class="bg-grey-3">
                  Carrito #{{ cart.id }}
                </q-card-section>

                <q-table
                  :rows="cart.products"
                  :columns="cartColumns"
                  row-key="id"
                  flat
                  hide-bottom
                />

                <q-card-section class="text-right">
                  Total: ${{ (cart.total ?? 0).toFixed(2) }}
                </q-card-section>
              </q-card>

              <div class="text-right text-h6 q-mt-md">
                Total general: ${{ totalGeneral.toFixed(2) }}
              </div>
            </div>
          </q-tab-panel>

        </q-tab-panels>

      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import axios from 'axios'

interface User {
  id: number
  image: string
  firstName: string
  lastName: string
  username?: string
  age: number
  gender: string
  email: string
  phone?: string
  university?: string
  height?: number
  weight?: number
  bloodGroup?: string
  eyeColor?: string
  company?: { name?: string; title?: string; department?: string }
  address?: { address?: string; city?: string; country?: string; postalCode?: string }
  bank?: { cardNumber?: string; cardType?: string; currency?: string; iban?: string }
  crypto?: { coin?: string; wallet?: string; network?: string }
}

interface CartProduct {
  id: number
  title: string
  price: number
  quantity: number
}

interface Cart {
  id: number
  products: CartProduct[]
  total?: number
}

const props = defineProps<{ userId: number | null }>()
const emit = defineEmits(['update:userId'])

const show = ref(false)
const loading = ref(false)
const loadingCarts = ref(false)

const user = ref<User>({} as User)
const tab = ref('personal')

const carts = ref<Cart[]>([])

const totalGeneral = computed(() =>
  carts.value.reduce((sum, c) => sum + (c.total ?? 0), 0)
)

const cartColumns = [
  { name: 'title', label: 'Producto', field: 'title' },
  { name: 'quantity', label: 'Cantidad', field: 'quantity' },
  {
    name: 'price',
    label: 'Precio',
    field: 'price',
    format: (v: number) => `$${v.toFixed(2)}`
  }
]

async function fetchCarts(id: number) {
  loadingCarts.value = true
  try {
    const { data } = await axios.get(`https://dummyjson.com/users/${id}/carts`)
    carts.value = data.carts ?? []
  } catch {
    carts.value = []
  } finally {
    loadingCarts.value = false
  }
}

watch(() => props.userId, async (id) => {
  if (!id) return

  show.value = true
  loading.value = true

  try {
    const { data } = await axios.get(`https://dummyjson.com/users/${id}`)
    user.value = data
    await fetchCarts(id)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

watch(show, (val) => {
  if (!val) emit('update:userId', null)
})
</script>