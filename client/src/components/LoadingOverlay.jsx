function LoadingOverlay({ visible, message = 'Os mortos deliberam...' }) {
  if (!visible) return null;

  return (
    <div className="loading-overlay" aria-live="polite" aria-label="Carregando">
      <div className="loading-overlay__box">
        <span className="loading-overlay__icon">☩</span>
        <p className="loading-overlay__msg">{message}</p>
      </div>
    </div>
  );
}

export default LoadingOverlay;
