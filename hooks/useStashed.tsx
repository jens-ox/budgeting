import createPersistedState from 'use-persisted-state'
const useStashedState = createPersistedState<any>('budget')

const useStashed = (initialState) => useStashedState(initialState)

export default useStashed
