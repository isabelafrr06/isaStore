class AddWeightToProducts < ActiveRecord::Migration[7.1]
  def change
    add_column :products, :weight, :decimal, precision: 3, scale: 1, default: 0.5, null: false
  end
end

