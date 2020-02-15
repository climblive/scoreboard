server {
	listen 443 ssl;
	server_name admin.climblive.app;

        # Gzip Settings
	include snippets/gzip.conf;

        client_max_body_size 20M;

	location / {
		proxy_pass http://127.0.0.1:8080/admin/;
		
		proxy_intercept_errors on;
		error_page 404 = /index.html;
		
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection $connection_upgrade;
	}
	
	ssl_certificate /etc/letsencrypt/live/climblive.app/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/climblive.app/privkey.pem;
}

server {
	listen 80;
	server_name admin.climblive.app;
	return 301 https://admin.climblive.app$request_uri;
}

