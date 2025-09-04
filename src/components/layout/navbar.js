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
        className={`transition-all duration-300 z-50 ${
          isScrolled
            ? "fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-md border-b border-gray-700/50 shadow-xl"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          {/* Main Header Row */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-2 rounded-xl">
                  <Square className="text-white" size={24} />
                </div>
                <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent text-2xl font-bold">
                  Asset3D
                </div>
              </div>
            </div>

            {/* Navigation - Desktop Only */}
            <nav className="hidden lg:flex items-center gap-8">
              <a
                href="#"
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                Browse
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                Collections
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                About
              </a>
            </nav>

            {/* Search Bar - Always visible on desktop, conditional on mobile */}
            <div
              className={`flex-1 max-w-md mx-8 ${
                isScrolled ? "block" : "hidden"
              }`}
            >
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search 3D models, textures, materials..."
                  className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-gray-800/80 transition-all backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
                <ShoppingCart size={24} />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Menu */}
              <div className="hidden md:flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 bg-gray-800/50 text-white hover:bg-gray-700/50 transition-all backdrop-blur-sm">
                  <User size={18} />
                  <span>Login</span>
                </button>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg">
                  Sign Up
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Category Navigation - Shows when scrolled */}
          {isScrolled && (
            <div className="hidden md:flex items-center gap-3 mt-4 pt-4 border-t border-gray-700/30">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <button
                    key={index}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
              <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors ml-2">
                View All Categories
              </button>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-700/30">
              <nav className="flex flex-col gap-4 mb-6">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white font-medium transition-colors"
                >
                  Browse
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white font-medium transition-colors"
                >
                  Collections
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white font-medium transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white font-medium transition-colors"
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
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
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
                <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800/50 text-white hover:bg-gray-700/50 transition-all">
                  <User size={18} />
                  <span>Login</span>
                </button>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-center">
                  Sign Up Free
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
