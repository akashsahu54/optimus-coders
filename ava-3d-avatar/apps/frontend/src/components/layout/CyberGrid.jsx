export const CyberGrid = () => {
  return (
    <>
      <div className="cyber-grid" />
      <div className="scan-lines" />
      {/* Main teal glow - left side */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 20% 30%, rgba(0, 255, 200, 0.12) 0%, transparent 40%)',
        }}
      />
      {/* Secondary glow - right side for chat panel blend */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 80% 50%, rgba(0, 255, 200, 0.06) 0%, transparent 35%)',
        }}
      />
      {/* Connecting glow line */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[70%] pointer-events-none z-0"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0, 255, 200, 0.4), transparent)',
        }}
      />
    </>
  );
};
