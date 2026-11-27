import {useMemo,useState} from 'react'
import DishImage from '../components/DishImage'
import CreateRecipeModal from '../components/CreateRecipeModal'
import ProfileEditorModal from '../components/ProfileEditorModal'

const EQUIP_LABEL={
  stove:'🔥 เตาแก๊ส',
  microwave:'📻 ไมโครเวฟ',
  air_fryer:'🌀 หม้อทอด',
  no_cook:'🥗 ไม่ใช้เตา'
}

const FILTERS=[
  ['all','ทั้งหมด'],
  ['pool','อยู่ในระบบสุ่ม'],
  ['mine','สูตรของฉัน']
]

export default function Community({
  communityMeals,
  profile,
  likedIds,
  poolIds,
  onUpdateProfile,
  onToggleLike,
  onTogglePool,
  onPublishRecipe,
  onCookRecipe
}){
  const [filter,setFilter]=useState('all')
  const [showCreate,setShowCreate]=useState(false)
  const [showProfileEdit,setShowProfileEdit]=useState(false)

  const mySharedCount=useMemo(
    ()=>communityMeals.filter(m=>m.author?.isMe).length,
    [communityMeals]
  )

  const list=useMemo(()=>{
    if(filter==='pool')return communityMeals.filter(m=>poolIds.includes(m.id))
    if(filter==='mine')return communityMeals.filter(m=>m.author?.isMe)
    return communityMeals
  },[communityMeals,filter,poolIds])

  return(
    <div className="flex-1 overflow-y-auto px-4 pb-5 space-y-3">
      {/* Header + Primary Share CTA */}
      <div className="pt-3 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold leading-tight">ชุมชนคนกินดี</h1>
          <p className="text-xs opacity-70">สูตรคลีนจากเพื่อนๆ คำนวณสารอาหารจากวัตถุดิบจริง</p>
        </div>
        <button
          onClick={()=>setShowCreate(true)}
          className="shrink-0 rounded-full bg-red text-white text-xs font-bold px-3.5 py-2 shadow-sm active:scale-95 transition"
        >
          + แชร์สูตรของฉัน
        </button>
      </div>

      {/* Compact Local User Profile Badge */}
      <div className="card p-3 flex items-center justify-between gap-2 bg-[#F6F3EC]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-11 h-11 rounded-full bg-card border border-tan flex items-center justify-center text-2xl shrink-0">
            {profile?.avatar||'🥗'}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm truncate">{profile?.displayName||'เชฟสายคลีน'}</div>
            <div className="text-[11px] opacity-75 font-num">
              แชร์แล้ว {mySharedCount} สูตร · เพิ่มเข้าสุ่ม {poolIds.length} เมนู
            </div>
          </div>
        </div>
        <button
          onClick={()=>setShowProfileEdit(true)}
          className="shrink-0 rounded-full border border-tan bg-card px-3 py-1.5 text-xs font-semibold text-brown"
        >
          ✏️ แก้ไขโปรไฟล์
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {FILTERS.map(([id,lbl])=>(
          <button
            key={id}
            onClick={()=>setFilter(id)}
            className={`pill text-xs py-1 px-3 shrink-0 ${filter===id?'on':''}`}
          >
            {lbl}
          </button>
        ))}
      </div>

      {/* Community Feed Cards */}
      {!list.length?(
        <div className="card p-6 text-center space-y-2">
          <div className="text-3xl">🍽️</div>
          <p className="text-sm font-semibold">
            {filter==='mine'
              ?'คุณยังไม่ได้แชร์สูตรอาหาร ลองกด “+ แชร์สูตรของฉัน” ดูสิ!'
              :'ยังไม่มีเมนูชุมชนในระบบสุ่มของคุณ'}
          </p>
        </div>
      ):(
        <div className="space-y-3">
          {list.map(meal=>{
            const liked=likedIds.includes(meal.id)
            const inPool=poolIds.includes(meal.id)
            const n=meal.nutrition||{cal:0,p:0,na:0}
            return(
              <article key={meal.id} className="card overflow-hidden">
                {/* Author Header */}
                <div className="px-3.5 pt-3 pb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-8 h-8 rounded-full bg-rice border border-tan flex items-center justify-center text-base shrink-0">
                      {meal.author?.avatar||'🥗'}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold truncate">{meal.author?.name||'เพื่อนกินดี'}</span>
                        {meal.author?.isMe&&<span className="chip text-[10px] py-0 px-2">สูตรของคุณ</span>}
                      </div>
                      <div className="text-[11px] opacity-65 flex items-center gap-1.5">
                        <span>⏱ {meal.prepTimeMins} นาที</span>
                        <span>·</span>
                        <span>{EQUIP_LABEL[meal.equipment?.[0]]||'🔥 ทำง่าย'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Like Toggle */}
                  <button
                    onClick={()=>onToggleLike(meal.id)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-num font-bold flex items-center gap-1 transition ${
                      liked?'border-red bg-red/10 text-red':'border-tan bg-rice text-brown'
                    }`}
                  >
                    <span>{liked?'❤️':'🤍'}</span>
                    <span>{meal.likes}</span>
                  </button>
                </div>

                {/* Dish Photo */}
                <DishImage meal={meal} className="h-36 w-full"/>

                {/* Dish Details & Actions */}
                <div className="p-3.5 space-y-2.5">
                  <div>
                    <h2 className="text-base font-bold leading-snug">{meal.nameTh}</h2>
                    {meal.captionTh&&<p className="text-xs opacity-80 mt-0.5 leading-relaxed">{meal.captionTh}</p>}
                  </div>

                  {/* Nutrition Badges */}
                  <div className="flex flex-wrap gap-1.5 font-num text-xs font-bold">
                    <span className="chip !text-red !border-tan bg-rice">{n.cal} kcal</span>
                    <span className="chip">โปรตีน {n.p}g</span>
                    <span className="chip">โซเดียม {n.na}mg</span>
                  </div>

                  {/* 2 Clear Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={()=>onCookRecipe(meal)}
                      className="rounded-xl bg-red text-white text-xs font-bold py-2.5 active:scale-[.98] transition"
                    >
                      ดูสูตร & ทำตาม
                    </button>
                    <button
                      onClick={()=>onTogglePool(meal.id)}
                      className={`rounded-xl border text-xs font-bold py-2.5 transition ${
                        inPool
                          ?'border-green bg-green/15 text-green'
                          :'border-tan bg-rice text-brown hover:border-red'
                      }`}
                    >
                      {inPool?'อยู่ในระบบสุ่มแล้ว ✓':'+ เพิ่มเข้าระบบสุ่ม'}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {showCreate&&(
        <CreateRecipeModal
          profile={profile}
          onPublish={onPublishRecipe}
          onClose={()=>setShowCreate(false)}
        />
      )}

      {showProfileEdit&&(
        <ProfileEditorModal
          profile={profile}
          onSave={onUpdateProfile}
          onClose={()=>setShowProfileEdit(false)}
        />
      )}
    </div>
  )
}
