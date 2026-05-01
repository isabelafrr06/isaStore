class Rack::Attack
  throttle('login/ip', limit: 5, period: 20.seconds) do |req|
    req.ip if req.path == '/api/admin/login' && req.post?
  end

  throttle('orders/ip', limit: 10, period: 1.hour) do |req|
    req.ip if req.path == '/api/orders' && req.post?
  end

  throttle('change-password/ip', limit: 5, period: 1.hour) do |req|
    req.ip if req.path == '/api/admin/change-password'
  end

  self.throttled_responder = lambda do |_env|
    [429, { 'Content-Type' => 'application/json' }, [{ error: 'Too many requests. Please try again later.' }.to_json]]
  end
end
