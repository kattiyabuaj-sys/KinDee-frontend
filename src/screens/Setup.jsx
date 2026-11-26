import {tdee} from '../utils/nutrition'

const ACT=[
  ['นั่งทำงานเป็นส่วนใหญ่','งานนั่งโต๊ะ แทบไม่ได้ออกกำลังกาย'],
  ['ออกกำลังกายเบาๆ','เดินเบาๆ หรือออกกำลังกาย 1–2 วัน/สัปดาห์'],
  ['ออกกำลังกายปานกลาง','ออกกำลังกายระดับกลาง 3–5 วัน/สัปดาห์'],
  ['ออกกำลังกายหนัก','ฝึกหนักเป็นประจำ 6–7 วัน/สัปดาห์']
]

const Row=({lb,u,k,min,max,v,set})=>{
  const go=n=>set(k,Math.min(max,Math.max(min,n)))
  return(
    <div className="py-2">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold">{lb}</span>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full border border-tan bg-card text-xl" onClick={()=>go(v-1)}>−</button>
          <span className="font-num font-bold w-20 text-center border border-tan bg-[#F3EEE4] rounded py-1">{v} {u}</span>
          <button className="w-9 h-9 rounded-full border border-tan bg-card text-xl" onClick={()=>go(v+1)}>+</button>
        </div>
      </div>
      <input type="range" min={min} max={max} value={v} onChange={e=>go(+e.target.value)} />
    </div>
  )
}

export default function Setup({u,setU,next}){
  const set=(k,v)=>setU({...u,[k]:v})
  return(
    <>
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="flex items-center justify-between pt-3">
          <b className="text-lg">🌿 KinDee (กินดี)</b>
          <span className="chip">ขั้นตอนที่ 1 จาก 2</span>
        </div>
        <div className="h-2 rounded bg-card mt-3"><div className="h-2 w-1/2 rounded bg-red"/></div>
        <h1 className="text-3xl font-bold my-4">บอกเราเกี่ยวกับตัวคุณ</h1>
        <div className="card p-4 mb-4">
          <div className="flex justify-between text-sm mb-2"><b>เพศ</b><span className="opacity-70">เพื่อคำนวณการเผาผลาญ</span></div>
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl border border-tan">
            {[['m','♂ ชาย'],['f','♀ หญิง']].map(([v,t])=>(
              <button key={v} onClick={()=>set('sex',v)} className={`py-3 rounded-lg font-semibold ${u.sex===v?'bg-red text-white':''}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="card p-4 mb-4 divide-y divide-tan/40">
          <Row lb="อายุ" u="ปี" k="age" min={15} max={80} v={u.age} set={set}/>
          <Row lb="น้ำหนัก" u="กก." k="kg" min={35} max={150} v={u.kg} set={set}/>
          <Row lb="ส่วนสูง" u="ซม." k="cm" min={140} max={210} v={u.cm} set={set}/>
        </div>
        <h2 className="text-lg font-bold mb-2">ระดับกิจกรรมประจำวัน</h2>
        <div className="space-y-2">
          {ACT.map(([t,d],i)=>(
            <button key={i} onClick={()=>set('act',i)} className={`w-full text-left rounded-2xl border p-3 ${u.act===i?'bg-red text-white border-red':'bg-card border-tan'}`}>
              <div className="font-semibold">{t}</div><div className="text-xs opacity-80">{d}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 bg-card border-t border-tan/50 space-y-3">
        <div className="text-center"><span className="chip">🔥 เป้าหมายต่อวัน: <span className="font-num ml-1">{tdee(u).toLocaleString()}</span>&nbsp;กิโลแคลอรี</span></div>
        <button className="cta" onClick={next}>ถัดไป: เลือกความชอบอาหาร →</button>
      </div>
    </>
  )
}
