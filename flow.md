# GoPVP App — Poora Flow

## GoPVP kya hai

GoPVP ek jagah hai jahan log **paise laga ke 1-vs-1 games** khelte hain. Abhi **chess** hai, **dart** jaldi aayega. Dono khiladi same rakam lagate hain, jeetne wale ko poora pot milta hai (platform ki fee kaat ke). Paise **USD** me dikhte hain, deposit **Bitcoin** me hota hai.

Login, wallet, profile, header, matches, leaderboard — ye **sab games ke liye ek hi** hain. Har game sirf apni cheezein laata hai: board ka preview, pool card ki pehli line, game room, practice, rules, aur matches list ka icon.

---

## Code ke 3 hisse

| Folder | Kya hai | Example |
|---|---|---|
| `applications/app` | **Asli app** — yahi ek deploy hota hai. Sab games ka ghar. | Login, wallet, header, play page ka dhancha, pools sheet, rejoin popup |
| `applications/chess` | **Sirf chess** ka code | Board, chess game room, computer ke saath practice, chess rules |
| `applications/common` | **Dono ke kaam ki cheezein** (button, text, box jaise UI pieces, server se baat karne ka code) | Button, Modal, server call, socket, toast |

Chess, app ka code kabhi use nahi karta. App, chess ko sirf ek list (`GAMES`) se jaanta hai. Dart aayega to wo bhi `applications/dart` me banega aur usi list me ek line judegi.

---

## 1. App khulta hai

1. User app kholta hai (aksar **Speed wallet** ke andar se, jaise `gopvp.app/chess?...`). Speed wallet ki bheji hui info (account, balance) app yaad rakh leta hai.
2. App pehle phone me **saved login** dhoondhta hai. Mila → user seedha andar. Nahi mila → login page.
3. URL me game ka naam hai (jaise `/chess`), to app server se **us game ki details** laata hai. Tab tak ek gol ghoomta loader dikhta hai.
4. Login + game details ready → app server se **live connection (socket)** jodta hai. Isi se matches, chaalein, balance update — sab turant aate hain.
5. Agar user ka koi **match beech me chal raha tha**, server batata hai → **Rejoin popup** (neeche section 9).

---

## 2. Login / Register

**Email se login:**
1. Email daalo → server check karta hai ki account hai ya nahi.
2. Password daalo → login. Saath me app is phone ki ek pehchaan (fingerprint) bhejta hai.
3. Country set nahi hai → country chuno. Tabhi app ke andar ja sakte ho.

**Google se login:** Google button → Google ka page → wapas app → login ho gaya.

**Naya account:** username (app naam suggest bhi karta hai, max 8 letters), email, password, country → account bana → seedha login.

**Login ke baad** → user usi game ke **Play** page par jaata hai jo usne pichhli baar khola tha.

**Logout:** Profile → Log out → server ko bataya → phone se login mitaya → login page.

**Doosre phone par login kiya?** Ek time par ek hi device. Server is phone ko batata hai → yahan se apne aap logout → login page.

**Login purana ho gaya (token expire)?** User ko kuch nahi karna. App chupchaap naya token leta hai aur wahi kaam dobara kar deta hai.

---

## 3. Header (har page ke upar)

- Game ke tabs: **Play · Matches · Leaderboard · Rules**
- **Balance** (dabao → Wallet)
- **Profile**

Balance live rehta hai — deposit, jeet, haar hote hi apne aap badal jaata hai.

---

## 4. Play page

Beech me game ka **preview** (chess ka board) aur neeche **Play now** button.

**Play now** dabaya → **pools sheet** khulti hai. Isme cards:

- **Pool cards** — har card: game ki line (jaise *Bullet 1 min* — ye game deta hai), **WIN $X**, **Entry fee $Y**.
  - Balance kam hai → button **Add funds** ban jaata hai → Wallet.
- **Practice** — computer ke saath free (sirf un games me jahan practice hai).
- **Room** — dost ke saath.

---

## 5. Pool se match (anjaan opponent)

1. Pool card par **Play** → confirm sheet ("confirm karte hi opponent dhoondhenge").
2. Confirm → app server ko bolta hai "is pool me daalo".
3. Turant koi mil gaya → seedha game room.
4. Nahi mila → **60 second** ka timer ke saath intezaar. Beech me **Leave** kar sakte ho.
5. Match mila → game room khulta hai (`/chess/play?match=...`).
6. 60 second me koi nahi mila → "time out" message, wapas play page.

---

## 6. Room (dost ke saath)

1. **Owner** room banata hai — fee aur time chunta hai → ek **code** milta hai.
2. Code dost ko bhejo. Dost **code daal ke join** karta hai.
3. Dono aa gaye → owner **Start** dabata hai → dono ka game room khulta hai.
4. Start se pehle dost nikal gaya → owner wapas dost ka intezaar karta hai. Owner ne room cancel kiya → room khatam.

---

## 7. Practice (computer ke saath)

1. Practice card → **difficulty** (Easy / Medium / Hard) aur **time** chuno.
2. Game room khulta hai. Computer (Stockfish) **user ke browser me hi** chalta hai — server nahi, paise nahi.
3. Game ke beech page reload kiya → **wahi game wapas** (chaalein aur clock browser me save rehte hain).

---

## 8. Game room (asli match)

- **Chaal chalo** → server ko jaati hai → opponent ko dikhti hai. Opponent ki chaal turant aati hai.
- **Clock** dono ka chalta hai. Waqt khatam → haar.
- **Pehli chaal ka time** — shuru me limited seconds. Koi pehli chaal na chale → match cancel.
- **Draw offer** — bhejo; opponent maane to draw, mana kare to message.
- **Resign** — haar maan lo (confirm popup ke baad).
- **Opponent offline** — uske naam ke paas "reconnecting" dikhta hai. Wapas aaya to hat jaata hai.
- Hamara net gaya aur wapas aaya → app server se **poora board dobara** le leta hai.

**Game khatam** (checkmate, resign, time out, draw, disconnect, cancel):
1. App server se **result** leta hai (kaun jeeta, kitne paise).
2. **Game over screen** — Victory / Defeat / Draw, wajah, paisa.
3. **New game** → wapas play page. Balance apne aap update.

**Same match do tab me khola?** Pehla tab khelta hai, doosra tab ruk jaata hai — taaki ek match do jagah se na chale.

---

## 9. Match beech me chhoot gaya → Rejoin popup

App wapas khula (kisi bhi page par) → server bola "match chal raha hai" → popup: **opponent ka naam, score, fee**.

- **Rejoin now** → seedha game room.
- **Exit** → "Pakka? Match haar jaoge" → haan → match forfeit.

Poori detail: `applications/app/docs/rejoin-flow.md`

---

## 10. Wallet

**Balance** — kitne paise hain, aur kitne **withdraw** ho sakte hain (sirf **jeete hue** paise nikal sakte ho).

**Deposit (paise daalna):**
1. Amount daalo ($1 se $99).
2. App ek **QR code** banata hai (Bitcoin / Lightning). Ek time limit tak valid.
3. Apne wallet se QR scan karke pay karo.
4. Payment aate hi server batata hai → **success** → balance badh gaya.
5. QR ka time nikal gaya → wapas jaake naya banao.

**Withdraw (paise nikalna):** amount + **Bitcoin address ya Lightning invoice** → request → ho gaya.

**Transactions list** — deposit, withdraw, jeet, haar, refund — sab, naye pehle. Scroll karte hi aur aate hain.

---

## 11. Matches page

- **My results** — mere match: opponent, jeeta/haara, rakam, kaise khatam hua, kab. Icon aur "kaise khatam hua" ka text **game deta hai** (chess: Bullet/Blitz icon, Checkmate/Stalemate).
- **My stats** — kitne jeete, best streak, score, kamai.
- **Worldwide** — sab logon ke haal ke match.

---

## 12. Leaderboard

- Time: **Daily / Weekly / Monthly / All time**
- Kis hisaab se: **Top earners / Most wins**
- Kisi player par dabao → uski detail popup me.

---

## 13. Rules

Har game ke **apne rules** — page game khud deta hai (chess: staking kaise hoti hai, payout, fair matching).

---

## 14. Profile

- **Username** badlo → Save.
- **Dark mode** on/off.
- **Ratings** — tumhara score.
- **Log out**.

---

## Peeche chalne wali baatein (user ko nahi dikhti)

- **Login yaad rehta hai** — phone me save; app band-chalu karne par bhi.
- **Error messages server ke** — app apni taraf se error text nahi banata, server jo bole wahi dikhata hai. Success par koi popup nahi.
- **Game ka code tab hi load hota hai jab zaroorat ho** — jaise chess ka game room ka code sirf game room khulne par aata hai. App jaldi khulta hai.
- **Band features** — device approval wala page abhi band (code me comment kiya hua), baad me chalu hoga.

---

## Naya game (jaise dart) kaise judega

1. `applications/dart` banao — isme dart ka preview, pool card ki line, game room, rules, matches ka icon, aur (chahe to) practice.
2. App ki `GAMES` list me dart ki ek line.
3. Dart ka Redux data (agar hai) app ke store me ek line.

Login, wallet, header, pools sheet, matches, leaderboard, rejoin popup — sab **apne aap** dart ke liye bhi chalenge.
