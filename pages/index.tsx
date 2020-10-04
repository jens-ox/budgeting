import Head from 'next/head'
import { useMemo, useState } from 'react'
import Table from '../components/Table'
import useStashed from '../hooks/useStashed'
import Budget from '../types/Budget'
import Entry from '../types/Entry'
import { useToasts } from 'react-toast-notifications'

export enum SpendingCategory {
  FOOD = 'Lebensmittel',
  CLOTING = 'Bekleidung und Schuhe',
  HOME = 'Wohnen und Energie',
  APPLIANCES = 'Innenausstattung und Haushaltsgeräte',
  HEALTH = 'Gesundheit',
  MOBILITY = 'Verkehr',
  MOBILE = 'Post und Telekommunikation',
  CULTURE = 'Freizeit, Unterhaltung, Kultur',
  EDUCATION = 'Bildungswesen',
  HOTEL = 'Beherberung und Gaststätten',
  OTHER = 'Andere Waren und Dienstleistungen'
}

export enum IncomeCategory {
  WORK = 'Nichtselbstständige Arbeit',
  CONTRACT = 'Selbstständige Arbeit',
  MEANS = 'Vermögenseinnahmen'
}

const initialState: Budget = {
  in: [],
  out: []
}

const initialHash = JSON.stringify(initialState)

export default function Home() {
  const [stashed, setStashed] = useStashed(initialState)
  const [budget, setBudget] = useState<Budget>(initialState)
  const { addToast } = useToasts()

  // yes, this is efficient enough, one day this can be upgraded to MurmurHash3 or sth
  const budgetHash = useMemo(() => JSON.stringify(budget), [budget])
  const stashHash = useMemo(() => JSON.stringify(stashed), [stashed])

  const stashDiffers = stashHash !== budgetHash
  const stashNotInitial = stashHash !== initialHash
  const localNotInitial = budgetHash !== initialHash

  const loadStashed = () => {
    setBudget(stashed)
    addToast(<span>loaded stashed entries</span>, {
      appearance: 'success'
    })
  }

  const updateStashed = () => {
    setStashed(budget)
    addToast(<span>updated stashed entries</span>, {
      appearance: 'success'
    })
  }

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
      <Head>
        <title>Budget</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav>
        <div className="container mx-auto flex justify-between">
          <div className="title">Budget</div>
          <div className="actions">
            {stashNotInitial && (
              <button onClick={loadStashed}>Load local</button>
            )}
            {stashDiffers ? (
              <button onClick={updateStashed} className="button-green">
                Save local
              </button>
            ) : (
              <button className="disabled">Up to date ✓</button>
            )}
            {localNotInitial && (
              <button className="button-red" onClick={reset}>
                Reset
              </button>
            )}
          </div>
        </div>
      </nav>
      <div className="container mx-auto">
        <main>
          <h3>Income</h3>
          <Table
            categories={IncomeCategory}
            defaultCategory={IncomeCategory.WORK}
            entries={budget.in}
            onChange={updateIn}
          ></Table>
          <h3>Spending</h3>
          <Table
            categories={SpendingCategory}
            defaultCategory={SpendingCategory.OTHER}
            entries={budget.out}
            onChange={updateOut}
          ></Table>
        </main>
      </div>
    </div>
  )
}
