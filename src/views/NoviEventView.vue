<template>
  <div class="novi-stranica">
    <div class="top-bar">
      <button class="nazad-btn" @click="$router.push('/')">← Novi događaj</button>
    </div>

    <div class="forma-omotac">
      <form @submit.prevent="kreiraj">
        <div class="polje">
          <label>Naziv događaja *</label>
          <input
            v-model="forma.naziv"
            class="input-field"
            type="text"
            placeholder="npr. Jutarnje kupanje"
            required
          />
        </div>

        <div class="polje">
          <label>Kategorija *</label>
          <select v-model="forma.kategorija" class="input-field" required>
            <option value="">-- Odaberi --</option>
            <option v-for="kat in kategorije" :key="kat" :value="kat">{{ kat }}</option>
          </select>
        </div>

        <div class="polje">
          <label>Opis</label>
          <textarea
            v-model="forma.opis"
            class="input-field textarea"
            placeholder="Kratki opis događaja..."
          ></textarea>
        </div>

        <div class="polje">
          <label>Lokacija *</label>
          <input
            v-model="forma.lokacija"
            class="input-field"
            type="text"
            placeholder="npr. Plaža Ambrela, Rovinj"
            required
          />
        </div>

        <div class="polje">
          <label>Datum i vrijeme *</label>
          <input
            v-model="forma.vrijemePocetka"
            class="input-field"
            type="datetime-local"
            required
          />
        </div>

        <div class="polje">
          <label>Prag sudionika za chat (min. 2)</label>
          <input
            v-model.number="forma.pragSudionika"
            class="input-field"
            type="number"
            min="2"
            max="100"
          />
        </div>

        <div class="polje">
          <label>URL slike (opcionalno)</label>
          <input v-model="forma.slika" class="input-field" type="url" placeholder="https://..." />
        </div>

        <p v-if="greska" class="greska-poruka">{{ greska }}</p>

        <div class="gumbi">
          <button type="button" class="btn-outline" @click="$router.push('/')">Odustani</button>
          <button type="submit" class="btn-primary" :disabled="ucitavanje">
            {{ ucitavanje ? 'Sprema...' : 'Kreiraj događaj' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import { useEventiStore } from '@/stores/eventiStore'

export default {
  name: 'NoviEventView',

  data() {
    return {
      kategorije: ['Sport', 'Kultura', 'Priroda', 'Zabava', 'Edukacija'],
      ucitavanje: false,
      greska: null,
      forma: {
        naziv: '',
        kategorija: '',
        opis: '',
        lokacija: '',
        vrijemePocetka: '',
        pragSudionika: 3,
        slika: '',
      },
    }
  },

  computed: {
    authStore() {
      return useAuthStore()
    },
    eventiStore() {
      return useEventiStore()
    },
  },

  methods: {
    async kreiraj() {
      this.greska = null
      this.ucitavanje = true
      try {
        const eventId = await this.eventiStore.kreirajEvent(
          this.forma,
          this.authStore.korisnik.uid,
          this.authStore.korisnikIme,
        )
        this.$router.push('/event/' + eventId)
      } catch {
        this.greska = 'Greška pri kreiranju događaja. Pokušaj ponovo.'
      } finally {
        this.ucitavanje = false
      }
    },
  },
}
</script>

<style scoped>
.novi-stranica {
  min-height: 100vh;
  background: var(--background);
}

.top-bar {
  padding: 14px 20px;
  background: white;
  border-bottom: 1px solid var(--border);
}
.nazad-btn {
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.forma-omotac {
  max-width: 560px;
  margin: 32px auto;
  padding: 0 20px 60px;
}

.polje {
  margin-bottom: 16px;
}

.polje label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #444;
  margin-bottom: 6px;
}

.textarea {
  min-height: 90px;
  resize: vertical;
}

.gumbi {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}
.gumbi button {
  flex: 1;
}
</style>
