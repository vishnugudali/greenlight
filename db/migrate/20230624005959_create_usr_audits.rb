class CreateUsrAudits < ActiveRecord::Migration[5.2]
  def change
    create_table :usr_audits do |t|
      t.string :uid
      t.string :name
      t.string :username
      t.string :email
      t.string :modified_by
      t.string :event_type
      t.bigint :from_role
      t.bigint :to_role
      t.datetime :last_login
      t.timestamps
    end
  end
end


