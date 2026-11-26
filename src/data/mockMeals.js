import {ING_MAP} from './mockIngredients'

const ALL=['seafood','nuts','dairy','gluten','soy']

const derive=m=>{
  const a=new Set(m.ingredients.flatMap(l=>ING_MAP[l.ingredientId].allergenFlags))
  return{...m,allergens:[...a],excludedAllergens:ALL.filter(x=>!a.has(x)),
    isVegetarian:!m.ingredients.some(l=>ING_MAP[l.ingredientId].isAnimal)}
}

const M=(id,nameTh,dishStyle,mealTiming,equipment,prepTimeMins,spiceLevel,glycemicLoad,healthGoals,mealPrepFriendly,lines,stepsTh)=>
  derive({id,nameTh,dishStyle,mealTiming,equipment,prepTimeMins,spiceLevel,glycemicLoad,healthGoals,mealPrepFriendly,
    ingredients:lines.map(([ingredientId,grams])=>({ingredientId,grams})),stepsTh})

const LD=['lunch','dinner']

export const MEALS=[
  M('m1','ผัดกะเพราอกไก่คลีน','stir-fry',LD,['stove'],15,2,'low',['muscle','protein','lowNa','lose','clean'],false,
    [['chicken_breast',180],['jasmine_rice',150],['holy_basil',25],['garlic',8],['chili',5],['light_soy',5]],
    ['หั่นอกไก่เป็นชิ้นพอดีคำ ล้างใบกะเพราให้สะอาด แล้วโขลกพริกและกระเทียมพอหยาบ','ตั้งกระทะไฟกลาง เติมน้ำเปล่าเล็กน้อยแทนน้ำมัน ผัดพริกกระเทียมจนหอม แล้วใส่อกไก่ลงรวนจนสุกนุ่มทั่วกัน','ปรุงรสด้วยซีอิ๊วลดโซเดียม ใส่ใบกะเพราผัดเร็วๆ ปิดไฟแล้วตักเสิร์ฟคู่ข้าวหอมมะลิร้อนๆ']),
  M('m2','ต้มยำน้ำใสกุ้ง','soup',LD,['stove'],15,2,'low',['lose','lowFat','sugar','clean'],false,
    [['shrimp',150],['mushroom',100],['herbs',30],['lime',15],['fish_sauce',6],['chili',3],['jasmine_rice',100]],
    ['ต้มน้ำเปล่าพร้อมตะไคร้ ข่า และใบมะกรูดจนหอม','ใส่เห็ดและกุ้ง ต้มต่ออีก 3 นาทีจนกุ้งสุก','ปรุงรสด้วยน้ำมะนาว พริก และน้ำปลาเล็กน้อย ปิดไฟแล้วเสิร์ฟร้อนๆ คู่ข้าวสวย']),
  M('m3','ยำปลาแซลมอน','salad',LD,['no_cook'],10,1,'low',['protein','sugar','clean','lowFat'],false,
    [['salmon',120],['salad',100],['tomato',60],['lime',20],['fish_sauce',5],['chili',3],['garlic',4],['brown_rice',100]],
    ['หั่นแซลมอนเป็นชิ้นพอดีคำ ล้างผักและพักให้สะเด็ดน้ำ','ผสมมะนาว น้ำปลา พริก และกระเทียมซอยเป็นน้ำยำ','คลุกแซลมอนกับผักและน้ำยำเบาๆ เสิร์ฟคู่ข้าวกล้อง']),
  M('m4','ผัดเต้าหู้ผักรวม','stir-fry',LD,['stove'],15,0,'low',['lose','lowNa','sugar','clean'],true,
    [['tofu_firm',200],['mixed_veg',150],['jasmine_rice',120],['garlic',6],['light_soy',6],['rice_bran_oil',5]],
    ['หั่นเต้าหู้เป็นลูกเต๋า ล้างและหั่นผักตามชอบ','ผัดเต้าหู้ในกระทะจนเหลืองอ่อน พักไว้','ผัดกระเทียมกับผัก ใส่เต้าหู้และซีอิ๊วลดโซเดียม ผัดไฟแรงให้ผักยังกรอบ แล้วตักเสิร์ฟ']),
  M('m5','ปลานึ่งมะนาว','steamed',LD,['microwave'],20,2,'low',['lose','protein','lowFat','muscle'],false,
    [['seabass',200],['napa',80],['lime',25],['garlic',8],['chili',4],['fish_sauce',4],['brown_rice',120]],
    ['วางผักกาดขาวรองจาน แล้ววางชิ้นปลาทับ','นึ่งหรือเข้าไมโครเวฟจนปลาสุก ประมาณ 6–8 นาที','ราดน้ำมะนาว พริก กระเทียมสับ และน้ำปลา แล้วเสิร์ฟคู่ข้าวกล้อง']),
  M('m6','สุกี้น้ำอกไก่','soup',LD,['stove'],15,0,'medium',['lose','lowFat','protein'],false,
    [['chicken_breast',120],['glass_noodle',150],['napa',120],['mushroom',50],['light_soy',5],['garlic',4]],
    ['ต้มน้ำซุปใสให้เดือด แช่วุ้นเส้นให้นุ่ม','ใส่อกไก่หั่นบางและผัก ต้มจนสุก','ปรุงรสด้วยซีอิ๊วขาวลดโซเดียมเล็กน้อย แล้วตักเสิร์ฟ']),
  M('m7','แกงจืดเต้าหู้หมูสับ','soup',LD,['stove'],20,0,'low',['lose','sugar'],true,
    [['pork_mince',80],['tofu_silken',150],['napa',100],['light_soy',4],['garlic',4],['jasmine_rice',100]],
    ['ต้มน้ำซุปใสให้เดือด ปั้นหมูสับเป็นก้อนเล็ก','ใส่หมูและเต้าหู้ ต้มจนสุก','ใส่ผัก ปรุงรสด้วยซีอิ๊วขาวและพริกไทย แล้วเสิร์ฟคู่ข้าวสวย']),
  M('m8','ข้าวผัดไข่คลีน','rice-bowl',['breakfast','lunch'],['stove'],15,0,'medium',['gain','clean'],true,
    [['egg',100],['brown_rice',180],['mixed_veg',60],['garlic',4],['light_soy',5],['rice_bran_oil',5]],
    ['ตีไข่และเตรียมข้าวให้ร่วน','ผัดไข่ในกระทะเคลือบจนสุกครึ่งหนึ่ง ใส่ข้าวและผัดให้เข้ากัน','ใส่ผัก ปรุงรสด้วยซีอิ๊วลดโซเดียมและพริกไทย ตักเสิร์ฟ']),
  M('m9','สมุนไพรอกไก่ย่าง','grill',LD,['air_fryer'],25,0,'low',['muscle','protein','lowNa','lowFat'],true,
    [['chicken_breast',200],['herbs',10],['garlic',8],['mixed_veg',120],['sweet_potato',120]],
    ['หมักอกไก่กับสมุนไพรและกระเทียม 15 นาที','เข้าหม้อทอดไร้น้ำมัน 180 องศา 15 นาที พลิกกลับครึ่งทาง','พักไก่ 3 นาที หั่นเสิร์ฟกับผักและมันหวานอบ']),
  M('m10','ข้าวต้มอกไก่','soup',['breakfast'],['stove'],20,0,'medium',['lose','lowFat','lowNa'],true,
    [['chicken_breast',100],['jasmine_rice',150],['egg',50],['mixed_veg',40],['light_soy',4],['garlic',4]],
    ['ต้มน้ำให้เดือด ใส่ข้าวสวยลงต้มจนเม็ดข้าวนุ่ม','ใส่อกไก่หั่นบางและผัก ต้มจนสุก ตอกไข่ลงเคี่ยวสั้นๆ','ปรุงรสด้วยซีอิ๊วลดโซเดียม โรยกระเทียมสับ แล้วเสิร์ฟร้อนๆ']),
  M('m11','ไข่ตุ๋นเต้าหู้อ่อน','steamed',['breakfast'],['microwave'],10,0,'low',['protein','lowNa','clean'],false,
    [['egg',100],['tofu_silken',150],['mixed_veg',50],['light_soy',5],['brown_rice',120]],
    ['ตีไข่กับน้ำเล็กน้อย ผสมเต้าหู้อ่อนและผักหั่นละเอียด','เข้าไมโครเวฟทีละ 1 นาที จนไข่เซ็ตตัว','ราดซีอิ๊วลดโซเดียมเล็กน้อย เสิร์ฟคู่ข้าวกล้อง']),
  M('m12','มันหวานโยเกิร์ตกรีกโรยเม็ดมะม่วง','breakfast',['breakfast'],['microwave'],10,0,'low',['gain','protein','sugar'],true,
    [['sweet_potato',200],['greek_yogurt',150],['cashew',15]],
    ['นึ่งหรืออุ่นมันหวานในไมโครเวฟจนนุ่ม','ตักโยเกิร์ตกรีกราดบนมันหวาน','โรยเม็ดมะม่วงหิมพานต์สับ แล้วเสิร์ฟ']),
  M('m13','เนื้อผัดกระเทียมพริกไทย','stir-fry',LD,['stove'],15,1,'low',['muscle','protein'],false,
    [['beef_lean',150],['mixed_veg',120],['brown_rice',130],['garlic',12],['light_soy',6],['chili',3],['olive_oil',5]],
    ['หั่นเนื้อวัวเป็นชิ้นบาง หมักกับซีอิ๊วลดโซเดียม','ผัดกระเทียมและพริกกับน้ำมันมะกอกจนหอม ใส่เนื้อผัดไฟแรง','ใส่ผักผัดพอสุก ตักเสิร์ฟคู่ข้าวกล้อง'])
]
