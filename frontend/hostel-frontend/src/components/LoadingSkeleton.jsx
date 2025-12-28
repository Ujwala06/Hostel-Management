// src/components/LoadingSkeleton.jsx - Create this file
export default function LoadingSkeleton({ count = 1, type = 'table' }) {
  return (
    <div className="loading-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton skeleton--${type}`}>
          <div className="skeleton__line skeleton__line--long"></div>
          <div className="skeleton__line skeleton__line--short"></div>
        </div>
      ))}
    </div>
  );
}
