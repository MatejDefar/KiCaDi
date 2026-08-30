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
