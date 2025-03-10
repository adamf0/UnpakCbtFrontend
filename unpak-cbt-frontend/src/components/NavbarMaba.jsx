const NavbarMaba = ({ children }) => {
  return (
    <nav className="bg-white shadow-md py-4 px-4 md:px-8 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {children}
      </div>
    </nav>
  );
};

export default NavbarMaba;
