require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module IsaStore
  class Application < Rails::Application
    config.load_defaults 7.1

    # Configuration for the API application
    config.api_only = true
    
    # Enable serving static files for images
    config.public_file_server.enabled = true
    
    # CORS configuration
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource '*',
          headers: :any,
          methods: [:get, :post, :put, :delete, :options, :head]
      end
    end

    # Autoload paths
    config.autoload_paths += %W(#{config.root}/app)
  end
end
