class ApplicationController < ActionController::API
  def authenticate_admin
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