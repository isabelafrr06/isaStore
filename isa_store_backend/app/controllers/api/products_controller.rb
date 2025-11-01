class Api::ProductsController < ApplicationController
  def index
    @products = Product.all.map { |p| serialize_product(p) }
    render json: @products
  end

  def show
    @product = Product.find_by(id: params[:id])
    if @product
      render json: serialize_product(@product)
    else
      render json: { error: 'Product not found' }, status: :not_found
    end
  end
  
  private
  
  def serialize_product(product)
    {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price_integer, # Return as integer (no decimals)
      images: product.all_images, # Array of images
      image: product.primary_image, # First image for backward compatibility
      stock: product.stock,
      created_at: product.created_at,
      updated_at: product.updated_at
    }
  end
end