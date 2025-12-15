import React from 'react';

export interface CatalogControlsProps {
  filter: string;
  sort: 'asc' | 'desc';
  running: boolean;
  addCount: number;
  removeCount: number;
  selectedCount: number;
  onFilterChange: (v: string) => void;
  onSortChange: (v: 'asc' | 'desc') => void;
  onToggleRunning: () => void;
  onToggleShowCards: () => void;
  onAddCountChange: (n: number) => void;
  onRemoveCountChange: (n: number) => void;
  onAdd: (count: number) => void;
  onRemoveRandom: (count: number) => void;
  onRemoveSelected: () => void;
}

export const CatalogControls: React.FC<CatalogControlsProps> = ({
  filter,
  sort,
  running,
  addCount,
  removeCount,
  selectedCount,
  onFilterChange,
  onSortChange,
  onToggleRunning,
  onToggleShowCards,
  onAddCountChange,
  onRemoveCountChange,
  onAdd,
  onRemoveRandom,
  onRemoveSelected,
}) => {
  return (
    <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
      <input
        placeholder="фильтр"
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
      />
      <select value={sort} onChange={(e) => onSortChange(e.target.value as 'asc' | 'desc')}>
        <option value="asc">по возрастанию</option>
        <option value="desc">по убыванию</option>
      </select>
      <button onClick={onToggleRunning}>{running ? 'Остановить обновления' : 'Запустить обновления'}</button>
      <button onClick={onToggleShowCards}>Показать/скрыть карточки</button>
      <span style={{marginLeft:12}}>Добавить</span>
      <input
        type="number"
        style={{width:80}}
        value={addCount}
        onChange={(e) => onAddCountChange(Number(e.target.value))}
      />
      <button onClick={() => onAdd(addCount)}>Добавить</button>
      <span>Удалить случайные</span>
      <input
        type="number"
        style={{width:80}}
        value={removeCount}
        onChange={(e) => onRemoveCountChange(Number(e.target.value))}
      />
      <button onClick={() => onRemoveRandom(removeCount)}>Удалить</button>
      <button onClick={onRemoveSelected} disabled={selectedCount === 0}>
        Удалить выбранные ({selectedCount})
      </button>
    </div>
  );
};

export default CatalogControls;
