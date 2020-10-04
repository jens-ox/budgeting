import React from 'react'

interface ITab {
  activeTab: string
  label: string
  handleClick: (label: string) => void
}

const Tab = ({ activeTab, label, handleClick }: ITab) => {
  return (
    <li
      className={`tab-list-item ${label === activeTab && 'tab-list-active'}`}
      onClick={() => handleClick(label)}
    >
      {label}
    </li>
  )
}

export default Tab
