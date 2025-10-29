class Api::AuthController < ApplicationController
  def login
    admin = Admin.find_by(email: params[:email])
    
    if admin&.authenticate(params[:password])
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
      rescue
        render json: { error: 'Not authenticated' }, status: :unauthorized
      end
    else
      render json: { error: 'Not authenticated' }, status: :unauthorized
    end
  end
  
  private
  
  def encode_token(payload)
    JWT.encode(payload, Rails.application.secret_key_base)
  end
end