import Head from 'next/head'
import { useMemo } from 'react'
import Table from '../components/Table'
import useStashed from '../hooks/useStashed'
import Budget from '../types/Budget'
import Entry from '../types/Entry'
import { useToasts } from 'react-toast-notifications'
import Tabs from '../components/Tabs'
import TabContainer from '../components/TabContainer'

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
      <Head>
        <title>Budget</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="print:hidden">
        <div className="container mx-auto flex justify-between">
          <div className="title">Budget</div>
          <div className="actions">
            {budgetHash !== initialHash && (
              <button className="button-red" onClick={reset}>
                Reset
              </button>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto">
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
      </main>
    </div>
  )
}
