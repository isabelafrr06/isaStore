class AddConditionToProducts < ActiveRecord::Migration[7.1]
  def change
    add_column :products, :condition, :string, default: 'new'
    add_index :products, :condition
  end
end

