import React from 'react';

export interface CardsGridProps<T> {
  items: T[];
  render: (item: T) => React.ReactNode;
  shownLabel?: string; // e.g. 'Показано'
  total?: number; // if total differs from items.length
}

export const CardsGrid = <T,>({ items, render, shownLabel = 'Показано', total }: CardsGridProps<T>) => {
  return (
    <div>
      <div style={{margin:'8px 0'}}>{shownLabel} {items.length}{typeof total === 'number' ? ` / ${total}` : ''}</div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:12}}>
        {items.map(render)}
      </div>
    </div>
  );
};

export default CardsGrid;
