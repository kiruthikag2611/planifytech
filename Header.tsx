
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { ArrowLeft, LogIn } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';
import { useUser } from '@/firebase/auth/use-user';
import { Skeleton } from './ui/skeleton';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import Link from 'next/link';

export function Header() {
  const router = useRouter();
  const [isClient, setIsClient] = React.useState(false);
  const { user, status } = useUser();
  const firestore = useFirestore();

  const userProfileQuery = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userProfile } = useDoc(userProfileQuery);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase();
  };

  if (!isClient) {
    // Render a placeholder or nothing on the server to avoid hydration mismatch
    return <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30"></header>;
  }

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="lg:hidden">
            <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center gap-4">
        {status === 'loading' && (
          <>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </>
        )}
        {status === 'unauthenticated' && (
            <Button asChild>
                <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4"/>
                    Sign In
                </Link>
            </Button>
        )}
        {status === 'authenticated' && user && (
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer">
                  <span className="font-medium hidden sm:inline-block">{user.displayName}</span>
                  <Avatar>
                      <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Your Information</h4>
                    <p className="text-sm text-muted-foreground">
                      This is the information you provided to generate your schedule.
                    </p>
                  </div>
                  <div className="grid gap-2 text-sm">
                    {userProfile && userProfile.answers ? (
                      Object.entries(userProfile.answers).map(([key, value]) => (
                        <div className="grid grid-cols-2 items-center gap-4" key={key}>
                          <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span>{String(value)}</span>
                        </div>
                      ))
                    ) : (
                      <p>No answers found.</p>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
        )}
      </div>
    </header>
  );
}
