import createPersistedState from 'use-persisted-state'
import Budget from '../types/Budget'
const useStashedState = createPersistedState<Budget>('budget')

const useStashed = (initialState) => useStashedState(initialState)

export default useStashed
