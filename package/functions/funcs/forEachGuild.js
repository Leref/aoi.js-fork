const {wait} = require('../../../Utils/helpers/functions.js');
const { Time } = require('../../../Utils/helpers/customParser.js');

module.exports = async d => {
    const data = d.util.openFunc(d);
    if(data.err) return d.error(data.err);
    
    let [ time="",awaitData,...cmds ] = data.inside.splits;
    const endCmd = cmds.pop(); 
    
    try {
    awaitData = JSON.parse(awaitData);
        }
    catch(e){
        d.aoiError.fnError(d,"custom",{ inside : data.inside },"Invalid Data Provided In");
    }
    
    time = isNaN(time) ? Time.parse(time).ms : Number(time);
    
   cmds.forEach( x => {
       if(!d.client.cmd.awaited.find( y => y.name.toLowerCase() === x.toLowerCase() )) {
           d.aoiError.fnError(d,"custom",{},"Awaited Command: " + x + " Not Found");
       }
   });
    
   cmds = cmds.map(x => d.client.cmd.awaited.find( y => y.name.toLowerCase() === x.toLowerCase() )).reverse(); 

   const datas= [...d.client.guilds.cache.values()].reverse();
    
    let i = datas.length -1;
    
    while(i >= 0) {
        const guild = datas[i];
        
        let u = cmds.length -1;
        
        const loopData = {
            channel : d.channel,
            message : d.message,
            guild,
            client : d.client,
            author : d.author,
            member : d.member,
        } 
        
        while(u >=0) {
            const cmd = cmds[u] 
        d.interpreter(d.client,loopData,d.args,cmd,d.client.db,false,undefined,awaitData);
            
            u--
    };
        
        await wait(time);
        
        i-- 
}
    
    return {
        code : d.util.setCode( data ) 
    }
}