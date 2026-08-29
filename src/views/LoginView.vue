<template>
  <div class="login-stranica">
    <div class="login-kartica">
      <div class="logo">
        <span class="logo-ki">Ki</span><span class="logo-ca">Ča</span><span class="logo-di">Di</span>
      </div>

      <div class="tabovi">
        <button
          :class="['tab', aktivniTab === 'prijava' ? 'aktivan' : '']"
          @click="aktivniTab = 'prijava'"
        >
          Prijava
        </button>
        <button
          :class="['tab', aktivniTab === 'registracija' ? 'aktivan' : '']"
          @click="aktivniTab = 'registracija'"
        >
          Registracija
        </button>
      </div>


      <form v-if="aktivniTab === 'registracija'" @submit.prevent="registracija">
        <div class="polje">
          <input
            v-model="ime"
            class="input-field"
            type="text"
            placeholder="Ime i prezime"
            required
          />
        </div>
        <div class="polje">
          <input
            v-model="email"
            class="input-field"
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div class="polje">
          <input
            v-model="lozinka"
            class="input-field"
            type="password"
            placeholder="Lozinka"
            required
          />
        </div>
        <p v-if="authStore.greska" class="greska-poruka">{{ authStore.greska }}</p>
        <button class="btn-primary" type="submit" :disabled="ucitavanje">
          {{ ucitavanje ? 'Čekaj...' : 'Registriraj se' }}
        </button>
      </form>


      <form v-else @submit.prevent="prijava">
        <div class="polje">
          <input
            v-model="email"
            class="input-field"
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div class="polje">
          <input
            v-model="lozinka"
            class="input-field"
            type="password"
            placeholder="Lozinka"
            required
          />
        </div>
        <p v-if="authStore.greska" class="greska-poruka">{{ authStore.greska }}</p>
        <button class="btn-primary" type="submit" :disabled="ucitavanje">
          {{ ucitavanje ? 'Čekaj...' : 'Prijavi se' }}
        </button>
        <p class="demo-hint">demo@primjer.hr · demo</p>
      </form>
    </div>
  </div>
</template>

