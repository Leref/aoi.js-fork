const { AoiInviteSystem } = require("../../classes/AoiInviteSystem.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const inviteSystem = d.client.AoiInviteSystem;
    if (!inviteSystem) {
        return d.aoiError.fnError(d, "inviteSystem", { inside: data.inside });
    }

    const inviteCode = data.invite.code;
    const guildID = await inviteSystem.getGuildID(inviteCode);

    return {
        code: d.util.setCode(data, guildID),
    };
};
