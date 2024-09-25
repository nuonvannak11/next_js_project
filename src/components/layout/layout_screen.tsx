"use client";

import { class_screen } from "../../utils/glable_function";

interface MainLayoutProps {
  page: React.ReactNode;
}

export default function ScreenLayout({ page }: MainLayoutProps) {
  return <div className={class_screen()}>{page}</div>;
}
