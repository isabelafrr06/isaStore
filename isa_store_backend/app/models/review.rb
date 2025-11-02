class Review < ApplicationRecord
  validates :rating, presence: true, inclusion: { in: 1..5 }
  validates :user_name, presence: true
  validates :provider, presence: true, inclusion: { in: %w[google facebook] }
  validates :provider_id, presence: true
  
  scope :approved, -> { where(approved: true) }
  scope :latest, -> { order(created_at: :desc) }
  
  def verified?
    verified
  end
  
  def approved?
    approved
  end
end

