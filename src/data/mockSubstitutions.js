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

const ALL_STYLES=['stir-fry','soup','salad','steamed','grill','rice-bowl','noodle','curry','breakfast']

export const SUBSTITUTIONS=[
  R('chicken_breast','tofu_firm','balanced',['stir-fry','soup','rice-bowl','noodle','curry','grill'],['vegetarian','lower_sodium','budget_friendly'],'ไม่มีไก่? สลับเป็นเต้าหู้ขาวแข็ง โปรตีนใกล้เคียงและคุมโซเดียม'),
  R('chicken_breast','chicken_thigh','protein',['stir-fry','soup','grill','curry','rice-bowl'],['budget_friendly'],'สะโพกไก่ไม่ติดหนังราคาถูกกว่า เนื้อฉ่ำกว่า แต่ไขมันสูงขึ้นเล็กน้อย'),
  R('chicken_breast','shrimp','protein',['stir-fry','soup','salad','noodle'],['lower_fat'],'กุ้งให้โปรตีนสูงเท่ากันและไขมันต่ำมาก เหมาะกับคนไม่แพ้อาหารทะเล'),
  R('chicken_breast','pork_loin','protein',['stir-fry','grill','rice-bowl','curry'],['high_protein'],'สันในหมูไขมันต่ำมาก นุ่มกว่าอกไก่ ให้โปรตีนสูงใกล้เคียงกัน'),
  R('chicken_thigh','chicken_breast','protein',['stir-fry','soup','grill','curry','rice-bowl'],['lower_fat','higher_protein'],'เปลี่ยนเป็นอกไก่เพื่อลดไขมันและเพิ่มโปรตีนต่อแคลอรี'),
  R('chicken_thigh','tofu_firm','balanced',['stir-fry','grill','curry'],['vegetarian','lower_fat'],'สลับเป็นเต้าหู้ขาวแข็ง คุมไขมันได้ดีและเป็นมังสวิรัติ'),
  R('pork_loin','chicken_breast','protein',['stir-fry','grill','rice-bowl','soup','curry'],['lower_fat','budget_friendly'],'ใช้อกไก่แทนสันในหมู ประหยัดกว่าและไขมันต่ำกว่าเล็กน้อย'),
  R('pork_loin','tofu_firm','balanced',['stir-fry','grill','rice-bowl','curry'],['vegetarian','budget_friendly'],'สลับเป็นเต้าหู้ขาวแข็ง ไม่มีเนื้อสัตว์และไขมันอิ่มตัวต่ำ'),
  R('pork_mince','chicken_breast','protein',['soup','stir-fry','rice-bowl','noodle'],['lower_fat'],'อกไก่สับให้โปรตีนใกล้เคียง ไขมันต่ำกว่าหมูสับมาก'),
  R('pork_mince','tofu_firm','balanced',['soup','stir-fry','rice-bowl','noodle'],['vegetarian','lower_fat'],'เต้าหู้แข็งขยี้แทนหมูสับ ไขมันต่ำและเป็นมังสวิรัติ'),
  R('beef_lean','chicken_breast','protein',['stir-fry','grill','salad','rice-bowl'],['lower_fat','budget_friendly'],'อกไก่หั่นบางผัด/ย่างแทนได้ ไขมันต่ำกว่าและถูกกว่าเนื้อวัว'),
  R('beef_lean','tofu_firm','balanced',['stir-fry','grill','rice-bowl'],['vegetarian','budget_friendly'],'ไม่กินเนื้อวัว? เต้าหู้แข็งหรือเทมเป้ผัดแทนได้'),
  R('beef_lean','pork_loin','protein',['stir-fry','grill','salad'],['budget_friendly'],'ไม่ทานเนื้อวัว? ใช้สันในหมูหั่นบางแทน นุ่มและไขมันต่ำ'),
  R('shrimp','tofu_silken','balanced',['soup','steamed','noodle'],['vegetarian','seafood_free'],'แพ้อาหารทะเล? ใช้เต้าหู้อ่อนแทนกุ้ง ได้โปรตีนใกล้เคียงและเนื้อนุ่ม'),
  R('shrimp','chicken_breast','protein',['stir-fry','soup','salad','noodle'],['seafood_free','budget_friendly'],'แพ้อาหารทะเล? ใช้อกไก่หั่นชิ้นแทนกุ้ง โปรตีนสูงเท่ากัน'),
  R('salmon','chicken_breast','protein',['salad','steamed','grill','rice-bowl'],['lower_fat','budget_friendly','seafood_free'],'อกไก่ให้โปรตีนเท่ากัน ไขมันต่ำกว่าและราคาถูกกว่าแซลมอนมาก'),
  R('salmon','tilapia','protein',['steamed','grill','rice-bowl'],['lower_fat','budget_friendly'],'ปลานิลให้โปรตีนสูง ไขมันต่ำ และประหยัดงบกว่าแซลมอนหลายเท่า'),
  R('seabass','chicken_breast','protein',['steamed','soup','grill'],['budget_friendly','seafood_free'],'อกไก่ให้โปรตีนใกล้เคียงปลา ราคาประหยัดกว่าและปลอดอาหารทะเล'),
  R('seabass','tilapia','protein',['steamed','soup','grill'],['budget_friendly'],'ปลานิลเนื้อนุ่มคล้ายปลากะพง โปรตีนเท่ากันในราคาประหยัดกว่าครึ่ง'),
  R('seabass','tofu_silken','balanced',['steamed','soup'],['vegetarian','seafood_free'],'เต้าหู้อ่อนนึ่งได้เนื้อนุ่มคล้ายปลา และไม่มีอาหารทะเล'),
  R('tilapia','tofu_firm','balanced',['steamed','grill','soup'],['vegetarian','seafood_free'],'แพ้ปลา? ใช้เต้าหู้ขาวแข็งนึ่งหรือย่างแทนได้'),
  R('mackerel','chicken_breast','protein',['grill','salad','rice-bowl'],['seafood_free','lower_fat'],'แพ้อาหารทะเล? ใช้อกไก่ย่างหรือฉีกฝอยแทนปลาทูได้'),
  R('canned_tuna','chicken_breast','protein',['salad','rice-bowl','breakfast'],['seafood_free','lower_sodium'],'อกไก่ต้มฉีกแทนทูน่ากระป๋อง ลดโซเดียมลงและปลอดอาหารทะเล'),
  R('canned_tuna','tofu_firm','balanced',['salad','rice-bowl'],['vegetarian','seafood_free','lower_sodium'],'ใช้เต้าหู้แข็งบี้คลุกแทนทูน่า ลดโซเดียมและเป็นมังสวิรัติ'),
  R('tempeh','tofu_firm','balanced',['stir-fry','grill','salad','rice-bowl'],['budget_friendly'],'ไม่มีเทมเป้? ใช้เต้าหู้ขาวแข็งแทน หาซื้อง่ายและถูกกว่า'),
  R('tempeh','chicken_breast','protein',['stir-fry','grill','rice-bowl'],['high_protein'],'สลับเป็นอกไก่ หากต้องการเพิ่มโปรตีนล้วนและลดไขมัน'),
  R('egg','egg_white','protein',['rice-bowl','breakfast','stir-fry','soup'],['lower_fat'],'ไข่ขาวให้โปรตีนใกล้เคียง แต่ไม่มีไขมันและคอเลสเตอรอลจากไข่แดง'),
  R('egg','tofu_silken','balanced',['soup','steamed','breakfast'],['vegetarian','cholesterol_free'],'ใช้เต้าหู้อ่อนแทนไข่ ได้เนื้อสัมผัสนุ่มละมุนและไม่มีคอเลสเตอรอล'),
  R('jasmine_rice','brown_rice','calories',['rice-bowl','stir-fry','soup','breakfast','curry','steamed','grill','salad'],['higher_fiber','low_glycemic'],'ข้าวกล้องมีไฟเบอร์มากกว่า ช่วยให้อิ่มนานและน้ำตาลขึ้นช้ากว่า'),
  R('jasmine_rice','rice_berry','calories',['rice-bowl','stir-fry','grill','curry','salad'],['higher_fiber','antioxidant'],'ข้าวไรซ์เบอร์รี่มีใยอาหารสูงและสารต้านอนุมูลอิสระ ช่วยคุมน้ำตาล'),
  R('brown_rice','jasmine_rice','calories',['rice-bowl','stir-fry','soup','breakfast','curry','grill','salad'],['easy_digest'],'ไม่มีข้าวกล้อง? ใช้ข้าวหอมมะลิแทนได้ ย่อยง่ายกว่าในปริมาณแคลอรีเท่ากัน'),
  R('rice_berry','brown_rice','calories',['rice-bowl','stir-fry','grill','curry','salad'],['budget_friendly'],'ใช้ข้าวกล้องแทนข้าวไรซ์เบอร์รี่ ได้กากใยใกล้เคียงในราคาประหยัดกว่า'),
  R('glass_noodle','konjac_noodle',1,['soup','salad','noodle'],['lower_carb'],'เส้นบุกแคลอรีต่ำมาก เหมาะกับช่วงลดน้ำหนักและคุมน้ำตาล'),
  R('rice_noodle','konjac_noodle',1,['soup','stir-fry','noodle'],['lower_carb','low_glycemic'],'สลับเป็นเส้นบุก ลดคาร์บและแคลอรีได้เกือบทั้งหมด'),
  R('rice_noodle','glass_noodle','calories',['soup','noodle'],['lower_glycemic'],'วุ้นเส้นมีค่าดัชนีน้ำตาลต่ำกว่าเส้นก๋วยเตี๋ยวทั่วไป'),
  R('oats','brown_rice','calories',['breakfast','soup'],['gluten_free'],'แพ้กลูเตนหรือไม่มีข้าวโอ๊ต? ใช้ข้าวกล้องต้มแทนได้'),
  R('fish_sauce','light_soy',1,ALL_STYLES,['lower_sodium','seafood_free','vegetarian'],'ซีอิ๊วลดโซเดียมแทนน้ำปลา ลดโซเดียมลงกว่าครึ่งและปลอดอาหารทะเล'),
  R('oyster_sauce_low','light_soy',1,ALL_STYLES,['seafood_free','vegetarian'],'แพ้อาหารทะเล? ใช้ซีอิ๊วลดโซเดียมแทนซอสหอยนางรม'),
  R('greek_yogurt','tofu_silken','balanced',['breakfast','salad'],['dairy_free','vegetarian'],'แพ้นม? เต้าหู้อ่อนปั่นเนียนแทนโยเกิร์ตได้ ไม่มีแลคโตส'),
  R('peanut_butter','avocado','calories',['breakfast','salad'],['nut_free'],'แพ้ถั่ว? ใช้อะโวคาโดบดแทนเนยถั่ว ได้ไขมันดีและเนื้อครีมมี่เหมือนกัน'),
  R('cashew','avocado','calories',['breakfast','stir-fry','salad'],['nut_free'],'แพ้ถั่ว? เปลี่ยนเม็ดมะม่วงเป็นอะโวคาโดเพื่อรับไขมันดีโดยไม่มีถั่ว')
]

export const SUB_MAP=Object.fromEntries(SUBSTITUTIONS.map(r=>[r.id,r]))
export const rulesFor=(ingId,style)=>SUBSTITUTIONS.filter(r=>r.sourceIngredientId===ingId&&r.compatibleDishStyles.includes(style))
