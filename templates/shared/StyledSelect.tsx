"use client";
import {useEffect,useId,useRef,useState} from "react";
type Props={id:string;value:string;options:string[];onChange:(value:string)=>void;className?:string};
export default function StyledSelect({id,value,options,onChange,className=""}:Props){
 const [open,setOpen]=useState(false);
 const [active,setActive]=useState(Math.max(0,options.indexOf(value)));
 const wrap=useRef<HTMLDivElement>(null);
 const listId=useId();
 useEffect(()=>{const onOutside=(event:PointerEvent)=>{if(wrap.current&&!wrap.current.contains(event.target as Node))setOpen(false)};document.addEventListener("pointerdown",onOutside);return()=>document.removeEventListener("pointerdown",onOutside)},[]);
 useEffect(()=>{setActive(Math.max(0,options.indexOf(value)))},[options,value]);
 const pick=(index:number)=>{onChange(options[index]);setActive(index);setOpen(false);wrap.current?.querySelector("button")?.focus()};
 const key=(event:React.KeyboardEvent<HTMLButtonElement>)=>{
  if(event.key==="Escape"){setOpen(false);return}
  if(event.key==="ArrowDown"||event.key==="ArrowUp"){event.preventDefault();const next=(active+(event.key==="ArrowDown"?1:-1)+options.length)%options.length;setActive(next);setOpen(true);return}
  if(event.key==="Home"||event.key==="End"){event.preventDefault();setActive(event.key==="Home"?0:options.length-1);setOpen(true);return}
  if(event.key==="Enter"||event.key===" "){event.preventDefault();if(open)pick(active);else setOpen(true)}
 };
 return <div className={className+" athenaStyledSelect"} ref={wrap}>
  <button id={id} type="button" className="athenaStyledSelectTrigger" aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} onClick={()=>{setActive(Math.max(0,options.indexOf(value)));setOpen(!open)}} onKeyDown={key}><span>{value}</span><span className="athenaStyledSelectCaret" aria-hidden="true">⌄</span></button>
  {open&&<div id={listId} className="athenaStyledSelectList" role="listbox" aria-label="Lựa chọn" aria-activedescendant={listId+"-"+active}>{options.map((option,index)=><button type="button" id={listId+"-"+index} role="option" aria-selected={value===option} data-active={active===index} key={option} onMouseEnter={()=>setActive(index)} onClick={()=>pick(index)} className="athenaStyledSelectOption">{option}</button>)}</div>}
 </div>
}
