FROM ruby:2.7

WORKDIR /app

RUN gem install bundler -v 2.2.11

COPY ./Gemfile* ./
COPY ./vendor ./vendor

RUN bundle install --local

EXPOSE 8080

COPY . .

CMD [ "ruby", "app.rb", "-p", "8080", "-o", "0.0.0.0" ]
