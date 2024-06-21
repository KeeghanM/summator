'use client'

import ReactSelect from 'react-select'
import makeAnimated from 'react-select/animated'
import { sources } from './sources'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

export function Example() {
  const animatedComponents = makeAnimated()
  const [priorities, setPriorities] = useState<
    { name: string; value: number }[]
  >([
    {
      name: sources[0].label,
      value: 5,
    },
  ])
  const [buttonClicked, setButtonClicked] = useState(false)
  const { data, isPending, error } = useQuery({
    queryKey: ['summarise-example'],
    queryFn: async () => {
      const response = await fetch('/api/example', {
        method: 'POST',
        body: JSON.stringify({
          sources: priorities,
        }),
      })
      if (!response.ok) throw new Error(response.statusText)
      return response.json() as Promise<{ __html: string }>
    },
    enabled: buttonClicked,
  })

  return (
    <div className="card shrink-0 w-full max-w-md shadow-2xl bg-base-100">
      <div className="card-body">
        <h2 className="text-2xl font-bold">See it in action!</h2>
        <div className="form-control">
          <label className="label">
            <span className="font-bold">Pick your news sources</span>
          </label>
          <ReactSelect
            onChange={(selected) => {
              setPriorities(
                selected.map((source) => ({
                  name: source.label,
                  value: 5,
                })),
              )
            }}
            components={animatedComponents}
            closeMenuOnSelect={false}
            isMulti={true}
            options={sources}
            defaultValue={[sources[0]]}
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
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={priority.value}
                  onChange={(e) => {
                    setPriorities(
                      priorities.map((p, i) => {
                        if (i === index) {
                          return {
                            name: p.name,
                            value: parseInt(e.target.value),
                          }
                        }
                        return p
                      }),
                    )
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
        <div className="form-control mt-6">
          <button
            onClick={() => setButtonClicked(true)}
            className="btn btn-primary text-white font-bold"
          >
            Summarise!
          </button>
        </div>
      </div>
      {data && !isPending && (
        <div dangerouslySetInnerHTML={{ __html: data.__html }} />
      )}
    </div>
  )
}
