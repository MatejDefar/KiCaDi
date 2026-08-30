<template>
  <div class="home-stranica">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-logo" @click="$router.push('/')">
        <span class="logo-ki">Ki</span><span class="logo-ca">Ča</span
        ><span class="logo-di">Di</span>
      </div>

      <div class="navbar-trazi">
        <span>🔍</span>
        <input v-model="pretrazivanje" class="trazi-input" type="text" placeholder="Pretraži..." />
      </div>

      <div class="navbar-desno">
        <button class="btn-novi" @click="$router.push('/event/novi')">+ Novi</button>
        <div class="avatar" :title="authStore.korisnikIme">{{ inicijali }}</div>
        <button class="odjava-btn" @click="odjava" title="Odjava">⎋</button>
      </div>
    </nav>

    <!-- Kategorije -->
    <div class="kategorije">
      <button
        v-for="kat in kategorije"
        :key="kat"
        :class="['kat-btn', eventiStore.filtarKategorija === kat ? 'aktivan' : '']"
        @click="eventiStore.postaviFiltarKategorija(kat)"
      >
        {{ kat }}
      </button>
    </div>

    <!-- Lista događaja -->
    <div v-if="eventiStore.ucitavanje" class="ucitavanje">Učitavanje...</div>

    <div v-else class="eventi-grid">
      <div
        v-for="event in filtrirani"
        :key="event.id"
        class="kartica event-kartica"
        @click="$router.push('/event/' + event.id)"
      >
        <div class="event-slika">
          <img v-if="event.slika" :src="event.slika" :alt="event.naziv" />
          <div v-else class="event-slika-placeholder">📅</div>
        </div>

        <div class="event-sadrzaj">
          <div class="event-header">
            <span class="kat-oznaka" :style="{ backgroundColor: boja(event.kategorija) }">
              {{ event.kategorija }}
            </span>
            <span v-if="event.chatId" title="Chat aktivan">💬</span>
          </div>

          <h3 class="event-naziv">{{ event.naziv }}</h3>
          <p class="event-info">📅 {{ formatirajDatum(event.vrijemePocetka) }}</p>
          <p class="event-info">📍 {{ event.lokacija }}</p>
          <p class="event-info">👥 {{ event.sudionici?.length || 0 }}/{{ event.pragSudionika }}</p>

          <div class="sudionici-avatari">
            <div
              v-for="(sudionik, i) in (event.sudionici || []).slice(0, 4)"
              :key="i"
              class="mini-avatar"
              :style="{ backgroundColor: barvaSudionika(i) }"
              :title="sudionik.ime"
            >
              {{ sudionik.ime?.charAt(0) }}
            </div>
          </div>

          <div v-if="event.chatId" class="chat-indikator">
            <span class="tocka aktivna"></span>
            <span class="tocka aktivna"></span>
            <span class="tocka"></span>
            <span class="chat-tekst">chat pri {{ event.pragSudionika }}</span>
          </div>

          <button class="btn-prijava" @click.stop="$router.push('/event/' + event.id)">
            Prijavi se
          </button>
        </div>
      </div>

      <div v-if="filtrirani.length === 0" class="prazno">Nema događaja u ovoj kategoriji.</div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import { useEventiStore } from '@/stores/eventiStore'

export default {
  name: 'HomeView',

  data() {
    return {
      pretrazivanje: '',
      kategorije: ['Svi', 'Sport', 'Kultura', 'Priroda', 'Zabava', 'Edukacija'],
    }
  },

  computed: {
    authStore() {
      return useAuthStore()
    },
    eventiStore() {
      return useEventiStore()
    },

    inicijali() {
      const ime = this.authStore.korisnikIme || ''
      return ime
        .split(' ')
        .map((r) => r[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    },

    filtrirani() {
      const eventi = this.eventiStore.filtriraniEventi
      if (!this.pretrazivanje) return eventi
      const pojam = this.pretrazivanje.toLowerCase()
      return eventi.filter(
        (e) => e.naziv?.toLowerCase().includes(pojam) || e.lokacija?.toLowerCase().includes(pojam),
      )
    },
  },

  mounted() {
    this.eventiStore.dohvatiEvente()
  },

  methods: {
    async odjava() {
      await this.authStore.odjava()
      this.$router.push('/login')
    },

    formatirajDatum(vrijemePocetka) {
      if (!vrijemePocetka) return ''
      const datum = vrijemePocetka.toDate ? vrijemePocetka.toDate() : new Date(vrijemePocetka)
      return datum.toLocaleString('hr-HR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    boja(kategorija) {
      const boje = {
        Sport: '#f5c842',
        Kultura: '#42a5f5',
        Priroda: '#66bb6a',
        Zabava: '#ab47bc',
        Edukacija: '#26c6da',
      }
      return boje[kategorija] || '#aaa'
    },

    barvaSudionika(index) {
      const boje = ['#c1432a', '#3b82f6', '#22c55e', '#eab308', '#a855f7']
      return boje[index % boje.length]
    },
  },
}
</script>

<style scoped>
.home-stranica {
  min-height: 100vh;
  background: var(--background);
}

.navbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background: white;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}
.navbar-logo {
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: -0.5px;
  white-space: nowrap;
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

.navbar-trazi {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 10px;
  padding: 8px 14px;
  gap: 8px;
}
.trazi-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  width: 100%;
}

.navbar-desno {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-novi {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
}
.btn-novi:hover {
  background: var(--primary-hover);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
}
.odjava-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}
.odjava-btn:hover {
  color: var(--primary);
}

.kategorije {
  display: flex;
  gap: 8px;
  padding: 16px 24px;
  overflow-x: auto;
}
.kat-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  background: white;
  color: #555;
  white-space: nowrap;
}
.kat-btn.aktivan {
  background: var(--primary);
  color: white;
  font-weight: 600;
}

.eventi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 0 24px 40px;
}
.event-kartica {
  cursor: pointer;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}
.event-kartica:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.event-slika {
  height: 180px;
  overflow: hidden;
  background: #e8e0d8;
}
.event-slika img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.event-slika-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.event-sadrzaj {
  padding: 16px;
}
.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.kat-oznaka {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  color: #333;
}
.event-naziv {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a1a1a;
}
.event-info {
  font-size: 13px;
  color: #555;
  margin-bottom: 4px;
}

.sudionici-avatari {
  display: flex;
  gap: 4px;
  margin: 10px 0;
}
.mini-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 11px;
  font-weight: 700;
}

.chat-indikator {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 10px;
}
.tocka {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
}
.tocka.aktivna {
  background: var(--primary);
}
.chat-tekst {
  font-size: 12px;
  color: #888;
  margin-left: 4px;
}

.btn-prijava {
  width: 100%;
  padding: 10px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.btn-prijava:hover {
  background: var(--primary-hover);
}

.ucitavanje,
.prazno {
  text-align: center;
  padding: 60px;
  color: #888;
}
.prazno {
  grid-column: 1/-1;
}
</style>
