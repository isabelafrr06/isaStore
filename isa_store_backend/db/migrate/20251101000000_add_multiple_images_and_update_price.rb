class AddMultipleImagesAndUpdatePrice < ActiveRecord::Migration[7.1]
  def up
    # Add JSON column for multiple images (PostgreSQL supports JSON/JSONB)
    add_column :products, :images, :json, default: []
    
    # Migrate existing single image to images array
    Product.reset_column_information
    Product.find_each do |product|
      if product.image.present?
        product.update_column(:images, [product.image])
      end
    end
    
    # Keep the image column for backward compatibility (will remove later)
    # For now, we'll maintain both during transition
  end
  
  def down
    remove_column :products, :images
  end
end

