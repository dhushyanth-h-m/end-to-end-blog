"use client"

import { useState } from "react"
import { BlogHeader } from "./blog-header"
import { BlogSidebar } from "./blog-sidebar"
import { BlogFeed } from "./blog-feed"

export default function DashboardPage() {
  const [searchResults, setSearchResults] = useState<{
    posts?: any[],
    users?: any[]
  } | null>(null)
  
  const handleSearch = (query: string, filter: "posts" | "people") => {
    // In a real app, you would call the search API here
    // For now, we'll just update the state
    console.log(`Searching for ${query} in ${filter}`)
    // This would normally update a search results component
    setSearchResults({ posts: [], users: [] })
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeader onSearch={handleSearch} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-3 order-2 md:order-1">
            <BlogFeed />
          </div>
          <div className="md:col-span-1 lg:col-span-1 order-1 md:order-2">
            <BlogSidebar className="sticky top-20" />
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-muted-foreground">
              © 2023 Blogify. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

