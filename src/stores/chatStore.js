import { defineStore } from 'pinia'
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useChatStore = defineStore('chat', {
  state: () => ({
    poruke: [],
    aktivniChat: null,
    ucitavanje: false,
    odjavaListenera: null
  }),

  actions: {
   
    async kreirajChat(eventId, eventNaziv) {
      const docRef = await addDoc(collection(db, 'chatovi'), {
        eventId: eventId,
        eventNaziv: eventNaziv,
        kreiran: serverTimestamp()
      })
      return docRef.id
    },


    async dohvatiChat(chatId) {
      try {
        const docRef = doc(db, 'chatovi', chatId)
        const snapshot = await getDoc(docRef)
        if (snapshot.exists()) {
          this.aktivniChat = { id: snapshot.id, ...snapshot.data() }
        }
      } catch (error) {
        console.error('Greška pri dohvaćanju chata:', error)
      }
    },


    pratiPoruke(chatId) {
      this.ucitavanje = true
      const q = query(
        collection(db, 'chatovi', chatId, 'poruke'),
        orderBy('vrijemeSlanja')
      )


      if (this.odjavaListenera) {
        this.odjavaListenera()
      }

      this.odjavaListenera = onSnapshot(q, (snapshot) => {
        this.poruke = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        this.ucitavanje = false
      })
    },

    async posaljiPoruku(chatId, sadrzaj, korisnikId, korisnikIme) {
      if (!sadrzaj.trim()) return
      await addDoc(collection(db, 'chatovi', chatId, 'poruke'), {
        sadrzaj: sadrzaj.trim(),
        korisnikId: korisnikId,
        korisnikIme: korisnikIme,
        vrijemeSlanja: serverTimestamp()
      })
    },

    zaustavljanjePracenja() {
      if (this.odjavaListenera) {
        this.odjavaListenera()
        this.odjavaListenera = null
      }
      this.poruke = []
      this.aktivniChat = null
    }
  }
})