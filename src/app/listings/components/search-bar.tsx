'use client';

import { useState, useEffect, useRef, type FormEvent } from 'react';
import { MapPin, Search, Stethoscope } from 'lucide-react';
import { CATEGORIES, type CategoryId } from './categories';
import { useSearchParams } from 'next/navigation';

export interface SearchValues {
  what: string; // business name or service
  where: string; // county / city / town
}

interface Props {
  category: CategoryId;
  onCategoryChange: (c: CategoryId) => void;
  onSearch: (q: SearchValues) => void;
}

const segment =
  'flex min-w-0 flex-1 items-center gap-2.5 border-b border-gray-100 px-4 py-2 last:border-b-0 sm:border-b-0 sm:border-r';
const labelCls = 'block text-[11px] font-medium text-gray-500';
const controlCls =
  'w-full min-w-0 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none';

export default function SearchBar({ category, onCategoryChange, onSearch }: Props) {
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const [what, setWhat] = useState(initialQuery);
  const [where, setWhere] = useState('');

  const isFirstRender = useRef(true);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      if (initialQuery.trim()) {
        onSearchRef.current({
          what: initialQuery.trim(),
          where: '',
        });
      }

      return;
    }

    const timer = setTimeout(() => {
      onSearchRef.current({
        what: what.trim(),
        where: where.trim(),
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [what, where, initialQuery]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch({ what: what.trim(), where: where.trim() });
  };

  return (
    <div className="bg-[#E8EDF1]/60 py-4 sm:py-5">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={submit}
          role="search"
          aria-label="Find care"
          className="flex flex-col rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm sm:flex-row sm:items-center sm:rounded-full"
        >
          <label className={segment}>
            <Search className="h-4 w-4 shrink-0 text-[#0C486D]" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className={labelCls}>Category</span>
              <select
                className={`${controlCls} cursor-pointer font-medium`}
                value={category}
                onChange={(e) => onCategoryChange(e.target.value as CategoryId)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </span>
          </label>

          <label className={segment}>
            <Stethoscope className="h-4 w-4 shrink-0 text-[#0C486D]" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className={labelCls}>What</span>
              <input
                className={controlCls}
                type="search"
                placeholder="Name or service"
                value={what}
                onChange={(e) => setWhat(e.target.value)}
              />
            </span>
          </label>

          <label className={segment}>
            <MapPin className="h-4 w-4 shrink-0 text-[#0C486D]" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className={labelCls}>Where</span>
              <input
                className={controlCls}
                type="text"
                placeholder="County or city"
                value={where}
                onChange={(e) => setWhere(e.target.value)}
              />
            </span>
          </label>

          <button
            type="submit"
            className="m-1 h-11 shrink-0 rounded-full bg-[#0C486D] px-7 text-sm font-medium text-white transition-colors hover:bg-[#0a3b5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C486D]"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}