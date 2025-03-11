import type React from "react"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, BookOpen, LogOut, Menu, Search, Settings, User, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  User as UserType, 
  Notification, 
  getCurrentUser, 
  getNotifications, 
  markNotificationAsRead,
  searchContent
} from "@/services/api"

interface BlogHeaderProps {
  onSearch?: (query: string, filter: "posts" | "people") => void
}

export function BlogHeader({ onSearch }: BlogHeaderProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFilter, setSearchFilter] = useState<"posts" | "people">("posts")
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  
  // State for user data
  const [user, setUser] = useState<UserType | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  
  // State for notifications
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)

  // Fetch current user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoadingUser(true)
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setLoadingUser(false)
      }
    }
    
    fetchUserData()
  }, [])
  
  // Fetch notifications
  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoadingNotifications(true)
        const notificationsData = await getNotifications()
        setNotifications(notificationsData)
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      } finally {
        setLoadingNotifications(false)
      }
    }
    
    fetchNotifications()
    
    // Set up polling for notifications every minute
    const intervalId = setInterval(fetchNotifications, 60000)
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) return
    
    try {
      // If onSearch prop is provided, use it (for parent component handling)
      if (onSearch) {
        onSearch(searchQuery, searchFilter)
      } else {
        // Otherwise, perform the search and navigate to search results page
        const results = await searchContent(searchQuery, searchFilter)
        
        // Store results in sessionStorage for the search results page
        sessionStorage.setItem('searchResults', JSON.stringify(results))
        sessionStorage.setItem('searchQuery', searchQuery)
        sessionStorage.setItem('searchFilter', searchFilter)
        
        // Navigate to search results page
        navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery)}&filter=${searchFilter}`)
        
        // Close mobile search if open
        if (showMobileSearch) {
          setShowMobileSearch(false)
        }
      }
    } catch (error) {
      console.error("Search failed:", error)
    }
  }

  const handleFilterChange = (value: string) => {
    setSearchFilter(value as "posts" | "people")
  }
  
  const handleMarkNotificationAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id)
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }
  
  const handleLogout = () => {
    // Clear local storage/cookies, etc.
    localStorage.removeItem('token')
    // Navigate to login page
    navigate('/')
  }

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 lg:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
                  <BookOpen className="h-5 w-5" />
                  <span>Blogify</span>
                </Link>
                <Link to="/dashboard" className="flex items-center gap-2 text-sm">
                  <span>Home</span>
                </Link>
                <Link to="/dashboard/explore" className="flex items-center gap-2 text-sm">
                  <span>Explore</span>
                </Link>
                <Link to="/dashboard/bookmarks" className="flex items-center gap-2 text-sm">
                  <span>Bookmarks</span>
                </Link>
                <Link to="/dashboard/write" className="flex items-center gap-2 text-sm">
                  <span>Write</span>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/dashboard" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="hidden font-bold md:inline-block">Blogify</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-4 text-sm">
            <Link to="/dashboard" className="font-medium">
              Home
            </Link>
            <Link to="/dashboard/explore" className="text-muted-foreground hover:text-foreground">
              Explore
            </Link>
            <Link to="/dashboard/bookmarks" className="text-muted-foreground hover:text-foreground">
              Bookmarks
            </Link>
          </nav>
        </div>

        {showMobileSearch ? (
          <div className="absolute inset-0 flex items-center px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search posts and people..."
                className="flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button type="submit" size="sm">
                Search
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowMobileSearch(false)}>
                <X className="h-5 w-5" />
              </Button>
            </form>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4 flex-1 justify-center">
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search posts and people..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Tabs
                defaultValue="posts"
                value={searchFilter}
                onValueChange={handleFilterChange}
                className="hidden sm:block"
              >
                <TabsList className="h-9">
                  <TabsTrigger value="posts" className="text-xs">
                    Posts
                  </TabsTrigger>
                  <TabsTrigger value="people" className="text-xs">
                    People
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button type="submit" size="sm" className="hidden sm:flex">
                Search
              </Button>
            </form>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileSearch(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1 py-0 min-w-4 h-4 flex items-center justify-center" variant="destructive">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-4 py-2 font-medium">Notifications</div>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {loadingNotifications ? (
                  <div className="px-4 py-2 text-sm text-muted-foreground">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-muted-foreground">No notifications yet</div>
                ) : (
                  notifications.map(notification => (
                    <DropdownMenuItem key={notification.id} className={`px-4 py-2 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''}`}>
                      <div className="flex items-start gap-2 w-full" onClick={() => handleMarkNotificationAsRead(notification.id)}>
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
                          <AvatarFallback>{notification.actor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">{notification.actor.name}</span>{' '}
                            {notification.type === 'like' && 'liked your post'}
                            {notification.type === 'comment' && 'commented on your post'}
                            {notification.type === 'follow' && 'followed you'}
                            {notification.type === 'mention' && 'mentioned you in a post'}
                          </p>
                          {notification.post && (
                            <p className="text-xs text-muted-foreground truncate">
                              {notification.post.title}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard/notifications" className="px-4 py-2 text-sm text-center cursor-pointer">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/dashboard/write">
            <Button size="sm" className="hidden md:flex">
              Write
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {loadingUser ? (
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                ) : (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                    <AvatarFallback>
                      {user ? user.name.charAt(0) + (user.name.split(' ')[1]?.charAt(0) || '') : 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user && (
                <div className="px-2 py-1.5 text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">@{user.username}</div>
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

