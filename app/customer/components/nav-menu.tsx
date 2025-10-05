"use client"

import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, ChevronRight, Home, FileText, Plus, Bell, User, Settings } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { NotificationCounter } from "./notification-count"


const components: { title: string; href: string; description: string; icon?: React.ReactNode }[] = [
  {
    title: "Application For Teacher Registration & Licensing",
    href: "/customer/dashboard/teacher-application",
    description: "A form for teachers to apply for a registration, including personal details, qualifications, and experience.",
    icon: <User className="h-4 w-4" />
  },
  {
    title: "Application For Student Teacher Registration", 
    href: "/customer/dashboard/student-application",
    description: "A form for students to apply for a registration, including personal details, educational background, and interests.",
    icon: <User className="h-4 w-4" />
  },
  {
    title: "Application For Renewal Of Teaching License",
    href: "/customer/dashboard/renewal-application", 
    description: "A form for renewing an existing registration, allowing users to update their information and confirm their continued eligibility.",
    icon: <FileText className="h-4 w-4" />
  },
  {
    title: "Application Of Restoration Of Name To The Register",
    href: "/customer/dashboard/restoration-application",
    description: "A form for restoring a previous registration, enabling users to reactivate your account and update any necessary details.",
    icon: <Settings className="h-4 w-4" />
  },
  {
    title: "Report A Misconduct Or A Case",
    href: "/customer/dashboard/tip-off",
    description: "A form for submitting a tip-off, allowing users to report concerns or issues related to the registration process or other relevant matters.",
    icon: <FileText className="h-4 w-4" />
  },
  {
    title: "Application For Change of Category ", 
    href: "/customer/dashboard/change-of-category",
    description: "A form for changing the category of an existing registration, enabling users to update your status or classification based on new qualifications or circumstances.",
    icon: <Settings className="h-4 w-4" />
  },
]

export function CustomerNavigationMenu() {
  const [isMounted, setIsMounted] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false)
  const [isMobileCreateOpen, setIsMobileCreateOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const closeSheet = () => {
    setIsSheetOpen(false)
    setIsMobileCreateOpen(false)
  }

  // Prevent hydration mismatch by not rendering interactive elements until mounted
  if (!isMounted) {
    return (
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-1">
              <div className="h-10 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center space-x-1">
              {/* Home */}
              <a
                href="/customer/dashboard"
                className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200"
              >
                <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Home
              </a>

              {/* My Applications */}
              <a
                href="/customer/dashboard/my-applications"
                className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200"
              >
                <FileText className="h-4 w-4 group-hover:scale-110 transition-transform" />
                My Applications
              </a>

              {/* Create Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsCreateMenuOpen(true)}
                onMouseLeave={() => setIsCreateMenuOpen(false)}
              >
                <button className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200">
                  <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  Submit An Application
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isCreateMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Desktop Dropdown */}
                <div className={`absolute top-full left-0 mt-1 w-[600px] bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-xl transition-all duration-200 ${
                  isCreateMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
                }`}>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {components.map((component) => (
                        <a
                          key={component.title}
                          href={component.href}
                          className="group block p-4 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-transparent hover:border-blue-200/50 transition-all duration-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-200">
                              {component.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                {component.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                                {component.description}
                              </p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <a
                href="/customer/dashboard/notifications"
                className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200"
              >
                <Bell className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Notifications
                <NotificationCounter 
                  showAnimation={true}
                  maxDisplay={999}
                  refreshInterval={30000}
                  className="hover:scale-110 transition-transform"
                />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center gap-2 sm:hidden min-w-0 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-semibold text-gray-900">Dashboard</span>
            </div>

            {/* Mobile menu button with Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                <SheetHeader className="px-6 py-4 border-b">
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                
                <div className="overflow-y-auto h-[calc(100vh-5rem)] p-4">
                  <div className="space-y-2">
                    {/* Home */}
                    <a
                      href="/customer/dashboard"
                      onClick={closeSheet}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200 group"
                    >
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 group-hover:scale-110 transition-all">
                        <Home className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Home</span>
                    </a>

                    {/* My Applications */}
                    <a
                      href="/customer/dashboard/my-applications"
                      onClick={closeSheet}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200 group"
                    >
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 group-hover:scale-110 transition-all">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="font-medium">My Applications</span>
                    </a>

                    {/* Create Section */}
                    <div className="border-t border-gray-200/50 pt-4 mt-4">
                      <button
                        onClick={() => setIsMobileCreateOpen(!isMobileCreateOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-200 group-hover:scale-110 transition-all">
                            <Plus className="h-4 w-4" />
                          </div>
                          <span className="font-medium">Create Application</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isMobileCreateOpen ? 'rotate-90' : ''}`} />
                      </button>

                      {/* Create submenu */}
                      <div className={`overflow-hidden transition-all duration-300 ${
                        isMobileCreateOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="pl-4 mt-2 space-y-1">
                          {components.map((component) => (
                            <a
                              key={component.title}
                              href={component.href}
                              onClick={closeSheet}
                              className="block px-4 py-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50/30 rounded-lg transition-all duration-200"
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-gray-100 text-gray-500 rounded-md mt-0.5 flex-shrink-0">
                                  {component.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium">{component.title}</div>
                                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                    {component.description}
                                  </div>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Notifications */}
                    <div className="border-t border-gray-200/50 pt-4">
                      <a
                        href="/customer/dashboard/notifications"
                        onClick={closeSheet}
                        className="flex items-center justify-between px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-200 group-hover:scale-110 transition-all relative">
                            <Bell className="h-4 w-4" />
                          </div>
                          <span className="font-medium">Notifications</span>
                        </div>
                        <NotificationCounter />
                      </a>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  )
}

export default CustomerNavigationMenu