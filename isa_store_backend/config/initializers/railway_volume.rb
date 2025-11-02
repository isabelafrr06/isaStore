# Railway Volume Configuration
# This initializer sets up serving images from Railway's persistent volume

if ENV['RAILWAY_VOLUME_MOUNT_PATH'].present?
  volume_images_path = File.join(ENV['RAILWAY_VOLUME_MOUNT_PATH'], 'images')
  
  # Create images directory if it doesn't exist
  FileUtils.mkdir_p(volume_images_path) unless Dir.exist?(volume_images_path)
  
  Rails.logger.info "✅ Railway volume detected at: #{ENV['RAILWAY_VOLUME_MOUNT_PATH']}"
  Rails.logger.info "📁 Images will be stored in: #{volume_images_path}"
  
  # Add middleware to serve images from the volume
  Rails.application.config.middleware.use Rack::Static,
    urls: ['/images'],
    root: ENV['RAILWAY_VOLUME_MOUNT_PATH'],
    cascade: true
else
  Rails.logger.info "📁 No Railway volume detected - using local public/images directory"
end

