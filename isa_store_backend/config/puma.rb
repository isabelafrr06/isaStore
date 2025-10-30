max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads min_threads_count, max_threads_count

# Railway/Render sets PORT automatically
port ENV.fetch("PORT") { 3001 }

environment ENV.fetch("RAILS_ENV") { "development" }

# Disable pidfile in production (Railway filesystem restrictions)
unless ENV["RAILS_ENV"] == "production"
  pidfile ENV.fetch("PIDFILE") { "tmp/pids/server.pid" }
end

# workers ENV.fetch("WEB_CONCURRENCY") { 2 }

# Disable tmp_restart in production
unless ENV["RAILS_ENV"] == "production"
  plugin :tmp_restart
end
