class RemoveUnusedOrderFields < ActiveRecord::Migration[7.1]
  def change
    remove_column :orders, :customer_email, :string
    remove_column :orders, :customer_city, :string
    remove_column :orders, :customer_zip_code, :string
  end
end

