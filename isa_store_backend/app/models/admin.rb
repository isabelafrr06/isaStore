class Admin < ApplicationRecord
  has_secure_password
  
  before_save :normalize_email
  
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :name, presence: true
  
  private
  
  def normalize_email
    self.email = email&.strip&.downcase
  end
end










