const Discord = require("discord.js");
const client = new Discord.Client();
/*
http://github.com/arpelo
*/

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

var prefix = "-";

client.on("ready", () => {
	console.log('ProjectSurvival ticketbot, etkinleştirildi!')
	client.user.setPresence({ game: { name: 'projectsurvivalmc.com | -yardım', type: 0 } });
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.toLowerCase().startsWith(prefix + `yardım`)) {
    const embed = new Discord.RichEmbed()
    .setTitle(`:mailbox_with_mail: Ticket Sistemi`)
    .setColor(0xCF40FA)
    .setDescription(`Hata bildirimleri, oyuncu şikayetleri için burayı kullanabilirsin.`)
    .addField(`Tickets`, `[${prefix}ticketaç]() > Destek bildirimi açar.\n[${prefix}ticketkapat]() > Açılan desteği kapatır.`)
    message.channel.send({ embed: embed });
  }

  if (message.content.toLowerCase().startsWith(prefix + `ping`)) {
    message.channel.send(`Hesaplama yapılıyor...`).then(m => {
    m.edit(`:ping_pong: API zamanlaması, ` + (m.createdTimestamp - message.createdTimestamp) + `ms, Discord API pingim ` + Math.round(client.ping) + `ms.`);
    });
}

/*
http://github.com/arpelo
*/

if (message.content.toLowerCase().startsWith(prefix + `ticketaç`)) {
    const reason = message.content.split(" ").slice(1).join(" ");
    if (!message.guild.roles.exists("name", "Ticket Yetkilisi")) return message.channel.send(`Bu Sunucuda '**Destek Ekibi**' rolünü bulamadım bu yüzden ticket açamıyorum \nEğer sunucu sahibisen, Destek Ekibi Rolünü oluşturabilirsin.`);
    if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`Zaten açık durumda bir ticketin var.`);
    message.guild.createChannel(`ticket-${message.author.id}`, "text").then(c => {
        let role = message.guild.roles.find("name", "Ticket Yetkilisi");
        let role2 = message.guild.roles.find("name", "@everyone");
        c.overwritePermissions(role, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        c.overwritePermissions(role2, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false
        });
        c.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        message.channel.send(`:white_check_mark: Destek bildirimin başarıyla oluşturuldu, #${c.name}.`);
        const embed = new Discord.RichEmbed()
        .setColor(0xCF40FA)
        .addField(`${message.author.username}!`, `Başarıyla ticket açtın, lütfen yetkilileri etiketleme.`)
        .setTimestamp();
        c.send({ embed: embed });
        message.delete();
    }).catch(console.error);
}
if (message.content.toLowerCase().startsWith(prefix + `ticketkapat`)) {
    if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`Bu komut sadece kişisel destek odanda kullanılabilir.`);

    message.channel.send(`Destek kanalını kapatmak istediğine eminsen **-kapat** yazman yeterli.`)
    .then((m) => {
      message.channel.awaitMessages(response => response.content === '-kapat.', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
      .then((collected) => {
          message.channel.delete();
        })
        .catch(() => {
          m.edit('Ticket kapatma isteğin zaman aşımına uğradı.').then(m2 => {
              m2.delete();
          }, 3000);
        });
    });
}

});

client.login(process.env.bot_tokeni);
