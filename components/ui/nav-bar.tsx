"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "../user-context";
import { Button } from "./button";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const pathname = usePathname();
  const routeName = pathname === "/" ? "" : `/${pathname.slice(1)}`;
  const { user } = useUser();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase())
      .join("");
  };

  const NavItems = () => (
    <>
      <NavigationMenuItem>
        <Link href="/dashboard" legacyBehavior passHref>
          <NavigationMenuLink className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
            Dashboard
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/explore-projects" legacyBehavior passHref>
          <NavigationMenuLink className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
            Explore Projects
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </>
  );

  return (
    <header className="sticky top-0 w-full py-4 px-4 bg-neutral-900 bg-opacity-30 backdrop-blur-lg z-50">
      <div className="w-full flex justify-between items-center h-auto max-w-7xl mx-auto">
        <Link href="/" className="text-3xl font-bold text-primary" aria-label="Home">
          /Open-Space
          {routeName && <span className="text-stone-500">{routeName}</span>}
        </Link>
        
        {session ? (
          <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <NavigationMenu>
                <NavigationMenuList className="flex space-x-4">
                  <NavItems />
                </NavigationMenuList>
              </NavigationMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage
                      src={user?.githubAvatarUrl}
                      alt="User avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                    <AvatarFallback className="rounded-full">
                      {user?.name ? getUserInitials(user.name) : "NN"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={() => signOut()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col space-y-4 mt-4">
                    <Link href="/dashboard" className="w-full">
                      <Button variant="ghost" className="w-full justify-start">
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/explore-projects" className="w-full">
                      <Button variant="ghost" className="w-full justify-start">
                        Explore Projects
                      </Button>
                    </Link>
                    <div className="my-2 border-t border-border" />
                    <Link href="/profile" className="w-full">
                      <Button variant="ghost" className="w-full justify-start">
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => signOut()}
                    >
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </>
        ) : (
          <Button>Login</Button>
        )}
      </div>
    </header>
  );
}
