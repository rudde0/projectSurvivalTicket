const Discord = require('discord.js');
const client = new Discord.Client();
const OzelUyelik = new Set();

client.on('ready', () => {
	console.log('ProjectSurvival ticket bot, aktif!')
	client.user.setPresence({ game: { name: 'projectsurvivalmc.com | -yardım', type: 0 } });
});

client.on('message', message => {
	if (message.content === '-new' || message.content === '-oluştur' || message.content === -'olustur') {
		if (message.guild.channels.exists("name", "ticket-" + message.author.name)) return message.channel.send(`Halihazırda açık bir ticketiniz var.`);
		message.guild.createChannel(`ticket-${message.author.name}`, "text").then(c => {
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
		message.author.send("Ticket kanalınız en üst kategoride oluşturuldu. Lütfen bu kanala girip sorununuzu belirtiniz.");
	}
	if (message.content === '-kapat') {
		if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`Ticket kanalı dışında bu komutu kullanamazsın.`);
		message.channel.delete();
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
