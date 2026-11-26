import {useMemo,useState} from 'react'
import {
  BUILDER_PRESETS,CARB_OPTIONS,EXTRA_OPTIONS,
  PORTION_SCALES,PROTEIN_OPTIONS,STYLE_OPTIONS,buildMealNutrition
} from '../utils/mealBuilder'

export default function MealBuilder({onSave,onCancel}){
  const [sel,setSel]=useState({
    carb:'rice_15',
    protein:'chicken',
    scale:1,
    style:'stir_fried',
    extras:['veg_fresh']
  })
  const [customName,setCustomName]=useState('')

  const {nutrition,autoName}=useMemo(()=>buildMealNutrition(sel),[sel])

  const toggleExtra=id=>setSel(s=>({
    ...s,
    extras:s.extras.includes(id)?s.extras.filter(x=>x!==id):[...s.extras,id]
  }))

  const applyPreset=preset=>{
    setSel(preset.state)
    setCustomName(preset.label)
  }

  const handleSave=()=>{
    const nameTh=customName.trim()||autoName
    onSave({
      mealId:'custom_builder',
      nameTh,
      nutrition,
      swaps:{}
    })
  }

  return(
    <div className="card p-4 space-y-4 border-2 border-tan bg-card">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">🧩 ประกอบจานอาหารเอง</h2>
          <p className="text-xs opacity-75">แตะเลือกส่วนประกอบ ไม่ต้องเดาตัวเลขเอง</p>
        </div>
        {onCancel&&(
          <button onClick={onCancel} className="text-xs font-semibold px-3 py-1 rounded-full border border-tan">
            ปิด
          </button>
        )}
      </div>

      {/* 1-tap Common Thai Presets */}
      <div>
        <div className="text-xs font-semibold opacity-75 mb-1.5">จานด่วนยอดนิยม (แตะเพื่อปรับต่อได้)</div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {BUILDER_PRESETS.map(p=>(
            <button
              key={p.id}
              onClick={()=>applyPreset(p)}
              className="shrink-0 rounded-full border border-tan bg-rice/60 px-3 py-1 text-xs font-semibold hover:border-red"
            >
              ⚡ {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Base Carb */}
      <div>
        <div className="text-sm font-bold mb-1.5">1. ฐานแป้ง / เส้น</div>
        <div className="flex flex-wrap gap-1.5">
          {CARB_OPTIONS.map(o=>(
            <button
              key={o.id}
              onClick={()=>setSel(s=>({...s,carb:o.id}))}
              className={`pill text-xs ${sel.carb===o.id?'on':''}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Protein + Scale */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-bold">2. โปรตีนหลัก</span>
          <div className="flex gap-1">
            {PORTION_SCALES.map(sc=>(
              <button
                key={sc.id}
                onClick={()=>setSel(s=>({...s,scale:sc.id}))}
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold border ${sel.scale===sc.id?'bg-brown text-white border-brown':'border-tan bg-rice/50'}`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PROTEIN_OPTIONS.map(o=>(
            <button
              key={o.id}
              onClick={()=>setSel(s=>({...s,protein:o.id}))}
              className={`pill text-xs ${sel.protein===o.id?'on':''}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Cooking Style */}
      <div>
        <div className="text-sm font-bold mb-1.5">3. วิธีปรุงและน้ำซุป / ซอส</div>
        <div className="grid grid-cols-2 gap-1.5">
          {STYLE_OPTIONS.map(o=>(
            <button
              key={o.id}
              onClick={()=>setSel(s=>({...s,style:o.id}))}
              className={`rounded-xl border px-2.5 py-2 text-xs font-semibold text-left transition ${sel.style===o.id?'bg-red text-white border-red':'bg-rice/40 border-tan'}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Veggies & Extras */}
      <div>
        <div className="text-sm font-bold mb-1.5">4. ผักและเครื่องเคียง (เลือกได้หลายข้อ)</div>
        <div className="flex flex-wrap gap-1.5">
          {EXTRA_OPTIONS.map(o=>(
            <button
              key={o.id}
              onClick={()=>toggleExtra(o.id)}
              className={`pill text-xs ${sel.extras.includes(o.id)?'on':''}`}
            >
              {o.label}{sel.extras.includes(o.id)&&' ✓'}
            </button>
          ))}
        </div>
      </div>

      {/* Live Nutrition Summary */}
      <div className="rounded-xl bg-[#F3EEE4] border border-tan/80 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold">ผลลัพธ์โดยประมาณ</span>
          <span className="font-num text-base font-bold text-red">{nutrition.cal} kcal</span>
        </div>
        <div className="flex flex-wrap gap-1.5 font-num text-xs font-semibold">
          <span className="chip">โปรตีน {nutrition.p}g</span>
          <span className="chip">คาร์บ {nutrition.c}g</span>
          <span className="chip">ไขมัน {nutrition.f}g</span>
          <span className="chip">โซเดียม {nutrition.na}mg</span>
          <span className="chip">น้ำตาล {nutrition.s}g</span>
        </div>
      </div>

      {/* Meal Name & Log Button */}
      <div className="space-y-2">
        <input
          type="text"
          value={customName}
          onChange={e=>setCustomName(e.target.value)}
          placeholder={autoName}
          className="w-full rounded-xl border border-tan bg-white/80 px-3 py-2 text-sm text-brown placeholder:text-brown/50 focus:outline-none focus:border-red"
        />
        <button className="cta" onClick={handleSave}>
          ✓ บันทึกมื้อนี้ ({nutrition.cal} kcal)
        </button>
      </div>
    </div>
  )
}
