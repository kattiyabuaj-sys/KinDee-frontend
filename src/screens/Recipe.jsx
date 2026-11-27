import {useState} from 'react'
import {scaleMeal} from '../utils/nutrition'
import {rulesFor} from '../data/mockSubstitutions'
import {suggestSwap} from '../store/userStore'
import DishImage from '../components/DishImage'

export default function Recipe({m,kcal,goals,back,again,saved,save,us,onSwap,onLogMeal,onOpenToday}){
  const [sw,setSw]=useState({})
  const [open,setOpen]=useState(null)
  const [logged,setLogged]=useState(false)
  const {rows,tot,targetKcal}=scaleMeal(m,kcal,sw,goals)
  const diff=tot.cal-targetKcal
  const diffPct=targetKcal?Math.round(Math.abs(diff)/targetKcal*100):0

  const pick=(from,r)=>{
    const on=sw[from]!==r.id
    setSw(s=>({...s,[from]:on?r.id:undefined}))
    setLogged(false)
    if(on)onSwap(from,r.targetIngredientId)
  }

  const handleLog=()=>{
    onLogMeal({mealId:m.id,nameTh:m.nameTh,nutrition:tot,swaps:sw})
    setLogged(true)
  }

  return(
    <div className="flex-1 overflow-y-auto pb-6">
      <div className="relative h-48">
        <DishImage meal={m} className="h-full w-full"/>
        <div className="absolute inset-x-0 top-0 p-4 flex justify-between items-start">
          <button onClick={back} className="w-10 h-10 rounded-full bg-card/90 border border-tan shadow-sm">←</button>
          <div className="flex gap-2">
            <button onClick={save} className="w-10 h-10 rounded-full bg-card/90 border border-tan shadow-sm">{saved?'★':'☆'}</button>
            <button onClick={again} className="bg-red text-white rounded-full px-4 h-10 font-semibold shadow-sm">🎲 สุ่มใหม่</button>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-10">
        <div className="card p-4">
          <div className="flex justify-between text-xs gap-2"><span className="chip truncate">{m.isCommunity&&m.author?`${m.author.avatar} สูตรโดย ${m.author.name}`:'🌿 แนะนำตามเป้าหมายของคุณ'}</span><span className="shrink-0">⏱ ใช้เวลา {m.prepTimeMins} นาที</span></div>
          <h1 className="text-2xl font-bold my-2">{m.nameTh}</h1>
          {/* Target banner — always visible so user knows what kcal the portions are scaled to */}
          <div className="flex items-center gap-2 mb-2 px-1 py-1.5 rounded-xl bg-[#F3EEE4] border border-tan text-xs font-semibold">
            <span className="text-red">🎯</span>
            <span>ปรับสัดส่วนให้ได้ <span className="font-num font-bold">{targetKcal}</span> kcal/มื้อ</span>
            {diffPct<=5
              ? <span className="ml-auto text-green">✓ ใกล้เคียงเป้ามาก</span>
              : <span className="ml-auto text-brown opacity-70">ค่าจริง {tot.cal} kcal ({diff>0?'+':''}{diff})</span>
            }
          </div>
          <div className="flex flex-wrap gap-2 font-num text-sm font-bold">
            <span className="chip !text-red !border-tan">{tot.cal} kcal
              {diffPct>5&&<span className="font-normal text-[11px] opacity-70 ml-1">({diff>0?'+':''}{diff} จากเป้า {targetKcal})</span>}
            </span>
            <span className="chip">โปรตีน {tot.p}g</span>
            <span className="chip">คาร์บ {tot.c}g</span>
            <span className="chip">ไขมัน {tot.f}g</span>
            <span className="chip">น้ำตาล {tot.s}g</span>
            <span className="chip">{tot.na<=600?'โซเดียมต่ำ ':'โซเดียม '}{tot.na}mg</span>
            <span className="chip !text-brown !border-tan">฿{tot.cost}</span>
          </div>
          <p className="text-[11px] opacity-65 mt-2.5 leading-snug">
            คำนวณจากน้ำหนักวัตถุดิบจริงต่อ 100 กรัม (รวมโซเดียมจากเครื่องปรุงและน้ำตาลแฝงตามมาตรฐานกองโภชนาการ)
          </p>
        </div>

        {/* Log Meal CTA & Confirmation */}
        <div className="mt-4">
          {!logged?(
            <button className="cta" onClick={handleLog}>
              ✓ บันทึกมื้อนี้ ({tot.cal} kcal)
            </button>
          ):(
            <div className="card p-3.5 border-green bg-green/10 space-y-2.5">
              <div className="font-bold text-green text-sm">✓ บันทึก “{m.nameTh}” ({tot.cal} kcal) ลงข้อมูลของวันนี้แล้ว!</div>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn-o py-2 bg-card" onClick={again}>🎲 สุ่มมื้อถัดไป</button>
                <button className="rounded-full bg-green text-white text-sm font-semibold py-2" onClick={onOpenToday}>📊 ดูข้อมูลของวันนี้</button>
              </div>
            </div>
          )}
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
