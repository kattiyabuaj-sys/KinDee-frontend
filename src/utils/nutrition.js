import {ING_MAP} from '../data/mockIngredients'
import {SUB_MAP} from '../data/mockSubstitutions'

const FAC=[1.2,1.375,1.55,1.725]
const FIXED=['seasoning','fat']
const WHOLE=['ฟอง','กลีบ','เม็ด','หัว']

export const bmr=({sex,age,kg,cm})=>10*kg+6.25*cm-5*age+(sex==='m'?5:-161)

export const tdee=u=>Math.round(bmr(u)*FAC[u.act])

export const mealKcal=(u,goals=[],n=3)=>{
  const adj=goals.includes('gain')?1.1:goals.includes('lose')?.85:1
  return Math.round(tdee(u)*adj/n/10)*10
}

const unitOf=i=>i.standardUnits.find(u=>u.unit===i.defaultUnit)||{unit:'กรัม',grams:1}

const per=(i,g)=>{
  const f=g/100,n=i.nutritionPer100g
  return{cal:n.calories*f,p:n.proteinG*f,c:n.carbsG*f,f:n.fatG*f,na:n.sodiumMg*f,s:n.sugarG*f,cost:i.estimatedCostThbPer100g*f}
}

const resolve=(meal,swaps)=>meal.ingredients.map(l=>{
  const src=ING_MAP[l.ingredientId]
  const rule=swaps[l.ingredientId]&&SUB_MAP[swaps[l.ingredientId]]
  return{
    key:l.ingredientId,rule,
    ing:rule?ING_MAP[rule.targetIngredientId]:src,
    g:l.grams*(rule?rule.conversionRatio:1),
    scal:l.scalable??!FIXED.includes(src.category)
  }
})

const tally=(rs,k)=>{
  const t={cal:0,p:0,c:0,f:0,na:0,s:0,cost:0}
  for(const r of rs){
    const x=per(r.ing,r.g*(r.scal?k:1))
    for(const j in t)t[j]+=x[j]
  }
  return t
}

const rnd=t=>Object.fromEntries(Object.entries(t).map(([k,v])=>[k,Math.round(v)]))

const snap=(v,u)=>WHOLE.includes(u)?Math.max(1,Math.round(v)):u==='กรัม'?Math.max(5,Math.round(v/5)*5):Math.max(.5,Math.round(v*2)/2)

export const totals=(meal,swaps={})=>rnd(tally(resolve(meal,swaps),1))

export const scaleMeal=(meal,target,swaps={})=>{
  const rs=resolve(meal,swaps)
  const fix=tally(rs.filter(r=>!r.scal),1).cal
  const v=tally(rs.filter(r=>r.scal),1).cal
  const k=v?Math.min(1.4,Math.max(.7,(target-fix)/v)):1
  const rows=rs.map(r=>{
    const u=unitOf(r.ing)
    return{id:r.key,name:r.ing.nameTh,unit:u.unit,amt:snap(r.g*(r.scal?k:1)/u.grams,u.unit),rule:r.rule?.id}
  })
  return{k,rows,tot:rnd(tally(rs,k))}
}

const KIT={
  q15:m=>m.prepTimeMins<=15,
  cheap:m=>m.costThb<=45,
  prep:m=>m.mealPrepFriendly,
  noOil:m=>!m.ingredients.some(l=>ING_MAP[l.ingredientId].category==='fat'),
  micro:m=>m.equipment.every(e=>e==='microwave'||e==='no_cook'),
  airfry:()=>true
}

const EX={
  seafood:m=>m.allergens.includes('seafood'),
  nut:m=>m.allergens.includes('nuts'),
  dairy:m=>m.allergens.includes('dairy'),
  veg:m=>!m.isVegetarian,
  beef:m=>m.ingredients.some(l=>l.ingredientId==='beef_lean'),
  spicy:m=>m.spiceLevel>0
}

export const filterMeals=(all,p)=>{
  const ok=(m,g,k)=>
    !p.ex.some(e=>EX[e](m))&&
    (!k||(p.kit.every(x=>KIT[x](m))&&(!m.equipment.includes('air_fryer')||p.kit.includes('airfry'))))&&
    (!g||!p.goals.length||p.goals.some(x=>m.healthGoals.includes(x)))
  const steps=[[1,1],[1,0],[0,0]]
  for(let lvl=0;lvl<3;lvl++){
    const list=all.filter(m=>ok(m,...steps[lvl]))
    if(list.length)return{list,lvl}
  }
  return{list:all,lvl:3}
}
