const Discord = require('discord.js');
const client = new Discord.Client();
const activities = require('./assets/activities');
/*const fs = require("fs");
let ticketbans = JSON.parse(fs.readFileSync("./ticketbans.json", "utf8"));*/

client.on('ready', () => {
	console.log(`${client.user.tag} adiyla bot baslatildi. Kimlik: ${client.user.id}`);
	client.setInterval(() => {
		const activity = activities[Math.floor(Math.random() * activities.length)];
		client.user.setStatus('available')
		client.user.setPresence({
			game: {
				name: activity.text,
				type: activity.type
			}
		});
    }, 60000);
});
client.on('error', console.error);

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

/*exports.run = async (reaction, user) => {
	console.log('new reacrion')
	var role
	var given
	var msg = await reaction.message
	console.log('En azından okundu')
	if (msg.id == '562542165427879937') {
		console.log('valid reacrion')
		if (reaction.emoji.id == '🛠') {
			role = msg.guild.roles.get('562545238552608768')
			console.log('new ping reaction')
			if (user.hasRole(role)) {
				user.removeRole(role)
				given = ' You have left @'
			} else {
				user.addRole(role)
				given = ' You have joined @'
			}
			user.send(reaction.emoji.toString() + given + role.name + '.')
		}
		console.log('new reacrion done')
	}
}*/

const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

client.on('raw', async event => {
	if (!events.hasOwnProperty(event.t)) return;
	const { d: data } = event;
	const user = client.users.get(data.user_id);
	const channel = client.channels.get(data.channel_id);
	const message = await channel.fetchMessage(data.message_id);
	const member = message.guild.members.get(user.id);
	const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
	const reaction = message.reactions.get(emojiKey);
	if (message.author.id === '212243328245301268' && (message.id === '562542165427879937')) { //Güncellemeler
		if (event.t === "MESSAGE_REACTION_ADD") {
			member.addRole(`562545238552608768`);
		} else {
			member.removeRole(`562545238552608768`);
		}
	}
	if (message.author.id === '212243328245301268' && (message.id === '562542250257678347')) { //Duyurular
		if (event.t === "MESSAGE_REACTION_ADD") {
			member.addRole(`562549572799561728`);
		} else {
			member.removeRole(`562549572799561728`);
		}
	}
	if (message.author.id === '212243328245301268' && (message.id === '562542419975864320')) { //Diğer
		if (event.t === "MESSAGE_REACTION_ADD") {
			member.addRole(`562550876536045569`);
		} else {
			member.removeRole(`562550876536045569`);
		}
	}
	if (message.author.id === '212243328245301268' && (message.id === '581472119301341185')) { //Olaylar
		if (event.t === "MESSAGE_REACTION_ADD") {
			member.addRole(`581472494607794206`);
		} else {
			member.removeRole(`581472494607794206`);
		}
	}
	setTimeout(function(){
		const roleUpdates = message.guild.roles.find(r => r.name === "🔔 Güncellemeler Kaynağı"); //message.member.roles.find("name", "🔔 Güncellemeler Kaynağı");
		const roleAnnouncements = message.guild.roles.find(r => r.name === "🔔 Duyurular Kaynağı");
		const roleOther = message.guild.roles.find(r => r.name === "🔔 Diğer Kaynağı");
		const roleEvents = message.guild.roles.find(r => r.name === "🔔 Olaylar Kaynağı");
		const headline = message.guild.roles.find(r => r.name === "⠀⠀⠀⠀⠀⠀SİSTEM ROLLERİ⠀⠀⠀⠀⠀⠀⠀");
		//var roleAll = message.member.roles.some(r=>["🔔 Güncellemeler Kaynağı", "🔔 Duyurular Kaynağı", "🔔 Diğer Kaynağı"].includes(r.name))
		if (event.t !== "MESSAGE_REACTION_ADD") {
			if (message.id === '562542165427879937' || message.id === '562542250257678347' || message.id === '562542419975864320' || message.id === '581472119301341185') {
				if(headline) {
					//console.log(!message.guild.roles.find(r => r.name === "🔔 Güncellemeler Kaynağı"))
					if(roleUpdates !== true && roleAnnouncements !== true && roleOther !== true && roleEvents !== true) {
						member.removeRole(`562549906011848714`);
					}
				}
			}
		} else {
			if (message.id === '562542165427879937' || message.id === '562542250257678347' || message.id === '562542419975864320' || message.id === '581472119301341185') {
				//console.log("ek1")
				if(roleUpdates !== false || roleAnnouncements !== false || roleOther !== false || roleEvents !== false) {
					//console.log("ek2")
					if(headline !== true) {
						//console.log("ek3")
						member.addRole(`562549906011848714`);
					}
				}
			}
		}
	 }, 1000);
});

client.on('message', message => {
	/*if (!ticketbans[message.author.id]) ticketbans[message.author.id] = {
		banlevel: 0
	};
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0];
	let args = messageArray.slice(1);
	if (message.content.toLowerCase().startsWith(`-ticketban`)) {
		if(!message.member.roles.has(`544105208783962114`)) return message.channel.reply(`Bu komutu kullanabilmek için gerekli izniniz yok.`);
		let ar = args[0];
		let ar2 = args[1];
		let userData = ticketbans[ar2];
		if (ar === "ekle") {
			message.channel.send(`${ar2} kimlikli kişi artık ticket açamayacak.`);
			userData.ticketbans++;
		} else if (ar === "çıkar" || ar === "cikar") {
			message.channel.send(`${ar2} kimlikli kişi tekrar ticket açabilir.`);
			userData.ticketbans = 0;
		}
	}*/
	if (message.content.toLowerCase().startsWith(`-destek`) || message.content.toLowerCase().startsWith(`-oluştur`) || message.content.toLowerCase().startsWith(`-olustur`) || message.content.toLowerCase().startsWith(`-new`)) {
		//let userData = banlevel[message.author.id];
		const reason = message.content.split(" ").slice(1).join(" ");
		let allowedRole = message.guild.roles.find("name", "Susturulmuş: Ticket");
		if (message.member.roles.has(allowedRole.id)) return message.channel.send(`Daha önceden yapılmış bir ihlal nedeniyle ticket açamıyorsunuz.`);
		if (!message.channel.name.startsWith(`🤖`)) return message.channel.send(`Sistem, sadece komut kanalında çalıştırılabilir.`);
		if (message.guild.channels.exists("name", "🎫" + message.author.username)) return message.channel.send(`Halihazırda açık bir ticketiniz var.`);
		//if (userData.ticketbans >= 1) return message.channel.reply(`Daha önceden yapılmış bir ihlal nedeniyle ticket açamıyorsunuz.`);
		message.guild.createChannel(`🎫${message.author.username}`, "text").then(c => {
			c.setTopic(`${reason}`);
			let role = message.guild.roles.find("name", "Yetkili: Ticket Yönetimi");
			let role2 = message.guild.roles.find("name", "@everyone");
			let role3 = message.guild.roles.find("name", "İnsan Kaynakları Yöneticisi");
			let role4 = message.guild.roles.find("name", "Yetkili: Adil Oyun Sağlayıcısı");
			c.overwritePermissions(role, {
				SEND_MESSAGES: true,
				READ_MESSAGES: true,
				MANAGE_CHANNELS: true,
				MANAGE_MESSAGES: true,
				ATTACH_FILES: true
			});
			c.overwritePermissions(role3, {
				SEND_MESSAGES: true,
				READ_MESSAGES: true,
				MANAGE_CHANNELS: true,
				MANAGE_MESSAGES: true,
				ATTACH_FILES: true
			});
			c.overwritePermissions(role4, {
				SEND_MESSAGES: true,
				READ_MESSAGES: true,
				MANAGE_CHANNELS: true,
				MANAGE_MESSAGES: true,
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
				description: "Ticket odasını oluşturdunuz.\nBu kanalda sorununuzla ilgili bilgi veriniz.\nYetkilileri etiketlemeyin, müsait olunca ticket cevaplanılır.\nSorununuz çözüldüğü zaman `-kapat` yazarak odayı kapatınız.",
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
		//.setAuthor("ProjectSurvival Ticket", message.guild.iconURL)
		//.setThumbnail(message.guild.iconURL)
		.addField("Destek talebin alındı:", "Senin adına en üst metin kanalında destek kanalı oluşturuldu.\nKanalı açıp sorunu bizimle paylaşabilirsin.")
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
		if (!message.channel.name.startsWith(`🎫`)) return message.channel.send(`Ticket kanalı dışında bu komutu kullanamazsın.`);
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
