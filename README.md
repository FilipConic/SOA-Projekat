# SOA - Projekat 

# Stakeholders
To make migrations for stakeholders service use the command:
docker-compose exec stakeholders python manage.py makemigrations

And to then apply these migrations you use:
docker-compose exec stakeholders python manage.py migrate
