import {useEffect,useState} from 'react'
import {fetchMeals} from './services/mealService'
import {filterMeals,mealKcal,tdee} from './utils/nutrition'
import {addSpin,addSwap,isSaved,toggleSaved,useUserStore} from './store/userStore'
import Setup from './screens/Setup'
import Prefs from './screens/Prefs'
import Wheel from './screens/Wheel'
import Recipe from './screens/Recipe'

const TABS=[['wheel','🎲','วงล้อ'],['saved','🔖','เมนูที่บันทึก'],['me','👤','โปรไฟล์']]

export default function App(){
  const [meals,setMeals]=useState([])
  const [u,setU]=useState({sex:'f',age:28,kg:62,cm:165,act:1})
  const [p,setP]=useState({goals:['lose'],kit:['q15'],ex:['spicy']})
  const [scr,setScr]=useState('setup')
  const [tab,setTab]=useState('wheel')
  const [cur,setCur]=useState(null)
  const [us,setUs]=useUserStore()

  useEffect(()=>{fetchMeals().then(setMeals)},[])
  if(!meals.length)return<div className="p-8 text-center">กำลังโหลด…</div>

  const kcal=mealKcal(u,p.goals)
  const pool=filterMeals(meals,p).list
  const open=m=>{setCur(m);setScr('recipe')}

  const body=()=>{
    if(scr==='setup')return<Setup u={u} setU={setU} next={()=>setScr('prefs')}/>
    if(scr==='prefs')return<Prefs p={p} setP={setP} meals={meals} back={()=>setScr('setup')} next={()=>{setTab('wheel');setScr('main')}}/>
    if(scr==='recipe')return<Recipe key={cur.id} m={cur} kcal={kcal} back={()=>setScr('main')} again={()=>{setScr('main');setTab('wheel')}} saved={isSaved(us,cur.id)} save={()=>setUs(s=>toggleSaved(s,cur.id))} us={us} onSwap={(a,b)=>setUs(s=>addSwap(s,a,b))}/>
    return(
      <>
        {tab==='wheel'&&<Wheel pool={pool} p={p} kcal={kcal} open={open} user={us} onSpin={m=>setUs(s=>addSpin(s,m.id))}/>}
        {tab==='saved'&&(
          <div className="flex-1 overflow-y-auto p-5 space-y-2">
            <h1 className="text-2xl font-bold mb-2">เมนูที่บันทึก</h1>
            {!us.savedMealIds.length&&<p className="opacity-70">ยังไม่มีเมนูที่บันทึก แตะ ☆ ในหน้าสูตรอาหารเพื่อบันทึก</p>}
            {meals.filter(m=>us.savedMealIds.includes(m.id)).map(m=>(
              <button key={m.id} onClick={()=>open(m)} className="card w-full text-left p-3 font-semibold">{m.nameTh}<span className="font-num text-sm opacity-70"> · {m.nutrition.cal} kcal</span></button>
            ))}
          </div>
        )}
        {tab==='me'&&(
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <h1 className="text-2xl font-bold">โปรไฟล์</h1>
            <div className="card p-4 space-y-1">
              <div>{u.sex==='m'?'ชาย':'หญิง'} · <span className="font-num">{u.age}</span> ปี · <span className="font-num">{u.kg}</span> กก. · <span className="font-num">{u.cm}</span> ซม.</div>
              <div>เป้าหมายต่อวัน <b className="font-num">{tdee(u).toLocaleString()}</b> kcal · ต่อมื้อ <b className="font-num">{kcal}</b> kcal</div>
            </div>
            <button className="cta" onClick={()=>setScr('setup')}>แก้ไขข้อมูลร่างกาย</button>
            <button className="btn-o w-full py-3" onClick={()=>setScr('prefs')}>แก้ไขความชอบอาหาร</button>
          </div>
        )}
        <nav className="grid grid-cols-3 bg-card border-t border-tan/50 py-2">
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
