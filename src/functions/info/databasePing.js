module.exports = async d => {
    const data = d.util.aoiFunc(d);

    data.result = d.client.db.ping

    return {
        code: d.util.setCode(data)
    }
}