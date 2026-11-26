import {useEffect,useState} from 'react'
import {fetchMeals,syncDailyLog,syncSavedMeal} from './services/mealService'
import {dailyTarget,filterMeals,mealKcal,tdee} from './utils/nutrition'
import {
  addDailyLog,addSpin,addSwap,clearTodayLog,isSaved,
  removeDailyLog,todayTotals,toggleSaved,useUserStore
} from './store/userStore'
import Setup from './screens/Setup'
import Prefs from './screens/Prefs'
import Wheel from './screens/Wheel'
import Recipe from './screens/Recipe'
import Today from './screens/Today'
import DishImage from './components/DishImage'

const TABS=[
  ['wheel','🎲','วงล้อ'],
  ['today','📊','ข้อมูลวันนี้'],
  ['saved','🔖','ที่บันทึก'],
  ['me','👤','โปรไฟล์']
]

export default function App(){
  const [meals,setMeals]=useState([])
  const [scr,setScr]=useState('setup')
  const [tab,setTab]=useState('wheel')
  const [cur,setCur]=useState(null)
  const [curTarget,setCurTarget]=useState(null)
  const [us,setUs]=useUserStore()
  const [mealCount,setMealCount]=useState(()=>us.mealCount||3)

  useEffect(()=>{fetchMeals().then(setMeals)},[])
  if(!meals.length)return<div className="p-8 text-center">กำลังโหลด…</div>

  const u=us.biometrics
  const p=us.preferences
  const setU=nextU=>setUs(s=>({...s,biometrics:typeof nextU==='function'?nextU(s.biometrics):nextU}))
  const setP=nextP=>setUs(s=>({...s,preferences:typeof nextP==='function'?nextP(s.preferences):nextP}))

  const dailyKcal=dailyTarget(u,p.goals)
  const kcal=mealKcal(u,p.goals,mealCount)
  const consumed=todayTotals(us)
  const remainingKcal=dailyKcal-consumed.cal
  const pool=filterMeals(meals,p).list

  const open=(m,targetOverride)=>{
    setCur(m)
    setCurTarget(targetOverride??kcal)
    setScr('recipe')
  }

  const goToday=()=>{
    setScr('main')
    setTab('today')
  }

  const handleSave=mealId=>{
    const nextSaved=!isSaved(us,mealId)
    setUs(s=>toggleSaved(s,mealId))
    syncSavedMeal(mealId,nextSaved).catch(()=>{})
  }

  const handleLogMeal=entry=>{
    setUs(s=>addDailyLog(s,entry))
    syncDailyLog(entry).catch(()=>{})
  }

  const body=()=>{
    if(scr==='setup')return<Setup u={u} setU={setU} goals={p.goals} mealCount={mealCount} setMealCount={n=>{setMealCount(n);setUs(s=>({...s,mealCount:n}))}} next={()=>setScr('prefs')}/>
    if(scr==='prefs')return<Prefs p={p} setP={setP} meals={meals} back={()=>setScr('setup')} next={()=>{setTab('wheel');setScr('main')}}/>
    if(scr==='recipe')return(
      <Recipe
        key={cur.id}
        m={cur}
        kcal={curTarget??kcal}
        goals={p.goals}
        back={()=>setScr('main')}
        again={()=>{setScr('main');setTab('wheel')}}
        saved={isSaved(us,cur.id)}
        save={()=>handleSave(cur.id)}
        us={us}
        onSwap={(a,b)=>setUs(s=>addSwap(s,a,b))}
        onLogMeal={handleLogMeal}
        onOpenToday={goToday}
      />
    )
    return(
      <>
        {tab==='wheel'&&(
          <Wheel
            pool={pool}
            p={p}
            kcal={kcal}
            dailyKcal={dailyKcal}
            consumedCal={consumed.cal}
            remainingKcal={remainingKcal}
            open={open}
            onOpenToday={()=>setTab('today')}
            user={us}
            onSpin={m=>setUs(s=>addSpin(s,m.id))}
          />
        )}
        {tab==='today'&&(
          <Today
            logs={us.todayLog||[]}
            consumed={consumed}
            dailyKcal={dailyKcal}
            onLogMeal={handleLogMeal}
            onRemove={id=>setUs(s=>removeDailyLog(s,id))}
            onClear={()=>setUs(s=>clearTodayLog(s))}
            onSpinNext={()=>setTab('wheel')}
          />
        )}
        {tab==='saved'&&(
          <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
            <h1 className="text-2xl font-bold mb-2">เมนูที่บันทึก</h1>
            {!us.savedMealIds.length&&<p className="opacity-70">ยังไม่มีเมนูที่บันทึก แตะ ☆ ในหน้าสูตรอาหารเพื่อบันทึก</p>}
            {meals.filter(m=>us.savedMealIds.includes(m.id)).map(m=>(
              <button key={m.id} onClick={()=>open(m)} className="card w-full text-left overflow-hidden flex items-center gap-3 pr-3">
                <DishImage meal={m} className="w-16 h-16 shrink-0" compact/>
                <div className="py-2 min-w-0">
                  <div className="font-semibold truncate">{m.nameTh}</div>
                  <div className="font-num text-xs opacity-70">{m.nutrition.cal} kcal • โปรตีน {m.nutrition.p}g</div>
                </div>
              </button>
            ))}
          </div>
        )}
        {tab==='me'&&(
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <h1 className="text-2xl font-bold">โปรไฟล์</h1>
            <div className="card p-4 space-y-1">
              <div>{u.sex==='m'?'ชาย':'หญิง'} · <span className="font-num">{u.age}</span> ปี · <span className="font-num">{u.kg}</span> กก. · <span className="font-num">{u.cm}</span> ซม.</div>
              <div>TDEE <b className="font-num">{tdee(u).toLocaleString()}</b> kcal · เป้าหมายต่อวัน <b className="font-num">{dailyKcal.toLocaleString()}</b> kcal</div>
              <div>เป้าหมายต่อมื้อ <b className="font-num">{kcal}</b> kcal</div>
            </div>
            <button className="cta" onClick={()=>setScr('setup')}>แก้ไขข้อมูลร่างกาย</button>
            <button className="btn-o w-full py-3" onClick={()=>setScr('prefs')}>แก้ไขความชอบอาหาร</button>
          </div>
        )}
        <nav className="grid grid-cols-4 bg-card border-t border-tan/50 py-2">
          {TABS.map(([id,ic,t])=>(
            <button key={id} onClick={()=>setTab(id)} className={`flex flex-col items-center text-xs font-semibold ${tab===id?'text-red':'opacity-70'}`}><span className="text-xl">{ic}</span>{t}</button>
          ))}
        </nav>
      </>
    )
  }

  return(
    <div className="mx-auto w-full max-w-[390px] h-dvh sm:h-[844px] sm:my-4 sm:rounded-[28px] sm:shadow-2xl overflow-hidden bg-rice flex flex-col">
      {body()}
    </div>
  )
}
