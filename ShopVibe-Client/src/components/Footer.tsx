import { Facebook, Instagram, Twitter, Youtube, Mail, Phone } from "lucide-react";
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaGooglePay } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-5 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Column 1 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">ShopVibe</h3>
          <p className="text-sm leading-6">
            ShopVibe is your trusted online shopping destination — bringing you the best
            deals across fashion, electronics, home, and more. Quality you can count on.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Track Your Order</a></li>
            <li><a href="#" className="hover:text-white">Returns & Refunds</a></li>
            <li><a href="#" className="hover:text-white">Report a Product</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">About Us</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Our Story</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
            <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Connect With Us</h4>
          <div className="flex space-x-4 mb-4">
            <a href="#" className="hover:text-white"><Facebook /></a>
            <a href="#" className="hover:text-white"><Instagram /></a>
            <a href="#" className="hover:text-white"><Twitter /></a>
            <a href="#" className="hover:text-white"><Youtube /></a>
          </div>
          <div className="text-sm space-y-2">
            <p className="flex items-center gap-2"><Mail size={16}/> support@shopvibe.com</p>
            <p className="flex items-center gap-2"><Phone size={16}/> +91 860602 9663</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700"></div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-5 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} ShopVibe. All rights reserved.</p>
        <div className="flex space-x-3 mt-2 sm:mt-0">
            <FaCcVisa className="text-blue-600 text-2xl" />
            <FaCcMastercard className="text-red-500 text-2xl" />
            <FaCcPaypal className="text-sky-600 text-2xl" />
            <FaGooglePay className="text-green-600 text-2xl" />
        </div>
      </div>
    </footer>
  );
}
