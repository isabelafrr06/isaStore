class Product < ApplicationRecord
  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :stock, presence: true, numericality: { greater_than_or_equal_to: 0 }
  
  # Support both single image (backward compatibility) and images array
  validates :image, presence: true, if: -> { images.blank? || images.empty? }
  validate :images_present
  
  # Ensure images is always an array
  before_save :normalize_images
  
  # Get first image for backward compatibility
  def primary_image
    if images.present? && images.is_a?(Array) && images.any?
      images.first
    elsif image.present?
      image
    else
      nil
    end
  end
  
  # Get all images
  def all_images
    if images.present? && images.is_a?(Array) && images.any?
      images
    elsif image.present?
      [image]
    else
      []
    end
  end
  
  # Helper method to get full image URL (for backward compatibility)
  def image_url
    img = primary_image
    return nil unless img
    
    if img.start_with?('http')
      img
    else
      "/images/#{img}"
    end
  end
  
  # Get formatted price as integer (no decimals)
  def price_integer
    price.to_i
  end
  
  private
  
  def images_present
    if (images.blank? || (images.is_a?(Array) && images.empty?)) && image.blank?
      errors.add(:images, "or image must be present")
    end
  end
  
  def normalize_images
    # Ensure images is always an array
    if images.is_a?(String)
      self.images = images.present? ? [images] : []
    elsif images.nil?
      self.images = image.present? ? [image] : []
    elsif !images.is_a?(Array)
      self.images = []
    end
    
    # If images is empty but image is set, use image
    if (images.blank? || images.empty?) && image.present?
      self.images = [image]
    end
  end
end