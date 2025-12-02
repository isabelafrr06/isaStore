class CreateDiscountTiers < ActiveRecord::Migration[7.1]
  def change
    create_table :discount_tiers do |t|
      t.integer :min_quantity, null: false
      t.decimal :discount_percent, precision: 5, scale: 2, null: false
      t.integer :position, default: 0
      t.boolean :active, default: true

      t.timestamps
    end

    add_index :discount_tiers, :min_quantity, unique: true
    add_index :discount_tiers, :position
    add_index :discount_tiers, :active
  end
end

