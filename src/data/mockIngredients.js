const N=(calories,proteinG,carbsG,fatG,sodiumMg,sugarG)=>({calories,proteinG,carbsG,fatG,sodiumMg,sugarG})
const X=(id,nameTh,category,n,cost,du='กรัม',units=[],flags=[],isAnimal=false)=>({
  id,nameTh,category,nutritionPer100g:N(...n),
  standardUnits:[{unit:'กรัม',grams:1},...units.map(([unit,grams])=>({unit,grams}))],
  defaultUnit:du,estimatedCostThbPer100g:cost,allergenFlags:flags,isAnimal
})

export const INGREDIENTS=[
  X('chicken_breast','อกไก่','protein',[120,23,0,2.6,65,0],18,'กรัม',[],[],true),
  X('chicken_thigh','สะโพกไก่ไม่ติดหนัง','protein',[177,20,0,10,85,0],14,'กรัม',[],[],true),
  X('pork_mince','หมูสับ','protein',[210,18,0,15,70,0],22,'กรัม',[],[],true),
  X('beef_lean','เนื้อวัวสันนอก','protein',[150,22,0,6,60,0],45,'กรัม',[],[],true),
  X('salmon','แซลมอนสด','protein',[208,20,0,13,60,0],70,'กรัม',[],['seafood'],true),
  X('seabass','ปลากะพง','protein',[97,18,0,2,70,0],35,'กรัม',[],['seafood'],true),
  X('shrimp','กุ้งสด','protein',[99,24,.2,.3,111,0],40,'กรัม',[],['seafood'],true),
  X('egg','ไข่ไก่','protein',[143,12.6,.7,9.5,142,.4],12,'ฟอง',[['ฟอง',50]]),
  X('egg_white','ไข่ขาว','protein',[52,11,.7,.2,166,.7],12,'ฟอง',[['ฟอง',33]]),
  X('tofu_firm','เต้าหู้ขาวแข็ง','protein',[110,12,2.5,6.5,15,.6],8,'กรัม',[],['soy']),
  X('tofu_silken','เต้าหู้อ่อน','protein',[55,5,2,3,7,1],8,'กรัม',[],['soy']),
  X('greek_yogurt','โยเกิร์ตกรีก','protein',[59,10,3.6,.4,36,3.6],25,'กรัม',[['ช้อนโต๊ะ',18]],['dairy']),
  X('jasmine_rice','ข้าวหอมมะลิ','carb',[130,2.7,28,.3,1,0],5),
  X('brown_rice','ข้าวกล้อง','carb',[123,2.7,25.6,1,4,.2],8),
  X('glass_noodle','วุ้นเส้น','carb',[86,.1,21,0,5,0],6),
  X('konjac_noodle','เส้นบุก','carb',[8,.1,3,0,5,0],15),
  X('sweet_potato','มันหวาน','carb',[86,1.6,20,.1,55,4.2],6,'กรัม',[['หัว',150]]),
  X('holy_basil','ใบกะเพรา','veggie',[25,3,3,.6,4,.3],10,'กำมือ',[['กำมือ',20]]),
  X('mixed_veg','ผักรวม','veggie',[35,2,7,.3,25,3],8),
  X('napa','ผักกาดขาว','veggie',[13,1.5,2.2,.2,65,1.2],4),
  X('mushroom','เห็ดฟาง','veggie',[35,3.8,5,.4,5,1],12),
  X('salad','ผักสลัดรวม','veggie',[15,1.4,2.9,.2,28,.8],20),
  X('herbs','สมุนไพร (ตะไคร้ ข่า ใบมะกรูด)','veggie',[30,1,7,.5,5,1],15,'กำมือ',[['กำมือ',25]]),
  X('tomato','มะเขือเทศ','veggie',[18,.9,3.9,.2,5,2.6],6),
  X('light_soy','ซีอิ๊วลดโซเดียม','seasoning',[60,6,8,0,3000,1],15,'ช้อนชา',[['ช้อนชา',6],['ช้อนโต๊ะ',18]],['soy','gluten']),
  X('fish_sauce','น้ำปลา','seasoning',[35,5,4,0,7000,3],10,'ช้อนชา',[['ช้อนชา',6],['ช้อนโต๊ะ',18]],['seafood'],true),
  X('lime','น้ำมะนาว','seasoning',[25,.4,8,0,2,2],15,'ช้อนโต๊ะ',[['ช้อนโต๊ะ',15]]),
  X('garlic','กระเทียม','seasoning',[149,6.4,33,.5,17,1],8,'กลีบ',[['กลีบ',4]]),
  X('chili','พริกขี้หนู','seasoning',[40,2,9,.4,9,5],10,'เม็ด',[['เม็ด',2]]),
  X('rice_bran_oil','น้ำมันรำข้าว','fat',[884,0,0,100,0,0],10,'ช้อนชา',[['ช้อนชา',4.5],['ช้อนโต๊ะ',14]]),
  X('olive_oil','น้ำมันมะกอก','fat',[884,0,0,100,2,0],45,'ช้อนชา',[['ช้อนชา',4.5],['ช้อนโต๊ะ',14]]),
  X('cashew','เม็ดมะม่วงหิมพานต์','fat',[553,18,30,44,12,6],60,'ช้อนโต๊ะ',[['ช้อนโต๊ะ',10]],['nuts'])
]

export const ING_MAP=Object.fromEntries(INGREDIENTS.map(i=>[i.id,i]))
