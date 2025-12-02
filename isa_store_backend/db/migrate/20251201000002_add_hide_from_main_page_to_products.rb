class AddHideFromMainPageToProducts < ActiveRecord::Migration[7.1]
  def change
    add_column :products, :hide_from_main_page, :boolean, default: false, null: false
    add_index :products, :hide_from_main_page
  end
end

