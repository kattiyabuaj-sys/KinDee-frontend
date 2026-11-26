const N=(calories,proteinG,carbsG,fatG,sodiumMg,sugarG)=>({calories,proteinG,carbsG,fatG,sodiumMg,sugarG})
const X=(id,nameTh,category,n,cost,du='กรัม',units=[],flags=[],isAnimal=false)=>({
  id,nameTh,category,nutritionPer100g:N(...n),
  standardUnits:[{unit:'กรัม',grams:1},...units.map(([unit,grams])=>({unit,grams}))],
  defaultUnit:du,estimatedCostThbPer100g:cost,allergenFlags:flags,isAnimal
})

/**
 * Master Thai ingredients per 100g (modeled after Thai Bureau of Nutrition / Department of Health standards).
 * Explicit sodium (sauces, seasoning powders, broths) and sugar (added sugars, glazes, natural sugars) are included.
 */
export const INGREDIENTS=[
  // Proteins
  X('chicken_breast','อกไก่ลอกหนัง','protein',[115,22.5,0,2.2,65,0],14,'กรัม',[],[],true),
  X('chicken_thigh','สะโพกไก่ไม่ติดหนัง','protein',[165,19.5,0,9.2,85,0],12,'กรัม',[],[],true),
  X('pork_mince','หมูสับ','protein',[210,17.5,0,15,72,0],18,'กรัม',[],[],true),
  X('pork_loin','สันในหมู','protein',[140,21,0,3.5,58,0],20,'กรัม',[],[],true),
  X('beef_lean','เนื้อวัวสันนอก','protein',[150,22,0,6,62,0],45,'กรัม',[],[],true),
  X('salmon','แซลมอนสด','protein',[205,20,0,13,60,0],70,'กรัม',[],['seafood'],true),
  X('seabass','ปลากะพง','protein',[97,18.5,0,2,70,0],35,'กรัม',[],['seafood'],true),
  X('tilapia','ปลานิล','protein',[96,19.5,0,1.7,52,0],14,'กรัม',[],['seafood'],true),
  X('mackerel','ปลาทู','protein',[165,19,0,9.2,90,0],15,'กรัม',[],['seafood'],true),
  X('canned_tuna','ทูน่าในน้ำแร่','protein',[108,23.5,0,.8,240,0],26,'กรัม',[],['seafood'],true),
  X('shrimp','กุ้งสด','protein',[98,21,.2,.5,115,0],38,'กรัม',[],['seafood'],true),
  X('egg','ไข่ไก่','protein',[143,12.6,.7,9.5,142,.4],10,'ฟอง',[['ฟอง',50]]),
  X('egg_white','ไข่ขาว','protein',[52,11,.7,.2,166,.7],10,'ฟอง',[['ฟอง',33]]),
  X('tofu_firm','เต้าหู้ขาวแข็ง','protein',[110,12,2.5,6.5,15,.6],8,'กรัม',[],['soy']),
  X('tofu_silken','เต้าหู้อ่อน','protein',[55,5,2,3,7,1],8,'กรัม',[],['soy']),
  X('tempeh','เทมเป้','protein',[192,19.5,7.6,10.8,9,0],22,'กรัม',[],['soy']),
  X('edamame','ถั่วแระญี่ปุ่น','protein',[121,11.9,8.9,5.2,6,2.2],18,'กรัม',[],['soy']),
  X('greek_yogurt','โยเกิร์ตกรีก','protein',[59,10,3.6,.4,36,3.6],25,'กรัม',[['ช้อนโต๊ะ',18]],['dairy']),

  // Carbs
  X('jasmine_rice','ข้าวหอมมะลิหุงสุก','carb',[130,2.7,28,.3,1,0],4),
  X('brown_rice','ข้าวกล้องหุงสุก','carb',[123,2.7,25.6,1,4,.2],6),
  X('rice_berry','ข้าวไรซ์เบอร์รี่หุงสุก','carb',[130,3,27,1,3,.2],7),
  X('sticky_rice','ข้าวเหนียวนึ่ง','carb',[168,3.2,37,.4,3,0],6),
  X('glass_noodle','วุ้นเส้นลวก','carb',[86,.1,21,0,5,0],5),
  X('rice_noodle','เส้นหมี่/เส้นเล็กลวก','carb',[109,1.8,24,.2,6,0],5),
  X('konjac_noodle','เส้นบุก','carb',[8,.1,3,0,5,0],14),
  X('sweet_potato','มันหวานนึ่ง','carb',[86,1.6,20,.1,55,4.2],6,'กรัม',[['หัว',150]]),
  X('oats','ข้าวโอ๊ต','carb',[389,16.9,66.3,6.9,2,0],12,'กรัม',[['ช้อนโต๊ะ',10]],['gluten']),
  X('whole_wheat_bread','ขนมปังโฮลวีต','carb',[247,13,41,3.4,400,4.3],12,'แผ่น',[['แผ่น',30]],['gluten']),
  X('banana','กล้วยหอม','carb',[89,1.1,22.8,.3,1,12.2],8,'ลูก',[['ลูก',100]]),

  // Veggies
  X('holy_basil','ใบกะเพรา','veggie',[25,3,3,.6,4,.3],8,'กำมือ',[['กำมือ',20]]),
  X('mixed_veg','ผักรวม','veggie',[35,2,7,.3,25,3],7),
  X('napa','ผักกาดขาว','veggie',[13,1.5,2.2,.2,65,1.2],4),
  X('kale','คะน้า','veggie',[35,3.3,4.4,.7,40,1],6),
  X('morning_glory','ผักบุ้ง','veggie',[19,2.6,3.1,.2,113,0],4),
  X('broccoli','บรอกโคลี','veggie',[34,2.8,6.6,.4,33,1.7],10),
  X('cabbage','กะหล่ำปลี','veggie',[25,1.3,5.8,.1,18,3.2],4),
  X('cucumber','แตงกวา','veggie',[15,.7,3.6,.1,2,1.7],4),
  X('pumpkin','ฟักทอง','veggie',[26,1,6.5,.1,1,2.8],5),
  X('onion','หอมใหญ่ / หอมแดง','veggie',[40,1.1,9.3,.1,4,4.2],5),
  X('mushroom','เห็ดฟาง','veggie',[35,3.8,5,.4,5,1],10),
  X('salad','ผักสลัดรวม','veggie',[15,1.4,2.9,.2,28,.8],18),
  X('herbs','สมุนไพร (ตะไคร้ ข่า ใบมะกรูด)','veggie',[30,1,7,.5,5,1],12,'กำมือ',[['กำมือ',25]]),
  X('tomato','มะเขือเทศ','veggie',[18,.9,3.9,.2,5,2.6],6),
  X('ginger','ขิงซอย','veggie',[80,1.8,18,.8,13,1.7],8,'ช้อนโต๊ะ',[['ช้อนโต๊ะ',10]]),

  // Seasonings, Broths & Sweeteners (explicit sodium & sugar accounting)
  X('light_soy','ซีอิ๊วลดโซเดียม','seasoning',[60,6,8,0,3000,1],15,'ช้อนชา',[['ช้อนชา',6],['ช้อนโต๊ะ',18]],['soy','gluten']),
  X('oyster_sauce_low','ซอสหอยนางรมลดโซเดียม','seasoning',[55,1.4,12,0,2400,5],15,'ช้อนชา',[['ช้อนชา',6],['ช้อนโต๊ะ',18]],['seafood'],true),
  X('fish_sauce','น้ำปลา','seasoning',[35,5,4,0,7200,3],10,'ช้อนชา',[['ช้อนชา',6],['ช้อนโต๊ะ',18]],['seafood'],true),
  X('seasoning_powder','ผงปรุงรสคลีน','seasoning',[180,8,35,1,16000,12],20,'ช้อนชา',[['ช้อนชา',4]]),
  X('broth_stock','น้ำซุปใสปรุงรส','seasoning',[12,1,1.5,.2,350,.5],4,'กรัม',[['ถ้วย',200]]),
  X('palm_sugar','น้ำตาลมะพร้าว / ซอสหวาน','seasoning',[380,0,95,0,25,92],10,'ช้อนชา',[['ช้อนชา',5]]),
  X('lime','น้ำมะนาว','seasoning',[25,.4,8,0,2,2],15,'ช้อนโต๊ะ',[['ช้อนโต๊ะ',15]]),
  X('garlic','กระเทียม','seasoning',[149,6.4,33,.5,17,1],8,'กลีบ',[['กลีบ',4]]),
  X('chili','พริกขี้หนู','seasoning',[40,2,9,.4,9,5],10,'เม็ด',[['เม็ด',2]]),
  X('black_pepper','พริกไทยดำ','seasoning',[251,10,64,3.3,20,.6],25,'ช้อนชา',[['ช้อนชา',2]]),
  X('curry_paste','พริกแกง','seasoning',[115,3,18,3.5,1600,2.5],18,'ช้อนโต๊ะ',[['ช้อนโต๊ะ',15]]),
  X('roasted_rice','ข้าวคั่ว','seasoning',[360,7,78,1.5,5,0],15,'ช้อนโต๊ะ',[['ช้อนโต๊ะ',10]]),
  X('coconut_milk_light','กะทิธัญพืช / กะทิไลท์','seasoning',[75,1.2,3.5,6.5,25,1.5],12,'ช้อนโต๊ะ',[['ช้อนโต๊ะ',15]]),

  // Fats
  X('rice_bran_oil','น้ำมันรำข้าว','fat',[884,0,0,100,0,0],10,'ช้อนชา',[['ช้อนชา',4.5],['ช้อนโต๊ะ',14]]),
  X('olive_oil','น้ำมันมะกอก','fat',[884,0,0,100,2,0],45,'ช้อนชา',[['ช้อนชา',4.5],['ช้อนโต๊ะ',14]]),
  X('sesame_oil','น้ำมันงา','fat',[884,0,0,100,0,0],30,'ช้อนชา',[['ช้อนชา',4.5]]),
  X('cashew','เม็ดมะม่วงหิมพานต์','fat',[553,18,30,44,12,6],60,'ช้อนโต๊ะ',[['ช้อนโต๊ะ',10]],['nuts']),
  X('peanut_butter','เนยถั่วคลีน','fat',[588,25,20,50,17,3],35,'ช้อนโต๊ะ',[['ช้อนโต๊ะ',16]],['nuts']),
  X('avocado','อะโวคาโด','fat',[160,2,8.5,14.7,7,.7],35,'กรัม',[['ลูก',120]])
]

export const ING_MAP=Object.fromEntries(INGREDIENTS.map(i=>[i.id,i]))
