import {ING_MAP} from './mockIngredients'

const ALL=['seafood','nuts','dairy','gluten','soy']
const BASE=(typeof import.meta!=='undefined'&&import.meta.env?.BASE_URL)||'/'

/**
 * Derives allergens, vegetarian status, and default dishStyle fallback imageUrl
 * directly from MasterIngredients so community recipes share the exact same
 * nutritional & safety guarantees as core dishes.
 */
export const deriveCommunityMeal=m=>{
  const validLines=(m.ingredients||[]).filter(l=>ING_MAP[l.ingredientId])
  const a=new Set(validLines.flatMap(l=>ING_MAP[l.ingredientId].allergenFlags))
  const style=m.dishStyle||'rice-bowl'
  return{
    ...m,
    isCommunity:true,
    dishStyle:style,
    imageUrl:m.imageUrl?.trim()||`${BASE}dishes/${style}.svg`,
    ingredients:validLines,
    allergens:[...a],
    excludedAllergens:ALL.filter(x=>!a.has(x)),
    isVegetarian:!validLines.some(l=>ING_MAP[l.ingredientId].isAnimal)
  }
}

const CM=(id,nameTh,dishStyle,mealTiming,equipment,prepTimeMins,spiceLevel,healthGoals,author,captionTh,likes,createdAt,lines,stepsTh)=>
  deriveCommunityMeal({
    id,
    nameTh,
    dishStyle,
    mealTiming,
    equipment,
    prepTimeMins,
    spiceLevel,
    glycemicLoad:'low',
    healthGoals,
    mealPrepFriendly:true,
    author,
    captionTh,
    likes,
    createdAt,
    ingredients:lines.map(([ingredientId,grams])=>({ingredientId,grams})),
    stepsTh
  })

/**
 * Seeded Thai community recipes from mock creators.
 * Every dish references MasterIngredients so calories, protein, carbs, fat,
 * sodium, sugar, and cost compute dynamically via `totals()` and `scaleMeal()`.
 */
export const MOCK_COMMUNITY_MEALS=[
  CM(
    'cm1',
    'ข้าวยำทูน่าอะโวคาโดคลีน',
    'rice-bowl',
    ['lunch','dinner'],
    ['no_cook'],
    10,
    1,
    ['lose','protein','clean','lowNa'],
    {name:'@พลอยสายเฮลตี้',avatar:'🥗'},
    'เมนูเด็กคอนโดไม่ต้องเปิดเตา ได้ไขมันดีจากอะโวคาโดกับโปรตีนแน่นๆ จากทูน่าในน้ำแร่',
    42,
    '2026-11-26T09:30:00Z',
    [['canned_tuna',115],['avocado',60],['rice_berry',140],['cucumber',60],['tomato',50],['lime',15],['chili',2],['light_soy',6]],
    [
      'บีบน้ำแร่ออกจากทูน่าให้พอหมาด วางบนข้าวไรซ์เบอร์รี่อุ่นๆ',
      'หั่นอะโวคาโด แตงกวา และมะเขือเทศจัดเรียงรอบชาม',
      'คลุกน้ำมะนาว พริกซอย และซีอิ๊วลดโซเดียมราดก่อนทาน อร่อยสดชื่นมาก'
    ]
  ),
  CM(
    'cm2',
    'ไข่คนเต้าหู้อ่อนไมโครเวฟ 5 นาที',
    'breakfast',
    ['breakfast','lunch'],
    ['microwave'],
    5,
    0,
    ['lose','protein','lowNa','sugar','clean'],
    {name:'@บอสเด็กหอ',avatar:'🍳'},
    'เช้าวันรีบๆ ใช้แค่ชามใบเดียวกับไมโครเวฟ นุ่มละมุนเหมือนกินที่คาเฟ่',
    35,
    '2026-11-25T23:15:00Z',
    [['egg',100],['tofu_silken',120],['whole_wheat_bread',60],['tomato',60],['light_soy',5],['black_pepper',1]],
    [
      'ตีไข่ไก่กับซีอิ๊วลดโซเดียมและพริกไทยดำในชามทนความร้อน ใส่เต้าหู้อ่อนหั่นเต๋าลงไป',
      'นำเข้าไมโครเวฟ 1 นาที คนเบาๆ แล้วเวฟต่ออีก 45 วินาทีจนไข่เซ็ตตัวนุ่ม',
      'เสิร์ฟคู่ขนมปังโฮลวีตปิ้งและมะเขือเทศสด'
    ]
  ),
  CM(
    'cm3',
    'อกไก่หมักพริกไทยดำหม้อทอด',
    'grill',
    ['lunch','dinner'],
    ['air_fryer'],
    18,
    1,
    ['muscle','protein','lowFat','lowNa'],
    {name:'@นัทสายเวท',avatar:'🧑‍🍳'},
    'สูตรอกไก่นุ่มไม่แห้งฝืดคอ ใส่กระเทียมกับพริกไทยดำเยอะๆ หอมฟุ้งทั้งบ้าน',
    58,
    '2026-11-25T12:40:00Z',
    [['chicken_breast',150],['sweet_potato',160],['broccoli',100],['garlic',8],['black_pepper',2],['light_soy',6],['olive_oil',4]],
    [
      'คลุกอกไก่กับกระเทียมสับ พริกไทยดำ ซีอิ๊วลดโซเดียม และน้ำมันมะกอกเล็กน้อย',
      'วางมันหวานและบรอกโคลีลงในหม้อทอดไร้น้ำมัน อบที่ 180°C นาน 14 นาที (กลับด้านตอนนาทีที่ 8)',
      'พักอกไก่ 3 นาทีก่อนหั่นเพื่อให้เนื้อฉ่ำไม่เสียความชุ่มชื้น'
    ]
  ),
  CM(
    'cm4',
    'ผัดเส้นบุกอกไก่ซอสกะเพรา',
    'noodle',
    ['lunch','dinner'],
    ['stove'],
    12,
    2,
    ['lose','sugar','lowFat','protein'],
    {name:'@เชฟมินิมอล',avatar:'🌿'},
    'อยากกินก๋วยเตี๋ยวผัดแบบแคลเบาๆ ใช้เส้นบุกล้างน้ำดีๆ ผัดไฟแรงหอมใบกะเพรา',
    29,
    '2026-11-24T17:10:00Z',
    [['konjac_noodle',180],['chicken_breast',125],['holy_basil',25],['kale',70],['garlic',8],['chili',4],['oyster_sauce_low',8],['light_soy',6]],
    [
      'ล้างเส้นบุกด้วยน้ำสะอาดและลวกน้ำร้อน 1 นาทีเพื่อลดกลิ่น จากนั้นพักให้สะเด็ดน้ำ',
      'ผัดพริกกระเทียมกับน้ำเปล่าเล็กน้อย ใส่อกไก่รวนจนสุก',
      'ใส่คะน้า เส้นบุก ซอสหอยนางรมและซีอิ๊วลดโซเดียม ผัดเร็วๆ แล้วใส่ใบกะเพราปิดท้าย'
    ]
  ),
  CM(
    'cm5',
    'ซุปฟักทองเต้าหู้ขาวอบอุ่นท้อง',
    'soup',
    ['lunch','dinner'],
    ['stove'],
    20,
    0,
    ['lose','lowNa','sugar','clean'],
    {name:'@ต้นรักผัก',avatar:'🥑'},
    'มังสวิรัติทานได้ อิ่มสบายท้องมื้อเย็น โซเดียมต่ำมากแต่รสหวานธรรมชาติจากฟักทอง',
    24,
    '2026-11-24T08:00:00Z',
    [['pumpkin',180],['tofu_firm',150],['mushroom',70],['broth_stock',180],['ginger',10],['light_soy',5],['black_pepper',1]],
    [
      'ต้มน้ำซุปใสกับขิงซอยและฟักทองหั่นชิ้นจนฟักทองนุ่มกำลังดี',
      'ใส่เห็ดฟางและเต้าหู้ขาวแข็งหั่นเต๋า ต้มต่ออีก 4 นาที',
      'ปรุงรสด้วยซีอิ๊วลดโซเดียมเล็กน้อยและพริกไทยดำ เสิร์ฟร้อนๆ'
    ]
  ),
  CM(
    'cm6',
    'แกงเขียวหวานกะทิไลท์ปลากะพง',
    'curry',
    ['lunch','dinner'],
    ['stove'],
    20,
    2,
    ['protein','lowFat','clean'],
    {name:'@เมย์คุมโซเดียม',avatar:'🍲'},
    'อยากกินแกงไทยแบบไม่รู้สึกผิด ใช้กะทิธัญพืชไลท์แทนกะทิสด ลดไขมันอิ่มตัวได้เยอะ',
    31,
    '2026-11-23T11:20:00Z',
    [['seabass',135],['coconut_milk_light',60],['curry_paste',15],['mixed_veg',110],['holy_basil',15],['brown_rice',130],['palm_sugar',2]],
    [
      'ผัดพริกแกงกับกะทิไลท์ 2 ช้อนโต๊ะจนเริ่มหอม จากนั้นเติมกะทิที่เหลือและน้ำเปล่าเล็กน้อย',
      'พอเดือดใส่เนื้อปลากะพงและผักรวม ต้มเบาๆ ห้ามคนแรงเพื่อไม่ให้ปลาเละ',
      'ปรุงด้วยน้ำตาลมะพร้าวปลายช้อน ใส่ใบกะเพราหรือโหระพา เสิร์ฟคู่ข้าวกล้อง'
    ]
  ),
  CM(
    'cm7',
    'โอเวอร์ไนท์โอ๊ตกล้วยเนยถั่วคลีน',
    'breakfast',
    ['breakfast'],
    ['no_cook'],
    5,
    0,
    ['gain','protein','clean'],
    {name:'@แพรวครัวคอนโด',avatar:'🥣'},
    'เตรียมไว้ก่อนนอน 5 นาที เช้ามาหยิบกินได้เลย พลังงานดีสำหรับคนเพิ่มกล้ามหรือสายออกกำลัง',
    47,
    '2026-11-22T20:00:00Z',
    [['oats',45],['greek_yogurt',140],['banana',100],['peanut_butter',16]],
    [
      'ผสมข้าวโอ๊ตกับโยเกิร์ตกรีกและน้ำเปล่าเล็กน้อยในขวดโหล คนให้เข้ากัน',
      'หั่นกล้วยหอมวางด้านบนและป้ายเนยถั่วคลีนปิดท้าย',
      'แช่ตู้เย็นข้ามคืนอย่างน้อย 4 ชั่วโมง เช้ามาพร้อมทานทันที'
    ]
  )
]
