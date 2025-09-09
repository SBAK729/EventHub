// /components/shared/MainFooter.tsx

import Image from "next/image";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

const MainFooter = () => {
  return (
    <footer className="bg-gradient-to-r from-[#4E3C7B] to-[#6950A4] text-white py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Image
              src="/assets/images/logo.png"
              width={128}
              height={38}
              alt="EventHub logo"
              className="mb-4"
            />
            <p className="text-white/80 text-sm text-pretty">
              Connecting communities through meaningful events. Discover, create, and participate in local experiences that bring people together.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-white/80 hover:text-white">Home</a></li>
              <li><a href="#" className="text-white/80 hover:text-white">My Events</a></li>
              <li><a href="#" className="text-white/80 hover:text-white">Create Event</a></li>
              <li><a href="#" className="text-white/80 hover:text-white">Search Event</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-white/80 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-white/80 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-white/80 hover:text-white">Community Guidelines</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 text-white/80 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-white/80 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 text-white/80 hover:text-white cursor-pointer" />
              <Github className="w-5 h-5 text-white/80 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;