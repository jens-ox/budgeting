import { useRef, useState } from 'react'
import currency from 'currency.js'
import Entry from '../types/Entry'
import { Plus, Minus } from 'react-feather'

const showAmount = (cents: number): string =>
  currency(cents, { fromCents: true }).toString()

export interface ITable {
  entries?: Array<Entry>
  categories: Record<string, string>
  defaultCategory: string
  onChange: (entries: Array<Entry>) => void
}

export default function Table({
  entries = [],
  categories,
  defaultCategory,
  onChange
}: ITable): JSX.Element {
  const inputRef = useRef(null)

  const addEntry = () => {
    const newEntries = [
      ...entries,
      {
        amount,
        name,
        category
      }
    ]
    onChange(newEntries)

    // re-set
    setAmount(0)
    setName('')
    setCategory(defaultCategory)

    // re-focus
    inputRef.current.focus()
  }

  const removeEntry = (i: number) => {
    const newEntries = entries.filter((_, index) => index !== i)
    onChange(newEntries)
  }

  // new entry
  const [amount, setAmount] = useState<number>(0)
  const [name, setName] = useState('')
  const [category, setCategory] = useState(defaultCategory)

  const handleEnter = (e) => {
    if (e.key !== 'Enter') return
    addEntry()
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Betrag</th>
          <th>Name</th>
          <th>Kategorie</th>
          <th className="print:hidden"></th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, i) => (
          <tr key={`entry-${i}`}>
            <td>{showAmount(entry.amount)}</td>
            <td>{entry.name}</td>
            <td>{entry.category}</td>
            <td>
              <button onClick={() => removeEntry(i)}>
                <Minus />
              </button>
            </td>
          </tr>
        ))}
        <tr onKeyUp={handleEnter} className="print:hidden">
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
                onChange={(e) => setCategory(e.target.value)}
              >
                {Object.values(categories).map((c) => (
                  <option key={`category-${c}`} value={c as string}>
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
              <Plus />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
