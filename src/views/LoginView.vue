<template>
  <div class="login-stranica">
    <div class="login-kartica">
      <div class="logo">
        <span class="logo-ki">Ki</span><span class="logo-ca">Ča</span
        ><span class="logo-di">Di</span>
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
          <input v-model="email" class="input-field" type="email" placeholder="Email" required />
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
          <input v-model="email" class="input-field" type="email" placeholder="Email" required />
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

<script>
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'LoginView',

  data() {
    return {
      aktivniTab: 'prijava',
      ime: '',
      email: '',
      lozinka: '',
      ucitavanje: false,
    }
  },

  computed: {
    authStore() {
      return useAuthStore()
    },
  },

  methods: {
    async registracija() {
      this.ucitavanje = true
      try {
        await this.authStore.registracija(this.ime, this.email, this.lozinka)
        this.$router.push('/')
      } catch {
      } finally {
        this.ucitavanje = false
      }
    },

    async prijava() {
      this.ucitavanje = true
      try {
        await this.authStore.prijava(this.email, this.lozinka)
        this.$router.push('/')
      } catch {
      } finally {
        this.ucitavanje = false
      }
    },
  },
}
</script>

<style scoped>
.login-stranica {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background);
}

.login-kartica {
  background: white;
  border-radius: 20px;
  padding: 48px 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
}

.logo {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 32px;
  letter-spacing: -0.5px;
}
.logo-ki {
  color: #1a1a1a;
}
.logo-ca {
  color: #c1432a;
}
.logo-di {
  color: #c17a2a;
}

.tabovi {
  display: flex;
  background: #f0ebe3;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 24px;
}

.tab {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: #888;
  transition: all 0.2s;
}

.tab.aktivan {
  background: white;
  color: #1a1a1a;
  font-weight: 700;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.polje {
  margin-bottom: 12px;
}

.demo-hint {
  text-align: center;
  font-size: 13px;
  color: #888;
  margin-top: 12px;
}
</style>
