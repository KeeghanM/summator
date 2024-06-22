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

  useEffect(() => {
    setPriorities(
      selected.map((s) => {
        const source = sources.find((source) => source.value === s)
        if (!source) {
          throw new Error(`Source ${s} not found`)
        }
        return {
          name: source.label,
          priority: 5,
          rss: source.rss,
        }
      }),
    )
  }, [selected])

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
                    console.log(e.target.value)
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
