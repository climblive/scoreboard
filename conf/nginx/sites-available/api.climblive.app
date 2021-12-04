server {
	listen 443 ssl;
	server_name api.climblive.app;

	# Gzip Settings
	include snippets/gzip.conf;

	client_max_body_size 20M;

	location ~ ^/(v2/api-docs)|(swagger-ui.html)|(webjars)|(swagger-resources) {
		proxy_pass http://127.0.0.1:8080;
		proxy_http_version 1.1;
	}

	location / {
		proxy_pass http://127.0.0.1:8080/api/;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "Upgrade";
	}

	include /etc/nginx/options-ssl.conf;
}
