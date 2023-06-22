class AddModifiedByToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :modified_by, :string
  end
end

