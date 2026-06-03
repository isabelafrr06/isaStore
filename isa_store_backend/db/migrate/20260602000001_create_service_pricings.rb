class CreateServicePricings < ActiveRecord::Migration[7.1]
  def change
    create_table :service_pricings do |t|
      t.string :name_es, null: false
      t.string :name_en, null: false
      t.string :price,   null: false
      t.integer :position, default: 0
      t.boolean :active, default: true
      t.timestamps
    end

    add_index :service_pricings, :position
    add_index :service_pricings, :active
  end
end
