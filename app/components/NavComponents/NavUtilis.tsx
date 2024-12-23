'use client'
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { getSession, logout, refreshToken, updateAccessGroup } from "@/app/auth/auth";
import { AccessGroup } from '@/app/lib/types';
import { ChevronRight } from 'lucide-react';
import { portalNames } from '@/app/lib/store';


interface NavUtilsProps {
  accessProfile: AccessGroup | null;
}

const NavUtils: React.FC<NavUtilsProps> = ({ accessProfile}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isLoggingOut, setIsLogOut] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isTokenRefreshDialogOpen, setIsTokenRefreshDialogOpen] = useState(false);
  const [isRefreshingToken, setIsRefreshingToken] = useState(false);
  const [sessionExpirationTime, setSessionExpirationTime] = useState<number | undefined>(undefined);
  const [timeRemaining, setTimeRemaining] = useState<number | undefined>(undefined);
  const [tokenRefreshTimeRemaining, setTokenRefreshTimeRemaining] = useState<number | undefined>(undefined);

  const [isPortalSwitchDialogOpen, setIsPortalSwitchDialogOpen] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null);

  const [isSwitchingPortal, setIsSwitchingPortal] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    async function fetchSessionAndRole() {
      try {
        const session = await getSession();
        if (session && session.auth && session.auth.expires_in) {
          // console.log(session.expires);
          const currentTime = Math.floor(Date.now() / 1000);
          if(session.expires){
            const expirationTime = new Date(session.expires).getTime() / 1000; 
            // console.log(expirationTime)
            const remainingTime = expirationTime - currentTime;
            setSessionExpirationTime(expirationTime);
            setTimeRemaining(remainingTime);
        
            interval = setInterval(() => {
              const currentTime = Math.floor(Date.now() / 1000);
              const updatedRemainingTime = expirationTime - currentTime;
              setTimeRemaining(updatedRemainingTime);

                if (updatedRemainingTime <= 0) {
                  // clearInterval(interval!);
                  // window.location.href = '/welcome';
                  // return;
                }

                if (updatedRemainingTime < 30) { 
                  // setIsTokenRefreshDialogOpen(true);
                  // setTokenRefreshTimeRemaining(30); 
                }
            }, 1000);
          }
        } else {
          setSessionExpirationTime(undefined);
          setTimeRemaining(undefined);
        }
      } catch (error) {
        console.error('Error fetching session or role:', error);
        // Handle error appropriately, maybe show an error message or redirect
      }
    }

    fetchSessionAndRole();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);


  const handleLogout = async () => {
    try {
        setIsLogOut(true)
        await logout();
    } catch (error) {
        setIsLogOut(false)
      console.error('Error during logout:', error);
    }
  };

  const handleTokenRefresh = async () => {
    try {
      setIsRefreshingToken(true);
      await refreshToken();
      
      // Fetch new session after token refresh
      const newSession = await getSession();
      if (newSession && newSession.expires) {
        const currentTime = Math.floor(Date.now() / 1000);
        const newExpirationTime = new Date(newSession.expires).getTime() / 1000;
        setSessionExpirationTime(newExpirationTime);
        setTimeRemaining(newExpirationTime - currentTime);
      }
      
      setIsRefreshingToken(false);
      setIsTokenRefreshDialogOpen(false);
    } catch (error) {
      setIsRefreshingToken(false);
      console.error('Error refreshing token:', error);
    }
  };

  const handlePortalSwitch = (persona: string) => {
    setSelectedPortal(persona);
    setIsPortalSwitchDialogOpen(true);
    setIsPortalOpen(false);
    setIsOpen(false);
  };

  const switchPortal = async (persona: string) => {
    try {
      setIsSwitchingPortal(true);
      await updateAccessGroup(persona);
    } catch (error) {
      console.error('Error switching portal:', error);
    } finally {
      setIsSwitchingPortal(false);
      setIsPortalSwitchDialogOpen(false);
      setSelectedPortal(null);
    }
  };

  return (
    <>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
          <Button variant="ghost" className="w-full bg-none hover:bg-slate-700 px-0">
            <div className="flex lg:justify-start justify-center md:w-full items-center">
                  <div className="flex lg:justify-start justify-center md:w-full items-center">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/avatars/01.png" alt="Avatar" />
                      <AvatarFallback>{accessProfile?.username[0]}</AvatarFallback>
                    </Avatar>
                    <div><span className="flex-1 hidden lg:block ms-1 text-left rtl:text-right lg:text-base text-white font-medium whitespace-nowrap">{accessProfile?.username}</span></div>
                  </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48" side='right' align="start">
          <div className="grid gap-2">
            <div className="grid gap-2 cursor-pointer">
              <Link href='/' >
                  <Label className="col-span-2 font-normal cursor-pointer">Profile</Label>
              </Link>
              <Separator />
              <Label className="font-normal cursor-pointer">Preferences</Label>
              <Separator />
              <Popover open={isPortalOpen} onOpenChange={setIsPortalOpen}>
                <PopoverTrigger asChild>
                  <div className="flex justify-between items-center cursor-pointer">
                    <Label className="font-normal">Switch Portal</Label>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-72" side='right' align="end">
                  <div className="space-y-1">
                  {accessProfile?.persona.map((persona) => (
                      <div
                        key={persona}
                        className="cursor-pointer bg-gray-50 hover:bg-slate-200 py-2 px-1 rounded flex items-center justify-between"
                        onClick={() => handlePortalSwitch(persona)}  // Changed from switchPortal to handlePortalSwitch
                      >
                        <Label className="font-normal cursor-pointer">
                          {portalNames[persona] || persona}
                        </Label>
                        {persona === accessProfile.current && (
                          <span className="flex w-3 h-3 ml-2 bg-green-500 rounded-full"></span>
                        )}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Separator />
              <Link href='/' >
                  <Label className="col-span-2 font-normal cursor-pointer">About this app</Label>
              </Link>
              <Separator />
              <div onClick={() => setIsLogoutDialogOpen(true)}>
                <Label className="col-span-2 font-normal cursor-pointer">Logout</Label>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
              <DialogTitle>{isLoggingOut ? (<>Logging Out...</>):(<>Confirm Logout</>) }</DialogTitle>
              <DialogDescription>
                  {isLoggingOut ? (
                      <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Removing session...</span>
                      </div>
                  ) : (
                      <div className='flex space-x-2'>
                      <p>Are you sure you want to log out?</p>
                      <p className="text-sm text-gray-500">This will end your current session.</p>
                      </div>
                  )}
              </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
                      Cancel
                  </Button>
                  <Button 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                  >
                      {isLoggingOut ? (
                      <>
                          <svg className="animate-spin h-5 w-5 mr-3 inline" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                      </>
                      ) : (
                      'Logout'
                      )}
                  </Button>
              </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isTokenRefreshDialogOpen} onOpenChange={setIsTokenRefreshDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Session Expiring Soon</DialogTitle>
              <DialogDescription>
                {timeRemaining !== undefined && (
                  `Your session is about to expire in ${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, '0')}. Please refresh your token to continue.`
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTokenRefreshDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleTokenRefresh} disabled={isRefreshingToken}>
                {isRefreshingToken ? 'Refreshing...' : 'Refresh Token'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isPortalSwitchDialogOpen} onOpenChange={setIsPortalSwitchDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Switch Portal</DialogTitle>
              <DialogDescription>
                {isSwitchingPortal ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Switching portal...</span>
                  </div>
                ) : (
                  <>Are you sure you want to switch to {selectedPortal && portalNames[selectedPortal]}?</>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsPortalSwitchDialogOpen(false)}
                disabled={isSwitchingPortal}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => selectedPortal && switchPortal(selectedPortal)}
                disabled={isSwitchingPortal}
              >
                {isSwitchingPortal ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 inline" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </>
  )
}

export default NavUtils;