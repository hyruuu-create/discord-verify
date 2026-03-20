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

// ✅ READY
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
      `📱 ${message.author} chat aja sana 😌`,
      `🌙 kangen itu berat ya ${message.author}...`,
      `👀 jujur aja ${message.author}, kangen siapa?`,
      `🔥 ${message.author} fix lagi mikirin dia nih`,
      `🥀 ${message.author}, kadang kangen ga harus memiliki...`
    ]

    const random = responses[Math.floor(Math.random() * responses.length)]
    await message.reply({ content: random })
  }
})

// LOGIN BOT (SATU KALI AJA!)
client.login(process.env.BOT_TOKEN)


// ================== WEB VERIFY ==================
const app = express()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = 'https://discord-verify-production-2866.up.railway.app/callback'

const BOT_TOKEN = process.env.BOT_TOKEN
const GUILD_ID = process.env.GUILD_ID
const ROLE_ID = process.env.ROLE_ID

app.use(express.static('public'))

app.get('/', (req, res) => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds.join`

  res.send(`<h1>Login</h1><a href="${url}">Verifikasi</a>`)
})

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

    res.send(`<h1>✅ Berhasil, ${user.username}</h1>`)

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message)
    res.send(`<h1>❌ Error</h1>`)
  }
})

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('🌐 Web jalan')
})
