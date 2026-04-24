class Api::AuthController < ApplicationController
  def login
    email = login_params[:email]&.strip&.downcase
    password = login_params[:password]

    admin = Admin.find_by(email: email)

    if admin.nil?
      render json: { error: 'Invalid email or password' }, status: :unauthorized
      return
    end

    if password.present? && admin.authenticate(password)
      token = encode_token({ admin_id: admin.id })
      render json: {
        token: token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email
        }
      }
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end
  
  def logout
    render json: { message: 'Logged out successfully' }
  end
  
  def me
    admin_token = request.headers['Authorization']&.split(' ')&.last
    if admin_token
      begin
        decoded = JWT.decode(admin_token, Rails.application.secret_key_base)
        admin = Admin.find(decoded[0]['admin_id'])
        render json: { 
          admin: { 
            id: admin.id, 
            name: admin.name, 
            email: admin.email 
          } 
        }
      rescue JWT::ExpiredSignature
        render json: { error: 'Token expired' }, status: :unauthorized
      rescue JWT::DecodeError
        render json: { error: 'Invalid token' }, status: :unauthorized
      rescue StandardError => e
        Rails.logger.error "Auth error in me action: #{e.message}"
        render json: { error: 'Not authenticated' }, status: :unauthorized
      end
    else
      render json: { error: 'Not authenticated' }, status: :unauthorized
    end
  end
  
  def change_password
    authenticate_admin
    return if performed?
    
    current_password = change_password_params[:current_password]
    new_password = change_password_params[:new_password]
    new_password_confirmation = change_password_params[:new_password_confirmation]
    
    unless @current_admin.authenticate(current_password)
      render json: { error: 'Current password is incorrect' }, status: :unauthorized
      return
    end
    
    if new_password.blank? || new_password.length < 6
      render json: { error: 'New password must be at least 6 characters long' }, status: :bad_request
      return
    end
    
    if new_password != new_password_confirmation
      render json: { error: 'New password and confirmation do not match' }, status: :bad_request
      return
    end
    
    @current_admin.password = new_password
    @current_admin.password_confirmation = new_password_confirmation
    
    if @current_admin.save
      render json: { message: 'Password changed successfully' }, status: :ok
    else
      render json: { errors: @current_admin.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  private
  
  def login_params
    params.permit(:email, :password)
  end
  
  def change_password_params
    params.permit(:current_password, :new_password, :new_password_confirmation)
  end
  
  def encode_token(payload)
    payload[:exp] = 7.days.from_now.to_i
    JWT.encode(payload, Rails.application.secret_key_base)
  end
end