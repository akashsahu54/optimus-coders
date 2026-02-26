export const CyberGrid = () => {
  return (
    <>
      <div className="cyber-grid" />
      <div className="scan-lines" />
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 245, 255, 0.05) 0%, transparent 50%)',
        }}
      />
    </>
  );
};
