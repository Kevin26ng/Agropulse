import Link from 'next/link';
import Image from 'next/image';
import { 
  Sprout, 
  FlaskConical, 
  Bug, 
  BarChart3,
  CloudRain,
  Thermometer,
  Droplets,
  Leaf
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      href: '/crop',
      icon: Sprout,
      title: 'Crop Recommendation',
      description: 'Get intelligent crop suggestions based on soil conditions and weather patterns'
    },
    {
      href: '/fertilizer',
      icon: FlaskConical,
      title: 'Fertilizer Analysis',
      description: 'Optimize fertilizer usage with personalized recommendations'
    },
    {
      href: '/pest',
      icon: Bug,
      title: 'Pest Detection',
      description: 'Identify pests quickly with AI-powered image recognition'
    },
    {
      href: '/dashboard',
      icon: BarChart3,
      title: 'Farm Dashboard',
      description: 'Monitor your farm performance with comprehensive analytics'
    }
  ];

  const stats = [
    { icon: CloudRain, label: 'Rainfall', value: '120mm' },
    { icon: Thermometer, label: 'Temperature', value: '28°C' },
    { icon: Droplets, label: 'Humidity', value: '65%' }
  ];


  return (
    <div>
      {/* Hero Section */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="icon-wrapper" style={{ margin: '0 auto 1rem' }}>
          <Leaf size={32} />
        </div>




         {/*Image */}
        <div style={{ margin: '1rem 0' }}>
          <Image 
            src="/img/agropulse.png"   //
            alt="Agropulse"
             width={1200}
             height={100}
/>
</div>


      </div>

      {/* Weather Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card" style={{ textAlign: 'center' }}>
              <Icon size={32} style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }} />
              <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem' }}>{stat.value}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Features Grid */}
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-primary)' }}>
        What would you like to do today?
      </h2>
      
      <div className="dashboard-grid">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.href} href={feature.href}>
              <div className="card feature-card">
                <div className="icon-wrapper">
                  <Icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
          <div className="card" style={{ marginTop: '3rem', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1rem' }}>Need immediate assistance?</h3>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/crop">
            <button className="btn btn-primary">
              <Sprout size={20} />
              Quick Crop Check
            </button>
          </Link>
          <Link href="/pest">
            <button className="btn btn-secondary">
              <Bug size={20} />
              Pest Scan
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}