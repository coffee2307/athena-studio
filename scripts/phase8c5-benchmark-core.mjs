/** Offline-only bounded HTTP benchmark helpers. */
export function localBenchmarkOrigin(raw){
 let url;
 try{url=new URL(raw);}catch{return null;}
 if(url.protocol!=="http:"||!["localhost","127.0.0.1"].includes(url.hostname)||
  url.username||url.password||url.pathname!=="/"||url.search||url.hash)return null;
 return url.origin;
}
export function percentile(values,part){
 if(!values.length)return null;
 const sorted=values.slice().sort((a,b)=>a-b);
 return Math.round(sorted[Math.ceil(part*sorted.length)-1]*10)/10;
}
export function benchmarkSummary(entries,seconds){
 const durations=entries.map(e=>e.duration).filter(Number.isFinite);
 const ok=entries.filter(e=>e.status>=200&&e.status<400).length;
 return {
  requests:entries.length,
  passed:ok,
  failed:entries.length-ok,
  httpErrors:entries.filter(e=>e.status>=400).length,
  networkErrors:entries.filter(e=>e.status===0).length,
  p50Ms:percentile(durations,0.5),
  p95Ms:percentile(durations,0.95),
  p99Ms:percentile(durations,0.99),
  throughputRps:Math.round(entries.length/Math.max(seconds,0.001)*10)/10
 };
}
