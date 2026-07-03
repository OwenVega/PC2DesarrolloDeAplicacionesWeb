<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Dashboard General</div>

    <div v-if="usersStore.loading" class="flex flex-center q-pa-xl">
      <q-spinner color="primary" size="80px" />
    </div>

    <div v-else class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h3 text-primary">{{ total }}</div>
            <div class="text-subtitle2">Total de usuarios</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h3 text-primary">{{ hombres }}</div>
            <div class="text-subtitle2">Hombres</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h3 text-primary">{{ mujeres }}</div>
            <div class="text-subtitle2">Mujeres</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h3 text-primary">{{ promedioEdad }}</div>
            <div class="text-subtitle2">Promedio de edad</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h3 text-primary">{{ empresasDistintas }}</div>
            <div class="text-subtitle2">Empresas distintas</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h3 text-primary">{{ ciudadesDistintas }}</div>
            <div class="text-subtitle2">Ciudades distintas</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useUsersStore } from 'src/stores/users-store';

const usersStore = useUsersStore();

const total = computed(() => usersStore.users.length);

const hombres = computed(() => usersStore.users.filter((u) => u.gender === 'male').length);

const mujeres = computed(() => usersStore.users.filter((u) => u.gender === 'female').length);

const promedioEdad = computed(() => {
  if (total.value === 0) return '0';
  const suma = usersStore.users.reduce((acc, u) => acc + u.age, 0);
  return (suma / total.value).toFixed(1);
});

const empresasDistintas = computed(
  () => new Set(usersStore.users.map((u) => u.company?.name).filter(Boolean)).size,
);

const ciudadesDistintas = computed(
  () => new Set(usersStore.users.map((u) => u.address?.city).filter(Boolean)).size,
);

onMounted(() => {
  void usersStore.fetchAllUsers();
});
</script>
