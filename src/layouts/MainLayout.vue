<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menú"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Directorio Corporativo
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>

        <q-item-label header>
          Navegación
        </q-item-label>

        <q-item clickable v-ripple to="/" exact>
          <q-item-section avatar>
            <q-icon name="groups" />
          </q-item-section>

          <q-item-section>
            Directorio
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/dashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>

          <q-item-section>
            Dashboard
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/comparar">
          <q-item-section avatar>
            <q-icon name="compare_arrows" />
          </q-item-section>

          <q-item-section>
            Comparar Usuarios
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>