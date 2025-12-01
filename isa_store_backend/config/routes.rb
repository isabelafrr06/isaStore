Rails.application.routes.draw do
  namespace :api do
    # Health check
    get 'health', to: 'health#show'
    
    # Products
    resources :products, only: [:index, :show]
    
    # Categories (public)
    resources :categories, only: [:index]
    
    # Cart operations
    get 'cart', to: 'cart#show'
    post 'cart/add', to: 'cart#add'
    delete 'cart/remove/:id', to: 'cart#remove'
    put 'cart/update/:id', to: 'cart#update'
    delete 'cart/clear', to: 'cart#clear'
    
    # Orders
    resources :orders, only: [:index, :create]
    
    # Reviews
    get 'reviews', to: 'reviews#index'
    get 'admin/reviews', to: 'reviews#index_all'
    post 'reviews', to: 'reviews#create'
    put 'admin/reviews/:id', to: 'reviews#update'
    delete 'admin/reviews/:id', to: 'reviews#destroy'
    
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
    
    # Image upload
    post 'admin/upload-image', to: 'image_upload#upload'
  end
  
  root 'api/products#index'
end
