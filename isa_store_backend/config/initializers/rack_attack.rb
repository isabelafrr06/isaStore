class Rack::Attack
  # Throttle login attempts: 5 requests per 20 seconds per IP
  throttle("login/ip", limit: 5, period: 20.seconds) do |req|
    if req.path == "/api/admin/login" && req.post?
      req.ip
    end
  end

  self.throttled_responder = lambda do |_env|
    [429, { "Content-Type" => "application/json" }, [{ error: "Too many requests. Please try again later." }.to_json]]
  end
end
