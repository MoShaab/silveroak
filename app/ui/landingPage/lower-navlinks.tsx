

import Image from 'next/image';
import Link from 'next/link';

import {
    UserCircleIcon ,
    HomeIcon,
    UserPlusIcon,
} from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import { PowerIcon } from '@heroicons/react/24/outline';

const links = [
    { name: 'Admin Log In', href: '/login', icon: UserCircleIcon  },
    { name: 'Create Listing', href: '/properties/sell_property/create', icon: HomeIcon },
    {name: 'Sign Up', href: '/signup', icon: UserPlusIcon}
    
];

export default function LowerNav() {
    

    return (
        <div className="flex flex-col md:flex-row items-center justify-between">
            <Link href="/">
                <Image src="/logo.png" width={100} height={100} alt="Logo" />
            </Link>

            <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button className="flex h-[25px] grow items-center justify-center gap-2 rounded-md bg-gray-400 p-3 text-sm font-small hover:bg-sky-300 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
           
            {/* Links displayed on desktop */}
            <div className="hidden md:flex space-x-3">
                {links.map((link) => {
                    const LinkIcon = link.icon;

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center space-x-2 h-[25px] bg-gray-500 hover:bg-blue-700 text-white font-small py-2 px-4 rounded  'bg-blue-700' : 'bg-gray-500'}`}
                        >
                            <LinkIcon className="w-6" />
                            <p className="block">{link.name}</p>
                        </Link>
                    );
                })}
            </div>

            {/* Breadcrumbs displayed on mobile */}
            <div className="flex md:hidden mt-4 space-x-2 text-sm text-blue-600">
                {links.map((link) => (
                    <Link key={link.name} href={link.href} className="flex items-center space-x-1">
                        <p className="block">{link.name}</p>
                        
                    </Link>
                ))}
            </div>
        </div>
    );
}
