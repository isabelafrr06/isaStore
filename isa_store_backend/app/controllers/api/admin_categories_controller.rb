class Api::AdminCategoriesController < ApplicationController
  before_action :check_auth
  before_action :set_category, only: [:update, :destroy, :reorder]

  def index
    categories = Category.all.map do |cat|
      {
        id: cat.id,
        name: cat.name,
        name_en: cat.name_en,
        name_es: cat.name_es,
        position: cat.position,
        product_count: Product.where(category: cat.name).count,
        created_at: cat.created_at,
        updated_at: cat.updated_at
      }
    end
    render json: { categories: categories }
  end

  def create
    category = Category.new(category_params)
    
    if category.save
      render json: {
        id: category.id,
        name: category.name,
        name_en: category.name_en,
        name_es: category.name_es,
        position: category.position,
        product_count: 0
      }, status: :created
    else
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @category.update(category_params)
      # Update all products with old category name to new category name
      if category_params[:name] && category_params[:name] != @category.name
        old_name = @category.name
        Product.where(category: old_name).update_all(category: category_params[:name])
      end
      
      render json: {
        id: @category.id,
        name: @category.name,
        name_en: @category.name_en,
        name_es: @category.name_es,
        position: @category.position,
        product_count: Product.where(category: @category.name).count
      }
    else
      render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    product_count = Product.where(category: @category.name).count
    
    if product_count > 0
      render json: { 
        error: "Cannot delete category with #{product_count} product(s). Please reassign or delete the products first." 
      }, status: :unprocessable_entity
    else
      @category.destroy
      render json: { message: 'Category deleted successfully' }
    end
  end

  def reorder
    # Expects params: { categories: [{ id: 1, position: 0 }, { id: 2, position: 1 }, ...] }
    params[:categories].each do |cat_data|
      category = Category.find_by(id: cat_data[:id])
      category.update(position: cat_data[:position]) if category
    end
    
    render json: { message: 'Categories reordered successfully' }
  end

  private

  def set_category
    @category = Category.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Category not found' }, status: :not_found
  end

  def category_params
    params.require(:category).permit(:name, :name_en, :name_es, :position)
  end

  def check_auth
    admin_token = request.headers['Authorization']&.split(' ')&.last
    unless admin_token
      render json: { error: 'Missing token' }, status: :unauthorized
      return
    end

    begin
      decoded = JWT.decode(admin_token, Rails.application.credentials.secret_key_base || 'fallback_secret', true, { algorithm: 'HS256' })
      @current_admin = Admin.find_by(id: decoded[0]['admin_id'])
      
      unless @current_admin
        render json: { error: 'Invalid token' }, status: :unauthorized
      end
    rescue JWT::DecodeError => e
      render json: { error: 'Invalid token', details: e.message }, status: :unauthorized
    end
  end
end

