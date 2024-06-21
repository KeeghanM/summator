'use client'

import ReactSelect from 'react-select'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ExampleForm, Priority } from './form'

export function Example() {
  const [htmlString, setHtmlString] = useState<string | undefined>()

  const mutation = useMutation({
    mutationFn: async (priorities: Priority[]) => {
      const response = await fetch('/api/example', {
        method: 'POST',
        body: JSON.stringify({ sources: priorities }),
      })
      if (!response.ok) throw new Error(response.statusText)
      return (await response.json()) as { __html: string }
    },
    onSuccess: (data) => {
      setHtmlString(data.__html)
    },
  })

  return (
    <div className="card shrink-0 w-full max-w-md shadow-2xl bg-base-100">
      <div className="card-body">
        {/* ERROR STATE */}
        {mutation.isError && (
          <>
            <p className="font-bold text-red-500">
              Oops! Something wen't wrong. Please try again.
            </p>
            <button
              className="btn btn-primary text-white"
              onClick={() => {
                setHtmlString(undefined)
                mutation.reset()
              }}
            >
              Reset
            </button>
          </>
        )}
        {/* SUCCESSFUL SUMMARY */}
        {!mutation.isError && htmlString && (
          <>
            <div dangerouslySetInnerHTML={{ __html: htmlString }} />
            <button
              className="btn btn-primary text-white"
              onClick={() => setHtmlString(undefined)}
            >
              Reset
            </button>
          </>
        )}
        {/* INITIAL/FORM STATE */}
        {!mutation.isError && !htmlString && (
          <ExampleForm
            onSubmit={mutation.mutate}
            isPending={mutation.isPending}
          />
        )}
      </div>
    </div>
  )
}
