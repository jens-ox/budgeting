import { useMemo, useState } from 'react'
import Table from '../components/Table'
import useStashed from '../hooks/useStashed'
import Budget from '../types/Budget'
import Entry from '../types/Entry'
import { useToasts } from 'react-toast-notifications'
import Tabs from '../components/Tabs'
import TabContainer from '../components/TabContainer'
import Donut from '../components/Donut'
import IncomeCategory from '../types/IncomeCategory'
import SpendingCategory from '../types/SpendingCategory'
import CumulatedEntry from '../types/CumulatedEntry'

const initialState: Budget = {
  in: [],
  out: []
}

const initialHash = JSON.stringify(initialState)

const cumulateEntries = (entries: Array<Entry>): Array<CumulatedEntry> => {
  const baseArray: Array<CumulatedEntry> = []
  return entries.reduce((arr, entry) => {
    const index = arr.findIndex(
      (cumulated) => cumulated.label === entry.category
    )
    if (index === -1) {
      arr.push({
        label: entry.category,
        amount: entry.amount
      })
    } else {
      arr[index].amount += entry.amount
    }
    return arr
  }, baseArray)
}

const cumulateExpenses = (budget: Budget): Array<CumulatedEntry> => {
  // first, default-cumulate
  const entries = cumulateEntries(budget.out)

  // compute difference to income
  const sumIncome = budget.in.reduce((acc, val) => acc + val.amount, 0)
  const sumSpending = budget.out.reduce((acc, val) => acc + val.amount, 0)
  const difference = sumIncome - sumSpending

  entries.push({
    amount: difference,
    label: SpendingCategory.SAVINGS
  })

  return entries
}

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false)
  const [budget, setBudget] = useStashed(initialState)
  const { addToast } = useToasts()

  // yes, this is efficient enough, one day this can be upgraded to MurmurHash3 or sth
  const budgetHash = useMemo(() => JSON.stringify(budget), [budget])

  // resets both state and localStorage
  const reset = () => {
    setBudget(initialState)
    addToast(<span>reset current entries</span>, {
      appearance: 'success'
    })
  }

  // update handlers
  const updateIn = (newIn: Array<Entry>) =>
    setBudget({
      in: newIn,
      out: budget.out
    })
  const updateOut = (newOut: Array<Entry>) =>
    setBudget({
      in: budget.in,
      out: newOut
    })

  return (
    <div>
      <nav className="print:hidden">
        <div className="container mx-auto flex justify-between">
          <div className="title">Budget</div>
          <div className="actions">
            {budgetHash !== initialHash && (
              <button
                className="button-red"
                onClick={() => setModalVisible(true)}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto py-8">
        <Tabs>
          <TabContainer label="Income">
            <Table
              categories={IncomeCategory}
              defaultCategory={IncomeCategory.WORK}
              entries={budget.in}
              onChange={updateIn}
            ></Table>
          </TabContainer>
          <TabContainer label="Spending">
            <Table
              categories={SpendingCategory}
              defaultCategory={SpendingCategory.OTHER}
              entries={budget.out}
              onChange={updateOut}
            ></Table>
          </TabContainer>
        </Tabs>
        {budget.in.length > 0 || budget.out.length > 0 ? (
          <div className="analytics">
            <h3 className="mb-8">Analytics</h3>
            {budget.in.length > 0 && (
              <Donut
                label="Income Overview"
                data={cumulateEntries(budget.in)}
              />
            )}
            {budget.out.length > 0 && (
              <Donut
                label="Expenses Overview"
                data={cumulateExpenses(budget)}
              ></Donut>
            )}
          </div>
        ) : (
          <p className="mt-8 text-sm text-gray-600 italic">
            Add entries to view analytics!
          </p>
        )}
      </main>
      {modalVisible && (
        <>
          <div
            className="backdrop"
            onClick={() => setModalVisible(false)}
          ></div>
          <div className="modal">
            <div className="title">Reset</div>
            <div className="content">
              Are you sure that you want to reset your budget?
            </div>
            <div className="actions">
              <button onClick={() => setModalVisible(false)}>Cancel</button>
              <button className="button-red" onClick={reset}>
                Yes
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
