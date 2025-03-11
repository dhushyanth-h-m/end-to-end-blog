import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookmarkPlus, Heart, MessageSquare, Share2, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for search results
const MOCK_POSTS = Array.from({ length: 5 }).map((_, i) => ({
  id: `post-${i}`,
  title: `Search result post about ${i % 2 === 0 ? "technology" : "design"} trends`,
  excerpt:
    "This is a search result that matches your query. Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  author: {
    name: `Author ${i + 1}`,
    username: `author${i + 1}`,
    avatar: `/placeholder.svg?${i}`,
  },
  publishedAt: new Date(Date.now() - i * 86400000).toLocaleDateString(),
  readTime: `${Math.floor(Math.random() * 10) + 3} min read`,
  likes: Math.floor(Math.random() * 100),
  comments: Math.floor(Math.random() * 20),
  hasImage: i % 2 === 0,
  relevance: `${90 - i * 5}% match`,
}))

const MOCK_PEOPLE = Array.from({ length: 5 }).map((_, i) => ({
  id: `user-${i}`,
  name: `User ${i + 1}`,
  username: `user${i + 1}`,
  avatar: `/placeholder.svg?user${i}`,
  bio: "Writer, blogger, and enthusiast. Sharing thoughts on technology, design, and productivity.",
  followers: Math.floor(Math.random() * 1000),
  posts: Math.floor(Math.random() * 50),
  relevance: `${90 - i * 5}% match`,
}))

interface SearchResultsProps {
  query: string
  filter: "posts" | "people"
  onClear: () => void
}

export function SearchResults({ query, filter, onClear }: SearchResultsProps) {
  const [activeFilter, setActiveFilter] = useState<"posts" | "people">(filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Search results for "{query}"</h2>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-4 w-4 mr-2" />
          Clear search
        </Button>
      </div>

      <Tabs defaultValue={filter} value={activeFilter} onValueChange={(v) => setActiveFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6 space-y-6">
          {MOCK_POSTS.map((post) => (
            <Card key={post.id}>
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
                        <span>{post.publishedAt}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                        <span>•</span>
                        <span className="text-primary">{post.relevance}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <Link to={`/dashboard/post/${post.id}`}>
                  <CardTitle className="text-xl mb-2 hover:text-primary transition-colors">{post.title}</CardTitle>
                </Link>
                <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>

                {post.hasImage && (
                  <div className="mt-4">
                    <Link to={`/dashboard/post/${post.id}`}>
                      <img
                        src="/placeholder.svg"
                        alt={post.title}
                        width={800}
                        height={400}
                        className="rounded-md object-cover w-full aspect-[2/1]"
                      />
                    </Link>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1" asChild>
                    <Link to={`/dashboard/post/${post.id}#comments`}>
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <BookmarkPlus className="h-4 w-4" />
                    <span className="sr-only">Bookmark</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="people" className="mt-6 space-y-4">
          {MOCK_PEOPLE.map((person) => (
            <Card key={person.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={person.avatar} alt={person.name} />
                      <AvatarFallback>{person.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        to={`/dashboard/profile/${person.username}`}
                        className="font-medium hover:underline text-lg"
                      >
                        {person.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">@{person.username}</p>
                      <p className="text-sm mt-1">{person.bio}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{person.followers} followers</span>
                        <span>{person.posts} posts</span>
                        <span className="text-primary">{person.relevance}</span>
                      </div>
                    </div>
                  </div>
                  <Button>Follow</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

