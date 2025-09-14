import React, { useState, useMemo } from 'react';
import { Table } from './Table';

type SortDirection = 'asc' | 'desc';
type SortPrimitive = string | number | boolean | Date | null | undefined;

interface Column<T> {
  property         : keyof T | 'noproperty';
  label?           : string;
  displayValue?    : (item: T) => React.ReactNode;
  sortValue?       : (item: T) => SortPrimitive;
  defaultSortDir?  : SortDirection;
  isSortable?      : boolean;
  width?           : string;
  minDisplayWidth ?: number;
}

interface IProps<T> {
  data              : T[] | null;
  columns           : Column<T>[];
  caption           : string;
  rowKey?           : keyof T;
  className?        : string;
  isResponsive?     : boolean;
  isStriped?        : boolean;
  isSticky?         : boolean;
  includeRowNumber? : boolean;
  rowNumberLabel?   : string;
}

export function SortableTable<T>(props: IProps<T>) {
  // Force re-render on window resize
  const [, setWindowWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {
    data,
    rowKey,
    columns,
    className,
    isResponsive,
    isStriped,
    isSticky,
    includeRowNumber = true,
    rowNumberLabel   = '#',
    caption,
    ...rest
  } = props;

  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  // Reuse one collator instance for natural, case-insensitive sorting
  const collator = useMemo(
    () => new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }),
    []
  );

  const handleSort = (column: Column<T>) => {
    if (!column.isSortable || column.property === null || column.property === 'noproperty') return;

    if (sortKey === column.property) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(column.property);
      setSortDir(column.defaultSortDir || 'asc');
    }
  };

  const hideCol = (column : Column<T>) => {
    return column.minDisplayWidth && column.minDisplayWidth > window.innerWidth;
  }

  const sortedData = useMemo(() => {
    if (!data || sortKey === 'noproperty') return data || [];

    const column = columns.find(c => c.property === sortKey);
    if (!column) return data;

    // Narrow sortKey to an actual key of T (we already checked for 'noproperty')
    const key = sortKey as keyof T;

    // Use provided sortValue or default to the property on the item.
    // Cast to SortPrimitive at the edge (no `any`).
    const getSortValue: (item: T) => SortPrimitive =
      column.sortValue ?? ((item: T) => item[key] as unknown as SortPrimitive);

    const dir = sortDir === 'desc' ? -1 : 1;

    return [...data].sort((a, b) => {
      let va = getSortValue(a);
      let vb = getSortValue(b);

      // null/undefined handling: group nulls first in asc
      const aNull = va == null;
      const bNull = vb == null;
      if (aNull && bNull) return 0;
      if (aNull) return -1 * dir;
      if (bNull) return  1 * dir;

      // Dates → numbers
      if (va instanceof Date) va = va.getTime();
      if (vb instanceof Date) vb = vb.getTime();

      // Strings → locale/numeric compare
      if (typeof va === 'string' && typeof vb === 'string') {
        return dir * collator.compare(va, vb);
      }

      // Numbers/booleans → numeric compare (booleans: false=0, true=1)
      const aNum = typeof va === 'number' ? va : typeof va === 'boolean' ? Number(va) : Number.NaN;
      const bNum = typeof vb === 'number' ? vb : typeof vb === 'boolean' ? Number(vb) : Number.NaN;

      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
        if (aNum > bNum) return  1 * dir;
        if (aNum < bNum) return -1 * dir;
        return 0;
      }

      // Fallback: compare stringified values with collator
      return dir * collator.compare(String(va), String(vb));
    });
  }, [data, sortKey, sortDir, columns, collator]);

  return (
    <Table
      className={className}
      isResponsive={isResponsive}
      isStriped={isStriped}
      isSticky={isSticky}
      caption={caption}
      {...rest}
    >
      <colgroup>
        {includeRowNumber && <col style={{ width: '50px' }} />}
        {columns.map((col, idx) => (
          <col key={idx} style={{ width: col.width || 'auto' }} />
        ))}
      </colgroup>

      <thead>
        <tr>
          {includeRowNumber && <th className='row-number'>{rowNumberLabel}</th>}
          {columns.map((col) => {
            const isSorted  = sortKey === col.property;
            const dirSymbol = isSorted ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';
            return hideCol(col) ? null : (
              <th
                key={String(col.property)}
                onClick={() => handleSort(col)}
                style={{ cursor: col.isSortable === false ? 'default' : 'pointer' }}
              >
                {col.label || String(col.property)}{dirSymbol}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {data && sortedData.map((item, idx) => {
          const keyVal = rowKey ? item[rowKey] : undefined;
          const rowId = keyVal != null ? String(keyVal) : String(idx);

          return (
            <tr key={rowId}>
              {includeRowNumber && <td className='row-number'>{idx + 1}</td>}

              {columns.map((col, colIdx) => {
                const render = col.displayValue
                  ? col.displayValue
                  : (row: T) =>
                      col.property !== 'noproperty'
                        ? <>{String(row[col.property as keyof T])}</>
                        : <></>;
                return hideCol(col) ? null : <td key={colIdx}>{render(item)}</td>;
              })}
            </tr>
          );
        })}
        {data === null && [1,2,3].map((index) => {
            return <tr className='placeholder-glow' key={`placeholder-${index}`}>
                {includeRowNumber && <th className='row-number'>{rowNumberLabel}</th>}
                {columns.map((col) => {
                    return hideCol(col) ? null : (
                    <td key={String(col.property)}><div className='placeholder col-12'>&nbsp;</div></td>
                    );
                })}
            </tr>
        })}
      </tbody>
    </Table>
  );
}
