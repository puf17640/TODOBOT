module.exports = (client) => {
  client.tagHandler = async (message, tag) => {
    const getJoinRank = (ID, guild) => { // Call it with the ID of the user and the guild
      if (!guild.member(ID)) return; // It will return undefined if the ID is not valid

      let arr = guild.members.cache.array(); // Create an array with every member
      arr.sort((a, b) => a.joinedAt - b.joinedAt); // Sort them by join date

      for (let i = 0; i < arr.length; i++) { // Loop though every element
        if (arr[i].id == ID) return i; // When you find the user, return it's position
      }
    }

    const JOIN_POS = async () => {
      return getJoinRank(message.author.id, message.guild);
    };

    const MEMCOUNT = async () => {
      return message.guild.memberCount;
    };

    const PROCESSED = async () => {
      const howMany = await client.getprocessedtodos(message.author.id);
      return howMany.length;
    };

    const SUBMITTED = async () => {
      const submitted = await client.getusertodos(message.author.id);
      return submitted.length;
    };

    const PLACEHOLDERS = {
      '<JOIN_POS>': JOIN_POS,
      '<MEMCOUNT>': MEMCOUNT,
      '<PROCESSED>': PROCESSED,
      '<SUBMITTED>': SUBMITTED
    };

    const handler = async (tag) => {
      for (let key in PLACEHOLDERS) {
        let cache = await PLACEHOLDERS[key]();
        tag = await tag.replace(new RegExp(key, 'g'), cache);
      }
      return tag;
    };

    const embedHandler = async (tag) => {
      let cont = tag.replace('<EMBED>', '');
      let obj = {};

      if (tag.includes('<COLOR>')) {
        let temp = cont.split(' ');
        let index = temp.indexOf('<COLOR>');
        let endindex = temp.indexOf('</COLOR>');
        obj.color = temp[endindex -index];
        temp.splice(index, 3);
        cont = temp.join(' ');
      }

      if (tag.includes('<IMG>')) {
        let temp = cont.split(' ');
        let index = temp.indexOf('<IMG>');
        let endindex = temp.indexOf('</IMG>');
        obj.img = temp[endindex -index];
        temp.splice(index, 3);
        cont = temp.join(' ');
      }

      if (tag.includes('<THUMB>')) {
        let temp = cont.split(' ');
        let index = temp.indexOf('<THUMB>');
        let endindex = temp.indexOf('</THUMB>');
        obj.thumb = temp[endindex -index];
        temp.splice(index, 3);
        cont = temp.join(' ');
      }

      let parsed = await handler(cont);
      message.channel.send(client.embed(parsed, obj));
    };

    if(tag.includes('<EMBED>') || tag.includes('</EMBED>'))
      embedHandler(tag);
    else 
      message.channel.send(await handler(tag));
  };
};
