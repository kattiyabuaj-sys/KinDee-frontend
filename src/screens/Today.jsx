import {useState} from 'react'
import MealBuilder from '../components/MealBuilder'

const fmtTime=iso=>{
  try{
    return new Date(iso).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})
  }catch{return ''}
}

export default function Today({logs,consumed,dailyKcal,onLogMeal,onRemove,onClear,onSpinNext}){
  const [showBuilder,setShowBuilder]=useState(false)
  const rem=dailyKcal-consumed.cal
  const pct=Math.min(100,Math.round((consumed.cal/Math.max(1,dailyKcal))*100))
  const over=rem<0

  const handleBuilderSave=entry=>{
    onLogMeal(entry)
    setShowBuilder(false)
  }

  return(
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">ข้อมูลของวันนี้</h1>
        <span className="chip">{logs.length} มื้อที่บันทึก</span>
      </div>

      {/* Daily Calorie Progress Card */}
      <div className="card p-4 space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs opacity-70">พลังงานที่ทานไปแล้ววันนี้</div>
            <div className="font-num text-2xl font-bold">
              {consumed.cal.toLocaleString()}
              <span className="text-sm font-normal opacity-70"> / {dailyKcal.toLocaleString()} kcal</span>
            </div>
          </div>
          <div className={`text-right font-num text-sm font-bold ${over?'text-red':'text-green'}`}>
            {over?`เกินเป้า ${Math.abs(rem).toLocaleString()} kcal`:`เหลืออีก ${rem.toLocaleString()} kcal`}
          </div>
        </div>
        <div className="h-3 rounded-full bg-[#EFE9DD] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${over?'bg-red':'bg-green'}`}
            style={{width:`${pct}%`}}
          />
        </div>
      </div>

      {/* Key Daily Macros, Sodium & Sugar */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="card p-3">
          <div className="text-xs opacity-70">โปรตีน</div>
          <div className="font-num text-xl font-bold text-green">{consumed.p} g</div>
        </div>
        <div className="card p-3">
          <div className="text-xs opacity-70">คาร์โบไฮเดรต</div>
          <div className="font-num text-xl font-bold">{consumed.c} g</div>
        </div>
        <div className="card p-3">
          <div className="text-xs opacity-70">ไขมัน • น้ำตาล</div>
          <div className="font-num text-lg font-bold">{consumed.f} g <span className="text-xs font-normal opacity-75">• {consumed.s} g</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs opacity-70">โซเดียม (แนะนำ ≤ 2,000)</div>
          <div className={`font-num text-xl font-bold ${consumed.na>2000?'text-red':''}`}>{consumed.na.toLocaleString()} mg</div>
        </div>
      </div>

      {/* Thai Meal Component Builder (Outside / Self-Made Meals) */}
      {!showBuilder?(
        <button
          onClick={()=>setShowBuilder(true)}
          className="card w-full p-3.5 text-left border-2 border-dashed border-tan hover:border-red transition flex items-center justify-between gap-3"
        >
          <div>
            <div className="font-bold text-sm">🧩 กินนอกแอป / ทำทานเอง? ประกอบจานอาหาร</div>
            <div className="text-xs opacity-75">แตะเลือก ข้าว + โปรตีน + วิธีปรุง คำนวณสารอาหารอัตโนมัติ</div>
          </div>
          <span className="shrink-0 rounded-full bg-red text-white text-xs font-bold px-3 py-1.5">+ บันทึก</span>
        </button>
      ):(
        <MealBuilder onSave={handleBuilderSave} onCancel={()=>setShowBuilder(false)}/>
      )}

      {/* Logged Meals List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">มื้ออาหารที่บันทึกไว้</h2>
          {logs.length>0&&(
            <button onClick={onClear} className="text-xs text-red underline">ล้างรายการวันนี้</button>
          )}
        </div>

        {!logs.length&&(
          <div className="card p-4 text-center text-sm opacity-75">
            ยังไม่มีมื้อที่บันทึกวันนี้ หมุนสุ่มเมนูหรือกด <b>“ประกอบจานอาหาร”</b> ด้านบนได้เลย
          </div>
        )}

        <div className="space-y-2">
          {[...logs].reverse().map(e=>{
            const swapCount=Object.values(e.swaps||{}).filter(Boolean).length
            const isCustom=e.mealId==='custom_builder'
            return(
              <div key={e.id} className="card p-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {isCustom&&<span className="mr-1">🧩</span>}{e.nameTh}
                  </div>
                  <div className="text-xs opacity-75 font-num flex flex-wrap gap-x-2">
                    <span>{fmtTime(e.loggedAt)}</span>
                    <span>• {e.nutrition?.cal||0} kcal</span>
                    <span>• โปรตีน {e.nutrition?.p||0}g</span>
                    <span>• โซเดียม {e.nutrition?.na||0}mg</span>
                    {swapCount>0&&<span className="text-green">• สลับวัตถุดิบ {swapCount} อย่าง</span>}
                  </div>
                </div>
                <button
                  onClick={()=>onRemove(e.id)}
                  className="shrink-0 rounded-full border border-tan px-3 py-1 text-xs font-semibold text-red hover:bg-red/10"
                >
                  ลบ
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <button className="cta" onClick={onSpinNext}>🎲 สุ่มมื้อถัดไป</button>
    </div>
  )
}
