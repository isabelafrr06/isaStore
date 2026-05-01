allowed_origins = [
  'http://localhost:3000',
  'http://localhost:5173',
  /\Ahttps:\/\/[a-zA-Z0-9-]+\.vercel\.app\z/
]

if ENV['FRONTEND_URL'].present?
  allowed_origins << ENV['FRONTEND_URL']
end

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*allowed_origins)
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
