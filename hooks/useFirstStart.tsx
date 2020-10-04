import createPersistedState from 'use-persisted-state'
const useStashedState = createPersistedState<boolean>('firstStart')

const useFirstStart = () => useStashedState(true)

export default useFirstStart
