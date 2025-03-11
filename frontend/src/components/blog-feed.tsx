"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookmarkPlus, Heart, MessageSquare, MoreHorizontal, Share2, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Post, getPosts, likePost, bookmarkPost } from "@/services/api"

export function BlogFeed() {
  // State for posts and pagination
  const [posts, setPosts] = useState<Post[]>([])
  const [feedType, setFeedType] = useState<"for-you" | "following" | "latest">("for-you")
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  
  // State for user interactions with posts
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({})
  
  // Fetch posts based on feed type and page
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        setError(null)
        
        // Reset data when feed type changes
        setPosts([])
        setPage(1)
        setHasMore(true)
        
        const postsData = await getPosts(feedType, 1)
        setPosts(postsData)
        
        // If fewer posts returned than expected, we've reached the end
        setHasMore(postsData.length >= 10) // Assuming backend returns 10 posts per page
      } catch (error) {
        console.error(`Failed to fetch ${feedType} posts:`, error)
        setError(`Failed to load posts. Please try again later.`)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [feedType])
  
  // Load user interaction data from localStorage on mount
  useEffect(() => {
    try {
      const savedLikedPosts = localStorage.getItem('likedPosts')
      const savedBookmarkedPosts = localStorage.getItem('bookmarkedPosts')
      
      if (savedLikedPosts) {
        setLikedPosts(JSON.parse(savedLikedPosts))
      }
      
      if (savedBookmarkedPosts) {
        setBookmarkedPosts(JSON.parse(savedBookmarkedPosts))
      }
    } catch (error) {
      console.error('Failed to load user interaction data from localStorage:', error)
    }
  }, [])

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return
    
    try {
      setLoadingMore(true)
      const nextPage = page + 1
      const morePosts = await getPosts(feedType, nextPage)
      
      if (morePosts.length > 0) {
        setPosts([...posts, ...morePosts])
        setPage(nextPage)
        setHasMore(morePosts.length >= 10) // Assuming backend returns 10 posts per page
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Failed to load more posts:', error)
      // Don't show error for load more, just keep the button enabled for retry
    } finally {
      setLoadingMore(false)
    }
  }
  
  const handleLikePost = async (postId: string) => {
    try {
      const isCurrentlyLiked = likedPosts[postId] || false
      
      // Optimistically update UI
      setLikedPosts({
        ...likedPosts,
        [postId]: !isCurrentlyLiked
      })
      
      // Save to localStorage
      localStorage.setItem('likedPosts', JSON.stringify({
        ...likedPosts,
        [postId]: !isCurrentlyLiked
      }))
      
      // Make API call
      await likePost(postId)
    } catch (error) {
      console.error('Failed to like post:', error)
      
      // Revert on error
      setLikedPosts({
        ...likedPosts,
        [postId]: !likedPosts[postId]
      })
      
      localStorage.setItem('likedPosts', JSON.stringify({
        ...likedPosts,
        [postId]: !likedPosts[postId]
      }))
    }
  }
  
  const handleBookmarkPost = async (postId: string) => {
    try {
      const isCurrentlyBookmarked = bookmarkedPosts[postId] || false
      
      // Optimistically update UI
      setBookmarkedPosts({
        ...bookmarkedPosts,
        [postId]: !isCurrentlyBookmarked
      })
      
      // Save to localStorage
      localStorage.setItem('bookmarkedPosts', JSON.stringify({
        ...bookmarkedPosts,
        [postId]: !isCurrentlyBookmarked
      }))
      
      // Make API call
      await bookmarkPost(postId)
    } catch (error) {
      console.error('Failed to bookmark post:', error)
      
      // Revert on error
      setBookmarkedPosts({
        ...bookmarkedPosts,
        [postId]: !bookmarkedPosts[postId]
      })
      
      localStorage.setItem('bookmarkedPosts', JSON.stringify({
        ...bookmarkedPosts,
        [postId]: !bookmarkedPosts[postId]
      }))
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="for-you" value={feedType} onValueChange={(v) => setFeedType(v as any)}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="for-you">For You</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="latest">Latest</TabsTrigger>
          </TabsList>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Customize feed</DropdownMenuItem>
              <DropdownMenuItem>Hide read posts</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-6 space-y-6">
          {loading ? (
            // Skeleton loading state
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={`skeleton-${index}`}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16 mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                  
                  {index % 2 === 0 && (
                    <Skeleton className="w-full h-48 mt-4 rounded-md" />
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => setFeedType(feedType)}>Try Again</Button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">No posts found</p>
              <p className="text-sm text-muted-foreground mb-4">Follow more people or explore different topics</p>
              <Button asChild variant="outline">
                <Link to="/dashboard/explore">Explore topics</Link>
              </Button>
            </div>
          ) : (
            // Actual posts
            posts.map((post) => (
              <BlogPostCard 
                key={post.id} 
                post={post} 
                isLiked={likedPosts[post.id] || false}
                isBookmarked={bookmarkedPosts[post.id] || false}
                onLike={handleLikePost}
                onBookmark={handleBookmarkPost}
              />
            ))
          )}
        </div>
      </Tabs>

      {!loading && posts.length > 0 && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={loadMorePosts} 
            disabled={loadingMore || !hasMore} 
            className="w-full max-w-md"
          >
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading more posts...
              </>
            ) : !hasMore ? (
              "No more posts to load"
            ) : (
              "Load more posts"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

interface BlogPostCardProps {
  post: Post
  isLiked: boolean
  isBookmarked: boolean
  onLike: (postId: string) => void
  onBookmark: (postId: string) => void
}

function BlogPostCard({ post, isLiked, isBookmarked, onLike, onBookmark }: BlogPostCardProps) {
  const handleShare = async () => {
    // If Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.origin + `/dashboard/post/${post.id}`,
        })
      } catch (error) {
        console.log('Error sharing', error)
      }
    } else {
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.origin + `/dashboard/post/${post.id}`)
        alert('Link copied to clipboard!')
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }
  }

  // Format the published date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: new Date().getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    }).format(date)
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <Link to={`/dashboard/profile/${post.author.username}`} className="font-medium hover:underline">
                {post.author.name}
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDate(post.publishedAt)}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mute this author</DropdownMenuItem>
              <DropdownMenuItem>Hide this post</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <Link to={`/dashboard/post/${post.id}`}>
          <CardTitle className="text-xl mb-2 hover:text-primary transition-colors">{post.title}</CardTitle>
        </Link>
        <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>

        {post.hasImage && (
          <div className="mt-4">
            <Link to={`/dashboard/post/${post.id}`}>
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.title}
                className="rounded-md object-cover w-full aspect-[2/1]"
              />
            </Link>
          </div>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/dashboard/topic/${tag.toLowerCase()}`}
                className="text-xs bg-muted px-2 py-1 rounded-full hover:bg-muted/80 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1 ${isLiked ? "text-red-500" : ""}`}
            onClick={() => onLike(post.id)}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{isLiked ? post.likes + 1 : post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link to={`/dashboard/post/${post.id}#comments`}>
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments}</span>
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={isBookmarked ? "text-primary" : ""}
            onClick={() => onBookmark(post.id)}
          >
            <BookmarkPlus className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            <span className="sr-only">Bookmark</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

