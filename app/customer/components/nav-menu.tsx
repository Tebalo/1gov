"use client"

import * as React from "react"
import Link from "next/link"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Teacher Application",
    href: "/customer/dashboard/teacher-application",
    description:
      "A form for teachers to apply for a registration, including personal details, qualifications, and experience.",
  },
  {
    title: "Student Application",
    href: "/customer/dashboard/student-application",
    description:
      "A form for students to apply for a registration, including personal details, educational background, and interests.",
  },
  {
    title: "Renewal Application",
    href: "/customer/dashboard/renewal-application",
    description:
      "A form for renewing an existing registration, allowing users to update their information and confirm their continued eligibility.",
  },
  {
    title: "Restoration Application",
    href: "/customer/dashboard/restoration-application",
    description: "A form for restoring a previous registration, enabling users to reactivate their account and update any necessary details.",
  },
  {
    title: "Tip-Off",
    href: "/customer/dashboard/tip-off",
    description:
      "A form for submitting a tip-off, allowing users to report concerns or issues related to the registration process or other relevant matters.",
  },
  {
    title: "Change of Category",
    href: "/customer/dashboard/change-of-category",
    description:
      "A form for changing the category of an existing registration, enabling users to update their status or classification based on new qualifications or circumstances.",
  },
]

export function CustomerNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/customer/dashboard/home">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/customer/dashboard/my-applications">My Applications</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Create</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link 
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}