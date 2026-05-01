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

    # Rate limiting
    config.middleware.use Rack::Attack
    
    # Enable serving static files for images
    config.public_file_server.enabled = true
    
    # Autoload paths
    config.autoload_paths += %W(#{config.root}/app)
  end
end
