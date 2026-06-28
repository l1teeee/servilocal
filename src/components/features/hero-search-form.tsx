'use client'

type Props = {
  searchLabel:  string
  searchHint:   string
  searchButton: string
}

export function HeroSearchForm({ searchLabel, searchHint, searchButton }: Props) {
  return (
    <form
      action="/jobs"
      className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-md sm:flex-row"
    >
      <label htmlFor="home-search" className="sr-only">
        {searchLabel}
      </label>
      <div className="flex min-h-12 flex-1 items-center gap-3 rounded-xl bg-white/15 px-4">
        <span className="material-symbols-outlined text-[20px] text-white/60">search</span>
        <input
          id="home-search"
          name="q"
          type="text"
          placeholder={searchHint}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50"
        />
      </div>
      <button
        type="submit"
        className="btn-press min-h-12 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition-[background-color,transform] duration-200 ease-out hover:bg-blue-400 sm:rounded-full"
      >
        {searchButton}
      </button>
    </form>
  )
}
