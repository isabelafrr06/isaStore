class Api::OrdersController < ApplicationController
  before_action :authenticate_admin, only: [:index]
  
  def index
    @orders = Order.all.includes(:order_items)
    orders_data = @orders.map do |order|
      {
        id: order.id,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_address: order.customer_address,
        items: order.order_items.map do |item|
          {
            productId: item.product_id,
            name: item.product_name,
            price: item.product_price.to_i, # Convert to integer (no decimals)
            image: item.product_image,
            quantity: item.quantity
          }
        end,
        total: order.total.to_i, # Convert to integer (no decimals)
        date: order.created_at.to_s,
        status: order.status
      }
    end
    render json: orders_data
  end

  def create
    cart_items = CartItem.all.includes(:product)
    
    if cart_items.empty?
      render json: { error: 'Cart is empty' }, status: :bad_request
      return
    end
    
    total = cart_items.sum { |item| item.product.price_integer * item.quantity }
    
    order = Order.create!(
      total: total,
      status: 'pending',
      customer_name: params[:customer_name],
      customer_phone: params[:customer_phone],
      customer_address: params[:customer_address]
    )
    
    cart_items.each do |cart_item|
      OrderItem.create!(
        order: order,
        product_id: cart_item.product_id,
        product_name: cart_item.product.name,
        product_price: cart_item.product.price_integer, # Store as integer
        product_image: cart_item.product.primary_image, # Use primary image
        quantity: cart_item.quantity
      )
    end
    
    CartItem.destroy_all
    
    order_data = {
      id: order.id,
      items: order.order_items.map do |item|
        {
          productId: item.product_id,
          name: item.product_name,
          price: item.product_price.to_i, # Convert to integer (no decimals)
          image: item.product_image,
          quantity: item.quantity
        }
      end,
      total: order.total.to_i, # Convert to integer (no decimals)
      date: order.created_at.to_s,
      status: order.status
    }
    
    render json: order_data, status: :created
  end
end