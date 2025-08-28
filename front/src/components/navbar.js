import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Home, 
  Sprout, 
  FlaskConical, 
  Bug, 
  BarChart3,
  Leaf,
  MapPin
  
} from 'lucide-react';

const Navbar = () => {
  const router = useRouter();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/soilanalysis', label: 'SoilAnalysis', icon: Leaf },
    { href: '/crop', label: 'Crop', icon: Sprout },
    { href: '/fertilizer', label: 'Fertilizer', icon: FlaskConical },
    { href: '/pest', label: 'Pest', icon: Bug },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 }
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="logo">
          <Leaf size={32} />
          <span>AgroPulse</span>
        </Link>
        
        <ul className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;