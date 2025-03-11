import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookMarked, Edit, Heart, Settings, TrendingUp, User, Users } from "lucide-react"
import { User as UserType, Topic, getCurrentUser, getTrendingTopics, getUserToFollow } from "@/services/api"
import { Skeleton } from "@/components/ui/skeleton"

interface BlogSidebarProps {
  className?: string
}

export function BlogSidebar({ className = "" }: BlogSidebarProps) {
  // State for storing data from API
  const [user, setUser] = useState<UserType | null>(null)
  const [trendingTopics, setTrendingTopics] = useState<Topic[]>([])
  const [recommendedUsers, setRecommendedUsers] = useState<UserType[]>([])
  
  // Loading states
  const [loadingUser, setLoadingUser] = useState(true)
  const [loadingTopics, setLoadingTopics] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  
  // Error states
  const [userError, setUserError] = useState<string | null>(null)
  const [topicsError, setTopicsError] = useState<string | null>(null)
  const [usersError, setUsersError] = useState<string | null>(null)

  // Fetch current user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoadingUser(true)
        const userData = await getCurrentUser()
        setUser(userData)
        setUserError(null)
      } catch (error) {
        console.error("Failed to fetch user data:", error)
        setUserError("Failed to load profile data")
      } finally {
        setLoadingUser(false)
      }
    }
    
    fetchUserData()
  }, [])
  
  // Fetch trending topics
  useEffect(() => {
    async function fetchTrendingTopics() {
      try {
        setLoadingTopics(true)
        const topics = await getTrendingTopics()
        setTrendingTopics(topics)
        setTopicsError(null)
      } catch (error) {
        console.error("Failed to fetch trending topics:", error)
        setTopicsError("Failed to load trending topics")
      } finally {
        setLoadingTopics(false)
      }
    }
    
    fetchTrendingTopics()
  }, [])
  
  // Fetch recommended users to follow
  useEffect(() => {
    async function fetchRecommendedUsers() {
      try {
        setLoadingUsers(true)
        const users = await getUserToFollow()
        setRecommendedUsers(users)
        setUsersError(null)
      } catch (error) {
        console.error("Failed to fetch recommended users:", error)
        setUsersError("Failed to load recommended users")
      } finally {
        setLoadingUsers(false)
      }
    }
    
    fetchRecommendedUsers()
  }, [])

  return (
    <aside className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          {loadingUser ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ) : userError ? (
            <div className="text-sm text-red-500">{userError}</div>
          ) : user ? (
            <>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0) || ''}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center text-sm">
                <div>
                  <p className="font-medium">{user.postsCount}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div>
                  <p className="font-medium">{user.followersCount}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="font-medium">{user.followingCount}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>
            </>
          ) : null}
        </CardContent>
        <CardFooter className="pt-2">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to="/dashboard/profile">
              <User className="mr-2 h-4 w-4" />
              View Profile
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <nav className="space-y-1">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/dashboard/write">
            <Edit className="mr-2 h-4 w-4" />
            Write a Post
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/dashboard/bookmarks">
            <BookMarked className="mr-2 h-4 w-4" />
            My Bookmarks
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/dashboard/likes">
            <Heart className="mr-2 h-4 w-4" />
            Liked Posts
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </nav>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Trending Topics</CardTitle>
          <CardDescription>Popular topics this week</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          {loadingTopics ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : topicsError ? (
            <div className="text-sm text-red-500">{topicsError}</div>
          ) : (
            <div className="space-y-2">
              {trendingTopics.map((topic) => (
                <Link key={topic.name} to={`/dashboard/topic/${topic.name.toLowerCase()}`} className="block">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">#{topic.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-6">{topic.postsCount.toLocaleString()} posts</p>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <Button variant="link" size="sm" className="w-full" asChild>
            <Link to="/dashboard/topics">View all topics</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Who to Follow</CardTitle>
          <CardDescription>Recommended writers</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          {loadingUsers ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-12 mt-1" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : usersError ? (
            <div className="text-sm text-red-500">{usersError}</div>
          ) : (
            <div className="space-y-4">
              {recommendedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-sm font-medium">{user.name}</h4>
                      <p className="text-xs text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <Button variant="link" size="sm" className="w-full" asChild>
            <Link to="/dashboard/discover">
              <Users className="mr-2 h-4 w-4" />
              Discover more
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </aside>
  )
}

