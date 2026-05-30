# SwiftPOS — Deploy locale (mini PC / tablet)

## Prerequisiti
- Node.js 18+ installato sul mini PC
- npm installato

---

## 1. Installare PM2 globalmente

```bash
npm install -g pm2
```

---

## 2. Build del frontend

Dalla cartella root del progetto:

```bash
npm run build
```

Il frontend compilato viene generato in `dist/`.

---

## 3. Avviare il server con PM2

```bash
cd server
pm2 start ecosystem.config.js
```

Per verificare che il processo sia attivo:

```bash
pm2 status
pm2 logs swiftpos
```

---

## 4. Avvio automatico all'avvio del PC

Eseguire il seguente comando e seguire le istruzioni a schermo:

```bash
pm2 startup
```

Poi salvare la lista dei processi attivi:

```bash
pm2 save
```

Da questo momento il server si avvia automaticamente ad ogni riavvio del PC.

---

## 5. Trovare l'IP del mini PC

**Su Windows:**

```
ipconfig
```

Cercare la voce **Indirizzo IPv4** sotto l'adattatore di rete attivo (es. `192.168.1.105`).

**Su Linux/macOS:**

```bash
ip addr show
# oppure
hostname -I
```

---

## 6. Accedere dal tablet tramite IP locale

Una volta avviato il server, aprire il browser del tablet e navigare a:

```
http://<IP-del-mini-PC>:5173
```

Esempio: `http://192.168.1.105:5173`

> Assicurarsi che il tablet e il mini PC siano sulla **stessa rete Wi-Fi**.

---

## 7. Servire il frontend in produzione

Per servire il frontend compilato direttamente dal server Node.js, aggiungere nel file `server/index.js` la riga per servire la cartella `dist/`. In alternativa usare un server statico come `serve`:

```bash
npm install -g serve
serve -s dist -l 5173
```

---

## 8. Installare la PWA dal browser (Chrome / Edge)

1. Aprire SwiftPOS nel browser del tablet o del PC
2. In Chrome: toccare il menu (tre puntini) → **Aggiungi a schermata Home** / **Installa app**
3. In Edge: toccare il menu → **App** → **Installa questo sito come app**

L'app verrà aggiunta alla schermata Home e si aprirà in modalità standalone (senza barra del browser), come un'app nativa.

---

## Riepilogo porte

| Servizio | Porta |
|----------|-------|
| Backend API + WebSocket | 3001  |
| Frontend (dev) | 5173  |
| Frontend (produzione con serve) | 5173  |
