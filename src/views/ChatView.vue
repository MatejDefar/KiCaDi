<template>
  <div class="chat-stranica">

    <div class="chat-header">
      <button class="nazad-btn" @click="nazad">←</button>
      <div class="header-info">
        <span>💬</span>
        <span class="chat-naziv">{{ chatStore.aktivniChat?.eventNaziv || 'Grupni chat' }}</span>
      </div>
      <span class="broj-sudionika">{{ event?.sudionici?.length || 0 }} sudionika</span>
    </div>


    <div class="poruke-lista" ref="porukeContainer">
      <div v-if="chatStore.ucitavanje" class="ucitavanje">Učitavanje poruka...</div>

      <div
        v-for="poruka in chatStore.poruke"
        :key="poruka.id"
        :class="['poruka-omotac', poruka.korisnikId === authStore.korisnik?.uid ? 'moja' : '']"
      >
      
        <template v-if="poruka.korisnikId !== authStore.korisnik?.uid">
          <div class="avatar-mini" :style="{ backgroundColor: avatarBoja(poruka.korisnikId) }">
            {{ poruka.korisnikIme?.charAt(0) }}
          </div>
          <div class="poruka-balon-omotac">
            <span class="poruka-ime">{{ poruka.korisnikIme }}</span>
            <div class="poruka-balon tuda">{{ poruka.sadrzaj }}</div>
            <span class="poruka-vrijeme">{{ formatirajVrijeme(poruka.vrijemeSlanja) }}</span>
          </div>
        </template>

     
        <template v-else>
          <div class="poruka-balon-omotac desno">
            <div class="poruka-balon moja-boja">{{ poruka.sadrzaj }}</div>
            <span class="poruka-vrijeme">{{ formatirajVrijeme(poruka.vrijemeSlanja) }}</span>
          </div>
        </template>
      </div>

      <div v-if="chatStore.poruke.length === 0 && !chatStore.ucitavanje" class="prazno">
        Započni razgovor! 👋
      </div>
    </div>

   
    <div class="unos-poruke">
      <input
        v-model="novaPoruka"
        class="poruka-input"
        type="text"
        placeholder="Poruka..."
        @keyup.enter="posalji"
      />
      <button class="posalji-btn" @click="posalji" :disabled="!novaPoruka.trim()">
        ➤
      </button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import { useChatStore } from '@/stores/chatStore'
import { useEventiStore } from '@/stores/eventiStore'

export default {
  name: 'ChatView',

  data() {
    return {
      novaPoruka: '',
      eventId: null
    }
  },

  computed: {
    authStore() { return useAuthStore() },
    chatStore() { return useChatStore() },
    eventiStore() { return useEventiStore() },
    event() { return this.eventiStore.odabraniEvent }
  },

  watch: {
    'chatStore.poruke'() {
      this.$nextTick(() => {
        const container = this.$refs.porukeContainer
        if (container) container.scrollTop = container.scrollHeight
      })
    }
  },

  async mounted() {
    const chatId = this.$route.params.id
    await this.chatStore.dohvatiChat(chatId)
    this.chatStore.pratiPoruke(chatId)

    if (this.chatStore.aktivniChat?.eventId) {
      this.eventId = this.chatStore.aktivniChat.eventId
      this.eventiStore.dohvatiEventPoDokumentu(this.eventId)
    }
  },

  beforeUnmount() {
    this.chatStore.zaustavljanjePracenja()
  },

  methods: {
    async posalji() {
      if (!this.novaPoruka.trim()) return
      const chatId = this.$route.params.id
      await this.chatStore.posaljiPoruku(
        chatId,
        this.novaPoruka,
        this.authStore.korisnik.uid,
        this.authStore.korisnikIme
      )
      this.novaPoruka = ''
    },

    nazad() {
      if (this.eventId) {
        this.$router.push('/event/' + this.eventId)
      } else {
        this.$router.push('/')
      }
    },

    formatirajVrijeme(timestamp) {
      if (!timestamp) return ''
      const datum = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return datum.toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })
    },

    avatarBoja(korisnikId) {
      if (!korisnikId) return '#888'
      const boje = ['#c1432a', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#06b6d4']
      let hash = 0
      for (let i = 0; i < korisnikId.length; i++) {
        hash = korisnikId.charCodeAt(i) + ((hash << 5) - hash)
      }
      return boje[Math.abs(hash) % boje.length]
    }
  }
}
</script>

<style scoped>
.chat-stranica {
  display: flex; flex-direction: column;
  height: 100vh; background: var(--background);
}

.chat-header {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 20px; background: white;
  border-bottom: 1px solid var(--border); flex-shrink: 0;
}
.nazad-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: #444; }
.header-info { flex: 1; display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 15px; }
.chat-naziv { font-weight: 700; }
.broj-sudionika { font-size: 13px; color: #888; }

.poruke-lista {
  flex: 1; overflow-y: auto; padding: 20px 16px;
  display: flex; flex-direction: column; gap: 12px;
}

.poruka-omotac { display: flex; align-items: flex-start; gap: 8px; }
.poruka-omotac.moja { flex-direction: row-reverse; }

.avatar-mini {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 13px; font-weight: 700; flex-shrink: 0;
}

.poruka-balon-omotac { display: flex; flex-direction: column; gap: 3px; max-width: 70%; }
.poruka-balon-omotac.desno { align-items: flex-end; }

.poruka-ime { font-size: 12px; font-weight: 600; color: #555; padding-left: 4px; }

.poruka-balon {
  padding: 10px 14px; border-radius: 18px;
  font-size: 14px; line-height: 1.5; word-break: break-word;
}
.tuda { background: white; color: #1a1a1a; border-bottom-left-radius: 4px; }
.moja-boja { background: var(--primary); color: white; border-bottom-right-radius: 4px; }

.poruka-vrijeme { font-size: 11px; color: #aaa; padding: 0 4px; }

.unos-poruke {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; background: white;
  border-top: 1px solid var(--border); flex-shrink: 0;
}
.poruka-input {
  flex: 1; padding: 12px 16px; border: 1px solid var(--border);
  border-radius: 24px; font-size: 14px; outline: none; background: #f8f6f2;
}
.poruka-input:focus { border-color: var(--primary); }

.posalji-btn {
  width: 42px; height: 42px; border-radius: 50%;
  background: var(--primary); color: white; border: none;
  font-size: 16px; cursor: pointer; display: flex;
  align-items: center; justify-content: center; flex-shrink: 0;
}
.posalji-btn:disabled { background: #ccc; cursor: not-allowed; }

.ucitavanje, .prazno { text-align: center; color: #888; margin: auto; }
</style>