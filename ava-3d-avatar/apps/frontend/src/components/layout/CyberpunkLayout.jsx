import { CyberGrid } from './CyberGrid';
import { ParticleField } from '../effects/ParticleField';

export const CyberpunkLayout = ({ children, showParticles = false }) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <CyberGrid />
      {showParticles && <ParticleField count={30} />}
      {children}
    </div>
  );
};
