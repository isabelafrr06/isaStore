class Api::CategoriesController < ApplicationController
  def index
    categories = Category.all.map do |cat|
      {
        id: cat.id,
        name: cat.name,
        name_en: cat.name_en,
        name_es: cat.name_es,
        position: cat.position,
        product_count: Product.where(category: cat.name).count
      }
    end
    render json: { categories: categories }
  end
end

