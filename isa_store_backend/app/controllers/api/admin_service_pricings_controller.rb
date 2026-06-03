class Api::AdminServicePricingsController < ApplicationController
  before_action :authenticate_admin
  before_action :set_service_pricing, only: [:update, :destroy]

  def index
    render json: ServicePricing.ordered
  end

  def create
    @service_pricing = ServicePricing.new(service_pricing_params)
    if @service_pricing.save
      render json: @service_pricing, status: :created
    else
      render json: { errors: @service_pricing.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @service_pricing.update(service_pricing_params)
      render json: @service_pricing
    else
      render json: { errors: @service_pricing.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @service_pricing.destroy
    render json: { message: 'Deleted' }, status: :ok
  end

  private

  def set_service_pricing
    @service_pricing = ServicePricing.find(params[:id])
  end

  def service_pricing_params
    params.require(:service_pricing).permit(:name_es, :name_en, :price, :position, :active)
  end
end
