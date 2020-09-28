import Head from 'next/head'
import { useRef, useState } from 'react'
import currency from 'currency.js'

const showAmount = (cents: number): string =>
  currency(cents, { fromCents: true }).toString()

export interface Entry {
  name: string
  amount: number
  category: Category
}

export enum Category {
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

export default function Home() {
  const [entries, setEntries] = useState<Array<Entry>>([])

  const inputRef = useRef(null)

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        amount,
        name,
        category
      }
    ])

    // re-set
    setAmount(0)
    setName('')
    setCategory(Category.OTHER)

    // re-focus
    inputRef.current.focus()
  }

  const removeEntry = (i: number) => {
    const newEntries = entries.filter((_, index) => index !== i)
    setEntries(newEntries)
  }

  // new entry
  const [amount, setAmount] = useState<number>(0)
  const [name, setName] = useState('')
  const [category, setCategory] = useState(Category.OTHER)

  const handleEnter = (e) => {
    if (e.key !== 'Enter') return
    addEntry()
  }

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
        <table>
          <thead>
            <tr>
              <th>Betrag</th>
              <th>Name</th>
              <th>Kategorie</th>
              <th className="text-right"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={`entry-${i}`}>
                <td>{showAmount(entry.amount)}</td>
                <td>{entry.name}</td>
                <td>{entry.category}</td>
                <td>
                  <button onClick={() => removeEntry(i)}>Delete</button>
                </td>
              </tr>
            ))}
            <tr onKeyUp={handleEnter}>
              <td>
                <input
                  type="number"
                  value={amount}
                  ref={inputRef}
                  onChange={(e) => setAmount(parseInt(e.target.value || '0'))}
                  onFocus={(e) => e.target.select()}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </td>
              <td>
                <div className="relative">
                  <select
                    name="category"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                  >
                    {Object.values(Category).map((c) => (
                      <option key={`category-${c}`} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </td>
              <td>
                <button onClick={addEntry} type="button">
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  )
}
