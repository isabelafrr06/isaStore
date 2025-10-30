class Api::ImageUploadController < ApplicationController
  def upload
    check_auth
    
    if params[:image].present?
      uploaded_file = params[:image]
      
      # Generate unique filename
      filename = "#{SecureRandom.hex(8)}_#{uploaded_file.original_filename}"
      file_path = Rails.root.join('public', 'images', filename)
      
      # Save file
      File.open(file_path, 'wb') do |file|
        file.write(uploaded_file.read)
      end
      
      render json: { 
        success: true, 
        filename: filename,
        url: "/images/#{filename}"
      }
    else
      render json: { error: 'No image file provided' }, status: :bad_request
    end
  rescue => e
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









