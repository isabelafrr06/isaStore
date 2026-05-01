class Admin < ApplicationRecord
  has_secure_password
  
  before_save :normalize_email
  
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :name, presence: true
  validates :password, length: { minimum: 8 }, if: -> { password.present? }
  
  private
  
  def normalize_email
    self.email = email&.strip&.downcase
  end
end










