"use client";

import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

// we use - use client because every component by default in app folder is a server component
// by default, means we'll not be able to use hooks and other interactivity

type Props = {
  label: string;
  iconSrc: string;
  href: string;
};

export const SidebarItem = ({ label, iconSrc, href }: Props) => {
  const pathName = usePathname();
  // To check whether this sidebar item is active or not
  const active = pathName === href;
  return (
    <Button
      variant={active ? "sidebarOutline" : "sidebar"}
      className="justify-start h-[62px]"
    >
      <Link href={href}>
        <Image
          src={iconSrc}
          alt={label}
          className="mr-5"
          height={32}
          width={32}
        />
        {label}
      </Link>
    </Button>
  );
};
