class Api::AuthController < ApplicationController
  def login
    # Use strong parameters to ensure params are received correctly
    email = login_params[:email]&.strip&.downcase
    password = login_params[:password]
    
    # Log for debugging (remove in production if sensitive)
    Rails.logger.info "Login attempt for email: #{email}"
    Rails.logger.info "Password provided: #{password.present? ? 'YES' : 'NO'}"
    
    admin = Admin.find_by(email: email)
    Rails.logger.info "Admin found: #{admin.present?}"
    
    if admin.nil?
      Rails.logger.warn "Admin not found for email: #{email}"
      render json: { error: 'Invalid email or password' }, status: :unauthorized
      return
    end
    
    # authenticate method compares plain text password with bcrypt hash
    if password.present? && admin.authenticate(password)
      token = encode_token({ admin_id: admin.id })
      Rails.logger.info "Login successful for admin: #{admin.email}"
      render json: { 
        token: token, 
        admin: { 
          id: admin.id, 
          name: admin.name, 
          email: admin.email 
        } 
      }
    else
      Rails.logger.warn "Password authentication failed for admin: #{admin.email}"
      # Double-check: verify password_digest exists in database
      Rails.logger.warn "Admin has password_digest: #{admin.password_digest.present?}"
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
      rescue
        render json: { error: 'Not authenticated' }, status: :unauthorized
      end
    else
      render json: { error: 'Not authenticated' }, status: :unauthorized
    end
  end
  
  private
  
  def login_params
    params.permit(:email, :password)
  end
  
  def encode_token(payload)
    JWT.encode(payload, Rails.application.secret_key_base)
  end
end