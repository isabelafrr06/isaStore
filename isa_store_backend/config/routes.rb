Rails.application.routes.draw do
  namespace :api do
    # Health check
    get 'health', to: 'health#show'
    
    # Products
    resources :products, only: [:index, :show]
    
    # Categories (public)
    resources :categories, only: [:index]
    
    # Discount tiers (public - for calculation)
    resources :discount_tiers, only: [:index]
    
    # Cart operations
    get 'cart', to: 'cart#show'
    post 'cart/add', to: 'cart#add'
    delete 'cart/remove/:id', to: 'cart#remove'
    put 'cart/update/:id', to: 'cart#update'
    delete 'cart/clear', to: 'cart#clear'
    
    # Orders
    resources :orders, only: [:index, :create]
    
    # Admin authentication
    post 'admin/login', to: 'auth#login'
    post 'admin/logout', to: 'auth#logout'
    get 'admin/me', to: 'auth#me'
    put 'admin/change-password', to: 'auth#change_password'
    
    # Admin products management
    resources :admin_products, path: 'admin/products', only: [:index, :show, :create, :update, :destroy]
    
    # Admin categories management
    resources :admin_categories, path: 'admin/categories', only: [:index, :create, :update, :destroy]
    post 'admin/categories/reorder', to: 'admin_categories#reorder'
    
    # Admin discount tiers management
    resources :admin_discount_tiers, path: 'admin/discount-tiers', only: [:index, :show, :create, :update, :destroy]

    # Service pricing (public read, admin write)
    resources :service_pricings, path: 'service-pricings', only: [:index]
    resources :admin_service_pricings, path: 'admin/service-pricings', only: [:index, :create, :update, :destroy]
    
    # Image upload
    post 'admin/upload-image', to: 'image_upload#upload'
  end
  
  root 'api/products#index'
end
