# Rejoin Popup — Kaise Chalta Hai

## Rejoin popup kya hai

User PvP match khel raha tha aur beech me app band ho gaya (network gaya, tab band kiya, phone lock hua). Jab woh wapas app kholta hai — kisi bhi page par, jaise `/wallet` — to ek popup aata hai:

> "Tumhara match abhi bhi chal raha hai. Opponent: rahul (1200), Fee: $5"
> **[Exit]**  **[Rejoin now]**

- **Rejoin now** → seedha usi match ke game room me.
- **Exit** → "Pakka? Match haar jaoge" wala popup → haan bola to match forfeit.

---

## Pehle kaise chalta tha (problem)

1. App khula → socket connect hua.
2. Server ne bola: "is user ka ek match chal raha hai" (`game:active`, sirf `match_id` aur `game_slug` deta hai).
3. Popup ko opponent ka naam aur fee chahiye, jo is message me nahi hai. Isliye app ne **chess ka code** (`loadMatchState`) chalaya, jo server se match ki poori detail laata hai.
4. Woh detail **chess ke `match` slice** me bhari gayi (board, chaalein, clock — sab kuch).
5. Popup ne opponent aur fee **chess ke `match` slice** se padhi.

**Problem:** popup har game ka hai (platform ka), lekin woh chess ke code aur chess ke Redux par tika tha.

- Dart aaya aur dart ka match chal raha ho → tab bhi chess ka code chalta → galat.
- Chess ka `match` slice app khulte hi chahiye tha, sirf popup ki wajah se. Chess ka data chess ke game room tak simit nahi tha.

---

## Ab kaise chalega

1. App khula → socket connect hua.
2. Server ne bola: "is user ka ek match chal raha hai" (`match_id`, `game_slug`).
3. App server se match ki detail maangta hai — **bina kisi game ke code ke** (common ka `requestGameState`).
4. Detail me se sirf 2 cheezein nikalta hai jo har game me hoti hain:
   - **Fee** (`bet`)
   - **Opponent** — players me se woh jo main nahi hoon (naam + score)
5. Ye dono platform ke `socketModals` slice me `activeGame` ke saath rakh deta hai.
6. Popup sab kuch `activeGame` se padhta hai. Chess ka `match` slice ab popup ke liye nahi bharta.

**Rejoin now dabaya:**

1. Popup band → `/chess/play?match=<id>` khula.
2. Chess ka game room khud server se poori detail (board, chaalein, clock) maangta hai aur chess ke `match` slice me bharta hai. Tab tak ek pal ka spinner.
3. Board khul gaya.

**Exit dabaya:**

1. "Pakka?" popup → haan.
2. Server ko bataya: "main rejoin nahi karunga" (`game:rejoin:declined`) → match haar gaye.
3. Popup band. Chess ka kuch saaf karne ki zaroorat nahi — kyunki popup ne chess ka kuch bhara hi nahi tha.

---

## Kaunsi file me kya badla

| File | Pehle | Ab |
|---|---|---|
| `common/src/util/socket.ts` | — | Naya `requestGameState(matchId)`: server se match ki detail laata hai. Galat match ya "match nahi mila" par kuch nahi (`null`) deta. |
| `common/src/types/response.ts` | — | Match detail ka woh hissa jo har game me same hai: `match_id`, `game_slug`, `bet`, players ka `user_id`, `username`, `score`. |
| `app/src/redux/socketModals/slice.ts` | `activeGame` me sirf `match_id` + `game_slug` | Saath me `bet` aur `opponent` bhi |
| `app/src/context/SocketContext.tsx` | Chess ka `loadMatchState` chalata tha | `requestGameState` se fee + opponent nikaal kar `activeGame` me rakhta hai |
| `app/src/components/common/RejoinGameModal.tsx` | Opponent + fee chess ke `match` slice se; Exit par chess ka `clearMatchState` | Sab `activeGame` se; Exit par chess ka kuch nahi |
| `chess/src/redux/match/thunk.ts` | Server se detail maangne ka code khud likha tha | Wahi `requestGameState` use karta hai |

---

## User ko kya farq dikhega

- Popup bilkul same dikhega — wahi naam, wahi score, wahi fee.
- **Rejoin now** ke baad board se pehle ek pal ka spinner aayega. Pehle popup ke time hi chess ki detail aa chuki hoti thi; ab game room khulne par aati hai.

---

## Yeh kyun kiya

- **Dart ke liye tayyar:** popup kisi game ke code par nahi tika. Dart ka match ho to bhi yahi popup chalega — bas dart ka game room alag hoga.
- **Chess ka data chess tak:** chess ka `match` slice ab sirf chess ke game room me bharta hai.
- **Ek hi jagah se server se poochna:** match ki detail maangne ka code pehle chess me tha; ab common me ek jagah hai, platform aur chess dono wahi use karte hain.

---

## Dhyan rahe

Backend me abhi sirf chess hai. `bet` aur players ka `username` / `score` har game me same lagte hain, lekin dart ke match ki detail kaisi hogi — yeh backend ne abhi tay nahi kiya. Dart aane par ek baar check karna.
