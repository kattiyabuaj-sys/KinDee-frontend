import {ING_MAP} from '../data/mockIngredients'

export const CARB_OPTIONS=[
  {id:'rice_15',label:'ข้าวสวย 1 จาน',short:'ข้าวสวย',lines:[['jasmine_rice',160]]},
  {id:'rice_1',label:'ข้าวสวย 1 ทัพพี',short:'ข้าวสวยครึ่งจาน',lines:[['jasmine_rice',100]]},
  {id:'brown_rice',label:'ข้าวกล้อง 1 จาน',short:'ข้าวกล้อง',lines:[['brown_rice',150]]},
  {id:'sticky_rice',label:'ข้าวเหนียว 1 ห่อ',short:'ข้าวเหนียว',lines:[['sticky_rice',110]]},
  {id:'noodle',label:'เส้นก๋วยเตี๋ยว/หมี่',short:'เส้นก๋วยเตี๋ยว',lines:[['rice_noodle',140]]},
  {id:'no_carb',label:'ไม่ใส่แป้ง',short:'',lines:[]}
]

export const PROTEIN_OPTIONS=[
  {id:'chicken',label:'ไก่ต้ม / ไก่ย่าง',short:'ไก่',lines:[['chicken_breast',120]]},
  {id:'pork',label:'หมูสับ / หมูชิ้น',short:'หมู',lines:[['pork_loin',110]]},
  {id:'boiled_egg',label:'ไข่ต้ม (2 ฟอง)',short:'ไข่ต้ม',lines:[['egg',100]]},
  {id:'fried_egg',label:'ไข่ดาว / ไข่เจียว',short:'ไข่ดาว/เจียว',lines:[['egg',100],['rice_bran_oil',8]]},
  {id:'fish',label:'ปลาต้ม / ปลาย่าง',short:'ปลา',lines:[['tilapia',130]]},
  {id:'tofu',label:'เต้าหู้ขาว',short:'เต้าหู้',lines:[['tofu_firm',150]]},
  {id:'none',label:'ไม่ใส่โปรตีนเพิ่ม',short:'',lines:[]}
]

export const PORTION_SCALES=[
  {id:.5,label:'น้อย (0.5x)'},
  {id:1,label:'ปกติ (1x)'},
  {id:1.5,label:'พิเศษ (1.5x)'}
]

/**
 * Cooking style & sauce/broth adjustments add realistic oil absorption,
 * seasoning sodium, and glaze/sauce sugar from Master Ingredients.
 */
export const STYLE_OPTIONS=[
  {id:'boiled',label:'ต้ม / นึ่ง / ลวก',short:'ต้ม/นึ่ง',lines:[['light_soy',6]]},
  {id:'stir_fried',label:'ผัดน้ำมันปกติ',short:'ผัด',lines:[['rice_bran_oil',10],['oyster_sauce_low',10],['light_soy',8],['palm_sugar',3]]},
  {id:'deep_fried',label:'ทอดกรอบ / ราดซอส',short:'ทอด/ราดซอส',lines:[['rice_bran_oil',18],['light_soy',8],['palm_sugar',5]]},
  {id:'soup',label:'น้ำซุป / น้ำราดปรุงรส',short:'น้ำซุป/ราด',lines:[['broth_stock',220],['fish_sauce',6],['palm_sugar',3],['rice_bran_oil',2]]}
]

export const EXTRA_OPTIONS=[
  {id:'veg_fresh',label:'ผักต้ม / ผักสด',short:'ผักสด',lines:[['mixed_veg',100]]},
  {id:'veg_stir',label:'ผักผัด (คะน้า/บุ้ง)',short:'ผักผัด',lines:[['kale',100],['rice_bran_oil',3]]},
  {id:'extra_egg',label:'+ ไข่ต้ม 1 ฟอง',short:'ไข่ต้ม',lines:[['egg',50]]},
  {id:'sweet_drink',label:'เครื่องดื่มหวานน้อย',short:'เครื่องดื่ม',lines:[['palm_sugar',14],['coconut_milk_light',40]]},
  {id:'fruit',label:'ผลไม้ 1 ส่วน',short:'ผลไม้',lines:[['banana',80]]}
]

export const BUILDER_PRESETS=[
  {id:'p1',label:'ข้าวมันไก่ต้มไม่หนัง',state:{carb:'rice_15',protein:'chicken',scale:1,style:'boiled',extras:['veg_fresh']}},
  {id:'p2',label:'ก๋วยเตี๋ยวหมูน้ำใส',state:{carb:'noodle',protein:'pork',scale:1,style:'soup',extras:['veg_fresh']}},
  {id:'p3',label:'กะเพราหมูไข่ดาว',state:{carb:'rice_15',protein:'pork',scale:1,style:'stir_fried',extras:['extra_egg']}},
  {id:'p4',label:'ข้าวเหนียวไก่ย่างส้มตำ',state:{carb:'sticky_rice',protein:'chicken',scale:1,style:'boiled',extras:['veg_fresh']}}
]

const sumLines=lines=>{
  const tot={cal:0,p:0,c:0,f:0,na:0,s:0,cost:0}
  for(const [id,grams] of lines){
    const ing=ING_MAP[id]
    if(!ing)continue
    const factor=grams/100,n=ing.nutritionPer100g
    tot.cal+=n.calories*factor
    tot.p+=n.proteinG*factor
    tot.c+=n.carbsG*factor
    tot.f+=n.fatG*factor
    tot.na+=n.sodiumMg*factor
    tot.s+=n.sugarG*factor
    tot.cost+=ing.estimatedCostThbPer100g*factor
  }
  return Object.fromEntries(Object.entries(tot).map(([k,v])=>[k,Math.round(v)]))
}

export const buildMealNutrition=({carb,protein,scale,style,extras})=>{
  const cObj=CARB_OPTIONS.find(x=>x.id===carb)
  const pObj=PROTEIN_OPTIONS.find(x=>x.id===protein)
  const sObj=STYLE_OPTIONS.find(x=>x.id===style)
  const eObjs=EXTRA_OPTIONS.filter(x=>extras.includes(x.id))

  const protLines=(pObj?.lines||[]).map(([id,g])=>[id,g*scale])
  const lines=[
    ...(cObj?.lines||[]),
    ...protLines,
    ...(sObj?.lines||[]),
    ...eObjs.flatMap(e=>e.lines)
  ]

  const parts=[cObj?.short,pObj?.short?`${pObj.short}${scale!==1?` (${scale}x)`:''}`:'',...eObjs.map(e=>e.short)].filter(Boolean)
  const autoName=parts.length
    ?`${parts.join(' + ')}${sObj?.short?` (${sObj.short})`:''}`
    :'มื้ออาหารประกอบเอง'

  return{nutrition:sumLines(lines),autoName}
}
