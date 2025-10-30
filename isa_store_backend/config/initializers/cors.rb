Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Allow localhost for development and your Vercel frontend for production
    origins 'http://localhost:3000',
            'http://localhost:5173',
            /https:\/\/.*\.vercel\.app$/  # This allows all Vercel preview deployments
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end