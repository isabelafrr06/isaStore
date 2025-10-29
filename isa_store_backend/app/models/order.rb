class Order < ApplicationRecord
  has_many :order_items, dependent: :destroy
  
  validates :total, presence: true, numericality: { greater_than: 0 }
  validates :status, presence: true
  validates :customer_name, presence: true
  validates :customer_phone, presence: true
  validates :customer_address, presence: true
end