class CreateCategories < ActiveRecord::Migration[7.1]
  def change
    create_table :categories do |t|
      t.string :name, null: false
      t.string :name_en
      t.string :name_es
      t.integer :position, default: 0

      t.timestamps
    end

    add_index :categories, :name, unique: true
    add_index :categories, :position

    # Seed initial categories
    reversible do |dir|
      dir.up do
        Category.create([
          { name: 'Chargers', name_en: 'Chargers', name_es: 'Cargadores', position: 1 },
          { name: 'Laptops', name_en: 'Laptops', name_es: 'Laptops', position: 2 },
          { name: 'iPads', name_en: 'iPads', name_es: 'iPads', position: 3 },
          { name: 'Accessories', name_en: 'Accessories', name_es: 'Accesorios', position: 4 },
          { name: 'Other', name_en: 'Other', name_es: 'Otros', position: 5 }
        ])
      end
    end
  end
end

