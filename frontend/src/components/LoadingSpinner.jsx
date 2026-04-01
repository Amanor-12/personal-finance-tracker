export default function LoadingSpinner({ fullScreen = false, label = 'Loading...' }) {
  return (
    <div className={`loading-state ${fullScreen ? 'loading-state--fullscreen' : ''}`}>
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}
