const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	console.log('ProjectSurvival ticket bot, aktif!')
	client.user.setPresence({ game: { name: 'projectsurvivalmc.com | -yardım', type: 0 } });
});

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

client.on('message', message => {
	if (message.content.toLowercase().startsWith(`-destek`) || message.content.toLowerCase().startsWith(`-oluştur`) || message.content.toLowerCase().startsWith(`-olustur`) || message.content.toLowerCase().startsWith(`-new`)) {
		const reason = message.content.split(" ").slice(1).join(" ");
		if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`Halihazırda açık bir ticketiniz var.`);
		message.guild.createChannel(`ticket-${message.author.id}`, "text").then(c => {
			let role = message.guild.roles.find("name", "Ticket Yetkilisi");
			let role2 = message.guild.roles.find("name", "@everyone");
			c.overwritePermissions(role, {
				SEND_MESSAGES: true,
				READ_MESSAGES: true,
				ATTACH_FILES: true
			});
			c.overwritePermissions(role2, {
				SEND_MESSAGES: false,
				READ_MESSAGES: false,
				ATTACH_FILES: true
			});
			c.overwritePermissions(message.author, {
				SEND_MESSAGES: true,
				READ_MESSAGES: true,
				ATTACH_FILES: true
			});
			c.send({embed: {
				color: 3447003,
				author: {
					name: client.user.username,
					icon_url: client.user.avatarURL
				},
				title: `Ticket oluşturuldu! (@${message.author.username})`,
				url: "http://www.projectsurvivalmc.com",
				description: "Ticket odasını oluşturdunuz.\nBu kanalda sorununuzla ilgili bilgi veriniz.\nYetkilileri etiketlemeyin, müsait olunca ticket cevaplanılır.",
				timestamp: new Date(),
				footer: {
					icon_url: client.user.avatarURL,
					text: "© ProjectSurvival"
				}
			}
			});
		});
		var embed = new Discord.RichEmbed()
		.setColor('#00FF00')
		.setTimestamp()
		.setAuthor("ProjectSurvival Ticket", message.guild.iconURL)
		.setThumbnail(message.guild.iconURL)
		.addField("Ticket oluşturuldu", "Başarıyla ticket oluşturdun! :white_check_mark:")
		message.channel.send({embed: embed});
	}
	if (message.content.toLowerCase().startsWith(`-yardım`) || message.content.toLowerCase().startsWith(`-yardim`) || message.content.toLowerCase().startsWith(`-help`)) {
		var embed = new Discord.RichEmbed()
		.setColor('#00FF00')
		.setTimestamp()
		.setAuthor("ProjectSurvival Ticket", message.guild.iconURL)
		.setThumbnail(message.guild.iconURL)
		.addField("Ne işe yarar?", "Oyuncu şikayetlerinizi, kritik hata bildirimlerini, ödeme bildiriminizi ticket açıp bize ulaştırabilirsiniz.")
		.addField("Ticket Kullanımı", "-oluştur **»** Yeni ticket odası açar.\n-kapat **»** Oluşturulan ticket odasını kapatır.\n-ip **»** Sunucu IP'sini gönderir.")
		message.channel.send({embed: embed});
	}
	if (message.content === '-ip') {
		var embed = new Discord.RichEmbed()
		.setColor('#00FF00')
		.addField("Kullanılabilir IP adresleri", "oyna.ProjectSurvivalMC.com\nplay.ProjectSurvivalMC.com\n")
		//.setImage(`https://mcapi.us/server/image?ip=play.projectsurvivalmc.com&theme=dark`)
		.setImage(`https://status.minecraftservers.org/classic/517604.png`)
		message.channel.send({embed: embed});
	}
	if (message.content.toLowerCase().startsWith(`-kapat`) || message.content.toLowerCase().startsWith(`-close`)) {
		if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`Ticket kanalı dışında bu komutu kullanamazsın.`);
		message.channel.send(`Kanalı silmek istediğine eminsen **-onayla** yaz.`)
		.then((m) => {
			message.channel.awaitMessages(response => response.content === '-onayla', {
				max: 1,
				time: 10000,
				errors: ['time'],
			})
			.then((collected) => {
				message.channel.delete();
			})
			.catch(() => {
				m.edit('Kapatma onayının süresi doldu.').then(m2 => {
					m2.delete();
				}, 3000);
			})
		});
	}
});

client.login(process.env.bot_tokeni);
