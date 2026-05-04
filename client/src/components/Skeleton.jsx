export default function Skeleton({ width = '100%', height = '1rem', rounded = false, className = '' }) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`animate-pulse bg-slate-200 ${rounded ? 'rounded-full' : 'rounded-2xl'} ${className}`}
      style={style}
    />
  );
}
