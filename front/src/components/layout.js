import Navbar from './navbar.js';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;