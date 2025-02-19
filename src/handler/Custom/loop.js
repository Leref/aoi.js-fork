const Interpreter = require("../../core/interpreter.js");
/**
 * @param  {import('../../classes/AoiClient.js')} client
 */
module.exports = async (client) => {
    const cmds = client.cmd.loop.allValues();
    let chan;
    let Data = {
        client: client,
        channel: undefined,
        guild: undefined,
    };
    for (const cmd of cmds) {
        const data = { ...Data };
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(
                client,
                data,
                [],
                { name: "ChannelParser", code: cmd.channel },
                client.db,
                true,
            );
            chan = await client.channels.fetch(id?.code);
            data.channel = chan;
            data.guild = chan?.guild;
        } else {
            chan = await client.channels.fetch(cmd.channel);
            data.channel = chan;
            data.guild = chan?.guild;
        }
        setInterval(async () => {
            await Interpreter(
                client,
                data,
                [],
                cmd,
                client.db,
                false,
                chan?.id,
                {},
                chan,
            );
        }, cmd.every || 60000);

        if (cmd.executeOnStartup)
            await Interpreter(
                client,
                data,
                [],
                cmd,
                client.db,
                false,
                chan?.id,
                {},
                chan,
            );
    }
};
