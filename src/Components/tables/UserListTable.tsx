import { useMemo, useState } from 'react';
import type { UserListRow } from '../../types/userList';
import { VERTICAL_COLORS, VERTICAL_FALLBACK_STYLE } from '../../Constants/userListData';
import styles from './UserListTable.module.scss';

interface UserListTableProps {
  rows?: UserListRow[];
  pageSize?: number;
  onLoadMore?: () => void;
}

function InfoIcon() {
  return (
    <svg className={styles.infoIcon} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" />
      <line x1="12" y1="10.75" x2="12" y2="16.5" />
      <circle cx="12" cy="7.75" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.2" y1="16.2" x2="21" y2="21" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 5h16L14 13v6l-4 2v-8L4 5Z" strokeLinejoin="round" />
    </svg>
  );
}

export default function UserListTable({
  rows = [],
  pageSize = 10,
  onLoadMore,
}: UserListTableProps) {
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const filteredRows = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return rows;
    return rows.filter((row) => row.quinId.includes(trimmed));
  }, [rows, query]);

  const visibleRows = filteredRows.slice(0, visibleCount);
  const hasMore = visibleCount < filteredRows.length;

  const handleLoadMore = () => {
    setVisibleCount((count) => count + pageSize);
    onLoadMore?.();
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>User List</span>
          <InfoIcon />
        </div>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <SearchIcon />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by an Event or Quin ID"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleCount(pageSize);
              }}
            />
          </div>
          <button type="button" className={styles.filterButton} aria-label="Filter users">
            <FilterIcon />
          </button>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <div className={`${styles.row} ${styles.headRow}`}>
          <div>Quin ID</div>
          <div>
            Number of
            <br />
            Events
          </div>
          <div>
            Number of
            <br />
            Products
          </div>
          <div>Vertical(s)</div>
        </div>

        {visibleRows.map((row) => (
          <div key={row.id} className={styles.row}>
            <div className={styles.quinId}>{row.quinId}</div>
            <div>{row.numberOfEvents}</div>
            <div>{row.numberOfProducts}</div>
            <div className={styles.verticals}>
              {row.verticals.map((vertical) => {
                const style = VERTICAL_COLORS[vertical] || VERTICAL_FALLBACK_STYLE;
                return (
                  <span
                    key={vertical}
                    className={styles.badge}
                    style={{ background: style.background, color: style.color }}
                  >
                    {vertical}
                  </span>
                );
              })}
            </div>
          </div>
        ))}

        {visibleRows.length === 0 && <div className={styles.emptyState}>No users match your search.</div>}
      </div>

      {hasMore && (
        <div className={styles.footer}>
          <button type="button" className={styles.loadMoreButton} onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
