import { useRef, useState } from 'react'
import Entry from '../types/Entry'
import { Plus, Minus } from 'react-feather'
import showAmount from '../helpers/showAmount'
import Category from '../types/Category'

export interface ITable {
  entries?: Array<Entry>
  categories: Record<string, string>
  defaultCategory: Category
  onChange: (entries: Array<Entry>) => void
}

export default function Table({
  entries = [],
  categories,
  defaultCategory,
  onChange
}: ITable): JSX.Element {
  const inputRef = useRef(null)

  // new entry
  const [amount, setAmount] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>(defaultCategory)

  const addEntry = () => {
    // abort if everything is empty
    if (!amount && name === '') return

    const newEntries = [
      {
        amount,
        name,
        category
      },
      ...entries
    ]
    onChange(newEntries)

    // re-set
    setAmount(null)
    setName('')
    setCategory(defaultCategory)

    // re-focus
    inputRef.current.focus()
  }

  const removeEntry = (i: number) => {
    const newEntries = entries.filter((_, index) => index !== i)
    onChange(newEntries)
  }

  const handleSelect = (e) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    addEntry()
  }

  const handleEnter = (e) => {
    if (e.key !== 'Enter') return
    addEntry()
  }

  const getSum = () =>
    entries.reduce((currentSum, entry) => currentSum + (entry.amount || 0), 0)

  return (
    <>
      <div className="flex flex-col mb-4 xl:hidden">
        <div className="form-element">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            className="bg-gray-100"
            type="number"
            value={amount || ''}
            placeholder="cents"
            ref={inputRef}
            onChange={(e) =>
              setAmount(e.target.value ? parseInt(e.target.value) : null)
            }
            onKeyUp={handleEnter}
            onFocus={(e) => e.target.select()}
          />
        </div>
        <div className="form-element">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            className="bg-gray-100"
            type="text"
            placeholder="Kebab"
            value={name}
            onKeyUp={handleEnter}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-element">
          <label htmlFor="Category">Category</label>
          <div className="relative bg-gray-100">
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              onKeyPress={handleSelect}
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
        </div>
        <div className="form-element">
          <button
            onClick={addEntry}
            type="button"
            className="button button-green text-center"
          >
            Add
          </button>
        </div>
      </div>
      <table className="table hidden print:w-full xl:table">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Name</th>
            <th>Category</th>
            <th className="print:hidden"></th>
          </tr>
        </thead>
        <tbody>
          <tr className="print:hidden row-add">
            <td>
              <input
                type="number"
                value={amount || ''}
                placeholder="cents"
                ref={inputRef}
                onChange={(e) =>
                  setAmount(e.target.value ? parseInt(e.target.value) : null)
                }
                onKeyUp={handleEnter}
                onFocus={(e) => e.target.select()}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Kebab"
                value={name}
                onKeyUp={handleEnter}
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
                  onKeyPress={handleSelect}
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
              <button
                onClick={addEntry}
                type="button"
                className="table-icon inline-block w-full h-full text-center"
              >
                <Plus className="inline" />
              </button>
            </td>
          </tr>
          {entries.map((entry, i) => (
            <tr key={`entry-${i}`} className="row-entry">
              <td>{showAmount(entry.amount)}</td>
              <td>{entry.name}</td>
              <td>{entry.category}</td>
              <td className="td-action print:hidden">
                <button
                  onClick={() => removeEntry(i)}
                  className="table-icon inline-block w-full h-full text-center"
                >
                  <Minus className="inline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th className="text-left">{showAmount(getSum())}</th>
          </tr>
        </tfoot>
      </table>
      <div className="xl:hidden">
        {entries.map((entry, i) => (
          <table key={`entry-${i}`} className="table-entries">
            <tbody>
              <tr>
                <td>Amount</td>
                <td>{showAmount(entry.amount)}</td>
              </tr>
              <tr>
                <td>Name</td>
                <td>{entry.name}</td>
              </tr>
              <tr>
                <td>Category</td>
                <td>{entry.category}</td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    </>
  )
}
