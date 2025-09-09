import { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Square,
  Palette,
  Building,
  Car,
  TreePine,
  Users,
} from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const categories = [
    { name: "Characters", icon: Users, active: true },
    { name: "Architecture", icon: Building, active: false },
    { name: "Vehicles", icon: Car, active: false },
    { name: "Nature", icon: TreePine, active: false },
    { name: "Textures", icon: Palette, active: false },
  ];

  return (
    <>
      <header
        className={`transition-all duration-500 ease-in-out z-50 ${
          isScrolled
            ? "fixed top-0 left-0 right-0 bg-black/70 backdrop-blur-md border-b border-gray-700/30 shadow-lg"
            : "absolute top-0 left-0 right-0 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-3 transition-all duration-500 ease-in-out">
          {/* Main Header Row */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 transition-all duration-500 ease-in-out">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-2 rounded-xl transition-all duration-500">
                  <Square className="text-white" size={24} />
                </div>
                <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent text-2xl font-bold transition-all duration-500">
                  Asset3D
                </div>
              </div>
            </div>

            {/* Navigation - Desktop Only */}
            <nav className="hidden lg:flex items-center gap-8 transition-all duration-500 ease-in-out">
              <a
                href="#"
                className="text-gray-300 hover:text-white font-medium transition-colors duration-300"
              >
                Browse
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white font-medium transition-colors duration-300"
              >
                Collections
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white font-medium transition-colors duration-300"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white font-medium transition-colors duration-300"
              >
                About
              </a>
              <div className="relative group">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-300"
                >
                  Categories
                </a>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-10 bg-zinc-950 rounded-lg shadow-lg opacity-0 scale-95 group-hover:opacity-100 hover:scale-100 transition-all duration-300 ease-in-out min-w-xl">
                  <div className="py-4 grid grid-cols-2">
                    {categories.map((category, index) => (
                      <a
                        key={index}
                        href="#"
                        className={`block px-4 mx-4 py-2 text-sm text-gray-300 hover:bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl hover:text-white transition-colors duration-300 ${
                          category.active
                            ? "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-white rounded-2xl"
                            : "bg-transparent"
                        }`}
                      >
                        <category.icon
                          className="inline-block mr-2"
                          size={16}
                        />
                        {category.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            {/* Search Bar - Always visible on desktop, conditional on mobile */}
            <div
              className={`flex-1 max-w-md mx-8 transition-all duration-500 ease-in-out ${
                isScrolled ? "opacity-100" : "opacity-0 absolute"
              }`}
            >
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search 3D models, textures, materials..."
                  className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-gray-800/80 transition-all duration-500 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4 transition-all duration-500 ease-in-out">
              {/* Cart */}
              <button className="relative p-2 text-gray-300 hover:text-white transition-colors duration-300">
                <ShoppingCart size={24} />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300">
                  3
                </span>
              </button>

              {/* User Menu */}
              <div className="hidden md:flex items-center gap-2 transition-all duration-500 ease-in-out">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 bg-gray-800/50 text-white hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm">
                  <User size={18} />
                  <span>Login</span>
                </button>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg">
                  Sign Up
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Category Navigation - Shows when scrolled with smooth transition */}
          {/* <div
            className={`hidden md:flex items-center gap-3 mt-4 pt-4 border-t border-gray-700/30 transition-all duration-500 ease-in-out overflow-hidden ${
              isScrolled
                ? "max-h-20 opacity-100"
                : "max-h-0 opacity-0 border-t-0 mt-0 pt-0"
            }`}
          >
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={index}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    category.active
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  <span>{category.name}</span>
                </button>
              );
            })}
            <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-300 ml-2">
              View All Categories
            </button>
          </div> */}

          {/* Mobile Menu */}
          <div
            className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${
              isMobileMenuOpen
                ? "max-h-96 opacity-100 mt-4 pt-4 border-t border-gray-700/30"
                : "max-h-0 opacity-0"
            }`}
          >
            <nav className="flex flex-col gap-4 mb-6">
              <a
                href="#"
                className="text-gray-300 hover:text-white font-medium transition-colors duration-300"
              >
                Browse
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white font-medium transition-colors duration-300"
              >
                Collections
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white font-medium transition-colors duration-300"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white font-medium transition-colors duration-300"
              >
                About
              </a>
            </nav>

            {/* Mobile Categories */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <button
                    key={index}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      category.active
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800/50 text-white hover:bg-gray-700/50 transition-all duration-300">
                <User size={18} />
                <span>Login</span>
              </button>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-center">
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
