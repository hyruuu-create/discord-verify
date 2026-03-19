require('dotenv').config();
const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder 
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Bot aktif sebagai ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // COMMAND ROLES INFO
  if (message.content === 'f!roles') {

    const channel = client.channels.cache.get(process.env.CHANNEL_ID);
    if (!channel) return message.reply('Channel tidak ditemukan!');

    const embed = new EmbedBuilder()
      .setTitle('𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 𝐀𝐁𝐎𝐔𝐓 𝐑𝐎𝐋𝐄𝐒')
      .setDescription(`
**𝙁𝙞𝙜𝙪𝙧𝙖𝙣 𝙎𝙚𝙧𝙫𝙚𝙧**

Di Figuran Server, pada dasarnya semua orang setara.
Tidak ada yang lebih tinggi sebagai manusia, tidak ada yang lebih rendah sebagai anggota komunitas.

Role dibuat bukan untuk membedakan derajat, melainkan untuk membagi tanggung jawab agar server tetap kondusif, tertata, dan nyaman untuk semua.

━━━━━━━━━━━━━━━━━━

👑 **Ketua**
  <@&1433406692015476806>
Penanggung jawab utama server.
Menentukan visi & keputusan akhir.

☃️ **Founder**
Pencetus dan penjaga konsep awal server.

☂️ **Admin**
Pengelola sistem & penangan masalah serius.

🎖️ **Moderator**
Penjaga ketertiban harian.

❄️ **Staff**
Pendukung operasional komunitas.

🛑 **Content Creator**
Representasi kreatif server.

💠 **Server Booster**
Pendukung perkembangan server.

🚨 **Criminal**
Role evaluasi / sanksi sementara.

💮 **Member Cewek**
Identitas tambahan.

🛸 **Member**
Bagian dari komunitas.

━━━━━━━━━━━━━━━━━━

✨ **Penegasan**
Role adalah tanggung jawab, bukan kasta.
Semua setara, semua punya ruang, semua punya nilai.
      `)
      .setColor('#5865F2')
      .setFooter({
  text: '𝙁𝙞𝙜𝙪𝙧𝙖𝙣 𝙎𝙚𝙧𝙫𝙚𝙧',
  iconURL: message.guild.iconURL('https://cdn.discordapp.com/attachments/1435566791844692031/1475124679265226893/PNG_FIGURAN.png?ex=699c586a&is=699b06ea&hm=eeb49118c1b6fb77af585bed0837ab84cf56ea0e9820166b76c6099dc9c81a3f&')})
      .setTimestamp();

    // Mention role (ganti nama sesuai nama role di server kamu)
    const content = `
<@&1433406692015476806 
<@&1452088737482670291
<@&1452185699322302525
<@&1471640157043163156
<@&1433429040467017850
<@&1452197732147138688
<@&1435439157647507518
<@&1452189793663320084
<@&1433449625825574912
    `;

    channel.send({
      content: content,
      embeds: [embed]
    });

    message.reply('Info roles berhasil dikirim!');
  }

});

client.login(process.env.TOKEN);

require('dotenv').config()
const express = require('express')
const axios = require('axios')

const app = express()

// CONFIG
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = 'https://discord-verify-production-0c19.up.railway.app/callback'

const BOT_TOKEN = process.env.BOT_TOKEN
const GUILD_ID = process.env.GUILD_ID
const ROLE_ID = process.env.ROLE_ID

// ROUTE HOME (TOMBOL VERIFY)
app.get('/', (req, res) => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds.join`
  
 res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Verify Server</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #1e1e2f, #2c2c54);
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
    }

    .card {
      background: rgba(255, 255, 255, 0.08);
      padding: 40px;
      border-radius: 15px;
      text-align: center;
      backdrop-filter: blur(10px);
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
      <img src=https://cdn.discordapp.com/attachments/1469870137166266398/1484135829449478174/Screenshot_2026-01-10_220600.png?ex=69bd20b3&is=69bbcf33&hm=8e3ebe2b00edf2815ad31ef198a2b703af852e5d00c00d3e817e8e5176abf691& width="80">
    }

    h1 {
      margin-bottom: 10px;
    }

    p {
      color: #ccc;
      margin-bottom: 25px;
    }

    a button {
      background: #5865F2;
      border: none;
      padding: 15px 30px;
      color: white;
      font-size: 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: 0.3s;
    }

    a button:hover {
      background: #4752c4;
      transform: scale(1.05);
    }
  </style>
</head>
<body>

  <div class="card">
    <h1>🔐 Server FiGu Verification</h1>
    <p>Silakan login dengan Discord untuk mendapatkan akses</p>
    
    <a href="${url}">
      <button>Verify with Discord</button>
    </a>
  </div>

</body>
</html>
`)
})

// CALLBACK DARI DISCORD
app.get('/callback', async (req, res) => {
  const code = req.query.code

  if (!code) return res.send('Code tidak ditemukan!')

  try {
    // 1. TUKAR CODE JADI TOKEN
    const tokenRes = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    const access_token = tokenRes.data.access_token

    // 2. AMBIL DATA USER
    const userRes = await axios.get(
      'https://discord.com/api/users/@me',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    )

    const user = userRes.data

    // 3. MASUKKAN USER KE SERVER
    await axios.put(
      `https://discord.com/api/guilds/${GUILD_ID}/members/${user.id}`,
      {
        access_token: access_token
      },
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )

    // 4. KASIH ROLE
    await axios.put(
      `https://discord.com/api/guilds/${GUILD_ID}/members/${user.id}/roles/${ROLE_ID}`,
      {},
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`
        }
      }
    )

    // SUCCESS
    res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Success</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #1e1e2f, #2c2c54);
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
    }

    .card {
      background: rgba(255, 255, 255, 0.08);
      padding: 40px;
      border-radius: 15px;
      text-align: center;
      backdrop-filter: blur(10px);
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
    }

    h1 {
      color: #57f287;
      margin-bottom: 10px;
    }

    p {
      color: #ccc;
    }

    .check {
      font-size: 50px;
      margin-bottom: 15px;
    }
  </style>
</head>
<body>

  <div class="card">
    <div class="check">✅</div>
    <h1>Berhasil Verifikasi</h1>
    <p>Halo <b>${user.username}</b>, kamu sudah mendapatkan role!</p>
  </div>

</body>
</html>
`)
  } catch (err) {
    console.error(err.response?.data || err.message)

    res.send(`
      <h2>❌ Error</h2>
      <p>Gagal verifikasi. Cek console server.</p>
    `)
  }
})

// RUN SERVER
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('Server Jalan Di https://discord-verify-production-0c19.up.railway.app')
})