class Api::AdminDiscountTiersController < ApplicationController
  before_action :set_discount_tier, only: [:show, :update, :destroy]
  
  def index
    check_auth
    @discount_tiers = DiscountTier.ordered
    render json: @discount_tiers
  end
  
  def show
    check_auth
    render json: @discount_tier
  end
  
  def create
    check_auth
    @discount_tier = DiscountTier.new(discount_tier_params)
    
    if @discount_tier.save
      render json: @discount_tier, status: :created
    else
      render json: { errors: @discount_tier.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def update
    check_auth
    if @discount_tier.update(discount_tier_params)
      render json: @discount_tier
    else
      render json: { errors: @discount_tier.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def destroy
    check_auth
    @discount_tier.destroy
    render json: { message: 'Discount tier deleted successfully' }, status: :ok
  end
  
  private
  
  def set_discount_tier
    @discount_tier = DiscountTier.find(params[:id])
  end
  
  def discount_tier_params
    params.require(:discount_tier).permit(:min_quantity, :discount_percent, :active, :position)
  end
  
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

