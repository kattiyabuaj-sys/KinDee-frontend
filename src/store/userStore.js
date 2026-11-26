import {useEffect,useState} from 'react'
import {MOCK_USER_HISTORY} from '../data/mockUserHistory'

const KEY='kindee.user.v1'
const MAX=50

const load=()=>{
  try{return{...MOCK_USER_HISTORY,...JSON.parse(localStorage.getItem(KEY))}}
  catch{return MOCK_USER_HISTORY}
}

export const isSaved=(s,id)=>s.savedMealIds.includes(id)

export const toggleSaved=(s,id)=>({...s,
  savedMealIds:isSaved(s,id)?s.savedMealIds.filter(x=>x!==id):[...s.savedMealIds,id]})

export const addSpin=(s,mealId)=>({...s,
  spinHistory:[...s.spinHistory,{mealId,at:new Date().toISOString()}].slice(-MAX)})

export const addSwap=(s,from,to)=>({...s,userSwapPreferences:{...s.userSwapPreferences,
  [from]:{...s.userSwapPreferences[from],[to]:(s.userSwapPreferences[from]?.[to]||0)+1}}})

export const suggestSwap=(s,from,min=2)=>{
  const top=Object.entries(s.userSwapPreferences[from]||{}).sort((a,b)=>b[1]-a[1])[0]
  return top&&top[1]>=min?top[0]:null
}

export const pickWinner=(s,pool,n=2)=>{
  const recent=s.spinHistory.slice(-n).map(x=>x.mealId)
  const ok=pool.filter(m=>!recent.includes(m.id))
  const src=ok.length?ok:pool
  return src[Math.floor(Math.random()*src.length)]
}

export const useUserStore=()=>{
  const [s,set]=useState(load)
  useEffect(()=>{
    try{localStorage.setItem(KEY,JSON.stringify(s))}catch{}
  },[s])
  return[s,set]
}
