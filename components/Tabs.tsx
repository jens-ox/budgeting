import React, { useState } from 'react'
import Tab from './Tab'

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(children[0].props.label)

  return (
    <div className="tabs">
      <ol className="tab-list print:opacity-0">
        {children.map((child) => {
          const { label } = child.props

          return (
            <Tab
              activeTab={activeTab}
              key={label}
              label={label}
              handleClick={(label) => setActiveTab(label)}
            />
          )
        })}
        <li className="filler" />
      </ol>

      {children.map((child, i) => {
        return (
          <div
            key={`child-${i}`}
            className={`tab-content print:mb-4 print:block ${
              child.props.label !== activeTab && 'hidden'
            }`}
          >
            <>
              <div className="hidden print:block text-lg">
                {child.props.label}
              </div>
              {child.props.children}
            </>
          </div>
        )
      })}
    </div>
  )
}

export default Tabs
