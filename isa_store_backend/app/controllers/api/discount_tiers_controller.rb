class Api::DiscountTiersController < ApplicationController
  # Public endpoint to get active discount tiers (for frontend calculation)
  def index
    @discount_tiers = DiscountTier.active.ordered
    render json: @discount_tiers
  end
end

