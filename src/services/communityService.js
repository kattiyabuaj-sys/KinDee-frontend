import {MOCK_COMMUNITY_MEALS,deriveCommunityMeal} from '../data/mockCommunityMeals'
import {totals} from '../utils/nutrition'

export const USE_MOCK_DATA=true
const API=import.meta.env.VITE_API_URL||'http://localhost:8000'
const STORAGE_KEY='kindee.community.v1'

const request=async(path,options={})=>{
  const r=await fetch(API+path,{
    headers:{'Content-Type':'application/json',...options.headers},
    ...options
  })
  if(!r.ok)throw new Error(`${path} ${r.status}`)
  return r.json()
}

const enrich=m=>{
  const derived=deriveCommunityMeal(m)
  const nutrition=totals(derived)
  return{...derived,nutrition,costThb:nutrition.cost}
}

const loadStored=()=>{
  try{
    const raw=JSON.parse(localStorage.getItem(STORAGE_KEY))
    return{
      published:Array.isArray(raw?.published)?raw.published:[],
      likeDeltas:raw?.likeDeltas&&typeof raw.likeDeltas==='object'?raw.likeDeltas:{}
    }
  }catch{
    return{published:[],likeDeltas:{}}
  }
}

const saveStored=data=>{
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data))}catch{}
}

/**
 * GET /api/v1/community/recipes
 * Returns user-published recipes (newest first) followed by seeded community posts,
 * all dynamically enriched with ingredient-backed nutrition totals.
 */
export const fetchCommunityRecipes=async()=>{
  if(!USE_MOCK_DATA)return request('/api/v1/community/recipes')
  const {published,likeDeltas}=loadStored()
  const all=[...published,...MOCK_COMMUNITY_MEALS].map(m=>{
    const enriched=enrich(m)
    const delta=likeDeltas[enriched.id]||0
    return{...enriched,likes:Math.max(0,(enriched.likes||0)+delta)}
  })
  return all
}

/**
 * POST /api/v1/community/recipes
 * Publishes a new ingredient-verified community recipe to localStorage (or backend API).
 */
export const publishCommunityRecipe=async(payload,profile)=>{
  if(!USE_MOCK_DATA){
    return request('/api/v1/community/recipes',{
      method:'POST',
      body:JSON.stringify({...payload,profile})
    })
  }
  const newMeal=enrich({
    id:`cm_${Date.now()}`,
    nameTh:payload.nameTh.trim(),
    dishStyle:payload.dishStyle||'rice-bowl',
    mealTiming:payload.mealTiming||['lunch','dinner'],
    equipment:payload.equipment?.length?payload.equipment:['stove'],
    prepTimeMins:Number(payload.prepTimeMins)||15,
    spiceLevel:Number(payload.spiceLevel)||0,
    glycemicLoad:'low',
    healthGoals:payload.healthGoals?.length?payload.healthGoals:['clean'],
    mealPrepFriendly:true,
    imageUrl:payload.imageUrl?.trim()||'',
    author:{
      name:profile?.displayName?.trim()||'เชฟสายคลีน',
      avatar:profile?.avatar||'🥗',
      isMe:true
    },
    captionTh:payload.captionTh?.trim()||'สูตรสุขภาพทำเองจากวัตถุดิบจริง',
    likes:1,
    createdAt:new Date().toISOString(),
    ingredients:payload.ingredients,
    stepsTh:payload.stepsTh.filter(s=>s.trim())
  })

  const stored=loadStored()
  stored.published=[newMeal,...stored.published]
  saveStored(stored)
  return newMeal
}

/**
 * POST /api/v1/community/recipes/:id/like
 * Persists community recipe like-count delta locally (or syncs with backend).
 */
export const toggleCommunityLike=async(recipeId,liked)=>{
  if(!USE_MOCK_DATA){
    return request(`/api/v1/community/recipes/${recipeId}/like`,{
      method:'POST',
      body:JSON.stringify({liked})
    })
  }
  const stored=loadStored()
  stored.likeDeltas[recipeId]=(stored.likeDeltas[recipeId]||0)+(liked?1:-1)
  saveStored(stored)
  return{recipeId,liked}
}

/**
 * POST /api/v1/users/me/random-pool
 * Syncs adding/removing a community recipe from the user's personal randomizer pool.
 */
export const syncCommunityPoolToggle=async(mealId,added)=>
  USE_MOCK_DATA
    ?{mealId,added}
    :request('/api/v1/users/me/random-pool',{method:'POST',body:JSON.stringify({mealId,added})})

/**
 * Merges core filtered meals with community recipes explicitly added by the user,
 * deduplicating by `id` so added community dishes appear in Wheel, Gacha Slot, and Mystery Cards.
 */
export const mergeDiscoveryPool=(coreFilteredPool,communityMeals,communityPoolIds=[])=>{
  if(!communityPoolIds?.length)return coreFilteredPool
  const added=communityMeals.filter(m=>communityPoolIds.includes(m.id))
  const seen=new Set(coreFilteredPool.map(m=>m.id))
  return[...coreFilteredPool,...added.filter(m=>!seen.has(m.id))]
}
