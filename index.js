require('dotenv').config()
const express = require('express')
const axios = require('axios')
const { Client, GatewayIntentBits } = require('discord.js')

// ================== DISCORD BOT ==================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

process.on('unhandledRejection', console.error)
process.on('uncaughtException', console.error)

// READY
client.once('clientReady', () => {
  console.log(`🤖 Bot aktif: ${client.user.tag}`)
})

// 🔥 RESPON KANGEN
const handledMessages = new Set();

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (handledMessages.has(message.id)) return;
  handledMessages.add(message.id);

  setTimeout(() => {
    handledMessages.delete(message.id);
  }, 10000);

 const text = message.content.toLowerCase();

if (text.includes('kangen')) {

  console.log("TRIGGER:", message.id);

  const responses = [
    `💭 ${message.author}, kangen siapa tuh? 👀`,
    `😏 ciee ${message.author} lagi kangen ya`,
    `💔 ${message.author}... dia juga kangen ga ya?`,
    `🥀 ${message.author}, kadang kangen ga harus memiliki...`,
    `🌙 ${message.author}, kangen itu datang tiba-tiba ya`,
    `📱 ${message.author} chat aja dia, siapa tau dibalas 😆`,
    `👀 ${message.author} lagi mikirin dia terus ya`,
    `🔥 ${message.author} fix ga bisa move on nih`,
    `💌 ${message.author} mungkin dia juga lagi kangen kamu`,
    `😶‍🌫️ ${message.author} pura-pura kuat padahal kangen`,
    `🫣 ${message.author} jangan dipendem terus dong kangennya`,
    `🎧 ${message.author} denger lagu galau lagi ya?`,
    `💫 ${message.author} kangen itu tanda masih peduli`,
    `🥺 ${message.author} sini cerita aja kalau lagi kangen`,
    `😜 ${message.author} kangen atau cuma gabut nih`,
    `😐 ${message.author} udah tau punya pacar masih hubungin mantan`
  ];

  const random = responses[Math.floor(Math.random() * responses.length)];
  await message.reply({ content: random });

} else if (text.includes('gabut')) {

  console.log("GABUT TRIGGER:", message.id);

  const responses = [
    `😴 ${message.author} gabut ya? sini ngobrol sama aku`,
    `🎮 ${message.author} gabut? main game sana 😆`,
    `📱 ${message.author} scroll tiktok mulu ya kamu`,
    `👀 ${message.author} gabut tapi ga tau mau ngapain`,
    `😏 ${message.author} gabut = nunggu dia chat ya`,
    `🔥 ${message.author} gabut mending aktif di server dong`,
    `🎧 ${message.author} gabut? denger lagu aja`,
    `💬 ${message.author} chat orang dong jangan diem aja`,
    `😆 ${message.author} gabut banget sampe ngomong di sini`,
    `🫠 ${message.author} gabut kronis ini`,
    `📢 ${message.author} gabut? ramein chat dong`,
    `😜 ${message.author} gabut tapi males gerak`,
    `💡 ${message.author} gabut? coba cari kesibukan`,
    `🧠 ${message.author} mikir keras padahal cuma gabut`,
    `🤣 ${message.author} gabut level max`,
    `😎 ${message.author} gabut? sini aku temenin`,
    `🧃 ${message.author} gabut sambil ngopi santai aja`,
    `🎲 ${message.author} gabut? ayo cari kegiatan seru`
  ];

  const random = responses[Math.floor(Math.random() * responses.length)];
  await message.reply({ content: random });
}
});

// ✅ LOGIN DI LUAR (FIX ERROR)
client.login(process.env.BOT_TOKEN)


// ================== WEB VERIFY ==================
const app = express()
const fs = require("fs")
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = 'https://discord-verify-production-2866.up.railway.app/callback'

const BOT_TOKEN = process.env.BOT_TOKEN
const GUILD_ID = process.env.GUILD_ID
const ROLE_ID = process.env.ROLE_ID

// HOME
app.use(express.static('public'))

app.get('/', (req, res) => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds.join`

  res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Figuran Verification</title>

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">

<style>
* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }

body {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  overflow: hidden;
}

.bg, .bg2 {
  position: absolute;
  filter: blur(120px);
}

.bg {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #ff7b00, transparent);
  animation: float 8s ease-in-out infinite;
}

.bg2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #3b82f6, transparent);
  animation: float 10s ease-in-out infinite;
}

@keyframes float {
  0%,100% { transform: translateY(0px); }
  50% { transform: translateY(-40px); }
}

.card {
  position: relative;
  z-index: 10;
  backdrop-filter: blur(20px);
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  width: 350px;
  box-shadow: 0 0 40px rgba(0,0,0,0.6);
  border: 1px solid rgba(255,255,255,0.1);
}

.logo {
  width: 90px;
  margin-bottom: 20px;
  border-radius: 15px;
}

h1 { color: white; margin-bottom: 10px; }

p {
  color: #cbd5f5;
  font-size: 14px;
  margin-bottom: 25px;
}

.btn {
  background: linear-gradient(45deg, #ff7b00, #ff3c00);
  border: none;
  padding: 14px;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  width: 100%;
}

.btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px #ff5e00;
}

.footer {
  margin-top: 20px;
  font-size: 12px;
  color: #94a3b8;
}
</style>
</head>

<body>

<div class="bg"></div>
<div class="bg2"></div>

<div class="card">
  <img class="logo" src="/logo.png">

  <h1>🎭 Figuran Verification</h1>

  <p>
    Selamat datang di panggung kami ✨<br>
    Masuk ke <b>area eksklusif Figuran</b>
  </p>

  <a href="${url}">
    <button class="btn">🚀 Verifikasi Sekarang</button>
  </a>

  <div class="footer">
    Powered by Hyruu
  </div>
</div>

</body>
</html>
`)
})
// CALLBACK
app.get('/callback', async (req, res) => {
  const code = req.query.code
  if (!code) return res.send('Code tidak ditemukan!')

  try {
    const tokenRes = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    const access_token = tokenRes.data.access_token

    const userRes = await axios.get(
      'https://discord.com/api/users/@me',
      { headers: { Authorization: `Bearer ${access_token}` } }
    )

    const user = userRes.data
    
    // ================== SIMPAN DATA USER ==================
let data = []
if (fs.existsSync("users.json")) {
  data = JSON.parse(fs.readFileSync("users.json"))
}

// biar tidak double
if (!data.find(u => u.id === user.id)) {
  data.push({
    id: user.id,
    username: user.username
  })
}

fs.writeFileSync("users.json", JSON.stringify(data, null, 2))
// =====================================================

    await axios.put(
      `https://discord.com/api/guilds/${GUILD_ID}/members/${user.id}`,
      { access_token },
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )

    await axios.put(
      `https://discord.com/api/guilds/${GUILD_ID}/members/${user.id}/roles/${ROLE_ID}`,
      {},
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`
        }
      }
    )

    res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Verification Success</title>

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

body {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  overflow: hidden;
}

/* glow background */
.bg {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #22c55e, transparent);
  filter: blur(120px);
  animation: float 8s ease-in-out infinite;
}

@keyframes float {
  0%,100% { transform: translateY(0px); }
  50% { transform: translateY(-30px); }
}

/* card */
.card {
  position: relative;
  z-index: 10;
  backdrop-filter: blur(20px);
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  width: 350px;
  box-shadow: 0 0 40px rgba(0,0,0,0.6);
  border: 1px solid rgba(255,255,255,0.1);
}

/* icon */
.check {
  font-size: 50px;
  margin-bottom: 15px;
  animation: pop 0.5s ease;
}

@keyframes pop {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

h1 {
  color: #22c55e;
  margin-bottom: 10px;
}

p {
  color: #cbd5f5;
  font-size: 14px;
  margin-bottom: 20px;
}

.btn {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  border: none;
  padding: 12px;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  width: 100%;
}

.btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px #22c55e;
}

.footer {
  margin-top: 15px;
  font-size: 12px;
  color: #94a3b8;
}
</style>
</head>

<body>

<div class="bg"></div>

<div class="card">
  <div class="check">✅</div>

  <h1>Berhasil Verifikasi!</h1>

  <p>
    Halo <b>${user.username}</b> 🎭<br>
    Kamu sudah resmi masuk ke <b>Figuran</b> ✨
  </p>

  <button class="btn" onclick="window.close()">Tutup Halaman</button>

  <div class="footer">
    Selamat datang di server 🚀
  </div>
</div>

</body>
</html>
`)

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message)
    res.send(`<h1>❌ Error</h1>`)
  }
})

// RUN
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('🌐 Web jalan')
})

// ================== LIHAT DATA VERIFY ==================
app.get("/data", (req, res) => {
  if (!fs.existsSync("users.json")) return res.json([])

  const data = JSON.parse(fs.readFileSync("users.json"))
  res.json(data)
})
// =====================================================
