class Product < ApplicationRecord
  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :stock, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :image, presence: true
  
  # Helper method to get full image URL
  def image_url
    if image.start_with?('http')
      image
    else
      "/images/#{image}"
    end
  end
end