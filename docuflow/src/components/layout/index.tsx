import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  CheckCircle,
  Archive,
  Clock,
  Menu,
  X,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // const user = await User.me(); // GET USER API todo
        const user = {
          full_name: 'John Doe',
          role: 'Admin',
        };
        setUserData(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    // await User.logout(); TODO LOGOUT API
    // Clear user data and token
    setUserData(null);
    window.location.reload();
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <FileText className="h-5 w-5" />,
      url: "/",
      badge: null,
    },
    {
      name: 'Create Document',
      icon: <PlusCircle className="h-5 w-5" />,
      url: "/create",
      badge: null,
    },
    {
      name: 'Review',
      icon: <Clock className="h-5 w-5" />,
      url: "/pending",
      badge: {
        text: 'Pending',
        variant: 'warning',
      },
    },
    {
      name: 'Sign',
      icon: <CheckCircle className="h-5 w-5" />,
      url: "/approved",
      badge: null,
    },
    {
      name: 'Archive',
      icon: <Archive className="h-5 w-5" />,
      url: "/archived",
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">DocuFlow</h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Separator />

          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.url}
                  className={cn(
                    'nav-item flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700',
                    location.pathname === item.url && 'active-nav-item pl-2'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-gray-500">{item.icon}</span>
                    {item.name}
                  </div>
                  {item.badge && (
                    <Badge variant={item.badge.variant} className="text-xs">
                      {item.badge.text}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </nav>

          <div className="mt-auto border-t p-4">
            {userData ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2 bg-teal-100 text-teal-700">
                    <AvatarFallback>
                      {getInitials(userData.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{userData.full_name}</p>
                    <p className="text-xs text-gray-500">{userData.role}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>
                    <UserIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="bg-white border-b shadow-sm px-4 py-3 md:hidden">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold">DocuFlow</h1>
            </div>
            {userData && (
              <Avatar className="h-8 w-8 bg-teal-100 text-teal-700">
                <AvatarFallback>
                  {getInitials(userData.full_name)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
