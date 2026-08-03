class AddCategoryToServicePricings < ActiveRecord::Migration[7.1]
  def up
    add_column :service_pricings, :category, :string, null: false, default: 'reference'
    add_index :service_pricings, [:category, :position]
    execute "UPDATE service_pricings SET category = 'reference'"
  end

  def down
    remove_index :service_pricings, [:category, :position]
    remove_column :service_pricings, :category
  end
end
