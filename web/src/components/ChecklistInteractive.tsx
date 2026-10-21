import { useState } from 'react'

type Item = { id: string; label: string }

type ChecklistInteractiveProps = {
  items: Item[]
}

export default function ChecklistInteractive({ items }: ChecklistInteractiveProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  return (
    <ul className="checklist-interactive">
      {items.map((item) => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={!!checked[item.id]}
              onChange={() =>
                setChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
              }
            />
            <span>{item.label}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}
