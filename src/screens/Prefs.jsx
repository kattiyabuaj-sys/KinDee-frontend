import {GOALS,KITCHEN,RESTRICT} from '../data/mockTags'
import {filterMeals} from '../utils/nutrition'

const NOTE=[
  null,
  'ไม่มีเมนูตรงกับอุปกรณ์/เวลาที่เลือกครบทุกข้อ จึงแสดงเมนูที่ตรงกับเป้าหมายแทน',
  'ไม่มีเมนูตรงกับเป้าหมายที่เลือก จึงแสดงเมนูที่ปลอดภัยตามข้อจำกัดอาหารของคุณแทน',
  'ตัวกรองเข้มเกินไป จึงแสดงเมนูสุขภาพทั่วไปให้ก่อน ลองปลดบางข้อดูนะ'
]

const Group=({title,hint,items,sel,tog})=>(
  <section className="mb-5">
    <div className="flex justify-between items-baseline mb-2">
      <h2 className="font-bold text-lg">{title}</h2>{hint&&<span className="text-xs opacity-70">{hint}</span>}
    </div>
    <div className="flex flex-wrap gap-2">
      {items.map(([id,t])=>(
        <button key={id} onClick={()=>tog(id)} className={`pill ${sel.includes(id)?'on':''}`}>{t}{sel.includes(id)&&' ✓'}</button>
      ))}
    </div>
  </section>
)

export default function Prefs({p,setP,meals,back,next}){
  const tog=k=>id=>setP({...p,[k]:p[k].includes(id)?p[k].filter(x=>x!==id):[...p[k],id]})
  const {list,lvl}=filterMeals(meals,p)
  return(
    <>
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="flex items-center justify-between pt-3">
          <button onClick={back} className="w-9 h-9 rounded-full border border-tan bg-card">←</button>
          <span className="chip">ขั้นตอนที่ 2 จาก 2</span>
        </div>
        <div className="h-2 rounded bg-red mt-3"/>
        <h1 className="text-3xl font-bold mt-4">เป้าหมายและความชอบของคุณ</h1>
        <p className="text-sm opacity-70 mb-4">แตะเลือกได้หลายข้อ</p>
        <Group title="เป้าหมายสุขภาพ" hint="เลือกเป้าหมายหลัก" items={GOALS} sel={p.goals} tog={tog('goals')}/>
        <Group title="เวลาและอุปกรณ์ครัว" items={KITCHEN} sel={p.kit} tog={tog('kit')}/>
        <Group title="ข้อจำกัดอาหาร" items={RESTRICT} sel={p.ex} tog={tog('ex')}/>
        {lvl>0&&<p className="card p-3 text-sm bg-[#F3EEE4]">{NOTE[lvl]}</p>}
      </div>
      <div className="p-4 bg-card border-t border-tan/50 space-y-3">
        <div className="text-center"><span className="chip">🍴 พบเมนูสุขภาพที่ตรงเงื่อนไข&nbsp;<span className="font-num">{lvl?0:list.length}</span>&nbsp;เมนู{lvl>0&&` (แสดง ${list.length} เมนูใกล้เคียง)`}</span></div>
        <button className="cta" onClick={next}>🎲 ไปที่วงล้อสุ่มเมนู</button>
      </div>
    </>
  )
}
