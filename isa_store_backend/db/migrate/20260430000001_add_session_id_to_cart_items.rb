class AddSessionIdToCartItems < ActiveRecord::Migration[7.1]
  def change
    add_column :cart_items, :session_id, :string
    add_index :cart_items, :session_id
  end
end
