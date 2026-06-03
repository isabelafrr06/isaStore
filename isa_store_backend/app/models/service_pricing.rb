class ServicePricing < ApplicationRecord
  validates :name_es, :name_en, :price, presence: true
  validates :position, numericality: { greater_than_or_equal_to: 0 }

  scope :active,  -> { where(active: true) }
  scope :ordered, -> { order(position: :asc) }
end
