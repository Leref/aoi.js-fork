const { Perms } = require('../../../Utils/Constants.js');

module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [roleId, sep = ' , ', guildId = d.guild?.id] = data.inside.splits;

    const guild =await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', { inside: data.inside });

    const role = await guild.roles.fetch(roleId).catch(err => {
        d.aoiError.fnError(d, 'role', { inside: data.inside });
    });

    const PERMS = Object.entries(Perms);

    data.result = role.permissions.toArray().map(y => PERMS.find(x => x[1] === y)?.[0]).join(sep);

    return {
        code: d.util.setCode(data)
    }
}