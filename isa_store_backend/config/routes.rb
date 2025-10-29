Rails.application.routes.draw do
  namespace :api do
    # Products
    resources :products, only: [:index, :show]
    
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
    
          # Admin products management
          resources :admin_products, path: 'admin/products', only: [:index, :show, :create, :update, :destroy]
          
          # Image upload
          post 'admin/upload-image', to: 'image_upload#upload'
  end
  
  root 'api/products#index'
end
