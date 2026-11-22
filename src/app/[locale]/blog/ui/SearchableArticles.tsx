'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'
import { ArticleCard, type Article, type ArticleLabels } from './ArticleCard'

type Labels = ArticleLabels & { search: string; noResults: string; clear: string }

export function SearchableArticles({ articles, labels }: { articles: Article[]; labels: Labels }) {
  const [query, setQuery] = useState('')
  const term = query.trim().toLowerCase()
  const [featured, ...archive] = articles
  const results = term
    ? articles.filter(article => `${article.title} ${article.excerpt}`.toLowerCase().includes(term))
    : archive

  return (
    <div className="grid gap-6 sm:gap-8">
      <label className="flex min-h-12 items-center gap-3 rounded-md border border-zinc-600 px-4 focus-within:border-white sm:w-96">
        <Search aria-hidden="true" className="size-4 shrink-0 text-zinc-400" />
        <span className="sr-only">{labels.search}</span>
        <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={labels.search}
          className="min-w-0 flex-1 bg-transparent py-3 text-base text-white caret-brand-red outline-none placeholder:text-zinc-400" />
      </label>
      {!term && <ArticleCard article={featured} labels={labels} featured />}
      {term && !results.length && (
        <div className="flex flex-wrap items-center gap-4">
          <p role="status" className="text-zinc-300">{labels.noResults}</p>
          <button type="button" onClick={() => setQuery('')} className="min-h-12 underline decoration-brand-red underline-offset-4 focus-visible:ring-2 focus-visible:ring-brand-red">{labels.clear}</button>
        </div>
      )}
      {results.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {results.map(article => <ArticleCard key={article.slug} article={article} labels={labels} />)}
        </div>
      )}
    </div>
  )
}
