import {ING_MAP} from '../data/mockIngredients'
import {SUB_MAP} from '../data/mockSubstitutions'

const FAC=[1.2,1.375,1.55,1.725]
const FIXED=['seasoning','fat']
const WHOLE=['ฟอง','กลีบ','เม็ด','หัว','ลูก','แผ่น']

/** Mifflin-St Jeor BMR equation. */
export const bmr=({sex,age,kg,cm})=>10*kg+6.25*cm-5*age+(sex==='m'?5:-161)

export const tdee=u=>Math.round(bmr(u)*FAC[u.act])

/**
 * Daily calorie target adjusted for weight goals:
 *   lose  → TDEE × 0.80 (−20% deficit, clinically safe for sustained fat loss)
 *   gain  → TDEE × 1.15 (+15% surplus for muscle gain)
 *   default → TDEE (maintenance)
 */
export const dailyTarget=(u,goals=[])=>{
  const adj=goals.includes('gain')?1.15:goals.includes('lose')?.80:1
  return Math.round(tdee(u)*adj/10)*10
}

/** Per-meal calorie target — user-configurable meal count (default 3). */
export const mealKcal=(u,goals=[],n=3)=>Math.round(dailyTarget(u,goals)/n/10)*10

const unitOf=i=>i.standardUnits.find(u=>u.unit===i.defaultUnit)||{unit:'กรัม',grams:1}

const per=(i,g)=>{
  const f=g/100,n=i.nutritionPer100g
  return{cal:n.calories*f,p:n.proteinG*f,c:n.carbsG*f,f:n.fatG*f,na:n.sodiumMg*f,s:n.sugarG*f,cost:i.estimatedCostThbPer100g*f}
}

const resolve=(meal,swaps)=>meal.ingredients.map(l=>{
  const src=ING_MAP[l.ingredientId]
  const rule=swaps[l.ingredientId]&&SUB_MAP[swaps[l.ingredientId]]
  const ing=rule?ING_MAP[rule.targetIngredientId]:src
  return{
    key:l.ingredientId,
    rule,
    ing,
    cat:ing.category,
    g:l.grams*(rule?rule.conversionRatio:1),
    // Seasonings and cooking fats stay fixed so scaling calories doesn't over-salt or over-oil the dish.
    scal:l.scalable??!FIXED.includes(src.category)
  }
})

const tallyRows=(rs,getScale)=>{
  const t={cal:0,p:0,c:0,f:0,na:0,s:0,cost:0}
  for(const r of rs){
    const x=per(r.ing,r.g*getScale(r))
    for(const j in t)t[j]+=x[j]
  }
  return t
}

const rnd=t=>Object.fromEntries(Object.entries(t).map(([k,v])=>[k,Math.round(v)]))
const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v))

/** Snaps scaled quantities to practical Thai kitchen measurements. */
const snap=(v,u)=>WHOLE.includes(u)?Math.max(1,Math.round(v)):u==='กรัม'?Math.max(5,Math.round(v/5)*5):Math.max(.5,Math.round(v*2)/2)

export const totals=(meal,swaps={})=>rnd(tallyRows(resolve(meal,swaps),()=>1))

/**
 * Scales a meal realistically to hit `target` kcal while keeping per-dish protein
 * in a realistic everyday range (~24–42g for standard meals; slightly higher for
 * muscle/protein goals) by capping protein scaling and flexing carbs/veggies.
 */
export const scaleMeal=(meal,target,swaps={},goals=[])=>{
  const rs=resolve(meal,swaps)
  const fixCal=tallyRows(rs.filter(r=>!r.scal),()=>1).cal
  const protCal=tallyRows(rs.filter(r=>r.scal&&r.cat==='protein'),()=>1).cal
  const otherCal=tallyRows(rs.filter(r=>r.scal&&r.cat!=='protein'),()=>1).cal
  const totalScalable=protCal+otherCal

  const highProt=goals.includes('muscle')||goals.includes('protein')
  const maxProtScale=highProt?1.4:1.25
  const kIdeal=totalScalable?clamp((target-fixCal)/totalScalable,.7,1.8):1

  // Cap protein scaling so single dishes don't inflate into unrealistic meat piles.
  const kProt=otherCal>0?clamp(kIdeal,.75,maxProtScale):clamp(kIdeal,.7,1.45)
  const remCal=Math.max(0,target-fixCal-protCal*kProt)
  const kOther=otherCal>0?clamp(remCal/otherCal,.65,1.85):kProt

  const scaleFor=r=>(!r.scal?1:r.cat==='protein'?kProt:kOther)
  const rows=rs.map(r=>{
    const u=unitOf(r.ing)
    return{
      id:r.key,
      name:r.ing.nameTh,
      unit:u.unit,
      amt:snap(r.g*scaleFor(r)/u.grams,u.unit),
      rule:r.rule?.id
    }
  })

  return{k:kIdeal,rows,tot:rnd(tallyRows(rs,scaleFor))}
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

/**
 * Filter logic (intentionally strict → progressive fallback):
 *
 *  Goals ("เป้าหมายสุขภาพ"): uses ALL-must-match (AND) so selecting more goals
 *  narrows the pool — adding "ลดโซเดียม" to "เพิ่มกล้ามเนื้อ" should REDUCE results,
 *  not expand them. We separate calorie-goal flags (lose/gain) which influence
 *  TDEE but do NOT filter the dish list from health/dietary tag goals (lowNa, lowFat
 *  muscle, protein, sugar, clean) which must all be satisfied by matched dishes.
 *
 *  Fallback levels (lvl):
 *    0 — strict: exclusions + kitchen + ALL health goals match
 *    1 — relax kitchen/time constraints only
 *    2 — relax health goal matching entirely (safe dishes only)
 *    3 — full catalogue (last resort)
 */
const CALORIE_GOALS=new Set(['lose','gain']) // affect TDEE only, not dish filtering
export const filterMeals=(all,p)=>{
  const dishGoals=p.goals.filter(g=>!CALORIE_GOALS.has(g))

  const passesExclusions=m=>!p.ex.some(e=>EX[e](m))
  const passesKitchen=m=>
    p.kit.every(x=>KIT[x](m))&&
    (!m.equipment.includes('air_fryer')||p.kit.includes('airfry'))
  // ALL selected dish-health goals must appear on the meal (AND semantics)
  const passesAllGoals=m=>!dishGoals.length||dishGoals.every(g=>m.healthGoals.includes(g))
  // At least ONE goal matches (looser fallback)
  const passesAnyGoal=m=>!dishGoals.length||dishGoals.some(g=>m.healthGoals.includes(g))

  const levels=[
    m=>passesExclusions(m)&&passesKitchen(m)&&passesAllGoals(m),  // lvl 0: strict
    m=>passesExclusions(m)&&passesAllGoals(m),                     // lvl 1: drop kitchen
    m=>passesExclusions(m)&&passesAnyGoal(m),                      // lvl 2: ANY goal
    m=>passesExclusions(m)                                          // lvl 3: exclusions only
  ]

  for(let lvl=0;lvl<levels.length;lvl++){
    const list=all.filter(levels[lvl])
    if(list.length>=3||lvl===levels.length-1)return{list,lvl}
  }
  return{list:all,lvl:4}
}

/**
 * Filters candidate meals to those that can fit within `remainingKcal + buffer`.
 * Returns the effective per-meal target (`mealTarget`) and guardrail flags so the
 * wheel warns clearly when the daily calorie budget is tight or already reached.
 */
export const fitBudget=(meals,perMealKcal,remainingKcal,buffer=50,goals=[])=>{
  if(remainingKcal<=0){
    const light=[...meals].sort((a,b)=>scaleMeal(a,280,{},goals).tot.cal-scaleMeal(b,280,{},goals).tot.cal)
    return{list:light,mealTarget:Math.min(perMealKcal,300),isTight:true,isOverBudget:true}
  }
  const mealTarget=Math.min(perMealKcal,Math.max(220,remainingKcal))
  const fitting=meals.filter(m=>scaleMeal(m,mealTarget,{},goals).tot.cal<=remainingKcal+buffer)
  if(fitting.length)return{list:fitting,mealTarget,isTight:remainingKcal<perMealKcal,isOverBudget:false}
  const lightest=[...meals].sort((a,b)=>scaleMeal(a,mealTarget,{},goals).tot.cal-scaleMeal(b,mealTarget,{},goals).tot.cal)
  return{list:lightest,mealTarget,isTight:true,isOverBudget:false}
}
