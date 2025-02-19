const { Time } = require('../../Utils/helpers/customParser.js');

module.exports = async d => {
const {code} = d.command 
const inside = d.unpack() 
const err = d.inside(inside)
if(err) return d.error(err) 
    let [filter,time,reactions,commands,errorMsg="",data=""] = inside.splits; 
    reactions = reactions.split(",") 

   filter = (r,u) =>( filter === "everyone" ? true : u.id === filter ) && ( reactions.includes(r.emoji.toString()) || reactions.includes(r.emoji.name) || reactions.includes(r.emoji.id) )
   time = Time.parse(time)?.ms;
    if(!time) d.aoiError.fnError(d,"custom",{inside},"Invalid Time Provided In") 

   commands = commands.split(",") 
    commands.forEach(cmd =>{
        if(!d.client.cmd.awaited.find(x=>x.name.toLowerCase() === cmd.toLowerCase())) d.aoiError.fnError(d,"custom",{},"Awaited Command: "+cmd+" Doesn't Exist") 
    })
   errorMsg = await d.util.errorParser(errorMsg,d) 
    if(data !== ""){
   try{
       data = JSON.parse(data) 
   }
    catch(e){
        d.aoiError.fnError(d,"custom",{inside},"Invalid Data Provided In") 
    }
        }
   d.message.awaitReactions({filter,time,max:1}).then(async collected=>{
       collected = collected.first()
       const index = reactions.findIndex(r=>( reactions.includes(r.emoji.toString()) || reactions.includes(r.emoji.name) || reactions.includes(r.emoji.id) )) 
       const cmd = d.client.awaited.find(x=>x.name.toLowerCase() === commands[index]?.toLowerCase()) 
       if(!cmd) return d.aoiError.fnError(d,"custom",{},"Invalid Await Command: "+commands[index] ) 
       await d.interpreter(
           d.client,
           d.message,
           d.args,
           cmd,
           d.client.db,
           false,undefined,
           {awaitData:data}
                          )
   }).catch(err=>{
       if(errorMsg !== "") {
           const extraOptions = errorMsg.options 
           delete errorMsg.options 
           d.aoiError.mskeMessageError(d.client,channel,{options:errorMsg},{extraOptions})
       }
       else d.aoiError.consoleError("$awaitMessageReactions",err) 
   })
    return {
        code:d.util.setCode({function:d.func,code,inside}) 
    } 
}