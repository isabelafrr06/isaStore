class Api::CartController < ApplicationController
  def show
    render_cart
  end

  def add
    product = Product.find_by(id: params[:productId])

    unless product
      render json: { error: 'Product not found' }, status: :not_found
      return
    end

    existing_item = CartItem.find_by(product_id: params[:productId], session_id: cart_session)

    if existing_item
      existing_item.quantity += params[:quantity] || 1
      existing_item.save
    else
      CartItem.create!(
        product_id: params[:productId],
        quantity: params[:quantity] || 1,
        session_id: cart_session
      )
    end

    render_cart
  end

  def remove
    cart_item = CartItem.find_by(id: params[:id], session_id: cart_session)
    if cart_item
      cart_item.destroy
      render_cart
    else
      render json: { error: 'Cart item not found' }, status: :not_found
    end
  end

  def update
    cart_item = CartItem.find_by(id: params[:id], session_id: cart_session)
    if cart_item
      cart_item.update(quantity: params[:quantity])
      render_cart
    else
      render json: { error: 'Cart item not found' }, status: :not_found
    end
  end

  def clear
    CartItem.where(session_id: cart_session).destroy_all
    render json: { message: 'Cart cleared' }
  end

  private

  def cart_session
    request.headers['X-Cart-Session']
  end

  def render_cart
    cart_items = CartItem.where(session_id: cart_session).includes(:product)
    cart = cart_items.map do |item|
      {
        id: item.id,
        productId: item.product_id,
        name: item.product.name,
        price: item.product.price_integer,
        image: item.product.primary_image,
        quantity: item.quantity
      }
    end
    render json: cart
  end
end
