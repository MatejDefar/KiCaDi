KiCaDi

Aplikacija za organizaciju i prijavu na događaje, s automatskim grupnim chatom kada se skupi dovoljno sudionika.

Tim
Matej Defar
Toni Pataj

Fakultet informatike u Puli
Kolegij: Programsko inženjerstvo
Mentor: doc. dr. sc. Nikola Tanković


Opis funkcionalnosti:
KiCaDi omogućuje korisnicima prijavu/registraciju, kreiranje događaja s osnovnim podacima (naziv, kategorija, vrijeme, prag broja sudionika), pregled i filtriranje popisa događaja te prijavu na odabrani događaj. Kada broj prijavljenih sudionika dosegne zadani prag, automatski se otvara grupni chat za taj događaj u kojem sudionici mogu razmjenjivati poruke u stvarnom vremenu.

Javni prototip

https://kicadi.web.app

Zaduženja po članu tima

Toni Pataj:
Izrada prototipa u Figmi
Sučelje za prijavu i registraciju (LoginView)
Stranica s detaljima događaja- prikaz organizatora, sudionika i real-time praćenje promjena
Pinia store za chat-slanje i real-time primanje poruka
Sučelje grupnog chata (ChatView) s auto-scrollom i razlikovanjem poruka
README dokumentacija i YouTube screencast


Matej Defar:
Inicijalno postavljanje projekta (Vue 3, Vite, Pinia, Vue Router, struktura foldera)
Firebase konfiguracija i Pinia store za autentifikaciju (registracija, prijava, odjava)
Vue Router s zaštitom ruta (navigation guards)
Pinia store za događaje i početna stranica s prikazom i filtriranjem događaja
Forma za kreiranje novog događaja
Firestore sigurnosna pravila i javni URL


