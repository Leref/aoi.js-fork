const {Perms} = require('../../utils/Constants.js');
const {PermissionFlagsBits, OAuth2Scopes} = require('discord.js');

module.exports = async d => {
    const data = d.util.aoiFunc(d);
    let [...perms] = data.inside.splits;

    if (perms.some(perm => !Perms[perm] && !PermissionFlagsBits[perm] && isNaN(perm))) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Perm(s) Provided In');
    perms = perms.map(perm => Perms[perm] || PermissionFlagsBits[perm] || perm);
    data.result = d.client.generateInvite({
        scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
        permissions: perms
    })

    return {
        code: d.util.setCode(data)
    }
}
