"use client";

import Navbar from "./layout_navbar";
import Sidebar from "./layout_sidebar";
import { class_screen } from "../../utils/glable_function";

interface MainLayoutProps {
  page: React.ReactNode;
}

export default function MainLayout({ page }: MainLayoutProps) {
  return (
    <div className={class_screen()}>
      <div className="home">
        <Sidebar />
        <div className="homeContainer">
          <Navbar />
          {page}
        </div>
      </div>
    </div>
  );
}
