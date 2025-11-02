class Api::ImageUploadController < ApplicationController
  def upload
    check_auth
    
    if params[:image].present?
      uploaded_file = params[:image]
      
      # Generate unique filename
      filename = "#{SecureRandom.hex(8)}_#{uploaded_file.original_filename}"
      
      # Use Railway volume if available, otherwise public/images
      images_path = if ENV['RAILWAY_VOLUME_MOUNT_PATH'].present?
        # Railway volume is mounted, use it for persistent storage
        File.join(ENV['RAILWAY_VOLUME_MOUNT_PATH'], 'images')
      else
        # Local development or no volume - use public/images
        Rails.root.join('public', 'images').to_s
      end
      
      # Create images directory if it doesn't exist
      FileUtils.mkdir_p(images_path) unless Dir.exist?(images_path)
      
      file_path = File.join(images_path, filename)
      
      # Save file
      File.open(file_path, 'wb') do |file|
        file.write(uploaded_file.read)
      end
      
      Rails.logger.info "Image saved to: #{file_path}"
      
      render json: { 
        success: true, 
        filename: filename,
        url: "/images/#{filename}"
      }
    else
      render json: { error: 'No image file provided' }, status: :bad_request
    end
  rescue => e
    Rails.logger.error "Image upload failed: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { error: "Upload failed: #{e.message}" }, status: :internal_server_error
  end
  
  private
  
  def check_auth
    admin_token = request.headers['Authorization']&.split(' ')&.last
    unless admin_token
      render json: { error: 'Missing token' }, status: :unauthorized
      return
    end
    
    begin
      decoded = JWT.decode(admin_token, Rails.application.secret_key_base)
      @current_admin = Admin.find(decoded[0]['admin_id'])
    rescue
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
end










