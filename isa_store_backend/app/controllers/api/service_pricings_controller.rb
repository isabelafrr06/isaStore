class Api::ServicePricingsController < ApplicationController
  def index
    render json: ServicePricing.active.ordered
  end
end
