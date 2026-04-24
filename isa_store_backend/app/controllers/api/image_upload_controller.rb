class Api::ImageUploadController < ApplicationController
  ALLOWED_MIME_TYPES = %w[image/jpeg image/png image/webp image/gif].freeze
  MAX_FILE_SIZE = 5.megabytes

  def upload
    check_auth
    return if performed?

    unless params[:image].present?
      render json: { error: 'No image file provided' }, status: :bad_request
      return
    end

    uploaded_file = params[:image]

    # Validate MIME type
    unless ALLOWED_MIME_TYPES.include?(uploaded_file.content_type)
      render json: { error: 'Invalid file type. Allowed types: JPEG, PNG, WebP, GIF' }, status: :bad_request
      return
    end

    # Validate file size
    if uploaded_file.size > MAX_FILE_SIZE
      render json: { error: 'File too large. Maximum size is 5 MB' }, status: :bad_request
      return
    end

    # Sanitize filename to prevent path traversal
    safe_original = File.basename(uploaded_file.original_filename)
    filename = "#{SecureRandom.hex(8)}_#{safe_original}"

    # Use Railway volume if available, otherwise public/images
    images_path = if ENV['RAILWAY_VOLUME_MOUNT_PATH'].present?
      File.join(ENV['RAILWAY_VOLUME_MOUNT_PATH'], 'images')
    else
      Rails.root.join('public', 'images').to_s
    end

    FileUtils.mkdir_p(images_path) unless Dir.exist?(images_path)

    file_path = File.join(images_path, filename)

    File.open(file_path, 'wb') do |file|
      file.write(uploaded_file.read)
    end

    render json: {
      success: true,
      filename: filename,
      url: "/images/#{filename}"
    }
  rescue StandardError => e
    Rails.logger.error "Image upload failed: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { error: 'Upload failed' }, status: :internal_server_error
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
    rescue JWT::ExpiredSignature
      render json: { error: 'Token expired' }, status: :unauthorized
    rescue JWT::DecodeError
      render json: { error: 'Invalid token' }, status: :unauthorized
    rescue StandardError => e
      Rails.logger.error "Auth error: #{e.message}"
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
end
