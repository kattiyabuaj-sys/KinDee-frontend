import {useMemo,useState} from 'react'
import {GOALS} from '../data/mockTags'
import {pickWinner} from '../store/userStore'
import {fitBudget,scaleMeal} from '../utils/nutrition'
import DishImage from '../components/DishImage'

// Calm, harmonious Warm Rice / Warm Cream / Miso Tan palette; Spicy Red reserved for pointer, CTA & winning slice.
const CALM_SLICE=[
  ['#FAF8F5','#673A25'],
  ['#EFE8DA','#673A25'],
  ['#E8E2D6','#673A25'],
  ['#E5CBB0','#673A25']
]
const pt=(a,r)=>[150+r*Math.sin(a*Math.PI/180),150-r*Math.cos(a*Math.PI/180)]
const MODES=[['wheel','🎡 วงล้อ'],['slot','🎰 กาชา'],['cards','🃏 เลือกไพ่']]

const shuffle=arr=>[...arr].sort(()=>Math.random()-.5)

export default function Wheel({pool,p,kcal,dailyKcal,consumedCal,remainingKcal,open,onOpenToday,user,onSpin}){
  const budget=useMemo(
    ()=>fitBudget(pool,kcal,remainingKcal,50,p.goals),
    [pool,kcal,remainingKcal,p.goals]
  )
  const fullPool=budget.list

  const [mode,setMode]=useState('wheel')
  const [seed,setSeed]=useState(0)

  // Wheel state (samples 8 from fullPool; reshuffle cycles through all matching dishes)
  const segs=useMemo(()=>{
    const a=shuffle(fullPool).slice(0,8)
    return Array.from({length:8},(_,i)=>a[i%a.length])
  },[fullPool.map(x=>x.id).join(),seed])
  const [rot,setRot]=useState(0)
  const [win,setWin]=useState(0)
  const [busy,setBusy]=useState(false)

  // Slot / Gacha state (uses the full filtered pool)
  const [slotReel,setSlotReel]=useState([])
  const [slotOffset,setSlotOffset]=useState(0)
  const [slotAnimate,setSlotAnimate]=useState(false)
  const [slotBusy,setSlotBusy]=useState(false)
  const [slotWinner,setSlotWinner]=useState(null)

  // Mystery Card state (deals 6 cards from the full filtered pool)
  const [deckSeed,setDeckSeed]=useState(0)
  const dealtCards=useMemo(()=>{
    const picked=shuffle(fullPool).slice(0,6)
    return Array.from({length:Math.min(6,Math.max(3,fullPool.length))},(_,i)=>picked[i%picked.length])
  },[fullPool.map(x=>x.id).join(),deckSeed])
  const [flippedIdx,setFlippedIdx]=useState(null)

  const spinWheel=()=>{
    if(busy||!segs.length)return
    const pk=pickWinner(user,[...new Map(segs.map(x=>[x.id,x])).values()])
    const ids=segs.flatMap((x,i)=>x.id===pk.id?[i]:[])
    const w=ids[Math.floor(Math.random()*ids.length)]
    onSpin(pk)
    setBusy(true)
    setWin(w)
    setRot(r=>r-r%360+360*6+360-(w*45+22.5))
    setTimeout(()=>setBusy(false),4200)
  }

  const spinSlot=()=>{
    if(slotBusy||!fullPool.length)return
    const pk=pickWinner(user,fullPool)
    // Build a 24-card strip from the full pool ending on index 20 so the reel decelerates smoothly.
    const filler=Array.from({length:24},()=>fullPool[Math.floor(Math.random()*fullPool.length)])
    const winIdx=20
    filler[winIdx]=pk
    setSlotReel(filler)
    setSlotAnimate(false)
    setSlotOffset(0)
    setSlotWinner(null)
    setSlotBusy(true)
    onSpin(pk)

    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        setSlotAnimate(true)
        // Each card is 148px wide + 10px gap = 158px; center inside 330px container -> offset = winIdx*158 - 91
        setSlotOffset(winIdx*158-91)
      })
    })

    setTimeout(()=>{
      setSlotBusy(false)
      setSlotWinner(pk)
    },3400)
  }

  const pickCard=idx=>{
    if(flippedIdx!==null)return
    const chosen=dealtCards[idx]
    if(!chosen)return
    setFlippedIdx(idx)
    onSpin(chosen)
  }

  const redealCards=()=>{
    setFlippedIdx(null)
    setDeckSeed(s=>s+1)
  }

  const reshuffleWheel=()=>{
    if(busy)return
    setRot(0)
    setWin(0)
    setSeed(s=>s+1)
  }

  const names=p.goals.map(g=>GOALS.find(x=>x[0]===g)?.[1]).filter(Boolean)
  const pct=Math.min(100,Math.round((consumedCal/Math.max(1,dailyKcal))*100))
  const over=remainingKcal<=0

  const activeDish=
    mode==='wheel'?(rot>0&&!busy?segs[win]:null)
      :mode==='slot'?slotWinner
        :(flippedIdx!==null?dealtCards[flippedIdx]:null)

  const activeNutr=activeDish?scaleMeal(activeDish,budget.mealTarget,{},p.goals).tot:null

  return(
    <div className="flex-1 overflow-y-auto px-5 pb-4">
      {/* Compact Daily Calorie Tracker Bar */}
      <button
        onClick={onOpenToday}
        className="card w-full text-left p-3 mt-3 space-y-1.5 active:scale-[.99] transition"
      >
        <div className="flex items-center justify-between text-xs font-semibold">
          <span>🔥 วันนี้ทานแล้ว <span className="font-num">{consumedCal.toLocaleString()}</span> / <span className="font-num">{dailyKcal.toLocaleString()}</span> kcal</span>
          <span className={`font-num ${over?'text-red':'text-green'}`}>
            {over?`เกิน ${Math.abs(remainingKcal)} kcal`:`เหลือ ${remainingKcal} kcal`} ›
          </span>
        </div>
        <div className="h-2 rounded-full bg-[#EFE9DD] overflow-hidden">
          <div className={`h-full rounded-full transition-all ${over?'bg-red':'bg-green'}`} style={{width:`${pct}%`}}/>
        </div>
      </button>

      {/* Filter & Pool Count Strip */}
      <div className="flex gap-1.5 overflow-x-auto py-2.5">
        <span className="chip !border-tan !text-brown bg-card">สุ่มจาก <span className="font-num mx-1">{fullPool.length}</span> เมนูที่ตรงใจ</span>
        <span className="chip"><span className="font-num mr-1">{budget.mealTarget}</span>kcal/มื้อนี้</span>
        {names.slice(0,2).map(n=><span key={n} className="chip">{n}</span>)}
      </div>

      {budget.isTight&&(
        <p className="rounded-xl border border-tan bg-[#F3EEE4] px-3 py-2 text-xs mb-2">
          {budget.isOverBudget
            ?'แคลอรีวันนี้ครบตามเป้าแล้ว จึงคัดเมนูเบาๆ ให้แทน หรือดูสรุปได้ที่ “ข้อมูลวันนี้”'
            :`โควตาแคลอรีวันนี้เหลือ ${remainingKcal} kcal จึงปรับสัดส่วนและคัดเมนูที่พอดีงบให้`}
        </p>
      )}

      {/* 3 Discovery Mode Switcher */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-card border border-tan mb-3">
        {MODES.map(([id,label])=>(
          <button
            key={id}
            onClick={()=>setMode(id)}
            className={`py-2 rounded-xl text-xs font-bold transition ${mode===id?'bg-red text-white shadow-sm':'text-brown opacity-80'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* MODE 1: SPINNER WHEEL */}
      {mode==='wheel'&&(
        <>
          <div className="relative mx-auto w-[280px] h-[280px]">
            <div className="absolute left-1/2 -top-1 -translate-x-1/2 z-10 text-red text-2xl leading-none drop-shadow-sm">▼</div>
            <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow" style={{transform:`rotate(${rot}deg)`,transition:'transform 4s cubic-bezier(.12,.7,.1,1)'}}>
              <circle cx="150" cy="150" r="148" fill="#FAF8F5" stroke="#D3A275" strokeWidth="2.5"/>
              {segs.map((s,i)=>{
                const [a,b]=[pt(i*45,138),pt(i*45+45,138)]
                const isWinner=rot>0&&!busy&&i===win
                const [bg,fg]=isWinner?['#A93118','#FFFFFF']:CALM_SLICE[i%4]
                return(
                  <g key={i}>
                    <path d={`M150 150L${a[0]} ${a[1]}A138 138 0 0 1 ${b[0]} ${b[1]}Z`} fill={bg} stroke="#D3A275" strokeWidth="1"/>
                    <text x="150" y="56" fill={fg} fontSize="10" fontWeight="700" textAnchor="middle" transform={`rotate(${i*45+22.5} 150 150)`}>
                      {s.nameTh.length>11?s.nameTh.slice(0,10)+'…':s.nameTh}
                    </text>
                  </g>
                )
              })}
              <circle cx="150" cy="150" r="24" fill="#FAF8F5" stroke="#D3A275" strokeWidth="2"/>
              <text x="150" y="157" textAnchor="middle" fontSize="20">🍴</text>
            </svg>
          </div>
          <div className="mt-3 space-y-2">
            <button className="cta disabled:opacity-60" disabled={busy} onClick={spinWheel}>
              🎲 {rot?'หมุนวงล้ออีกครั้ง':'หมุนวงล้อสุ่มเมนู'}
            </button>
            {fullPool.length>8&&(
              <button onClick={reshuffleWheel} disabled={busy} className="w-full py-2 text-xs font-semibold text-brown underline disabled:opacity-50">
                🔄 เปลี่ยนชุดเมนูบนวงล้อ (จากทั้งหมด {fullPool.length} เมนู)
              </button>
            )}
          </div>
        </>
      )}

      {/* MODE 2: GACHA / SLOT REEL */}
      {mode==='slot'&&(
        <div className="space-y-3">
          <div className="card p-3 bg-[#F3EEE4] relative overflow-hidden">
            <div className="text-center text-xs font-semibold opacity-75 mb-2">
              สุ่มกาชาจากเมนูที่ตรงใจทั้งหมด <span className="font-num font-bold">{fullPool.length}</span> เมนู
            </div>
            <div className="relative h-[168px] overflow-hidden rounded-xl border border-tan bg-card">
              {/* Center Winning Pointer */}
              <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[154px] border-2 border-red rounded-xl pointer-events-none z-10"/>
              <div className="absolute left-1/2 -top-1 -translate-x-1/2 text-red text-base z-20 leading-none">▼</div>

              {!slotReel.length?(
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <span className="text-3xl mb-1">🎰</span>
                  <p className="text-sm font-semibold">กดปุ่มด้านล่างเพื่อหมุนกาชาสุ่มมื้ออร่อย</p>
                </div>
              ):(
                <div
                  className="flex items-center gap-[10px] h-full px-2"
                  style={{
                    transform:`translateX(-${slotOffset}px)`,
                    transition:slotAnimate?'transform 3.2s cubic-bezier(.1,.82,.18,1)':'none'
                  }}
                >
                  {slotReel.map((item,idx)=>{
                    const cal=scaleMeal(item,budget.mealTarget,{},p.goals).tot.cal
                    return(
                      <div key={idx} className="w-[148px] shrink-0 h-[146px] rounded-xl border border-tan bg-card overflow-hidden flex flex-col">
                        <DishImage meal={item} className="h-20 w-full" compact/>
                        <div className="p-2 flex-1 flex flex-col justify-between">
                          <div className="text-xs font-bold leading-tight line-clamp-2">{item.nameTh}</div>
                          <div className="font-num text-[11px] font-bold text-green">{cal} kcal</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
          <button className="cta disabled:opacity-60" disabled={slotBusy} onClick={spinSlot}>
            🎰 {slotBusy?'กำลังสุ่มกาชา…':slotWinner?'หมุนกาชาอีกครั้ง':'หมุนกาชาสุ่มเมนู'}
          </button>
        </div>
      )}

      {/* MODE 3: MYSTERY CARD PICK */}
      {mode==='cards'&&(
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="opacity-75">แตะเลือกไพ่ 1 ใบเพื่อเปิดดูเมนูของคุณ</span>
            <button onClick={redealCards} className="font-bold text-red underline">🃏 สับไพ่ชุดใหม่</button>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {dealtCards.map((cardMeal,idx)=>{
              const revealed=flippedIdx===idx
              const dim=flippedIdx!==null&&!revealed
              const cardCal=scaleMeal(cardMeal,budget.mealTarget,{},p.goals).tot.cal
              return(
                <button
                  key={`${deckSeed}_${idx}`}
                  onClick={()=>pickCard(idx)}
                  disabled={flippedIdx!==null}
                  className={`h-36 rounded-2xl border-2 transition-all duration-300 overflow-hidden flex flex-col ${
                    revealed
                      ?'border-red bg-card shadow-md scale-[1.02]'
                      :dim
                        ?'border-tan/50 bg-[#EFE8DA] opacity-50'
                        :'border-tan bg-gradient-to-br from-[#F7F3EA] to-[#E6D5BE] hover:border-red active:scale-95'
                  }`}
                >
                  {revealed?(
                    <>
                      <DishImage meal={cardMeal} className="h-16 w-full" compact/>
                      <div className="p-1.5 flex-1 flex flex-col justify-between text-left">
                        <div className="text-[11px] font-bold leading-tight line-clamp-2">{cardMeal.nameTh}</div>
                        <div className="font-num text-[10px] font-bold text-red">{cardCal} kcal</div>
                      </div>
                    </>
                  ):(
                    <div className="h-full w-full flex flex-col items-center justify-center p-2">
                      <div className="w-10 h-10 rounded-full bg-card border border-tan flex items-center justify-center text-xl shadow-sm">🍽️</div>
                      <span className="mt-2 text-[11px] font-bold text-brown">เลือกใบนี้</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Winning Dish Preview Card (with photo & CTA) */}
      {activeDish&&activeNutr&&(
        <div className="card mt-4 overflow-hidden border-2 border-red/70">
          <div className="flex items-stretch">
            <DishImage meal={activeDish} className="w-24 shrink-0" compact/>
            <div className="p-3 flex-1 min-w-0 flex flex-col justify-between gap-1.5">
              <div>
                <div className="text-[11px] font-bold text-red">✨ เมนูที่สุ่มได้</div>
                <div className="font-bold text-sm leading-snug truncate">{activeDish.nameTh}</div>
                <div className="font-num text-xs opacity-80">
                  {activeNutr.cal} kcal • โปรตีน {activeNutr.p}g • ⏱ {activeDish.prepTimeMins} นาที
                </div>
              </div>
              <button
                onClick={()=>open(activeDish,budget.mealTarget)}
                className="w-full rounded-xl bg-red text-white text-xs font-bold py-2 active:scale-[.98] transition"
              >
                ดูสูตรและสัดส่วนวัตถุดิบ →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
