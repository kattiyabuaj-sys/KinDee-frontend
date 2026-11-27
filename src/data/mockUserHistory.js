/**
 * Default persisted user state and seed history for first-time visitors.
 * Stored in localStorage under `kindee.user.v1` and structured to match
 * the backend user-profile & daily-log payloads.
 */
export const DEFAULT_BIOMETRICS={sex:'f',age:28,kg:62,cm:165,act:1}

export const AVATAR_OPTIONS=['🥗','🍳','🥑','🧑‍🍳','🌿']

export const DEFAULT_PROFILE={displayName:'เชฟสายคลีน',avatar:'🥗'}

export const DEFAULT_PREFERENCES={goals:['lose'],kit:['q15'],ex:['spicy']}

export const MOCK_USER_HISTORY={
  biometrics:DEFAULT_BIOMETRICS,
  profile:DEFAULT_PROFILE,
  preferences:DEFAULT_PREFERENCES,
  mealCount:3,
  savedMealIds:['m4'],
  likedCommunityIds:['cm1'],
  communityPoolIds:[],
  spinHistory:[
    {mealId:'m1',at:'2026-11-24T12:10:00Z'},
    {mealId:'m8',at:'2026-11-25T07:40:00Z'}
  ],
  userSwapPreferences:{
    chicken_breast:{tofu_firm:3},
    jasmine_rice:{brown_rice:2}
  },
  todayLog:[]
}
