class CreateOrderItems < ActiveRecord::Migration[7.1]
  def change
    create_table :order_items do |t|
      t.references :order, null: false, foreign_key: true
      t.integer :product_id
      t.string :product_name
      t.decimal :product_price, precision: 10, scale: 2
      t.string :product_image
      t.integer :quantity

      t.timestamps
    end
  end
end