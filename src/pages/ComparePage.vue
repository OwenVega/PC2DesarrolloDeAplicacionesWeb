<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Comparar Colaboradores</div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6">
        <q-select
          v-model="userAId"
          :options="options"
          label="Usuario A"
          emit-value
          map-options
          :loading="usersStore.loading"
        />
      </div>
      <div class="col-12 col-sm-6">
        <q-select
          v-model="userBId"
          :options="options"
          label="Usuario B"
          emit-value
          map-options
          :loading="usersStore.loading"
        />
      </div>
    </div>

    <div v-if="!userA || !userB" class="text-grey text-center q-pa-md">
      Selecciona dos usuarios para comparar.
    </div>

    <q-markup-table v-else bordered>
      <thead>
        <tr>
          <th class="text-left">Atributo</th>
          <th class="text-left">{{ userA.firstName }} {{ userA.lastName }}</th>
          <th class="text-left">{{ userB.firstName }} {{ userB.lastName }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in compareRows" :key="row.label">
          <td class="text-weight-medium">{{ row.label }}</td>
          <td>{{ row.a }}</td>
          <td>{{ row.b }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useUsersStore } from 'src/stores/users-store';

interface CompareRow {
  label: string;
  a: string | number | undefined;
  b: string | number | undefined;
}

const usersStore = useUsersStore();

const userAId = ref<number | null>(null);
const userBId = ref<number | null>(null);

const options = computed(() =>
  usersStore.users.map((u) => ({
    label: `${u.firstName} ${u.lastName}`,
    value: u.id,
  })),
);

const userA = computed(() => usersStore.users.find((u) => u.id === userAId.value));
const userB = computed(() => usersStore.users.find((u) => u.id === userBId.value));

const compareRows = computed<CompareRow[]>(() => {
  if (!userA.value || !userB.value) return [];
  const a = userA.value;
  const b = userB.value;
  return [
    { label: 'Edad', a: a.age, b: b.age },
    { label: 'Género', a: a.gender, b: b.gender },
    { label: 'Empresa', a: a.company?.name, b: b.company?.name },
    { label: 'Cargo', a: a.company?.title, b: b.company?.title },
    { label: 'Universidad', a: a.university, b: b.university },
    { label: 'Ciudad', a: a.address?.city, b: b.address?.city },
    { label: 'País', a: a.address?.country, b: b.address?.country },
    { label: 'Altura', a: a.height, b: b.height },
    { label: 'Peso', a: a.weight, b: b.weight },
    { label: 'Grupo Sanguíneo', a: a.bloodGroup, b: b.bloodGroup },
  ];
});

onMounted(() => {
  void usersStore.fetchAllUsers();
});
</script>
