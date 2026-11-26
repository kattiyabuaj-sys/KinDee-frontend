import {useMemo,useState} from 'react'
import {GOALS} from '../data/mockTags'
import {pickWinner} from '../store/userStore'

const FILL=[['#A93118','#fff'],['#FAF8F5','#673A25'],['#D3A275','#673A25'],['#6F8B3C','#fff']]
const pt=(a,r)=>[150+r*Math.sin(a*Math.PI/180),150-r*Math.cos(a*Math.PI/180)]

export default function Wheel({pool,p,kcal,open,user,onSpin}){
  const segs=useMemo(()=>{
    const a=[...pool].sort(()=>Math.random()-.5).slice(0,8)
    return Array.from({length:8},(_,i)=>a[i%a.length])
  },[pool.map(x=>x.id).join()])
  const [rot,setRot]=useState(0)
  const [win,setWin]=useState(0)
  const [busy,setBusy]=useState(false)

  const spin=()=>{
    if(busy)return
    const pk=pickWinner(user,[...new Map(segs.map(x=>[x.id,x])).values()])
    const ids=segs.flatMap((x,i)=>x.id===pk.id?[i]:[])
    const w=ids[Math.floor(Math.random()*ids.length)]
    onSpin(pk)
    setBusy(true)
    setWin(w)
    setRot(r=>r-r%360+360*6+360-(w*45+22.5))
    setTimeout(()=>setBusy(false),4200)
  }

  const names=p.goals.map(g=>GOALS.find(x=>x[0]===g)?.[1]).filter(Boolean)
  const m=segs[win]
  return(
    <div className="flex-1 overflow-y-auto px-5 pb-4">
      <div className="flex gap-2 overflow-x-auto py-3">
        {names.map(n=><span key={n} className="chip">{n}</span>)}
        <span className="chip"><span className="font-num mr-1">{kcal}</span>kcal/มื้อ</span>
      </div>
      <h1 className="text-3xl font-bold text-center mt-3">มื้อนี้กินอะไรดี?</h1>
      <p className="text-center text-sm opacity-70 mb-3">หมุนวงล้อเพื่อสุ่มเมนูสุขภาพที่ตรงใจคุณ</p>
      <div className="relative mx-auto w-[300px] h-[300px]">
        <div className="absolute left-1/2 -top-1 -translate-x-1/2 z-10 text-red text-2xl leading-none">▼</div>
        <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow" style={{transform:`rotate(${rot}deg)`,transition:'transform 4s cubic-bezier(.12,.7,.1,1)'}}>
          <circle cx="150" cy="150" r="148" fill="#FAF8F5" stroke="#D3A275" strokeWidth="2"/>
          {segs.map((s,i)=>{
            const [a,b]=[pt(i*45,138),pt(i*45+45,138)]
            const [bg,fg]=FILL[i%4]
            return(
              <g key={i}>
                <path d={`M150 150L${a[0]} ${a[1]}A138 138 0 0 1 ${b[0]} ${b[1]}Z`} fill={bg}/>
                <text x="150" y="58" fill={fg} fontSize="10" fontWeight="600" textAnchor="middle" transform={`rotate(${i*45+22.5} 150 150)`}>
                  {s.nameTh.length>11?s.nameTh.slice(0,10)+'…':s.nameTh}
                </text>
              </g>
            )
          })}
          <circle cx="150" cy="150" r="24" fill="#FAF8F5" stroke="#D3A275" strokeWidth="2"/>
          <text x="150" y="157" textAnchor="middle" fontSize="20">🍴</text>
        </svg>
      </div>
      <div className="text-center mt-4"><span className="chip">✓ พร้อมสุ่ม: {rot?m.nameTh:'กดปุ่มเพื่อเริ่ม'}{rot>0&&!busy&&<> • <span className="font-num">{m.nutrition.cal}</span> kcal</>}</span></div>
      <div className="mt-3 space-y-2">
        <button className="cta disabled:opacity-60" disabled={busy} onClick={spin}>🎲 {rot?'สุ่มใหม่':'สุ่มเมนู'}</button>
        {rot>0&&!busy&&<button className="btn-o w-full py-3" onClick={()=>open(m)}>ดูสูตรและวัตถุดิบ</button>}
      </div>
    </div>
  )
}
