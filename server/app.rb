require 'bundler/setup'
require 'puma'
require 'sinatra'
require 'httparty'

API_CLIENTS = {}

set :logging, nil
set :server, 'puma'
LOG = Logger.new(STDOUT)

options "*" do
  200
end

before "*" do
  response.headers["Access-Control-Allow-Origin"] = "*"
  response.headers["Access-Control-Allow-Methods"] = "*"
  response.headers["Access-Control-Allow-Headers"] = "*"
  response.headers["Content-Type"] = "application/json"
end

get "*" do
  request_headers = {
    'Authorization' => request.env['HTTP_AUTHORIZATION'],
    'Content-Type' => 'application/json'
  }
  subdomain = request.env['HTTP_X_SUBDOMAIN']
  uri = URI("https://#{subdomain}.retail.heartland.us")
  uri.path = request.path
  uri.query = request.query_string

  response = HTTParty.get(uri, headers: request_headers)
  response.body
end

post "*" do
  request_headers = {
    'Authorization' => request.env['HTTP_AUTHORIZATION'],
    'Content-Type' => 'application/json'
  }
  subdomain = request.env['HTTP_X_SUBDOMAIN']
  uri = URI("https://#{subdomain}.retail.heartland.us")
  uri.path = request.path
  uri.query = request.query_string

  response = HTTParty.get(uri, headers: request_headers, body: request.body.read)
  response.body
end
