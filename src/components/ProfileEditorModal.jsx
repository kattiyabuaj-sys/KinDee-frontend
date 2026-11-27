import {useState} from 'react'
import {AVATAR_OPTIONS} from '../data/mockUserHistory'

/**
 * Lightweight local profile editor for nickname & culinary avatar.
 * Persists directly to `userStore` (`localStorage`) with zero auth friction.
 */
export default function ProfileEditorModal({profile,onSave,onClose}){
  const [name,setName]=useState(profile?.displayName||'เชฟสายคลีน')
  const [avatar,setAvatar]=useState(profile?.avatar||AVATAR_OPTIONS[0])

  const submit=e=>{
    e.preventDefault()
    onSave({displayName:name.trim()||'เชฟสายคลีน',avatar})
    onClose()
  }

  return(
    <div className="fixed inset-0 z-50 bg-black/45 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <form onSubmit={submit} className="w-full max-w-[390px] bg-rice rounded-t-3xl sm:rounded-3xl border border-tan p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">แก้ไขโปรไฟล์ชุมชน</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-card border border-tan text-sm">✕</button>
        </div>

        <div>
          <label className="block text-xs font-bold mb-2">เลือกอวตารของคุณ</label>
          <div className="grid grid-cols-5 gap-2">
            {AVATAR_OPTIONS.map(av=>(
              <button
                key={av}
                type="button"
                onClick={()=>setAvatar(av)}
                className={`h-12 rounded-2xl border text-2xl flex items-center justify-center transition ${
                  avatar===av?'border-red bg-red/10 scale-105 shadow-sm':'border-tan bg-card'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1.5">ชื่อเล่น / นามแฝง</label>
          <input
            type="text"
            maxLength={24}
            value={name}
            onChange={e=>setName(e.target.value)}
            placeholder="เช่น เชฟสายคลีน, @พลอยเฮลตี้"
            className="w-full rounded-xl border border-tan bg-card px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:border-red"
          />
          <p className="text-[11px] opacity-65 mt-1">ชื่อและอวตารนี้จะแสดงบนสูตรอาหารที่คุณแชร์</p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-o py-2.5 bg-card">ยกเลิก</button>
          <button type="submit" className="cta py-2.5">บันทึกโปรไฟล์</button>
        </div>
      </form>
    </div>
  )
}
