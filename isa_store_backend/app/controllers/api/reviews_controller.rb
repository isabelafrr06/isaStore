class Api::ReviewsController < ApplicationController
  before_action :authenticate_admin, only: [:update, :destroy, :index_all]
  
  def index
    # Public endpoint - only approved reviews
    @reviews = Review.approved.latest
    render json: @reviews.map { |review| serialize_review(review) }
  end
  
  def index_all
    # Admin endpoint - all reviews including unapproved
    @reviews = Review.latest
    render json: @reviews.map { |review| serialize_review(review) }
  end
  
  def create
    # Verify OAuth token before creating review
    oauth_data = verify_oauth_token(params[:provider], params[:oauth_token])
    
    unless oauth_data
      render json: { error: 'Invalid or expired OAuth token. Please authenticate again.' }, status: :unauthorized
      return
    end
    
    # Check if user already reviewed (one review per provider_id)
    existing_review = Review.find_by(provider: params[:provider], provider_id: oauth_data[:id])
    
    if existing_review
      render json: { error: 'You have already submitted a review. You can only submit one review per account.' }, status: :unprocessable_entity
      return
    end
    
    @review = Review.new(review_params)
    @review.user_name = oauth_data[:name]
    @review.user_email = oauth_data[:email] || ''
    @review.provider = params[:provider]
    @review.provider_id = oauth_data[:id]
    @review.profile_picture_url = oauth_data[:picture] || ''
    @review.verified = true
    @review.approved = false # Require admin approval by default
    
    if @review.save
      render json: serialize_review(@review), status: :created
    else
      render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def update
    @review = Review.find(params[:id])
    
    if @review.update(review_params.merge(approved: params[:approved]))
      render json: serialize_review(@review)
    else
      render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def destroy
    @review = Review.find(params[:id])
    @review.destroy
    render json: { message: 'Review deleted successfully' }
  end
  
  private
  
  def review_params
    params.permit(:rating, :comment)
  end
  
  def verify_oauth_token(provider, token)
    case provider
    when 'google'
      verify_google_token(token)
    when 'facebook'
      verify_facebook_token(token)
    else
      nil
    end
  end
  
  def verify_google_token(token)
    # Verify Google OAuth token
    # In production, use Google's token verification API
    begin
      require 'net/http'
      require 'json'
      
      uri = URI("https://oauth2.googleapis.com/tokeninfo?id_token=#{token}")
      response = Net::HTTP.get_response(uri)
      
      if response.code == '200'
        data = JSON.parse(response.body)
        {
          id: data['sub'],
          name: data['name'],
          email: data['email'],
          picture: data['picture']
        }
      else
        nil
      end
    rescue => e
      Rails.logger.error "Google token verification error: #{e.message}"
      nil
    end
  end
  
  def verify_facebook_token(token)
    # Verify Facebook OAuth token
    begin
      require 'net/http'
      require 'json'
      
      # Get app access token first (you'll need to set FACEBOOK_APP_ID and FACEBOOK_APP_SECRET)
      app_id = ENV['FACEBOOK_APP_ID']
      app_secret = ENV['FACEBOOK_APP_SECRET']
      
      return nil unless app_id && app_secret
      
      # Verify user token
      uri = URI("https://graph.facebook.com/v18.0/me?access_token=#{token}&fields=id,name,email,picture")
      response = Net::HTTP.get_response(uri)
      
      if response.code == '200'
        data = JSON.parse(response.body)
        {
          id: data['id'],
          name: data['name'],
          email: data['email'] || '',
          picture: data.dig('picture', 'data', 'url') || ''
        }
      else
        nil
      end
    rescue => e
      Rails.logger.error "Facebook token verification error: #{e.message}"
      nil
    end
  end
  
  def serialize_review(review)
    {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      user_name: review.user_name,
      user_email: review.user_email,
      profile_picture_url: review.profile_picture_url,
      provider: review.provider,
      verified: review.verified,
      approved: review.approved,
      created_at: review.created_at.iso8601
    }
  end
end

