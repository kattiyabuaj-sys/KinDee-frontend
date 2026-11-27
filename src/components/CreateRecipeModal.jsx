import {useMemo,useState} from 'react'
import {INGREDIENTS,ING_MAP} from '../data/mockIngredients'
import {totals} from '../utils/nutrition'
import DishImage from './DishImage'

const STYLES=[
  ['stir-fry','🍳 ผัดคลีน'],
  ['soup','🍲 ต้ม/ซุป'],
  ['salad','🥗 ยำ/สลัด'],
  ['steamed','♨️ นึ่ง/ตุ๋น'],
  ['grill','🔥 ย่าง/อบ'],
  ['rice-bowl','🍚 จานข้าว'],
  ['noodle','🍜 ก๋วยเตี๋ยว'],
  ['curry','🍛 แกงไทย'],
  ['breakfast','🥣 มื้อเช้า']
]

const EQUIP=[
  ['stove','🔥 เตาแก๊ส'],
  ['microwave','📻 ไมโครเวฟ'],
  ['air_fryer','🌀 หม้อทอดไร้น้ำมัน'],
  ['no_cook','🥗 ไม่ใช้ความร้อน']
]

const SPICE=[
  [0,'ไม่เผ็ด'],
  [1,'เผ็ดน้อย'],
  [2,'เผ็ดกลาง'],
  [3,'เผ็ดมาก']
]

const CATS=[
  ['all','ทั้งหมด'],
  ['protein','โปรตีน'],
  ['carb','คาร์บ'],
  ['veggie','ผัก'],
  ['seasoning','เครื่องปรุง'],
  ['fat','ไขมันดี']
]

const unitInfo=ing=>{
  const u=ing.standardUnits.find(x=>x.unit===ing.defaultUnit)||ing.standardUnits[0]
  const step=u.unit==='กรัม'?10:u.unit==='ฟอง'||u.unit==='แผ่น'||u.unit==='ลูก'?1:0.5
  const init=u.unit==='กรัม'?(ing.category==='protein'?120:ing.category==='carb'?140:80):1
  return{unit:u.unit,gramsPerUnit:u.grams,step,init}
}

/**
 * Step-by-step Thai community recipe creator backed by MasterIngredients.
 * Prevents unverified manual macro entry by calculating live nutrition from ingredient weights.
 */
export default function CreateRecipeModal({profile,onPublish,onClose}){
  const [step,setStep]=useState(1)
  const [nameTh,setNameTh]=useState('')
  const [captionTh,setCaptionTh]=useState('')
  const [prepTimeMins,setPrepTimeMins]=useState(15)
  const [equipment,setEquipment]=useState(['stove'])
  const [spiceLevel,setSpiceLevel]=useState(0)
  const [dishStyle,setDishStyle]=useState('rice-bowl')
  const [imageUrl,setImageUrl]=useState('')

  const handlePhotoPick=e=>{
    const file=e.target.files?.[0]
    if(!file)return
    const reader=new FileReader()
    reader.onload=ev=>{
      const img=new Image()
      img.onload=()=>{
        const max=640
        const ratio=Math.min(1,max/Math.max(img.width,img.height))
        const w=Math.round(img.width*ratio)
        const h=Math.round(img.height*ratio)
        const canvas=document.createElement('canvas')
        canvas.width=w
        canvas.height=h
        canvas.getContext('2d').drawImage(img,0,0,w,h)
        setImageUrl(canvas.toDataURL('image/jpeg',0.8))
      }
      img.src=ev.target.result
    }
    reader.readAsDataURL(file)
    e.target.value=''
  }

  const [cat,setCat]=useState('all')
  const [query,setQuery]=useState('')
  const [lines,setLines]=useState([]) // [{ingredientId, amount, unit, gramsPerUnit, grams}]

  const [stepsTh,setStepsTh]=useState(['',''])
  const [autoAddPool,setAutoAddPool]=useState(true)
  const [submitting,setSubmitting]=useState(false)
  const [err,setErr]=useState('')

  const filteredIngredients=useMemo(()=>{
    const q=query.trim().toLowerCase()
    return INGREDIENTS.filter(i=>
      (cat==='all'||i.category===cat)&&
      (!q||i.nameTh.toLowerCase().includes(q))
    )
  },[cat,query])

  const liveNutrition=useMemo(()=>{
    if(!lines.length)return{cal:0,p:0,c:0,f:0,na:0,s:0,cost:0}
    return totals({ingredients:lines.map(l=>({ingredientId:l.ingredientId,grams:l.grams}))})
  },[lines])

  const toggleEquip=id=>{
    setEquipment(prev=>prev.includes(id)?(prev.length>1?prev.filter(x=>x!==id):prev):[...prev,id])
  }

  const addIngredient=ing=>{
    if(lines.some(l=>l.ingredientId===ing.id))return
    const info=unitInfo(ing)
    setLines(prev=>[
      ...prev,
      {
        ingredientId:ing.id,
        amount:info.init,
        unit:info.unit,
        gramsPerUnit:info.gramsPerUnit,
        step:info.step,
        grams:Math.round(info.init*info.gramsPerUnit)
      }
    ])
  }

  const adjustAmount=(id,delta)=>{
    setLines(prev=>prev.map(l=>{
      if(l.ingredientId!==id)return l
      const nextAmt=Math.max(l.step,Math.round((l.amount+delta)*10)/10)
      return{...l,amount:nextAmt,grams:Math.round(nextAmt*l.gramsPerUnit)}
    }))
  }

  const removeIngredient=id=>setLines(prev=>prev.filter(l=>l.ingredientId!==id))

  const updateStepText=(idx,val)=>setStepsTh(prev=>prev.map((s,i)=>i===idx?val:s))
  const addStepRow=()=>setStepsTh(prev=>[...prev,''])
  const removeStepRow=idx=>setStepsTh(prev=>prev.length>1?prev.filter((_,i)=>i!==idx):prev)

  const goNext=()=>{
    setErr('')
    if(step===1&&!nameTh.trim()){
      setErr('กรุณาตั้งชื่อเมนูของคุณก่อนครับ')
      return
    }
    if(step===2&&!lines.length){
      setErr('กรุณาเลือกวัตถุดิบอย่างน้อย 1 อย่างเพื่อคำนวณโภชนาการจริง')
      return
    }
    setStep(s=>Math.min(3,s+1))
  }

  const handleSubmit=async()=>{
    const cleanSteps=stepsTh.map(s=>s.trim()).filter(Boolean)
    if(!cleanSteps.length){
      setErr('กรุณาใส่วิธีทำอย่างน้อย 1 ขั้นตอน')
      return
    }
    setSubmitting(true)
    setErr('')
    try{
      // Auto-tag healthGoals from computed nutrition so community dishes filter accurately
      const healthGoals=['clean']
      if(liveNutrition.p>=22)healthGoals.push('protein')
      if(liveNutrition.p>=28)healthGoals.push('muscle')
      if(liveNutrition.na<=600)healthGoals.push('lowNa')
      if(liveNutrition.cal<=450)healthGoals.push('lose')
      if(liveNutrition.f<=12)healthGoals.push('lowFat')
      if(liveNutrition.s<=6)healthGoals.push('sugar')

      await onPublish({
        nameTh,
        captionTh,
        prepTimeMins,
        equipment,
        spiceLevel,
        dishStyle,
        imageUrl,
        healthGoals,
        ingredients:lines.map(l=>({ingredientId:l.ingredientId,grams:l.grams})),
        stepsTh:cleanSteps
      },autoAddPool)
      onClose()
    }catch{
      setErr('ไม่สามารถบันทึกสูตรได้ กรุณาลองใหม่อีกครั้ง')
      setSubmitting(false)
    }
  }

  return(
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="w-full max-w-[390px] h-[92dvh] sm:h-[810px] bg-rice rounded-t-3xl sm:rounded-3xl border border-tan flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-card border-b border-tan/60 px-4 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">✨ แชร์สูตรอาหารของฉัน</h2>
            <p className="text-[11px] opacity-70">
              โดย {profile?.avatar} {profile?.displayName} · ขั้นตอนที่ {step} / 3
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-rice border border-tan text-sm">✕</button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-card">
          <div className="h-full bg-red transition-all duration-300" style={{width:`${(step/3)*100}%`}}/>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {step===1&&(
            <>
              <div className="card p-3.5 space-y-3">
                <div>
                  <label className="block text-xs font-bold mb-1">ชื่อเมนู *</label>
                  <input
                    type="text"
                    value={nameTh}
                    onChange={e=>setNameTh(e.target.value)}
                    placeholder="เช่น อกไก่ย่างขมิ้นข้าวไรซ์เบอร์รี่"
                    className="w-full rounded-xl border border-tan bg-rice px-3 py-2 text-sm font-semibold focus:outline-none focus:border-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">คำแนะนำ / เคล็ดลับสั้นๆ</label>
                  <textarea
                    rows={2}
                    value={captionTh}
                    onChange={e=>setCaptionTh(e.target.value)}
                    placeholder="แชร์เคล็ดลับความอร่อย หรือเหมาะกับมื้อไหน..."
                    className="w-full rounded-xl border border-tan bg-rice px-3 py-2 text-xs focus:outline-none focus:border-red"
                  />
                </div>
              </div>

              <div className="card p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">เวลาเตรียมและทำอาหาร</span>
                  <span className="font-num text-sm font-bold text-red">{prepTimeMins} นาที</span>
                </div>
                <input type="range" min={5} max={45} step={5} value={prepTimeMins} onChange={e=>setPrepTimeMins(+e.target.value)}/>

                <div>
                  <span className="block text-xs font-bold mb-1.5">อุปกรณ์ที่ใช้</span>
                  <div className="flex flex-wrap gap-1.5">
                    {EQUIP.map(([id,lbl])=>(
                      <button
                        key={id}
                        type="button"
                        onClick={()=>toggleEquip(id)}
                        className={`pill text-xs py-1 px-2.5 ${equipment.includes(id)?'on':''}`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold mb-1.5">ระดับความเผ็ด</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {SPICE.map(([lv,lbl])=>(
                      <button
                        key={lv}
                        type="button"
                        onClick={()=>setSpiceLevel(lv)}
                        className={`py-1.5 rounded-xl border text-xs font-semibold ${spiceLevel===lv?'bg-red text-white border-red':'bg-rice border-tan'}`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card p-3.5 space-y-2.5">
                <span className="block text-xs font-bold">รูปภาพและสไตล์จานอาหาร</span>
                <DishImage meal={{dishStyle,imageUrl,nameTh:nameTh||'ตัวอย่างเมนู'}} className="h-28 w-full rounded-xl border border-tan/60"/>
                <div className="flex flex-wrap gap-1.5">
                  {STYLES.map(([id,lbl])=>(
                    <button
                      key={id}
                      type="button"
                      onClick={()=>setDishStyle(id)}
                      className={`pill text-xs py-1 px-2.5 ${dishStyle===id?'on':''}`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <label className="flex-1 cursor-pointer rounded-xl border border-dashed border-tan bg-rice px-3 py-2 text-center text-xs font-bold text-brown hover:border-red transition">
                    📷 {imageUrl?'เปลี่ยนรูปอาหารจากเครื่อง':'เลือกรูปอาหารจากเครื่อง'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoPick}
                      className="hidden"
                    />
                  </label>
                  {imageUrl&&(
                    <button
                      type="button"
                      onClick={()=>setImageUrl('')}
                      className="rounded-xl border border-tan bg-rice px-3 py-2 text-xs font-bold text-red"
                    >
                      ลบรูป
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {step===2&&(
            <>
              {/* Live Nutrition Preview */}
              <div className="card p-3 bg-[#F3EEE4] border-green/60 sticky top-0 z-10">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-green">📊 โภชนาการคำนวณจากวัตถุดิบจริง</span>
                  <span className="font-num text-red">{liveNutrition.cal} kcal</span>
                </div>
                <div className="flex flex-wrap gap-1.5 font-num text-[11px] font-bold">
                  <span className="chip">โปรตีน {liveNutrition.p}g</span>
                  <span className="chip">คาร์บ {liveNutrition.c}g</span>
                  <span className="chip">ไขมัน {liveNutrition.f}g</span>
                  <span className="chip">โซเดียม {liveNutrition.na}mg</span>
                  <span className="chip">น้ำตาล {liveNutrition.s}g</span>
                </div>
              </div>

              {/* Selected Ingredients List */}
              {lines.length>0&&(
                <div className="card p-3 divide-y divide-tan/40">
                  <div className="text-xs font-bold pb-1.5">วัตถุดิบที่เลือก ({lines.length} รายการ)</div>
                  {lines.map(l=>{
                    const ing=ING_MAP[l.ingredientId]
                    return(
                      <div key={l.ingredientId} className="py-2 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{ing.nameTh}</div>
                          <div className="font-num text-[11px] opacity-65">{l.grams} กรัม</div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button type="button" onClick={()=>adjustAmount(l.ingredientId,-l.step)} className="w-7 h-7 rounded-full border border-tan bg-rice text-sm font-bold">−</button>
                          <span className="font-num text-xs font-bold min-w-[54px] text-center">{l.amount} {l.unit}</span>
                          <button type="button" onClick={()=>adjustAmount(l.ingredientId,l.step)} className="w-7 h-7 rounded-full border border-tan bg-rice text-sm font-bold">+</button>
                          <button type="button" onClick={()=>removeIngredient(l.ingredientId)} className="ml-1 text-xs text-red font-bold">ลบ</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Ingredient Picker */}
              <div className="card p-3 space-y-2.5">
                <input
                  type="text"
                  value={query}
                  onChange={e=>setQuery(e.target.value)}
                  placeholder="🔍 ค้นหาวัตถุดิบ เช่น อกไก่, ข้าวกล้อง, ไข่..."
                  className="w-full rounded-xl border border-tan bg-rice px-3 py-2 text-xs focus:outline-none focus:border-red"
                />
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {CATS.map(([id,lbl])=>(
                    <button
                      key={id}
                      type="button"
                      onClick={()=>setCat(id)}
                      className={`pill text-xs py-1 px-2.5 shrink-0 ${cat===id?'on':''}`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-tan/30">
                  {filteredIngredients.map(ing=>{
                    const added=lines.some(l=>l.ingredientId===ing.id)
                    return(
                      <button
                        key={ing.id}
                        type="button"
                        onClick={()=>addIngredient(ing)}
                        disabled={added}
                        className={`w-full py-2 px-1 flex items-center justify-between text-left text-xs ${added?'opacity-45':'hover:bg-rice/60'}`}
                      >
                        <div>
                          <span className="font-semibold">{ing.nameTh}</span>
                          <span className="font-num text-[11px] opacity-65 ml-1.5">
                            ({ing.nutritionPer100g.calories} kcal / 100g)
                          </span>
                        </div>
                        <span className={`font-bold ${added?'text-green':'text-red'}`}>
                          {added?'เลือกแล้ว ✓':'+ เพิ่ม'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {step===3&&(
            <>
              <div className="card p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">วิธีทำทีละขั้นตอน</span>
                  <button type="button" onClick={addStepRow} className="text-xs font-bold text-red">+ เพิ่มขั้นตอน</button>
                </div>
                <div className="space-y-2.5">
                  {stepsTh.map((txt,idx)=>(
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="chip text-[11px]">ขั้นที่ {idx+1}</span>
                        {stepsTh.length>1&&(
                          <button type="button" onClick={()=>removeStepRow(idx)} className="text-[11px] text-red font-semibold">ลบขั้นนี้</button>
                        )}
                      </div>
                      <textarea
                        rows={2}
                        value={txt}
                        onChange={e=>updateStepText(idx,e.target.value)}
                        placeholder={`อธิบายขั้นตอนที่ ${idx+1}...`}
                        className="w-full rounded-xl border border-tan bg-rice px-3 py-2 text-xs focus:outline-none focus:border-red"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <label className="card p-3.5 flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAddPool}
                  onChange={e=>setAutoAddPool(e.target.checked)}
                  className="w-4 h-4 accent-red"
                />
                <div className="text-xs">
                  <div className="font-bold">เพิ่มเข้าระบบสุ่มของฉันทันทีหลังแชร์</div>
                  <div className="opacity-70">เมนูนี้จะไปปรากฏในวงล้อ กาชา และเลือกไพ่ของคุณ</div>
                </div>
              </label>

              {/* Final Summary Preview */}
              <div className="card p-3 bg-[#F3EEE4] text-xs space-y-1">
                <div className="font-bold">สรุปก่อนโพสต์: {nameTh}</div>
                <div className="font-num opacity-80">
                  {liveNutrition.cal} kcal · โปรตีน {liveNutrition.p}g · โซเดียม {liveNutrition.na}mg · วัตถุดิบ {lines.length} อย่าง
                </div>
              </div>
            </>
          )}

          {err&&<p className="text-xs font-semibold text-red bg-red/10 border border-red/30 rounded-xl px-3 py-2">{err}</p>}
        </div>

        {/* Footer */}
        <div className="bg-card border-t border-tan/60 p-3.5 flex gap-2">
          {step>1&&(
            <button type="button" onClick={()=>{setErr('');setStep(s=>s-1)}} className="btn-o py-3 px-4 bg-rice">
              ← ย้อนกลับ
            </button>
          )}
          {step<3?(
            <button type="button" onClick={goNext} className="cta flex-1 py-3">
              ถัดไป →
            </button>
          ):(
            <button type="button" disabled={submitting} onClick={handleSubmit} className="cta flex-1 py-3 disabled:opacity-60">
              {submitting?'กำลังเผยแพร่…':'🚀 เผยแพร่สูตรสู่ชุมชน'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
