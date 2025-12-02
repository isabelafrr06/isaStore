class Api::ProductsController < ApplicationController
  def index
    @products = Product.all
    
    # Filter out products that should be hidden from main page
    @products = @products.where("hide_from_main_page = false OR hide_from_main_page IS NULL")
    
    # Apply filters
    @products = @products.by_category(params[:category]) if params[:category].present?
    @products = @products.by_condition(params[:condition]) if params[:condition].present?
    
    # Apply sorting - always show available products first, then apply user's sort preference
    @products = case params[:sort_by]
                when 'price_asc'
                  @products.order(Arel.sql("CASE WHEN stock > 0 THEN 0 ELSE 1 END, price ASC"))
                when 'price_desc'
                  @products.order(Arel.sql("CASE WHEN stock > 0 THEN 0 ELSE 1 END, price DESC"))
                when 'name_asc'
                  @products.order(Arel.sql("CASE WHEN stock > 0 THEN 0 ELSE 1 END, name ASC"))
                when 'name_desc'
                  @products.order(Arel.sql("CASE WHEN stock > 0 THEN 0 ELSE 1 END, name DESC"))
                when 'newest'
                  @products.order(Arel.sql("CASE WHEN stock > 0 THEN 0 ELSE 1 END, created_at DESC"))
                when 'oldest'
                  @products.order(Arel.sql("CASE WHEN stock > 0 THEN 0 ELSE 1 END, created_at ASC"))
                else
                  # Default: available first, then by newest
                  @products.order(Arel.sql("CASE WHEN stock > 0 THEN 0 ELSE 1 END, created_at DESC"))
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
      weight: product.weight || 0.5,
      category: product.category,
      condition: product.condition,
      created_at: product.created_at,
      updated_at: product.updated_at
    }
  end
end