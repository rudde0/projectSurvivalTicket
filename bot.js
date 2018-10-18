const Discord = require('discord.js');
const client = new Discord.Client();
const OzelUyelik = new Set();

client.on('ready', () => {
	console.log('ProjectSurvival ticket bot, aktif!')
	client.user.setPresence({ game: { name: 'projectsurvivalmc.com | -yardım', type: 0 } });
});

client.on('message', message => {
	if (message.content === '-new' || message.content === '-oluştur' || message.content === '-olustur') {
		if (message.guild.channels.exists("name", "ticket-" + message.author.username)) return message.channel.send(`Halihazırda açık bir ticketiniz var.`);
		message.guild.createChannel(`ticket-${message.author.username}`, "text").then(c => {
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
		});
		var embed = new Discord.RichEmbed()
		.setColor('#00FF00')
		.setTimestamp()
		.setAuthor("ProjectSurvival Ticket", message.guild.iconURL)
		.setThumbnail(message.guild.iconURL)
		.addField("Ticket oluşturuldu", "Başarıyla ticket oluşturdun, lütfen yetkilileri etiketleme! :white_check_mark:")
		message.channel.send({embed: embed});
		c.send({embed: {
			color: 3447003,
			author: {
				name: client.user.username,
				icon_url: client.user.avatarURL
			},
			title: "Ticket oluşturuldu!",
			url: "http://www.projectsurvivalmc.com",
			description: "Ticket odasını oluşturdunuz.",
			fields: [{
				name: "Bilgi",
				value: "Bu kanalda sorununuzla ilgili bilgi veriniz."
			},
			{
				name: "Uyarı",
				value: "Yetkilileri etiketlemeyin, müsait olunca ticket cevaplanılır."
			}
			],
			timestamp: new Date(),
			footer: {
				icon_url: client.user.avatarURL,
				text: "© ProjectSurvival"
			}
		}
		});
	}
	if (message.content === '-yardım' || message.content === '-yardim') {
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
		.setTimestamp()
		.setAuthor("Sunucu IP", message.guild.iconURL)
		.setThumbnail(message.guild.iconURL)
		.addField("Kullanılabilir IP adresleri", "oyna.ProjectSurvivalMC.com\nplay.ProjectSurvivalMC.com")
		.addField("İstemci", "1.12.2 ile giriş yapılır.\nAynı zamanda Forge 1.12.2 ile de girebilirsiniz.")
		message.channel.send({embed: embed});
	}
	if (message.content === '-kapat') {
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
