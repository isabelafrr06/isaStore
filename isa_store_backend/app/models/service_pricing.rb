class ServicePricing < ApplicationRecord
  CATEGORIES = %w[reference additional].freeze

  validates :name_es, :name_en, :price, presence: true
  validates :position, numericality: { greater_than_or_equal_to: 0 }
  validates :category, inclusion: { in: CATEGORIES }

  scope :active,     -> { where(active: true) }
  scope :ordered,    -> { order(position: :asc) }
  scope :reference,  -> { where(category: 'reference') }
  scope :additional, -> { where(category: 'additional') }
end
