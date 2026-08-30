import { defineStore } from 'pinia'
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useChatStore } from './chatStore'

export const useEventiStore = defineStore('eventi', {
  state: () => ({
    eventi: [],
    odabraniEvent: null,
    ucitavanje: false,
    greska: null,
    filtarKategorija: 'Svi',
  }),

  getters: {
    filtriraniEventi: (state) => {
      if (state.filtarKategorija === 'Svi') return state.eventi
      return state.eventi.filter((e) => e.kategorija === state.filtarKategorija)
    },
  },

  actions: {
    async dohvatiEvente() {
      this.ucitavanje = true
      try {
        const q = query(collection(db, 'eventi'), orderBy('vrijemePocetka'))
        const snapshot = await getDocs(q)
        this.eventi = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      } catch (error) {
        this.greska = 'Greška pri učitavanju događaja.'
      } finally {
        this.ucitavanje = false
      }
    },

    async dohvatiEventPoDokumentu(eventId) {
      try {
        const docRef = doc(db, 'eventi', eventId)
        const snapshot = await getDoc(docRef)
        if (snapshot.exists()) {
          this.odabraniEvent = { id: snapshot.id, ...snapshot.data() }
        }
      } catch (error) {
        this.greska = 'Greška pri učitavanju događaja.'
      }
    },

    pratiEvent(eventId, callback) {
      const docRef = doc(db, 'eventi', eventId)
      return onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const podaci = { id: snapshot.id, ...snapshot.data() }
          this.odabraniEvent = podaci
          callback(podaci)
        }
      })
    },

    async kreirajEvent(podaci, korisnikId, korisnikIme) {
      try {
        const noviEvent = {
          ...podaci,
          kreatorId: korisnikId,
          kreatorIme: korisnikIme,
          sudionici: [{ id: korisnikId, ime: korisnikIme }],
          vrijemePocetka: new Date(podaci.vrijemePocetka),
          kreiran: serverTimestamp(),
        }
        const docRef = await addDoc(collection(db, 'eventi'), noviEvent)
        return docRef.id
      } catch (error) {
        this.greska = 'Greška pri kreiranju događaja.'
        throw error
      }
    },

    async prijaviSeNaEvent(eventId, korisnikId, korisnikIme) {
      try {
        const docRef = doc(db, 'eventi', eventId)
        const sudionik = { id: korisnikId, ime: korisnikIme }
        await updateDoc(docRef, { sudionici: arrayUnion(sudionik) })

        const snapshot = await getDoc(docRef)
        const eventPodaci = snapshot.data()
        const pragSudionika = eventPodaci.pragSudionika || 3
        const brojSudionika = (eventPodaci.sudionici || []).length

        if (brojSudionika >= pragSudionika && !eventPodaci.chatId) {
          const chatStore = useChatStore()
          const chatId = await chatStore.kreirajChat(eventId, eventPodaci.naziv)
          await updateDoc(docRef, { chatId: chatId })
        }
      } catch (error) {
        this.greska = 'Greška pri prijavi na događaj.'
        throw error
      }
    },

    async odjaviSeSOdeventa(eventId, korisnikId, korisnikIme) {
      try {
        const docRef = doc(db, 'eventi', eventId)
        await updateDoc(docRef, {
          sudionici: arrayRemove({ id: korisnikId, ime: korisnikIme }),
        })
      } catch (error) {
        this.greska = 'Greška pri odjavi s događaja.'
        throw error
      }
    },

    postaviFiltarKategorija(kategorija) {
      this.filtarKategorija = kategorija
    },
  },
})
