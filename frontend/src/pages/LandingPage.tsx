import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/new');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '48px',
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative'
    }}>
      {/* 添加星空背景效果 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)',
        pointerEvents: 'none',
        zIndex: -1
      }} />

      {/* Hero Section with enhanced styling */}
      <section style={{
        textAlign: 'center',
        marginBottom: '40px',
        position: 'relative'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          background: 'linear-gradient(-45deg, #00ffff, #ff00ff, #00ffff, #ff00ff)',
          backgroundSize: '300% 300%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '24px',
          animation: 'gradient 5s ease infinite',
          textShadow: '0 0 30px rgba(0,255,255,0.3)',
          fontFamily: '"Orbitron", sans-serif'
        }}>
          Your Future Story Begins Here
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'rgba(255, 255, 255, 0.9)',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.8',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          fontFamily: '"Rajdhani", sans-serif'
        }}>
          Discover your destiny through AI-generated future diary entries, 
          preserved as unique NFTs on the SUI blockchain.
        </p>
      </section>

      {/* Enhanced Feature Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px',
        padding: '20px'
      }}>
        <FeatureCard
          icon="✨"
          title="AI Future Diary"
          description="Experience daily AI-generated future events unique to you. Each prophecy might reveal cosmic discoveries or mysterious encounters, crafting your personal journey into tomorrow."
        />
        <FeatureCard
          icon="🌌"
          title="NFT Collection & Trading"
          description="Own your future moments as NFTs on the SUI blockchain. Trade and exchange diary entries with other players to build your collection of possible destinies."
        />
        <FeatureCard
          icon="📚"
          title="Future Chronicles"
          description="Create your personal Future Chronicle by combining diary entries. Unlock hidden storylines, discover easter eggs, and explore interconnected narratives with other players."
        />
      </div>

      {/* Enhanced Call to Action */}
      <section style={{
        textAlign: 'center',
        marginTop: '40px',
        marginBottom: '60px'
      }}>
        <button 
          onClick={handleStartJourney}
          style={{
            background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
            border: 'none',
            borderRadius: '25px',
            padding: '16px 40px',
            fontSize: '1.2rem',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
            fontWeight: '600',
            fontFamily: '"Orbitron", sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          Start Your Future Journey
        </button>
      </section>
    </div>
  );
}

// Enhanced FeatureCard Component
function FeatureCard({ icon, title, description }: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        fontSize: '3rem',
        marginBottom: '16px',
        filter: 'drop-shadow(0 0 10px rgba(0,255,255,0.3))'
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '1.5rem',
        marginBottom: '12px',
        background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: '"Orbitron", sans-serif'
      }}>
        {title}
      </h3>
      <p style={{
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: '1.8',
        fontFamily: '"Rajdhani", sans-serif'
      }}>
        {description}
      </p>
    </div>
  );
} 