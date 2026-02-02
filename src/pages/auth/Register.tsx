import { RegisterForm } from "@/components/auth/RegisterForm"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export default function RegisterPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate("/app/dashboard")
    }
  }, [user, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <RegisterForm />
    </div>
  )
}
