import './App.css'
import { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { LoginForm } from "./components/login-form"
import { RegisterForm } from "./components/register-form"
import DashboardPage from './components/dashboard'


function App() {
  const [activeTab, setActiveTab] = useState("login")

  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/" element={
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Blogify</h1>
              <p className="text-muted-foreground">Your ideas, your voice, your blog.</p>
            </div>

            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="space-y-4">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register" className="space-y-4">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
