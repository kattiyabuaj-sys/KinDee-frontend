import {GOALS,KITCHEN,RESTRICT} from '../data/mockTags'
import {dailyTarget,filterMeals,tdee} from '../utils/nutrition'

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

export default function Prefs({p,setP,meals,u,mealCount,setMealCount,back,next}){
  const tog=k=>id=>setP({...p,[k]:p[k].includes(id)?p[k].filter(x=>x!==id):[...p[k],id]})
  const {list,lvl}=filterMeals(meals,p)

  const baseTdee=tdee(u)
  const target=dailyTarget(u,p.goals)
  const hasLose=p.goals.includes('lose')
  const hasGain=p.goals.includes('gain')
  const perMeal=Math.round(target/mealCount/10)*10

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

        {/* Meal Count Picker */}
        <div className="card p-4 mt-4">
          <div className="flex justify-between text-sm mb-2">
            <b>จำนวนมื้อต่อวัน</b>
            <span className="opacity-70">กำหนดแคลต่อมื้อ</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[2,3,4,5].map(n=>(
              <button
                key={n}
                onClick={()=>setMealCount(n)}
                className={`py-2.5 rounded-xl border font-num font-bold text-sm ${mealCount===n?'bg-red text-white border-red':'bg-card border-tan'}`}
              >
                {n} มื้อ
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 bg-card border-t border-tan/50 space-y-3">
        {/* Calorie summary — now shown AFTER goals are selected */}
        <div className="flex gap-2 flex-wrap justify-center">
          <span className="chip">🔥 TDEE: <span className="font-num ml-1">{baseTdee.toLocaleString()}</span> kcal</span>
          {(hasLose||hasGain)&&(
            <span className={`chip ${hasLose?'!text-red !border-red/40 !bg-red/10':'!text-green !border-green/40 !bg-green/10'}`}>
              {hasLose?`🎯 ลดน้ำหนัก: ${target.toLocaleString()} kcal (−20%)`:`💪 เพิ่มน้ำหนัก: ${target.toLocaleString()} kcal (+15%)`}
            </span>
          )}
          {!hasLose&&!hasGain&&<span className="chip">🎯 เป้าหมาย: <span className="font-num ml-1">{target.toLocaleString()}</span> kcal</span>}
          <span className="chip">🍽️ ต่อมื้อ: <span className="font-num ml-1">{perMeal}</span> kcal ({mealCount} มื้อ)</span>
        </div>
        <div className="text-center"><span className="chip">🍴 พบเมนูสุขภาพที่ตรงเงื่อนไข&nbsp;<span className="font-num">{lvl?0:list.length}</span>&nbsp;เมนู{lvl>0&&` (แสดง ${list.length} เมนูใกล้เคียง)`}</span></div>
        <button className="cta" onClick={next}>🎲 ไปที่วงล้อสุ่มเมนู</button>
      </div>
    </>
  )
}
