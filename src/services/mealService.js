import {MEALS} from '../data/mockMeals'
import {scaleMeal,totals} from '../utils/nutrition'

export const USE_MOCK_DATA=true
const API=import.meta.env.VITE_API_URL||'http://localhost:8000'

const request=async(path,options={})=>{
  const r=await fetch(API+path,{
    headers:{'Content-Type':'application/json',...options.headers},
    ...options
  })
  if(!r.ok)throw new Error(`${path} ${r.status}`)
  return r.json()
}

const enrich=m=>{
  const nutrition=totals(m)
  return{...m,nutrition,costThb:nutrition.cost}
}

/** GET /api/v1/meals/recommendations */
export const fetchMeals=async()=>
  USE_MOCK_DATA?MEALS.map(enrich):request('/api/v1/meals/recommendations')

/** GET /api/v1/meals/:id */
export const fetchMeal=async id=>
  USE_MOCK_DATA?enrich(MEALS.find(m=>m.id===id)):request('/api/v1/meals/'+id)

/** POST /api/v1/recipes/:id/scale-and-swap */
export const scaleAndSwapRecipe=async(meal,targetKcal,swaps={})=>
  USE_MOCK_DATA
    ?scaleMeal(meal,targetKcal,swaps)
    :request(`/api/v1/recipes/${meal.id}/scale-and-swap`,{method:'POST',body:JSON.stringify({targetKcal,swaps})})

/** POST /api/v1/users/me/saved-meals */
export const syncSavedMeal=async(mealId,saved)=>
  USE_MOCK_DATA?{mealId,saved}:request('/api/v1/users/me/saved-meals',{method:'POST',body:JSON.stringify({mealId,saved})})

/** POST /api/v1/users/me/daily-log */
export const syncDailyLog=async entry=>
  USE_MOCK_DATA?entry:request('/api/v1/users/me/daily-log',{method:'POST',body:JSON.stringify(entry)})
