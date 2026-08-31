<template>
  <div class="detalji-stranica">
    <div class="top-bar">
      <button class="nazad-btn" @click="$router.push('/')">← {{ event?.naziv || '' }}</button>
    </div>

    <div v-if="ucitavanje" class="ucitavanje">Učitavanje...</div>

    <div v-else-if="event">
      <!-- Hero slika -->
      <div class="hero-slika">
        <img v-if="event.slika" :src="event.slika" :alt="event.naziv" />
        <div v-else class="hero-placeholder">📅</div>
      </div>

      <div class="sadrzaj">
        <span class="kat-oznaka" :style="{ backgroundColor: boja(event.kategorija) }">
          {{ event.kategorija }}
        </span>

        <h1 class="naziv">{{ event.naziv }}</h1>

        <div class="meta-info">
          <p>📅 {{ formatirajDatum(event.vrijemePocetka) }}</p>
          <p>📍 {{ event.lokacija }}</p>
          <p>👥 {{ event.sudionici?.length || 0 }} / {{ event.pragSudionika }} sudionika</p>
        </div>

        <p class="opis">{{ event.opis }}</p>

        
        <div class="organizator">
          <div class="avatar-krug" style="background-color: #c1432a;">
            {{ event.kreatorIme?.charAt(0) }}
          </div>
          <div>
            <p class="org-label">Organizator</p>
            <p class="org-ime">{{ event.kreatorIme }}</p>
          </div>
        </div>

        
        <div class="sudionici-sekcija">
          <h3>Sudionici</h3>
          <div
            v-for="(sudionik, index) in (event.sudionici || [])"
            :key="index"
            class="sudionik-red"
          >
            <div class="avatar-krug" :style="{ backgroundColor: barvaSudionika(index) }">
              {{ sudionik.ime?.charAt(0) }}
            </div>
            <span>{{ sudionik.ime }}</span>
            <span v-if="sudionik.id === event.kreatorId" class="org-tag">org.</span>
          </div>
        </div>

     
        <div v-if="!event.chatId" class="chat-info">
          <p>💬 Chat se aktivira kada se prijavi {{ event.pragSudionika }} sudionika
            (trenutno {{ event.sudionici?.length || 0 }})</p>
        </div>

       
        <div class="gumbi">
          <button
            v-if="!jeSudionik"
            class="btn-primary"
            :disabled="akcija"
            @click="prijaviSe"
          >
            👥 {{ akcija ? 'Čekaj...' : 'Prijavi se' }}
          </button>

          <div v-else class="prijavljen-gumbi">
            <button class="btn-outline" :disabled="akcija" @click="odjaviSe">
              {{ akcija ? 'Čekaj...' : 'Odjavi se' }}
            </button>
            <button
              v-if="event.chatId"
              class="btn-secondary"
              @click="$router.push('/chat/' + event.chatId)"
            >
              💬 Grupni chat
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="greska">Događaj nije pronađen.</div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import { useEventiStore } from '@/stores/eventiStore'

export default {
  name: 'EventDetaljiView',

  data() {
    return {
      ucitavanje: true,
      akcija: false,
      odjavaListenera: null
    }
  },

  computed: {
    authStore() { return useAuthStore() },
    eventiStore() { return useEventiStore() },
    event() { return this.eventiStore.odabraniEvent },

    jeSudionik() {
      if (!this.event || !this.authStore.korisnik) return false
      return (this.event.sudionici || []).some(
        (s) => s.id === this.authStore.korisnik.uid
      )
    }
  },

  async mounted() {
    const eventId = this.$route.params.id
    this.odjavaListenera = this.eventiStore.pratiEvent(eventId, () => {
      this.ucitavanje = false
    })
  },

  beforeUnmount() {
    if (this.odjavaListenera) this.odjavaListenera()
    this.eventiStore.odabraniEvent = null
  },

  methods: {
    async prijaviSe() {
      this.akcija = true
      try {
        await this.eventiStore.prijaviSeNaEvent(
          this.$route.params.id,
          this.authStore.korisnik.uid,
          this.authStore.korisnikIme
        )
      } finally {
        this.akcija = false
      }
    },

    async odjaviSe() {
      this.akcija = true
      try {
        await this.eventiStore.odjaviSeSOdeventa(
          this.$route.params.id,
          this.authStore.korisnik.uid,
          this.authStore.korisnikIme
        )
      } finally {
        this.akcija = false
      }
    },

    formatirajDatum(vrijemePocetka) {
      if (!vrijemePocetka) return ''
      const datum = vrijemePocetka.toDate ? vrijemePocetka.toDate() : new Date(vrijemePocetka)
      return datum.toLocaleString('hr-HR', {
        weekday: 'long', day: 'numeric', month: 'short',
        hour: '2-digit', minute: '2-digit'
      })
    },

    boja(kategorija) {
      const boje = {
        Sport: '#f5c842', Kultura: '#42a5f5',
        Priroda: '#66bb6a', Zabava: '#ab47bc', Edukacija: '#26c6da'
      }
      return boje[kategorija] || '#aaa'
    },

    barvaSudionika(index) {
      const boje = ['#c1432a', '#3b82f6', '#22c55e', '#eab308', '#a855f7']
      return boje[index % boje.length]
    }
  }
}
</script>

<style scoped>
.detalji-stranica { min-height: 100vh; background: var(--background); }

.top-bar {
  padding: 14px 20px; background: white;
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 100;
}
.nazad-btn { background: none; border: none; font-size: 15px; font-weight: 600; cursor: pointer; }
.nazad-btn:hover { color: var(--primary); }

.hero-slika { height: 220px; overflow: hidden; background: #e8e0d8; }
.hero-slika img { width: 100%; height: 100%; object-fit: cover; }
.hero-placeholder { height: 100%; display: flex; align-items: center; justify-content: center; font-size: 64px; }

.sadrzaj { max-width: 680px; margin: 0 auto; padding: 24px 20px 60px; }

.kat-oznaka {
  font-size: 12px; font-weight: 600; padding: 4px 12px;
  border-radius: 20px; color: #333; display: inline-block; margin-bottom: 12px;
}
.naziv { font-size: 26px; font-weight: 800; margin-bottom: 16px; line-height: 1.2; }
.meta-info p { font-size: 14px; color: #555; margin-bottom: 6px; }
.opis { margin: 16px 0; font-size: 14px; line-height: 1.7; color: #333; }

.organizator { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
.avatar-krug {
  width: 40px; height: 40px; border-radius: 50%;
  color: white; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 15px; flex-shrink: 0;
}
.org-label { font-size: 12px; color: #888; }
.org-ime { font-weight: 700; font-size: 15px; }

.sudionici-sekcija h3 { font-size: 16px; font-weight: 700; margin-bottom: 12px; }
.sudionik-red { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.org-tag { font-size: 12px; color: var(--primary); font-weight: 600; }

.chat-info {
  background: #fff8f0; border: 1px solid #f0d0b0;
  border-radius: 10px; padding: 12px 16px; margin: 16px 0;
  font-size: 13px; color: #a06030;
}

.gumbi { margin-top: 24px; display: flex; flex-direction: column; gap: 10px; }
.prijavljen-gumbi { display: flex; gap: 10px; }
.prijavljen-gumbi button { flex: 1; }

.ucitavanje, .greska { text-align: center; padding: 80px; color: #888; }
</style>