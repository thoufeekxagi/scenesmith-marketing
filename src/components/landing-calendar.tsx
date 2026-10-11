"use client";
import {useState} from "react";
const posts = [
  {day:4,title:"A little inspiration",platform:"Instagram",state:"published",copy:"Small moments. Fresh perspectives. A few things worth sharing."},
  {day:9,title:"Something new",platform:"X",state:"published",copy:"Good ideas start with a conversation. Here’s to the next one."},
  {day:15,title:"The next chapter",platform:"Instagram",state:"scheduled",copy:"A new season of creating. A fresh page, and plenty to look forward to."},
  {day:19,title:"Behind the scenes",platform:"X",state:"draft",copy:"A little peek at what we’re making. Still finding just the right words."},
  {day:24,title:"Made to be shared",platform:"Instagram",state:"scheduled",copy:"Ideas grow when you share them. What have you been working on?"},
];
export function LandingCalendar(){
  const [offset,setOffset]=useState(0);
  const [selected,setSelected]=useState<(typeof posts)[number]|null>(null);
  const date=new Date(Date.UTC(2026,8+offset,1));
  const label=new Intl.DateTimeFormat("en",{month:"long",year:"numeric",timeZone:"UTC"}).format(date);
  const days=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,0)).getUTCDate();
  const start=(date.getUTCDay()+6)%7;
  function move(amount:number){setOffset(offset+amount);setSelected(null);}
  return <div className="ed-calendar" aria-label="Interactive example social calendar"><div className="ed-cal-top"><span className="ed-demo-label">A peek at your calendar · sample content</span><div><h3 aria-live="polite">{label}</h3><div className="ed-month-buttons"><button aria-label="Previous month" onClick={()=>move(-1)}>←</button><button onClick={()=>{setOffset(0);setSelected(null);}}>Reset</button><button aria-label="Next month" onClick={()=>move(1)}>→</button></div></div></div><div className="ed-week">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><span key={d}>{d}</span>)}</div><div className="ed-grid">{Array.from({length:Math.ceil((start+days)/7)*7},(_,i)=>{const day=i-start+1;const valid=day>0&&day<=days;const post=valid&&offset===0?posts.find(p=>p.day===day):undefined;return <div className={`ed-day${valid?"":" outside"}`} key={i}>{valid&&<span>{day}</span>}{post&&<button className={`ed-event ${post.state}`} aria-label={`${post.platform}: ${post.title}, ${post.state}, September ${day}`} aria-pressed={selected?.day===day} onClick={()=>setSelected(post)}><span>{post.platform}</span><strong>{post.title}</strong><i aria-hidden="true"/></button>}</div>;})}</div><div className="ed-detail" aria-live="polite">{selected?<><span className={`ed-dot ${selected.state}`}/><div><strong>{selected.title}</strong><p>{selected.copy}</p><small>{selected.platform} · {selected.state} · Example post</small></div><button aria-label="Close post preview" onClick={()=>setSelected(null)}>×</button></>:<p>Select a post for a little closer look. ↗</p>}</div></div>;
}
