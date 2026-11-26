import {ING_MAP} from './mockIngredients'

const ratio=(s,t,b)=>{
  if(typeof b==='number')return b
  const a=ING_MAP[s].nutritionPer100g,c=ING_MAP[t].nutritionPer100g
  const rp=a.proteinG/c.proteinG,rc=a.calories/c.calories
  const r=b==='protein'?rp:b==='calories'?rc:Math.sqrt(rp*rc)
  return Math.round(r*20)/20
}

const R=(sourceIngredientId,targetIngredientId,ratioBasis,compatibleDishStyles,dietaryBenefits,reasonTh)=>({
  id:`${sourceIngredientId}__${targetIngredientId}`,sourceIngredientId,targetIngredientId,ratioBasis,
  conversionRatio:ratio(sourceIngredientId,targetIngredientId,ratioBasis),
  compatibleDishStyles,dietaryBenefits,reasonTh
})

export const SUBSTITUTIONS=[
  R('chicken_breast','tofu_firm','balanced',['stir-fry','soup','rice-bowl'],['vegetarian','lower_sodium','budget_friendly'],'ไม่มีไก่? สลับเป็นเต้าหู้ขาวแข็ง โปรตีนใกล้เคียงและคุมโซเดียม'),
  R('chicken_breast','chicken_thigh','protein',['stir-fry','soup','grill'],['budget_friendly'],'สะโพกไก่ไม่ติดหนังราคาถูกกว่า เนื้อฉ่ำกว่า แต่ไขมันสูงขึ้นเล็กน้อย'),
  R('chicken_breast','shrimp','protein',['stir-fry','soup'],['lower_fat'],'กุ้งให้โปรตีนสูงเท่ากันและไขมันต่ำมาก เหมาะกับคนไม่แพ้อาหารทะเล'),
  R('shrimp','tofu_silken','balanced',['soup'],['vegetarian','seafood_free'],'แพ้อาหารทะเล? ใช้เต้าหู้อ่อนแทนกุ้ง ได้โปรตีนใกล้เคียงและเนื้อนุ่ม'),
  R('salmon','chicken_breast','protein',['salad','steamed'],['lower_fat','budget_friendly'],'อกไก่ต้มให้โปรตีนเท่ากัน ไขมันต่ำกว่าและราคาถูกกว่าแซลมอน'),
  R('seabass','chicken_breast','protein',['steamed','soup'],['budget_friendly'],'อกไก่ให้โปรตีนใกล้เคียงปลา ราคาประหยัดกว่า'),
  R('seabass','tofu_silken','balanced',['steamed','soup'],['vegetarian','seafood_free'],'เต้าหู้อ่อนนึ่งได้เนื้อนุ่มคล้ายปลา และไม่มีอาหารทะเล'),
  R('pork_mince','chicken_breast','protein',['soup','stir-fry'],['lower_fat'],'อกไก่สับให้โปรตีนใกล้เคียง ไขมันต่ำกว่าหมูสับมาก'),
  R('pork_mince','tofu_firm','balanced',['soup','stir-fry'],['vegetarian','lower_fat'],'เต้าหู้แข็งขยี้แทนหมูสับ ไขมันต่ำและเป็นมังสวิรัติ'),
  R('beef_lean','chicken_breast','protein',['stir-fry'],['lower_fat','budget_friendly'],'อกไก่หั่นบางผัดได้เหมือนกัน ไขมันต่ำกว่าและถูกกว่าเนื้อวัว'),
  R('beef_lean','tofu_firm','balanced',['stir-fry'],['vegetarian','budget_friendly'],'ไม่กินเนื้อวัว? เต้าหู้แข็งทอดผัดแทนได้'),
  R('egg','egg_white','protein',['rice-bowl','breakfast','stir-fry'],['lower_fat'],'ไข่ขาวให้โปรตีนใกล้เคียง แต่ไม่มีไขมันและคอเลสเตอรอลจากไข่แดง'),
  R('jasmine_rice','brown_rice','calories',['rice-bowl','stir-fry','soup','breakfast'],['higher_fiber','low_glycemic'],'ข้าวกล้องมีไฟเบอร์มากกว่า ช่วยให้อิ่มนานและน้ำตาลขึ้นช้ากว่า'),
  R('glass_noodle','konjac_noodle','calories',['soup'],['lower_carb'],'เส้นบุกแคลอรีต่ำมาก เหมาะกับช่วงลดน้ำหนัก'),
  R('fish_sauce','light_soy','protein',['salad','soup','steamed','stir-fry'],['lower_sodium'],'ซีอิ๊วลดโซเดียมแทนน้ำปลา ลดโซเดียมต่อช้อนลงกว่าครึ่ง'),
  R('greek_yogurt','tofu_silken','balanced',['breakfast'],['dairy_free','vegetarian'],'แพ้นม? เต้าหู้อ่อนปั่นเนียนแทนโยเกิร์ตได้')
].map(r=>r.sourceIngredientId==='glass_noodle'||r.sourceIngredientId==='fish_sauce'?{...r,ratioBasis:1,conversionRatio:1}:r)

export const SUB_MAP=Object.fromEntries(SUBSTITUTIONS.map(r=>[r.id,r]))
export const rulesFor=(ingId,style)=>SUBSTITUTIONS.filter(r=>r.sourceIngredientId===ingId&&r.compatibleDishStyles.includes(style))
