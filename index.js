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

    console.log("TRIGGER:", message.id); // ✅ pindahin ke sini

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
      `😐 ${message.author} Udah tau punya pacar masih hubungin mantan`
    ];

    const random = responses[Math.floor(Math.random() * responses.length)];

    await message.reply({ content: random });

    if (text.includes('gabut')) {

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
    `🤣 ${message.author} gabut level max`
  ];

  const random = responses[Math.floor(Math.random() * responses.length)];

  await message.reply({ content: random });
}
  }
});

// LOGIN BOT
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
</head>
<body>
  <h1>🎭 Figuran Verification</h1>
  <a href="${url}">
    <button>Masuk & Verifikasi</button>
  </a>
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

    res.send(`<h1>🎉 Berhasil!</h1><p>Halo <b>${user.username}</b></p>`)

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message)
    res.send(`<h1>❌ Error</h1>`)
  }
})

// RUN
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('🌐 Web jalan')
})
