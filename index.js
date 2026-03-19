require('dotenv').config()
const express = require('express')
const axios = require('axios')
const { Client, GatewayIntentBits } = require('discord.js')

// ================== DISCORD BOT ==================
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
})

client.once('ready', () => {
  console.log(`🤖 Bot aktif: ${client.user.tag}`)
})

// 🔥 LOGIN BOT (PAKAI INI!)
console.log("BOT TOKEN:", process.env.BOT_TOKEN)
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
    <img class="logo" src="https://cdn.discordapp.com/attachments/1470011473081143477/1484184835214934026/Screenshot_2026-01-10_220600.png?ex=69bd4e57&is=69bbfcd7&hm=a13cf01a1149106b6cd283a976bd175c539cbebac7cc213ec2761a59ffa22a41&">
    
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
    // Tukar code → token
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

    // Ambil user
    const userRes = await axios.get(
      'https://discord.com/api/users/@me',
      { headers: { Authorization: `Bearer ${access_token}` } }
    )

    const user = userRes.data

    // Join server
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

    // Kasih role
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
<title>Berhasil</title>
<style>
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #0f172a, #1e293b);
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
}

.logo {
  width: 120px;
  margin-bottom: 20px;
}

.check {
  font-size: 50px;
  margin-bottom: 10px;
}

h1 {
  color: #4ade80;
}

p {
  color: #ccc;
}
</style>
</head>

<body>
  <div class="card">
    <img class="logo" src="https://cdn.discordapp.com/attachments/1470011473081143477/1484184835214934026/Screenshot_2026-01-10_220600.png?ex=69bd4e57&is=69bbfcd7&hm=a13cf01a1149106b6cd283a976bd175c539cbebac7cc213ec2761a59ffa22a41&">

    <div class="check">🎉</div>
    <h1>Selamat Datang!</h1>
    <p>
      Halo <b>${user.username}</b>,<br><br>
      Kamu resmi menjadi bagian dari<br>
      <b>panggung Figuran</b> 🎭<br><br>
      Nikmati suasana, bangun cerita,<br>
      dan jadilah bagian dari perjalanan ini ✨
    </p>
  </div>
</body>
</html>
`)

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message)
    res.send(`<h1>❌ Error, cek log Railway</h1>`)
  }
})

// RUN
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('🌐 Web jalan')
})
