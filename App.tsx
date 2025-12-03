import React, { useState, useMemo } from 'react';
import { RUNEWORDS, ALL_ITEM_TYPES } from './data';
import { FilterState, SortOption, Runeword } from './types';
import FilterSidebar from './components/FilterSidebar';
import RunewordCard from './components/RunewordCard';
import StatsDashboard from './components/StatsDashboard';
import { Scroll, SortAsc, SortDesc } from 'lucide-react';

function App() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    minLevel: 0,
    maxLevel: 99,
    sockets: [],
    selectedTypes: [],
    category: 'All'
  });

  const [sortOption, setSortOption] = useState<SortOption>(SortOption.LEVEL_ASC);

  const filteredRunewords = useMemo(() => {
    return RUNEWORDS.filter(item => {
      // Search (Name or Stats)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(searchLower);
        const matchesStats = item.stats.some(stat => stat.toLowerCase().includes(searchLower));
        
        if (!matchesName && !matchesStats) return false;
      }
      
      // Level
      if (item.minLevel < filters.minLevel || item.minLevel > filters.maxLevel) return false;
      
      // Sockets
      if (filters.sockets.length > 0 && !filters.sockets.includes(item.sockets)) return false;
      
      // Types
      if (filters.selectedTypes.length > 0) {
        // Check if any of the selected types are present in the item's types
        const hasMatch = item.itemTypes.some(t => filters.selectedTypes.includes(t));
        // Special case: 'Melee Weapon' matches Axes, Swords, Maces, etc.
        // For simplicity in this demo, strict matching, but 'Weapon' matches all weapons in our data structure
        // If the item has type 'Weapon' (generic) it matches specific selection? No, usually specific -> generic
        if (!hasMatch) return false;
      }
      
      // Category Tab
      if (filters.category !== 'All' && item.category !== filters.category) return false;

      return true;
    }).sort((a, b) => {
      switch (sortOption) {
        case SortOption.LEVEL_ASC: return a.minLevel - b.minLevel;
        case SortOption.LEVEL_DESC: return b.minLevel - a.minLevel;
        case SortOption.NAME_ASC: return a.name.localeCompare(b.name);
        case SortOption.NAME_DESC: return b.name.localeCompare(a.name);
        default: return 0;
      }
    });
  }, [filters, sortOption]);

  const categories = ['All', 'Helm', 'Chest', 'Shield', 'Weapon', 'Quiver'];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-diablo-900 text-gray-200 font-sans">
      {/* Sidebar - Sticky on Desktop, Static on Mobile */}
      <aside className="lg:sticky lg:top-0 lg:h-screen z-10">
        <FilterSidebar 
          filters={filters} 
          setFilters={setFilters} 
          availableItemTypes={ALL_ITEM_TYPES} 
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
        <header className="mb-8 border-b border-diablo-700 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <Scroll className="text-diablo-gold" size={32} />
            <h1 className="text-3xl lg:text-4xl font-serif text-diablo-gold tracking-wide">
              Runeword Architect
            </h1>
          </div>
          <p className="text-gray-400">Search, filter, and discover {RUNEWORDS.length} powerful rune combinations.</p>
        </header>

        <StatsDashboard data={filteredRunewords} />

        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sticky top-0 lg:static bg-diablo-900/95 p-2 lg:p-0 z-10 backdrop-blur-sm border-b border-diablo-700 lg:border-none">
          {/* Category Tabs */}
          <div className="flex overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 gap-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  filters.category === cat 
                    ? 'bg-diablo-gold text-diablo-900' 
                    : 'bg-diablo-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="w-full sm:w-48 appearance-none bg-diablo-800 border border-diablo-700 text-gray-200 rounded px-3 py-2 pr-8 focus:border-diablo-gold focus:outline-none"
              >
                {Object.values(SortOption).map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                {sortOption.includes('Low to High') || sortOption.includes('A-Z') ? <SortAsc size={16} /> : <SortDesc size={16} />}
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRunewords.length > 0 ? (
            filteredRunewords.map((item) => (
              <RunewordCard key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500 bg-diablo-800/30 rounded-lg border border-dashed border-diablo-700">
              <p className="text-xl font-serif mb-2">No Runewords Found</p>
              <p className="text-sm">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;