type Level="info"|"warn"|"error";
const allowedCode=/^[A-Z0-9_]{2,48}$/;
export function logEvent(level:Level,event:string,fields:Record<string,unknown>={}){
 const safe={event:allowedCode.test(event)?event:"UNCLASSIFIED_EVENT",...Object.fromEntries(Object.entries(fields).filter(([key,value])=>allowedCode.test(key)&&typeof value==="string"&&allowedCode.test(value)))};
 const line=JSON.stringify({time:new Date().toISOString(),level,...safe});
 if(level==="error")console.error(line);else if(level==="warn")console.warn(line);else console.info(line);
}
