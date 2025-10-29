class AddCustomerFieldsToOrders < ActiveRecord::Migration[7.1]
  def change
    add_column :orders, :customer_name, :string
    add_column :orders, :customer_email, :string
    add_column :orders, :customer_phone, :string
    add_column :orders, :customer_address, :string
    add_column :orders, :customer_city, :string
    add_column :orders, :customer_zip_code, :string
  end
end
