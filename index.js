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
const REDIRECT_URI = 'https://discord-verify-production-0c19.up.railway.app/callback'

const BOT_TOKEN = process.env.BOT_TOKEN
const GUILD_ID = process.env.GUILD_ID
const ROLE_ID = process.env.ROLE_ID

// HOME
app.get('/', (req, res) => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds.join`

  res.send(`
  <h2 style="text-align:center;margin-top:50px;">
    🔐 <br><br>
    <a href="${url}">VERIFY DISCORD</a>
  </h2>
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

    res.send(`<h1>✅ Verifikasi berhasil, ${user.username}</h1>`)

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message)
    res.send(`<h1>❌ Error, cek log Railway</h1>`)
  }
})

// RUN
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('🌐 Web jalan')
})