class CreateReviews < ActiveRecord::Migration[7.1]
  def change
    create_table :reviews do |t|
      t.integer :rating, null: false
      t.text :comment
      t.string :user_name, null: false
      t.string :user_email
      t.string :provider, null: false # 'google' or 'facebook'
      t.string :provider_id, null: false # User ID from OAuth provider
      t.string :profile_picture_url
      t.boolean :verified, default: false
      t.boolean :approved, default: false # For admin moderation

      t.timestamps
    end

    add_index :reviews, :provider_id
    add_index :reviews, :approved
  end
end

