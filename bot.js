const Discord = require("discord.js");
const client = new Discord.Client();

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

var prefix = "-";

client.on("ready", () => {
  client.user.setGame(`projectsurvivalmc.com | ${prefix}yardım`);
});

client.on("guildCreate", (guild) => {
client.user.setGame(`github.com/arpelo | ${prefix}yardım`);
    guild.owner.user.send(`Selam bu bot opensource bir projedir. http://github.com/arpelo`);
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.toLowerCase().startsWith(prefix + `yardım`)) {
    const embed = new Discord.RichEmbed()
    .setTitle(`:mailbox_with_mail: xBOT Ticket System`)
    .setColor(0xCF40FA)
    .setDescription(`ProjectSurvival Destek Botu`)
    .addField(`Tickets`, `[${prefix}ticketaç]() > Destek Bildirimi Oluşturur!\n[${prefix}ticketkapat]() > Ticket kapatır!`)
    .addField(`Diğer`, `[${prefix}yardım]() > yardım menüsünü gösterir.`)
    message.channel.send({ embed: embed });
  }
}

if (message.content.toLowerCase().startsWith(prefix + `ticketaç`)) {
    const reason = message.content.split(" ").slice(1).join(" ");
    if (!message.guild.roles.exists("name", "🛡️ Ticket Yetkilisi")) return message.channel.send(`Destek ekibinin rolü bulunamadı.`);
    if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`Zaten açık durumda bir ticketin var.`);
    message.guild.createChannel(`ticket-${message.author.id}`, "text").then(c => {
        let role = message.guild.roles.find("name", "🛡️ Ticket Yetkilisi");
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
        message.channel.send(`:white_check_mark: Ticket Kanalın oluşturuldu, #${c.name}.`);
        const embed = new Discord.RichEmbed()
        .setColor(0xCF40FA)
        .addField(`Hey ${message.author.username}!`, `Ticket başarıyla oluşturuldu!`)
        .setTimestamp();
        c.send({ embed: embed });
        message.delete();
    }).catch(console.error);
}
if (message.content.toLowerCase().startsWith(prefix + `ticketkapat`)) {
    if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`Bu komutu sadece ticket kanalında kullanabilirsin.`);

    message.channel.send(`Destek Kanalını kapatmaya emin misin? kapatmak için **-kapat** yazman yeterli.`)
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

client.login(bot_tokeni);
