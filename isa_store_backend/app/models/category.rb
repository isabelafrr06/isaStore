class Category < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :name_en, presence: true
  validates :name_es, presence: true
  
  has_many :products, foreign_key: 'category', primary_key: 'name'
  
  default_scope { order(:position) }
  
  def localized_name(locale = 'en')
    locale.to_s == 'es' ? name_es : name_en
  end
end

