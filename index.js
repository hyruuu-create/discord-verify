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
client.on('messageCreate', async (message) => {
  if (message.author.bot) return

  const text = message.content.toLowerCase()

  if (text.includes('kangen')) {
    const responses = [
      `💭 ${message.author}, kangen siapa tuh? 👀`,
      `😏 ciee ${message.author} lagi kangen ya`,
      `💔 ${message.author}... dia juga kangen ga ya?`,
      `📱 ${message.author} chat aja sana, jangan dipendem 😌`,
      `🌙 kangen itu berat ya ${message.author}...`,
      `👀 jujur aja ${message.author}, kangen siapa?`,
      `🔥 ${message.author} fix lagi mikirin dia nih`,
      `🥀 ${message.author}, kadang kangen ga harus memiliki...`
    ]

    const random = responses[Math.floor(Math.random() * responses.length)]
    await message.reply({ content: random })
  }
})

// LOGIN BOT (SATU KALI)
client.login(process.env.BOT_TOKEN)


// ================== WEB VERIFY ==================
const app = express()

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
<title>Figuran Verification</title>
<style>
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
}

.card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(15px);
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 0 40px rgba(0,0,0,0.6);
  max-width: 400px;
}

.logo {
  width: 150px;
  margin-bottom: 20px;
}

h1 {
  margin-bottom: 10px;
  font-size: 24px;
}

p {
  color: #ccc;
  font-size: 14px;
  margin-bottom: 25px;
}

.btn {
  background: linear-gradient(45deg, #ff7b00, #ff3c00);
  border: none;
  padding: 14px 28px;
  color: white;
  font-size: 15px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px #ff5e00;
}
</style>
</head>

<body>
  <div class="card">
    <img class="logo" src="/logo.png">
    
    <h1>🎭 Figuran Verification</h1>
    <p>
      Selamat datang di panggung kami.<br>
      Saatnya kamu memasuki <b>area tenang para Figuran</b> ✨<br><br>
      Klik tombol di bawah untuk memulai perjalananmu.
    </p>

    <a href="${url}">
      <button class="btn">Masuk & Verifikasi</button>
    </a>
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

    // join server
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

    // kasih role
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
<h1>🎉 Berhasil!</h1>
<p>Halo <b>${user.username}</b>, kamu sudah terverifikasi 🎭</p>
`)

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message)
    res.send(`<h1>❌ Error, cek Railway</h1>`)
  }
})

// RUN
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('🌐 Web jalan')
})
