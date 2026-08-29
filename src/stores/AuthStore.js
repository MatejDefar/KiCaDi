import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth } from '@/firebase/config'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    korisnik: null,
    ucitavanje: true,
    greska: null,
  }),

  getters: {
    jePrijavljen: (state) => !!state.korisnik,
    korisnikIme: (state) => state.korisnik?.displayName || state.korisnik?.email || '',
  },

  actions: {
    inicijaliziraj() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (korisnik) => {
          this.korisnik = korisnik
          this.ucitavanje = false
          resolve(korisnik)
        })
      })
    },

    async registracija(ime, email, lozinka) {
      this.greska = null
      try {
        const rezultat = await createUserWithEmailAndPassword(auth, email, lozinka)
        await updateProfile(rezultat.user, { displayName: ime })
        this.korisnik = rezultat.user
      } catch (error) {
        this.greska = prevedeGresku(error.code)
        throw error
      }
    },

    async prijava(email, lozinka) {
      this.greska = null
      try {
        const rezultat = await signInWithEmailAndPassword(auth, email, lozinka)
        this.korisnik = rezultat.user
      } catch (error) {
        this.greska = prevedeGresku(error.code)
        throw error
      }
    },

    async odjava() {
      await signOut(auth)
      this.korisnik = null
    },
  },
})

function prevedeGresku(kod) {
  const greske = {
    'auth/email-already-in-use': 'Email adresa je već u upotrebi.',
    'auth/invalid-email': 'Email adresa nije ispravna.',
    'auth/weak-password': 'Lozinka mora imati najmanje 6 znakova.',
    'auth/user-not-found': 'Korisnik s tim emailom ne postoji.',
    'auth/wrong-password': 'Pogrešna lozinka.',
    'auth/invalid-credential': 'Pogrešan email ili lozinka.',
  }
  return greske[kod] || 'Došlo je do greške. Pokušaj ponovo.'
}
