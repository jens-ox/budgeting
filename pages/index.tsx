import Head from 'next/head'
import Table from '../components/Table'

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

export default function Home() {
  return (
    <div className="container mx-auto pt-8">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="mb-6">
        <h1>Budget</h1>
        <span className="text-gray-600 italic text-sm">
          Einnahmen und Ausgaben für einen Zeitraum deiner Wahl eintragen und
          Auswertung speichern.
        </span>
      </header>

      <main>
        <h3>Einnahmen</h3>
        <Table
          categories={IncomeCategory}
          defaultCategory={IncomeCategory.WORK}
        ></Table>
        <h3>Ausgaben</h3>
        <Table
          categories={SpendingCategory}
          defaultCategory={SpendingCategory.OTHER}
        ></Table>
      </main>
    </div>
  )
}
