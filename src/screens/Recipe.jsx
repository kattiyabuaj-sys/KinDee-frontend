import {useState} from 'react'
import {scaleMeal} from '../utils/nutrition'
import {rulesFor} from '../data/mockSubstitutions'
import {suggestSwap} from '../store/userStore'

export default function Recipe({m,kcal,back,again,saved,save,us,onSwap}){
  const [sw,setSw]=useState({})
  const [open,setOpen]=useState(null)
  const {rows,tot}=scaleMeal(m,kcal,sw)
  const pick=(from,r)=>{
    const on=sw[from]!==r.id
    setSw(s=>({...s,[from]:on?r.id:undefined}))
    if(on)onSwap(from,r.targetIngredientId)
  }
  return(
    <div className="flex-1 overflow-y-auto pb-6">
      <div className="h-44 px-4 pt-4 flex justify-between items-start bg-gradient-to-br from-tan to-green">
        <button onClick={back} className="w-10 h-10 rounded-full bg-card">←</button>
        <div className="flex gap-2">
          <button onClick={save} className="w-10 h-10 rounded-full bg-card">{saved?'★':'☆'}</button>
          <button onClick={again} className="bg-red text-white rounded-full px-4 h-10 font-semibold">🎲 สุ่มใหม่</button>
        </div>
      </div>
      <div className="px-4 -mt-10">
        <div className="card p-4">
          <div className="flex justify-between text-xs"><span className="chip">🌿 แนะนำตามเป้าหมายของคุณ</span><span>⏱ ใช้เวลา {m.prepTimeMins} นาที</span></div>
          <h1 className="text-2xl font-bold my-2">{m.nameTh}</h1>
          <div className="flex flex-wrap gap-2 font-num text-sm font-bold">
            <span className="chip !text-red !border-tan">{tot.cal} kcal</span>
            <span className="chip">โปรตีน {tot.p}g</span>
            <span className="chip">คาร์บ {tot.c}g</span>
            <span className="chip">ไขมัน {tot.f}g</span>
            <span className="chip">น้ำตาล {tot.s}g</span>
            <span className="chip">{tot.na<=600?'โซเดียมต่ำ ':'โซเดียม '}{tot.na}mg</span>
            <span className="chip !text-brown !border-tan">฿{tot.cost}</span>
          </div>
        </div>
        <div className="flex justify-between items-baseline mt-5 mb-2"><h2 className="text-xl font-bold">วัตถุดิบตามสัดส่วนของคุณ</h2><span className="text-xs">สำหรับ 1 มื้อ</span></div>
        <div className="card p-3 divide-y divide-tan/40">
          {rows.map(r=>{
            const opts=rulesFor(r.id,m.dishStyle)
            const sug=suggestSwap(us,r.id)
            const open_=open===r.id||(open===null&&sug&&opts.some(o=>o.targetIngredientId===sug))
            return(
              <div key={r.id} className="py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{r.name} <span className="font-num">{r.amt}</span> {r.unit}</span>
                  {opts.length>0&&<button className="btn-o shrink-0" onClick={()=>setOpen(open_?'':r.id)}>⇄ สลับของ</button>}
                </div>
                {open_&&(
                  <div className="mt-2 rounded-xl border-2 border-green bg-[#F3EEE4] p-3 text-sm space-y-2">
                    <b className="text-green">ตัวเลือกทดแทนอัจฉริยะ</b>
                    {opts.map(o=>(
                      <button key={o.id} onClick={()=>pick(r.id,o)} className={`block w-full text-left rounded-lg p-2 border ${sw[r.id]===o.id?'border-green bg-green/10':'border-tan/60 bg-card'}`}>
                        {o.targetIngredientId===sug&&<span className="chip mr-1">⭐ คุณมักสลับแบบนี้</span>}
                        {o.reasonTh}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <h2 className="text-xl font-bold mt-5 mb-2">วิธีทำทีละขั้นตอน</h2>
        <div className="space-y-3">
          {m.stepsTh.map((t,i)=>(
            <div key={i} className="card p-3"><span className="chip mb-1">ขั้นที่ {i+1}</span><p>{t}</p></div>
          ))}
        </div>
      </div>
    </div>
  )
}
