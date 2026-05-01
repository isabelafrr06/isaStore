class Api::AdminDiscountTiersController < ApplicationController
  before_action :authenticate_admin
  before_action :set_discount_tier, only: [:show, :update, :destroy]

  def index
    @discount_tiers = DiscountTier.ordered
    render json: @discount_tiers
  end

  def show
    render json: @discount_tier
  end

  def create
    @discount_tier = DiscountTier.new(discount_tier_params)

    if @discount_tier.save
      render json: @discount_tier, status: :created
    else
      render json: { errors: @discount_tier.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @discount_tier.update(discount_tier_params)
      render json: @discount_tier
    else
      render json: { errors: @discount_tier.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
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
end
