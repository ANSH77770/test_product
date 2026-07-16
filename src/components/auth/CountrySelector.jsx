import React, { useState } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Check, Search } from 'lucide-react';
import { COUNTRIES } from '@/lib/constants';
import { cn } from '@/lib/cn';

/**
 * Country dial code selector with flag icons and searchable dropdown list.
 * @param {object} props - Component props including selectedCountry, onSelect, countries list, and disabled state.
 */
export const CountrySelector = ({
  countries = COUNTRIES,
  selectedCountry,
  onSelect,
  disabled = false,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DropdownMenuPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuPrimitive.Trigger
        disabled={disabled}
        className={cn(
          'flex items-center gap-1.5 px-3 py-3.5 rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:z-10 disabled:opacity-50 disabled:cursor-not-allowed select-none shrink-0',
          className
        )}
        aria-label="Select country code"
      >
        <span className="text-base leading-none">{selectedCountry?.flag}</span>
        <span className="tracking-tight">{selectedCountry?.dialCode}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')} />
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="start"
          sideOffset={6}
          className="z-50 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-2xl animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 select-none"
        >
          {/* Search Box */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-800 text-slate-500">
            <Search className="w-4 h-4 shrink-0" />
            <input
              type="text"
              placeholder="Search country or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* List of Countries */}
          <div className="max-h-56 overflow-y-auto pr-1 space-y-0.5">
            {filteredCountries.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">No country found</div>
            ) : (
              filteredCountries.map((country) => {
                const isSelected = selectedCountry?.code === country.code;
                return (
                  <DropdownMenuPrimitive.Item
                    key={`${country.code}-${country.dialCode}`}
                    onSelect={() => {
                      onSelect?.(country);
                      setSearchQuery('');
                    }}
                    className={cn(
                      'flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors outline-none select-none',
                      isSelected
                        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base leading-none">{country.flag}</span>
                      <span className="truncate">{country.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-slate-500 dark:text-slate-400">{country.dialCode}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                    </div>
                  </DropdownMenuPrimitive.Item>
                );
              })
            )}
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};
