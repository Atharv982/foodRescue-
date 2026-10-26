'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
  badge?: string;
  hint?: string;
}

interface CustomDropdownProps {
  label?: string;
  icon?: ReactNode;
  value: string;
  options: (DropdownOption | string)[];
  onChange: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CustomDropdown({
  label,
  icon,
  value,
  options,
  onChange,
  defaultValue,
  placeholder = 'Select option...',
  searchable = false,
  clearable = true,
  className = '',
  size = 'md',
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options to DropdownOption objects
  const normalizedOptions: DropdownOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  // Find currently selected option
  const selectedOption = normalizedOptions.find((opt) => opt.value === value) || {
    value,
    label: value || placeholder,
  };

  const isDefault = defaultValue !== undefined ? value === defaultValue : false;
  const isChanged = defaultValue !== undefined ? value !== defaultValue : Boolean(value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen, searchable]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Filtered options based on search query
  const filteredOptions = normalizedOptions.filter((opt) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      opt.label.toLowerCase().includes(q) ||
      (opt.badge && opt.badge.toLowerCase().includes(q)) ||
      (opt.hint && opt.hint.toLowerCase().includes(q))
    );
  });

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (defaultValue !== undefined) {
      onChange(defaultValue);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="mb-1.5 flex items-center justify-between text-[11px] font-bold tracking-wider text-ink/50 uppercase">
          <span className="flex items-center gap-1.5">
            {icon && <span className="text-moss">{icon}</span>}
            {label}
          </span>
          {isChanged && !isDefault && defaultValue !== undefined && clearable && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[10px] font-extrabold text-tomato hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`group flex w-full items-center justify-between gap-2 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
          size === 'sm'
            ? 'px-3 py-2 text-xs'
            : size === 'lg'
            ? 'px-4 py-3.5 text-sm'
            : 'px-3.5 py-2.5 text-xs'
        } ${
          isOpen
            ? 'border-moss bg-white shadow-md ring-2 ring-moss/10'
            : isChanged && !isDefault
            ? 'border-moss/40 bg-sage/20 text-ink font-bold shadow-2xs hover:bg-sage/30'
            : 'border-ink/10 bg-cream/50 text-ink/80 hover:border-ink/25 hover:bg-white'
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          {!label && icon && (
            <span className={`shrink-0 transition-colors ${isOpen || (isChanged && !isDefault) ? 'text-moss' : 'text-ink/40'}`}>
              {icon}
            </span>
          )}
          {selectedOption.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate font-semibold text-ink">
            {selectedOption.label}
          </span>
          {selectedOption.badge && (
            <span className="hidden sm:inline-flex rounded-full bg-moss/10 px-1.5 py-0.5 text-[9px] font-extrabold text-moss shrink-0">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          {isChanged && !isDefault && (
            <span className="h-2 w-2 rounded-full bg-moss animate-pulse" title="Filter active" />
          )}
          <ChevronDown
            size={15}
            className={`text-ink/40 transition-transform duration-200 group-hover:text-ink ${
              isOpen ? 'rotate-180 text-moss' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 z-50 mt-2 max-h-80 w-full min-w-[240px] overflow-hidden rounded-2xl border border-ink/10 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
          style={{ width: 'max(100%, 240px)' }}
        >
          {/* Optional Search Input */}
          {(searchable || normalizedOptions.length > 5) && (
            <div className="p-1.5 pb-2 border-b border-ink/5">
              <div className="relative flex items-center">
                <Search size={13} className="absolute left-2.5 text-ink/40" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${label || 'options'}...`}
                  className="w-full rounded-xl border border-ink/10 bg-cream/40 py-1.5 pl-8 pr-7 text-xs font-medium text-ink placeholder:text-ink/40 focus:border-moss focus:bg-white focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-ink/40 hover:text-ink cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1 space-y-0.5 overscroll-contain">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-ink/50">
                No matching options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs transition duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-moss text-white font-bold shadow-xs'
                        : 'text-ink/80 hover:bg-cream hover:text-ink font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {opt.icon && (
                        <span className={`shrink-0 ${isSelected ? 'text-white' : 'text-moss'}`}>
                          {opt.icon}
                        </span>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="truncate">{opt.label}</span>
                        {opt.hint && (
                          <span
                            className={`text-[10px] truncate ${
                              isSelected ? 'text-white/80' : 'text-ink/40'
                            }`}
                          >
                            {opt.hint}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {opt.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-ink/5 text-ink/60'
                          }`}
                        >
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check size={14} className="text-white shrink-0" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
