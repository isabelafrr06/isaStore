class Api::ImageUploadController < ApplicationController
  before_action :authenticate_admin

  ALLOWED_MIME_TYPES = %w[image/jpeg image/png image/webp image/gif image/avif].freeze
  MAX_FILE_SIZE = 5.megabytes

  def upload
    unless params[:image].present?
      render json: { error: 'No image file provided' }, status: :bad_request
      return
    end

    uploaded_file = params[:image]

    unless ALLOWED_MIME_TYPES.include?(uploaded_file.content_type)
      render json: { error: 'Invalid file type. Allowed types: JPEG, PNG, WebP, GIF, AVIF' }, status: :bad_request
      return
    end

    if uploaded_file.size > MAX_FILE_SIZE
      render json: { error: 'File too large. Maximum size is 5 MB' }, status: :bad_request
      return
    end

    safe_original = File.basename(uploaded_file.original_filename)
    filename = "#{SecureRandom.hex(8)}_#{safe_original}"

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
end
