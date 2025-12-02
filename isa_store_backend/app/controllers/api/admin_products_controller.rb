class Api::AdminProductsController < ApplicationController
  before_action :set_product, only: [:show, :update, :destroy]
  
  def index
    check_auth
    @products = Product.all
    render json: @products
  end
  
  def show
    check_auth
    render json: @product
  end
  
  def create
    check_auth
    @product = Product.new(product_params)
    
    if @product.save
      render json: @product, status: :created
    else
      render json: { errors: @product.errors }, status: :unprocessable_entity
    end
  end
  
  def update
    check_auth
    if @product.update(product_params)
      render json: @product
    else
      render json: { errors: @product.errors }, status: :unprocessable_entity
    end
  end
  
  def destroy
    check_auth
    @product.destroy
    render json: { message: 'Product deleted successfully' }, status: :ok
  end
  
  private
  
  def set_product
    @product = Product.find(params[:id])
  end
  
  def product_params
    # Allow images as array and single image for backward compatibility
    params.require(:product).permit(:name, :description, :price, :image, :stock, :weight, :category, :condition, :hide_from_main_page, images: [])
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
