import {MEALS} from '../data/mockMeals'
import {totals} from '../utils/nutrition'

export const USE_MOCK_DATA=true
const API=import.meta.env.VITE_API_URL||'http://localhost:8000'

const get=async path=>{
  const r=await fetch(API+path)
  if(!r.ok)throw new Error(path+' '+r.status)
  return r.json()
}

const enrich=m=>{
  const nutrition=totals(m)
  return{...m,nutrition,costThb:nutrition.cost}
}

export const fetchMeals=async()=>USE_MOCK_DATA?MEALS.map(enrich):get('/api/v1/meals/recommendations')
export const fetchMeal=async id=>USE_MOCK_DATA?enrich(MEALS.find(m=>m.id===id)):get('/api/v1/meals/'+id)
