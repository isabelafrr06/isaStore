class ApplicationController < ActionController::API
  include ActionController::Cookies

  def authenticate_admin
    admin_token = cookies[:admin_token]
    unless admin_token
      render json: { error: 'Missing token' }, status: :unauthorized
      return
    end

    begin
      decoded = JWT.decode(admin_token, Rails.application.secret_key_base, true, algorithms: ['HS256'])
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
