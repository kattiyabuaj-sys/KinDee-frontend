import {useState} from 'react'

const STYLE_META={
  'stir-fry':{bg:'from-[#F4E6D4] to-[#E6C9A8]',icon:'🍳',label:'ผัดคลีน'},
  'soup':{bg:'from-[#EFE9DA] to-[#D9DEC8]',icon:'🍲',label:'ต้มซุป'},
  'salad':{bg:'from-[#E7EEDB] to-[#D1DFB7]',icon:'🥗',label:'ยำ/สลัด'},
  'steamed':{bg:'from-[#F5F0E6] to-[#DFD5C2]',icon:'♨️',label:'นึ่ง/ตุ๋น'},
  'grill':{bg:'from-[#F2E0CE] to-[#DFB995]',icon:'🔥',label:'ย่าง/อบ'},
  'rice-bowl':{bg:'from-[#F6EBD8] to-[#E4CCA8]',icon:'🍚',label:'จานข้าว'},
  'noodle':{bg:'from-[#F3EAE0] to-[#DFC8AF]',icon:'🍜',label:'เมนูก๋วยเตี๋ยว'},
  'curry':{bg:'from-[#F3DEC8] to-[#E0B088]',icon:'🍛',label:'แกงไทย'},
  'breakfast':{bg:'from-[#F7EFE1] to-[#E8D5B5]',icon:'🥣',label:'มื้อเช้า'}
}

/**
 * Renders dish photo (`imageUrl`) with an automatic warm Thai-culinary fallback
 * when an image asset is absent or fails to load.
 */
export default function DishImage({meal,className='h-36 w-full',compact=false}){
  const [failed,setFailed]=useState(false)
  const meta=STYLE_META[meal?.dishStyle]||STYLE_META['rice-bowl']
  const showImg=Boolean(meal?.imageUrl)&&!failed

  if(showImg){
    return(
      <div className={`relative overflow-hidden bg-gradient-to-br ${meta.bg} ${className}`}>
        <img
          src={meal.imageUrl}
          alt={meal.nameTh||'เมนูอาหาร'}
          onError={()=>setFailed(true)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    )
  }

  return(
    <div className={`relative overflow-hidden bg-gradient-to-br ${meta.bg} flex flex-col items-center justify-center text-brown ${className}`}>
      <div className="w-14 h-14 rounded-full bg-card/85 border border-tan/70 flex items-center justify-center shadow-sm">
        <span className={compact?'text-2xl':'text-3xl'}>{meta.icon}</span>
      </div>
      {!compact&&(
        <span className="mt-1.5 text-[11px] font-semibold tracking-wide bg-card/80 px-2.5 py-0.5 rounded-full border border-tan/50">
          {meta.label}
        </span>
      )}
    </div>
  )
}
