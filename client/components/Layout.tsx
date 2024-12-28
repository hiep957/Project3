import { ReactNode } from "react";
import Header from "./Header";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Container } from "@mui/material";
interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <div>{children}</div>

      <footer className="bg-gray-300 text-black py-12 mt-8">
        <Container maxWidth={false} sx={{ maxWidth: "1280px" }}>
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Our Store</h3>
              <p className="text-sm text-gray-300">
                Quality products, exceptional service, and unbeatable prices.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/products" className="hover:text-gray-300">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-gray-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-gray-300">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-gray-300">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-xl font-bold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/shipping" className="hover:text-gray-300">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-gray-300">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-gray-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-gray-300">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone size={20} className="mr-2" />
                  <span>+84 123 456 7890</span>
                </div>
                <div className="flex items-center">
                  <Mail size={20} className="mr-2" />
                  <span>support@ourstore.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={20} className="mr-2" />
                  <span>123 E-commerce Street, City, Country</span>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="flex space-x-4 mt-4">
                <Link href="#" className="hover:text-gray-300">
                  <Facebook />
                </Link>
                <Link href="#" className="hover:text-gray-300">
                  <Instagram />
                </Link>
                <Link href="#" className="hover:text-gray-300">
                  <Twitter />
                </Link>
                <Link href="#" className="hover:text-gray-300">
                  <Linkedin />
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright */}
          
        </Container>
        <div className="bg-gray-900 py-4 mt-8">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Our Store. All Rights Reserved.
              </p>
            </div>
          </div>
      </footer>
    </>
  );
};
