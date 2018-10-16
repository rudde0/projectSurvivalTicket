const Discord = require('discord.js');
const client = new Discord.Client();
const OzelUyelik = new Set();

client.on('ready', () => {
	console.log('ProjectSurvival ticket bot, aktif!')
	client.user.setPresence({ game: { name: 'projectsurvivalmc.com | -yardım', type: 0 } });
});

client.on('message', message => {
	if (message.content === '-new' || message.content === '-oluştur' || message.content === -'olustur') {
		message.guild.createChannel(`ticket-${message.author}`, "text").then(c => {
			let role = message.guild.roles.find("name", "\@🛡️ Ticket Yetkilisi");
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
	}
});

client.login(process.env.bot_tokeni);
