import Head from 'next/head'
import { useState } from 'react'
import Table from '../components/Table'
import useStashed from '../hooks/useStashed'
import Budget from '../types/Budget'
import Entry from '../types/Entry'

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

export default function Home() {
  const [stashed, setStashed] = useStashed(initialState)
  const [budget, setBudget] = useState<Budget>(initialState)

  const loadStashed = () => {
    console.log('loading stashed', stashed)
    setBudget(stashed)
  }

  const updateStashed = () => {
    console.log('updating stashed', budget)
    setStashed(budget)
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
    <div className="container mx-auto pt-8">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="mb-6">
        <h1>Budget</h1>
        <span className="text-gray-600 italic text-sm print:hidden">
          Add income and expenses for a time frame of your choice and get some
          statistics about it.
        </span>
      </header>

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
        <button onClick={loadStashed} className="mr-2">
          Load local
        </button>
        <button onClick={updateStashed}>Save local</button>
      </main>
    </div>
  )
}
