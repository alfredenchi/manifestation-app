import { Link, useLocation } from 'react-router-dom';

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-md text-base font-bold transition-all duration-300 ${
        isActive 
          ? 'bg-amber-400 text-black font-extrabold shadow-lg shadow-amber-400/50' 
          : 'text-amber-400 hover:text-amber-300 hover:bg-black/50'
      }`}
    >
      {children}
    </Link>
  );
}

const Navigation = () => {
  return (
    <nav className="h-16 w-full bg-black shadow-xl border-b-2 border-amber-400 fixed top-0 left-0 right-0 z-[9999]">
      <div className="container mx-auto px-4 h-full">
        <div className="h-full flex items-center justify-between">
          <Link to="/" className="text-amber-400 text-xl font-bold hover:text-amber-300 transition-colors duration-300">
            Videos
          </Link>
          <div className="flex items-center">
            <NavLink to="/readme">Principles</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 