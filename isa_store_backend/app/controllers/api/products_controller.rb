class Api::ProductsController < ApplicationController
  def index
    @products = Product.all
    
    # Apply filters
    @products = @products.by_category(params[:category]) if params[:category].present?
    @products = @products.by_condition(params[:condition]) if params[:condition].present?
    
    # Apply sorting
    @products = case params[:sort_by]
                when 'price_asc'
                  @products.order_by_price_asc
                when 'price_desc'
                  @products.order_by_price_desc
                when 'name_asc'
                  @products.order_by_name_asc
                when 'name_desc'
                  @products.order_by_name_desc
                when 'newest'
                  @products.order_by_newest
                when 'oldest'
                  @products.order_by_oldest
                else
                  @products.order_by_newest # Default sorting
                end
    
    render json: @products.map { |p| serialize_product(p) }
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
      category: product.category,
      condition: product.condition,
      created_at: product.created_at,
      updated_at: product.updated_at
    }
  end
end