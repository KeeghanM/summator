import { sources } from './sources'
import { useState, useEffect } from 'react'
import ReactSelect from 'react-select'
import makeAnimated from 'react-select/animated'

export type Source = { name: string; priority: number; rss: string }

type ExampleFormProps = {
  onSubmit: (priorities: Source[]) => void
  isPending: boolean
}

export function ExampleForm({ onSubmit, isPending }: ExampleFormProps) {
  const animatedComponents = makeAnimated()
  const [selected, setSelected] = useState<string[]>([sources[0].value])
  const [priorities, setPriorities] = useState<Source[]>([
    { name: sources[0].label, priority: 5, rss: sources[0].rss },
  ])

  // Updates priorities when selected sources change
  useEffect(() => {
    // Create a new array of priorities based on selected sources
    const newPriorities = selected.map((s) => {
      const source = sources.find((source) => source.value === s)
      if (!source) {
        throw new Error(`Source ${s} not found`)
      }
      return {
        name: source.label,
        priority: 0, // We'll set the priority later
        rss: source.rss,
      }
    })

    // Calculate the current sum of priorities
    let sumPriorities = priorities.reduce((sum, p) => sum + p.priority, 0)
    const maxPriority = 10

    // Assign priorities to new or existing sources
    newPriorities.forEach((newP) => {
      const existingP = priorities.find((p) => p.name === newP.name)
      if (existingP) {
        // If the source already exists, keep its current priority
        newP.priority = existingP.priority
      } else {
        // If it's a new source
        if (sumPriorities < maxPriority) {
          // If the sum is less than the max, add the difference
          newP.priority = Math.min(maxPriority - sumPriorities, 5) // Default to 5 if there's enough room
          sumPriorities += newP.priority
        } else {
          // If the sum is already at the max
          const lowestPriority = priorities
            .filter((p) => p.priority > 1)
            .sort((a, b) => a.priority - b.priority)[0]

          if (lowestPriority) {
            // Reduce the lowest priority by 1 and set the new source to priority 1
            lowestPriority.priority -= 1
            newP.priority = 1
          } else {
            // If all priorities are at the minimum, set the new source to priority 1
            console.warn(
              'Cannot add new source: all priorities are already at minimum',
            )
            newP.priority = 1
          }
        }
      }
    })

    // Update the priorities state
    setPriorities(newPriorities)
  }, [selected])

  // Function to handle priority changes from user input
  const handlePriorityChange = (index: number, newPriority: number) => {
    const newPriorities = [...priorities]
    newPriorities[index].priority = newPriority

    // Calculate the new sum of priorities
    let sumPriorities = newPriorities.reduce((sum, p) => sum + p.priority, 0)
    if (sumPriorities > 10) {
      // Adjust the priorities to ensure the total does not exceed the max
      for (let i = 0; i < newPriorities.length; i++) {
        if (i !== index && newPriorities[i].priority > 1) {
          const reduction = Math.min(
            sumPriorities - 10,
            newPriorities[i].priority - 1,
          )
          newPriorities[i].priority -= reduction
          sumPriorities -= reduction
          if (sumPriorities <= 10) break
        }
      }
    }

    // Update the priorities state
    setPriorities(newPriorities)
  }

  return (
    <div>
      <div className={isPending ? 'opacity-50' : ''}>
        <h2 className="text-2xl font-bold">See it in action!</h2>
        <div className="form-control">
          <label className="label">
            <span className="font-bold">Pick your news sources</span>
          </label>
          <ReactSelect
            defaultValue={[sources[0]]}
            onChange={(values) => {
              setSelected(values.map((v) => v.value))
            }}
            isDisabled={isPending}
            components={animatedComponents}
            closeMenuOnSelect={false}
            isMulti={true}
            options={sources}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                padding: '0.5rem',
              }),
            }}
          />
          <p className="text-sm italic">
            When creating your own summaries, you can import any RSS feed you
            like! This is just a sample of what you can expect.
          </p>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="font-bold">Set your priorities</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {priorities.map((priority, index) => (
              <div
                key={index}
                className="form-control m-2 p-2 rounded bg-secondary bg-opacity-10"
              >
                <label className="label font-bold">
                  <span>{priority.name}</span>
                </label>
                <input
                  disabled={isPending}
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={priority.priority}
                  onChange={(e) => {
                    handlePriorityChange(index, parseInt(e.target.value))
                  }}
                  className="range"
                />
                <div className="w-full flex justify-between text-xs px-2">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="form-control mt-6">
        <button
          onClick={() => {
            if (isPending) return
            onSubmit(priorities)
          }}
          className="btn btn-primary text-white text-xl"
        >
          {isPending ? (
            <span className="loading loading-dots loading-lg"></span>
          ) : (
            'Summarise!'
          )}
        </button>
      </div>
    </div>
  )
}
