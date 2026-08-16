import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="container-custom">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-9xl font-black text-primary mb-6">404</div>
          <h1 className="text-4xl font-bold text-heading mb-4">Page Not Found</h1>
          <p className="text-muted text-lg mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary">
              Go Home
            </Link>
            <Link to="/contact" className="btn-secondary">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}