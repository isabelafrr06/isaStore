class DiscountTier < ApplicationRecord
  validates :min_quantity, presence: true, numericality: { greater_than: 0 }, uniqueness: true
  validates :discount_percent, presence: true, numericality: { greater_than: 0, less_than_or_equal_to: 100 }
  
  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(min_quantity: :desc) }
  
  # Get the highest applicable discount tier for a given quantity
  def self.get_applicable_tier(quantity)
    active.ordered.where('min_quantity <= ?', quantity).first
  end
end

