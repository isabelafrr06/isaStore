class Api::AuthController < ApplicationController
  before_action :authenticate_admin, only: [:me, :logout, :change_password]

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
      cookies[:admin_token] = {
        value: token,
        httponly: true,
        secure: Rails.env.production?,
        same_site: Rails.env.production? ? :none : :lax,
        expires: 24.hours.from_now
      }
      render json: {
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
    cookies.delete(:admin_token)
    render json: { message: 'Logged out successfully' }
  end

  def me
    render json: {
      admin: {
        id: @current_admin.id,
        name: @current_admin.name,
        email: @current_admin.email
      }
    }
  end

  def change_password
    current_password = change_password_params[:current_password]
    new_password = change_password_params[:new_password]
    new_password_confirmation = change_password_params[:new_password_confirmation]

    unless @current_admin.authenticate(current_password)
      render json: { error: 'Current password is incorrect' }, status: :unauthorized
      return
    end

    if new_password.blank? || new_password.length < 12
      render json: { error: 'New password must be at least 12 characters long' }, status: :bad_request
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
    payload[:exp] = 24.hours.from_now.to_i
    JWT.encode(payload, Rails.application.secret_key_base, 'HS256')
  end
end
