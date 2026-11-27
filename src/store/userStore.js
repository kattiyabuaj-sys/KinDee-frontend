import {useEffect,useState} from 'react'
import {DEFAULT_BIOMETRICS,DEFAULT_PREFERENCES,DEFAULT_PROFILE,MOCK_USER_HISTORY} from '../data/mockUserHistory'

const KEY='kindee.user.v1'
const MAX_SPINS=50

/** Local calendar date key (YYYY-MM-DD) so todayLog resets cleanly on a new day. */
export const todayKey=(d=new Date())=>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`

const isSameLocalDay=(iso,key)=>{
  if(!iso)return false
  return todayKey(new Date(iso))===key
}

const load=()=>{
  try{
    const raw=JSON.parse(localStorage.getItem(KEY))
    if(!raw)return MOCK_USER_HISTORY
    const key=todayKey()
    return{
      ...MOCK_USER_HISTORY,
      ...raw,
      biometrics:{...DEFAULT_BIOMETRICS,...raw.biometrics},
      profile:{...DEFAULT_PROFILE,...raw.profile},
      preferences:{...DEFAULT_PREFERENCES,...raw.preferences},
      mealCount:raw.mealCount||3,
      likedCommunityIds:Array.isArray(raw.likedCommunityIds)?raw.likedCommunityIds:[],
      communityPoolIds:Array.isArray(raw.communityPoolIds)?raw.communityPoolIds:[],
      todayLog:Array.isArray(raw.todayLog)?raw.todayLog.filter(e=>isSameLocalDay(e.loggedAt,key)):[]
    }
  }catch{
    return MOCK_USER_HISTORY
  }
}

export const isSaved=(s,id)=>s.savedMealIds.includes(id)

export const toggleSaved=(s,id)=>({
  ...s,
  savedMealIds:isSaved(s,id)?s.savedMealIds.filter(x=>x!==id):[...s.savedMealIds,id]
})

export const updateProfile=(s,patch)=>({
  ...s,
  profile:{...DEFAULT_PROFILE,...s.profile,...patch}
})

export const isCommunityLiked=(s,id)=>(s.likedCommunityIds||[]).includes(id)

export const toggleCommunityLikeState=(s,id)=>({
  ...s,
  likedCommunityIds:isCommunityLiked(s,id)
    ?(s.likedCommunityIds||[]).filter(x=>x!==id)
    :[...(s.likedCommunityIds||[]),id]
})

export const isInCommunityPool=(s,id)=>(s.communityPoolIds||[]).includes(id)

export const toggleCommunityPoolState=(s,id)=>({
  ...s,
  communityPoolIds:isInCommunityPool(s,id)
    ?(s.communityPoolIds||[]).filter(x=>x!==id)
    :[...(s.communityPoolIds||[]),id]
})

export const addSpin=(s,mealId)=>({
  ...s,
  spinHistory:[...s.spinHistory,{mealId,at:new Date().toISOString()}].slice(-MAX_SPINS)
})

export const addSwap=(s,from,to)=>({
  ...s,
  userSwapPreferences:{
    ...s.userSwapPreferences,
    [from]:{...s.userSwapPreferences[from],[to]:(s.userSwapPreferences[from]?.[to]||0)+1}
  }
})

export const suggestSwap=(s,from,min=2)=>{
  const top=Object.entries(s.userSwapPreferences[from]||{}).sort((a,b)=>b[1]-a[1])[0]
  return top&&top[1]>=min?top[0]:null
}

/** Avoids repeating the last `n` spun meals when alternatives exist in the pool. */
export const pickWinner=(s,pool,n=2)=>{
  const recent=s.spinHistory.slice(-n).map(x=>x.mealId)
  const ok=pool.filter(m=>!recent.includes(m.id))
  const src=ok.length?ok:pool
  return src[Math.floor(Math.random()*src.length)]
}

/** Appends a finalized meal (with scaled & swapped nutrition) to today's log. */
export const addDailyLog=(s,{mealId,nameTh,nutrition,swaps={}})=>{
  const entry={
    id:`log_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
    mealId,
    nameTh,
    loggedAt:new Date().toISOString(),
    nutrition,
    swaps
  }
  return{...s,todayLog:[...(s.todayLog||[]),entry]}
}

export const removeDailyLog=(s,logId)=>({
  ...s,
  todayLog:(s.todayLog||[]).filter(e=>e.id!==logId)
})

export const clearTodayLog=s=>({...s,todayLog:[]})

/** Sums consumed calories, macros, sodium, sugar, and cost for today's logged meals. */
export const todayTotals=s=>{
  const key=todayKey()
  const base={cal:0,p:0,c:0,f:0,na:0,s:0,cost:0}
  for(const e of s.todayLog||[]){
    if(!isSameLocalDay(e.loggedAt,key)||!e.nutrition)continue
    for(const k in base)base[k]+=e.nutrition[k]||0
  }
  return Object.fromEntries(Object.entries(base).map(([k,v])=>[k,Math.round(v)]))
}

export const useUserStore=()=>{
  const [s,set]=useState(load)
  useEffect(()=>{
    try{localStorage.setItem(KEY,JSON.stringify(s))}catch{}
  },[s])
  return[s,set]
}
